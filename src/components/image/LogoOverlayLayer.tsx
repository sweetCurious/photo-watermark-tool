import { PointerEvent } from 'react';
import { LogoOverlay } from './previewUtils';

interface LogoOverlayLayerProps {
  displayScale: number;
  logoOverlays: LogoOverlay[];
  opacity: number;
  onPointerDown: (event: PointerEvent<HTMLImageElement>, overlay: LogoOverlay) => void;
  onPointerMove: (event: PointerEvent<HTMLImageElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLImageElement>) => void;
}

export function LogoOverlayLayer({
  displayScale,
  logoOverlays,
  opacity,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: LogoOverlayLayerProps) {
  return logoOverlays.map((overlay) => (
    <img
      alt={`${overlay.fileName} 可拖动位置`}
      className="absolute select-none rounded border border-white/70 outline outline-1 outline-primary/70"
      draggable={false}
      key={overlay.id}
      onPointerDown={(event) => onPointerDown(event, overlay)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      src={overlay.objectUrl}
      style={{
        cursor: 'move',
        height: overlay.height * displayScale,
        left: overlay.x * displayScale,
        opacity,
        top: overlay.y * displayScale,
        touchAction: 'none',
        width: overlay.width * displayScale,
      }}
    />
  ));
}
