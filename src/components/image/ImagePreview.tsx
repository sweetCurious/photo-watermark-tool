import { PointerEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { usePreviewFitScale } from '../../hooks/usePreviewFitScale';
import { createDrawableLogos, renderProcessedCanvas } from '../../services/imageProcessingService';
import { createLogoCanvas, getLogoRects } from '../../services/logoRenderer';
import { useImageStore } from '../../store/imageStore';
import { useLogoStore } from '../../store/logoStore';
import { useSettingsStore } from '../../store/settingsStore';
import { releaseCanvas, revokeObjectUrl } from '../../utils/memory';
import { CanvasSetup } from '../canvas/CanvasSetup';
import { ImageUpload } from '../upload/ImageUpload';
import { LogoOverlayLayer } from './LogoOverlayLayer';
import { PreviewToolbar } from './PreviewToolbar';
import { canvasToObjectUrl, clamp, LogoOverlay } from './previewUtils';

interface DragState {
  id: string;
  offsetX: number;
  offsetY: number;
  pointerId: number;
  x: number;
  y: number;
}

export function ImagePreview() {
  const [previewScale, setPreviewScale] = useState(100);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [logoOverlays, setLogoOverlays] = useState<LogoOverlay[]>([]);
  const previewSurfaceRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const logos = useLogoStore((state) => state.logos);
  const outputSizes = useSettingsStore((state) => state.outputSizes);
  const templates = useSettingsStore((state) => state.templates);
  const canvasOrientation = useSettingsStore((state) => state.canvasOrientation);
  const setTemplate = useSettingsStore((state) => state.setTemplate);
  const selectedImage = images.find((image) => image.id === selectedImageId) ?? null;
  const selectedOutputSize = canvasOrientation ? outputSizes[canvasOrientation] : null;
  const selectedTemplate = canvasOrientation ? templates[canvasOrientation] : null;
  const { fitScale, previewViewportRef } = usePreviewFitScale(selectedOutputSize);
  const displayScale = fitScale * (previewScale / 100);

  useEffect(() => {
    if (!selectedImage || !canvasOrientation) {
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
    const currentCanvasOrientation = canvasOrientation;
    const outputSize = outputSizes[currentCanvasOrientation];
    const template = templates[currentCanvasOrientation];
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
          currentCanvasOrientation,
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
  }, [canvasOrientation, logos, outputSizes, selectedImage, templates]);

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
      !canvasOrientation ||
      !selectedOutputSize ||
      !selectedTemplate
    ) {
      return;
    }

    setTemplate(canvasOrientation, {
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

  if (!canvasOrientation) {
    return <div className="flex h-full items-center justify-center p-10"><CanvasSetup /></div>;
  }

  if (!selectedImage || !selectedOutputSize || !selectedTemplate) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <ImageUpload />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <PreviewToolbar
        fileName={selectedImage.fileName}
        originalHeight={selectedImage.height}
        originalWidth={selectedImage.width}
        outputSize={selectedOutputSize}
        previewScale={previewScale}
        setPreviewScale={setPreviewScale}
      />
      <div className="min-h-0 flex-1 overflow-auto" ref={previewViewportRef}>
        <div className="flex min-h-full min-w-full items-center justify-center p-8">
          {previewUrl ? (
            <div
              className="relative shrink-0 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/5"
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
              <LogoOverlayLayer
                displayScale={displayScale}
                logoOverlays={logoOverlays}
                opacity={selectedTemplate.logo.opacity}
                onPointerDown={handleLogoPointerDown}
                onPointerMove={handleLogoPointerMove}
                onPointerUp={handleLogoPointerUp}
              />
            </div>
          ) : (
            <p className="text-sm text-slate-500">正在生成预览...</p>
          )}
        </div>
      </div>
    </div>
  );
}
