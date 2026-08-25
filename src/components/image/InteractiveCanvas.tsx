import { PointerEvent, RefObject, useRef, useState } from 'react';
import { OutputSize, TemplateSettings } from '../../store/settingsStore';
import { ImageComposition, UploadedImage } from '../../types/image';
import { getCoverRect } from '../../utils/drawCover';
import { LogoOverlayLayer } from './LogoOverlayLayer';
import { clamp, LogoOverlay } from './previewUtils';

interface PhotoDragState {
  composition: ImageComposition;
  pointerId: number;
  startClientX: number;
  startClientY: number;
}

interface InteractiveCanvasProps {
  displayScale: number;
  image: UploadedImage;
  isCompositionEditing: boolean;
  logoOverlays: LogoOverlay[];
  onCompositionChange: (composition: ImageComposition) => void;
  onStartComposition: () => void;
  onLogoPointerDown: (event: PointerEvent<HTMLImageElement>, overlay: LogoOverlay) => void;
  onLogoPointerMove: (event: PointerEvent<HTMLImageElement>) => void;
  onLogoPointerUp: (event: PointerEvent<HTMLImageElement>) => void;
  outputSize: OutputSize;
  surfaceRef: RefObject<HTMLDivElement>;
  template: TemplateSettings;
}

export function InteractiveCanvas({
  displayScale,
  image,
  isCompositionEditing,
  logoOverlays,
  onCompositionChange,
  onStartComposition,
  onLogoPointerDown,
  onLogoPointerMove,
  onLogoPointerUp,
  outputSize,
  surfaceRef,
  template,
}: InteractiveCanvasProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef<PhotoDragState | null>(null);
  const photoRect = getCoverRect(
    image.width,
    image.height,
    outputSize.width,
    outputSize.height,
    image.composition,
  );

  function handlePointerDown(event: PointerEvent<HTMLImageElement>) {
    if (!isCompositionEditing) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      composition: image.composition,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
    };
    setIsDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLImageElement>) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const startRect = getCoverRect(
      image.width,
      image.height,
      outputSize.width,
      outputSize.height,
      dragState.composition,
    );
    const overflowX = Math.max(startRect.width - outputSize.width, 0);
    const overflowY = Math.max(startRect.height - outputSize.height, 0);
    const deltaX = (event.clientX - dragState.startClientX) / displayScale;
    const deltaY = (event.clientY - dragState.startClientY) / displayScale;
    const x = clamp(startRect.x + deltaX, -overflowX, 0);
    const y = clamp(startRect.y + deltaY, -overflowY, 0);

    onCompositionChange({
      ...dragState.composition,
      positionX: overflowX > 0 ? -x / overflowX : 0.5,
      positionY: overflowY > 0 ? -y / overflowY : 0.5,
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLImageElement>) {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;
      setIsDragging(false);
    }
  }

  return (
    <div
      className="relative shrink-0 overflow-hidden bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/5"
      ref={surfaceRef}
      style={{
        height: outputSize.height * displayScale,
        width: outputSize.width * displayScale,
      }}
    >
      <img
        alt={image.fileName}
        className="absolute max-w-none select-none"
        draggable={false}
        onPointerCancel={handlePointerUp}
        onDoubleClick={onStartComposition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        src={image.objectUrl}
        style={{
          cursor: isCompositionEditing ? (isDragging ? 'grabbing' : 'grab') : 'default',
          height: photoRect.height * displayScale,
          left: photoRect.x * displayScale,
          touchAction: 'none',
          top: photoRect.y * displayScale,
          width: photoRect.width * displayScale,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          backgroundColor: template.watermark.background,
          height: outputSize.height * template.watermark.barHeightRatio * displayScale,
          opacity: template.watermark.opacity,
        }}
      />
      {isCompositionEditing ? (
        <div className="pointer-events-none absolute inset-0 z-10">
          <span className="absolute inset-y-0 left-1/3 w-px bg-white/80 shadow-[0_0_1px_rgba(15,23,42,0.7)]" />
          <span className="absolute inset-y-0 left-2/3 w-px bg-white/80 shadow-[0_0_1px_rgba(15,23,42,0.7)]" />
          <span className="absolute inset-x-0 top-1/3 h-px bg-white/80 shadow-[0_0_1px_rgba(15,23,42,0.7)]" />
          <span className="absolute inset-x-0 top-2/3 h-px bg-white/80 shadow-[0_0_1px_rgba(15,23,42,0.7)]" />
          <span className="absolute inset-0 border-2 border-violet-500/80" />
        </div>
      ) : null}
      <LogoOverlayLayer
        displayScale={displayScale}
        logoOverlays={logoOverlays}
        opacity={template.logo.opacity}
        onPointerDown={onLogoPointerDown}
        onPointerMove={onLogoPointerMove}
        onPointerUp={onLogoPointerUp}
      />
    </div>
  );
}
