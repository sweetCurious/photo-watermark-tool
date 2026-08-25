import { Focus, ZoomIn, ZoomOut } from 'lucide-react';
import { ImageComposition } from '../../types/image';

interface CompositionControlsProps {
  composition: ImageComposition;
  onChange: (composition: ImageComposition) => void;
}

export function CompositionControls({ composition, onChange }: CompositionControlsProps) {
  const zoomPercent = Math.round(composition.zoom * 100);

  return (
    <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
      <span className="text-xs font-medium text-slate-500">拖动照片调整构图</span>
      <span className="h-5 w-px bg-slate-200" />
      <ZoomOut className="size-3.5 text-slate-400" />
      <input
        aria-label="照片构图缩放"
        className="w-32 accent-violet-600"
        max="300"
        min="100"
        onChange={(event) =>
          onChange({ ...composition, zoom: Number(event.target.value) / 100 })
        }
        step="1"
        type="range"
        value={zoomPercent}
      />
      <ZoomIn className="size-3.5 text-slate-400" />
      <span className="w-10 text-right text-xs font-medium text-slate-600">{zoomPercent}%</span>
      <button
        className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        onClick={() => onChange({ positionX: 0.5, positionY: 0.5, zoom: 1 })}
        type="button"
      >
        <Focus className="size-3.5" /> 恢复居中
      </button>
    </div>
  );
}
