import { PointerEvent, useRef, useState } from 'react';
import { useCompositionMode } from '../../hooks/useCompositionMode';
import { useLogoOverlays } from '../../hooks/useLogoOverlays';
import { usePreviewFitScale } from '../../hooks/usePreviewFitScale';
import { useImageStore } from '../../store/imageStore';
import { useLogoStore } from '../../store/logoStore';
import { useSettingsStore } from '../../store/settingsStore';
import { CanvasSetup } from '../canvas/CanvasSetup';
import { ImageUpload } from '../upload/ImageUpload';
import { CompositionControls } from './CompositionControls';
import { InteractiveCanvas } from './InteractiveCanvas';
import { PreviewToolbar } from './PreviewToolbar';
import { clamp, LogoOverlay } from './previewUtils';

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
  const previewSurfaceRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const updateImageComposition = useImageStore((state) => state.updateImageComposition);
  const logos = useLogoStore((state) => state.logos);
  const outputSizes = useSettingsStore((state) => state.outputSizes);
  const templates = useSettingsStore((state) => state.templates);
  const canvasOrientation = useSettingsStore((state) => state.canvasOrientation);
  const setTemplate = useSettingsStore((state) => state.setTemplate);
  const selectedImage = images.find((image) => image.id === selectedImageId) ?? null;
  const activeOrientation = selectedImage?.orientation ?? canvasOrientation;
  const selectedOutputSize = activeOrientation ? outputSizes[activeOrientation] : null;
  const selectedTemplate = activeOrientation ? templates[activeOrientation] : null;
  const { overlays: logoOverlays, setOverlays: setLogoOverlays } = useLogoOverlays({
    enabled: Boolean(selectedImageId && activeOrientation),
    logos,
    outputSize: selectedOutputSize,
    template: selectedTemplate,
  });
  const { fitScale, previewViewportRef } = usePreviewFitScale(selectedOutputSize);
  const compositionMode = useCompositionMode({
    image: selectedImage,
    resetKey: `${activeOrientation ?? 'none'}:${selectedImageId ?? 'none'}`,
    updateComposition: updateImageComposition,
  });
  const displayScale = fitScale * (previewScale / 100);

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
      !activeOrientation ||
      !selectedOutputSize ||
      !selectedTemplate
    ) {
      return;
    }

    setTemplate(activeOrientation, {
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
      <div className="relative min-h-0 flex-1 overflow-auto" ref={previewViewportRef}>
        <div className="flex min-h-full min-w-full items-center justify-center p-8">
          <InteractiveCanvas
            displayScale={displayScale}
            image={selectedImage}
            isCompositionEditing={compositionMode.isEditing}
            logoOverlays={logoOverlays}
            onCompositionChange={(composition) =>
              updateImageComposition(selectedImage.id, composition)
            }
            onLogoPointerDown={handleLogoPointerDown}
            onLogoPointerMove={handleLogoPointerMove}
            onLogoPointerUp={handleLogoPointerUp}
            onStartComposition={compositionMode.start}
            outputSize={selectedOutputSize}
            surfaceRef={previewSurfaceRef}
            template={selectedTemplate}
          />
        </div>
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
          <CompositionControls
            composition={selectedImage.composition}
            isEditing={compositionMode.isEditing}
            onCancel={compositionMode.cancel}
            onChange={(composition) => updateImageComposition(selectedImage.id, composition)}
            onDone={compositionMode.finish}
            onStart={compositionMode.start}
          />
        </div>
      </div>
    </div>
  );
}
