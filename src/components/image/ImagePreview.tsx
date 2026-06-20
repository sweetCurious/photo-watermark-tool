import { PointerEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { createDrawableLogos, renderProcessedCanvas } from '../../services/imageProcessingService';
import {
  createLogoCanvas,
  getLogoRects,
  LogoRect,
} from '../../services/logoRenderer';
import { useImageStore } from '../../store/imageStore';
import { useLogoStore } from '../../store/logoStore';
import { useSettingsStore } from '../../store/settingsStore';
import { releaseCanvas, revokeObjectUrl } from '../../utils/memory';
import { ImageUpload } from '../upload/ImageUpload';

interface LogoOverlay extends LogoRect {
  fileName: string;
  objectUrl: string;
}

interface DragState {
  id: string;
  offsetX: number;
  offsetY: number;
  pointerId: number;
  x: number;
  y: number;
}

function canvasToObjectUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Preview Render Failed'));
        return;
      }

      resolve(URL.createObjectURL(blob));
    }, 'image/png');
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ImagePreview() {
  const [previewScale, setPreviewScale] = useState(55);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [logoOverlays, setLogoOverlays] = useState<LogoOverlay[]>([]);
  const previewSurfaceRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const logos = useLogoStore((state) => state.logos);
  const outputSizes = useSettingsStore((state) => state.outputSizes);
  const templates = useSettingsStore((state) => state.templates);
  const setTemplate = useSettingsStore((state) => state.setTemplate);
  const selectedImage = images.find((image) => image.id === selectedImageId) ?? null;
  const selectedOutputSize = selectedImage ? outputSizes[selectedImage.orientation] : null;
  const selectedTemplate = selectedImage ? templates[selectedImage.orientation] : null;
  const displayScale = previewScale / 100;

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl((currentUrl) => {
        if (currentUrl) {
          revokeObjectUrl(currentUrl);
        }

        return null;
      });
      setLogoOverlays((currentOverlays) => {
        currentOverlays.forEach((overlay) => revokeObjectUrl(overlay.objectUrl));
        return [];
      });
      return;
    }

    const currentImage = selectedImage;
    const outputSize = outputSizes[currentImage.orientation];
    const template = templates[currentImage.orientation];
    const abortController = new AbortController();

    async function renderPreview() {
      let drawableLogos: Awaited<ReturnType<typeof createDrawableLogos>> = [];

      try {
        drawableLogos = await createDrawableLogos(logos, abortController.signal);

        const bottomBarHeight = outputSize.height * template.watermark.barHeightRatio;
        const bottomBar = {
          height: bottomBarHeight,
          width: outputSize.width,
          x: 0,
          y: outputSize.height - bottomBarHeight,
        };
        const rects = getLogoRects(drawableLogos, bottomBar, template.logo, outputSize);
        const nextLogoOverlays = await Promise.all(
          rects.map(async (rect, index) => {
            const logoCanvas = createLogoCanvas(drawableLogos[index], template.logo.removeBackground);
            const objectUrl = await canvasToObjectUrl(logoCanvas);

            return {
              ...rect,
              fileName: logos[index].fileName,
              objectUrl,
            };
          }),
        );
        const canvas = await renderProcessedCanvas(
          currentImage,
          [],
          outputSize,
          template,
          abortController.signal,
        );

        canvas.toBlob((blob) => {
          drawableLogos.forEach((logo) => logo.dispose());
          releaseCanvas(canvas);

          if (!blob || abortController.signal.aborted) {
            nextLogoOverlays.forEach((overlay) => revokeObjectUrl(overlay.objectUrl));
            return;
          }

          const nextPreviewUrl = URL.createObjectURL(blob);
          setPreviewUrl((currentUrl) => {
            if (currentUrl) {
              revokeObjectUrl(currentUrl);
            }

            return nextPreviewUrl;
          });
          setLogoOverlays((currentOverlays) => {
            currentOverlays.forEach((overlay) => revokeObjectUrl(overlay.objectUrl));
            return nextLogoOverlays;
          });
        }, 'image/jpeg', 0.9);
      } catch (error) {
        drawableLogos.forEach((logo) => logo.dispose());

        if (!abortController.signal.aborted) {
          console.error('Preview Render Failed', error);
          toast.error('预览生成失败');
        }
      }
    }

    void renderPreview();

    return () => {
      abortController.abort();
    };
  }, [logos, outputSizes, selectedImage, templates]);

  function getPointerCanvasPosition(event: PointerEvent<HTMLImageElement>) {
    const previewSurface = previewSurfaceRef.current;

    if (!previewSurface) {
      return null;
    }

    const rect = previewSurface.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) / displayScale,
      y: (event.clientY - rect.top) / displayScale,
    };
  }

  function handleLogoPointerDown(event: PointerEvent<HTMLImageElement>, overlay: LogoOverlay) {
    const position = getPointerCanvasPosition(event);

    if (!position) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      id: overlay.id,
      offsetX: position.x - overlay.x,
      offsetY: position.y - overlay.y,
      pointerId: event.pointerId,
      x: overlay.x,
      y: overlay.y,
    };
  }

  function handleLogoPointerMove(event: PointerEvent<HTMLImageElement>) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId || !selectedOutputSize) {
      return;
    }

    const position = getPointerCanvasPosition(event);

    if (!position) {
      return;
    }

    setLogoOverlays((currentOverlays) =>
      currentOverlays.map((overlay) => {
        if (overlay.id !== dragState.id) {
          return overlay;
        }

        const x = clamp(position.x - dragState.offsetX, 0, selectedOutputSize.width - overlay.width);
        const y = clamp(
          position.y - dragState.offsetY,
          0,
          selectedOutputSize.height - overlay.height,
        );

        dragStateRef.current = {
          ...dragState,
          x,
          y,
        };

        return {
          ...overlay,
          x,
          y,
        };
      }),
    );
  }

  function handleLogoPointerUp(event: PointerEvent<HTMLImageElement>) {
    const dragState = dragStateRef.current;

    if (
      !dragState ||
      dragState.pointerId !== event.pointerId ||
      !selectedImage ||
      !selectedOutputSize ||
      !selectedTemplate
    ) {
      return;
    }

    setTemplate(selectedImage.orientation, {
      ...selectedTemplate,
      logo: {
        ...selectedTemplate.logo,
        positions: {
          ...selectedTemplate.logo.positions,
          [dragState.id]: {
            xRatio: dragState.x / selectedOutputSize.width,
            yRatio: dragState.y / selectedOutputSize.height,
          },
        },
      },
    });
    dragStateRef.current = null;
  }

  if (!selectedImage || !selectedOutputSize || !selectedTemplate) {
    return <ImageUpload />;
  }

  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-default bg-background-panel px-6">
        <div className="min-w-0 truncate text-sm text-slate-600">
          {selectedImage.fileName} · {selectedImage.width} x {selectedImage.height}
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-600">
          <span>预览大小</span>
          <input
            className="w-40 accent-primary"
            max="100"
            min="25"
            onChange={(event) => setPreviewScale(Number(event.target.value))}
            step="5"
            type="range"
            value={previewScale}
          />
          <span className="w-10 text-right">{previewScale}%</span>
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-8">
        <div className="flex h-full min-h-[320px] items-center justify-center">
          {previewUrl ? (
            <div
              className="relative shrink-0 bg-background-upload"
              ref={previewSurfaceRef}
              style={{
                height: selectedOutputSize.height * displayScale,
                width: selectedOutputSize.width * displayScale,
              }}
            >
              <img
                alt={selectedImage.fileName}
                className="block h-full w-full select-none object-contain"
                draggable={false}
                src={previewUrl}
              />
              {logoOverlays.map((overlay) => (
                <img
                  alt={`${overlay.fileName} 可拖动位置`}
                  className="absolute select-none rounded border border-white/70 outline outline-1 outline-primary/70"
                  draggable={false}
                  key={overlay.id}
                  onPointerDown={(event) => handleLogoPointerDown(event, overlay)}
                  onPointerMove={handleLogoPointerMove}
                  onPointerUp={handleLogoPointerUp}
                  src={overlay.objectUrl}
                  style={{
                    cursor: 'move',
                    height: overlay.height * displayScale,
                    left: overlay.x * displayScale,
                    opacity: selectedTemplate.logo.opacity,
                    top: overlay.y * displayScale,
                    touchAction: 'none',
                    width: overlay.width * displayScale,
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">正在生成预览...</p>
          )}
        </div>
      </div>
    </div>
  );
}
