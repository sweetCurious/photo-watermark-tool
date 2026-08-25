import { Check, Crop, Focus, X, ZoomIn, ZoomOut } from 'lucide-react';
import { ImageComposition } from '../../types/image';

interface CompositionControlsProps {
  composition: ImageComposition;
  isEditing: boolean;
  onCancel: () => void;
  onChange: (composition: ImageComposition) => void;
  onDone: () => void;
  onStart: () => void;
}

export function CompositionControls({
  composition,
  isEditing,
  onCancel,
  onChange,
  onDone,
  onStart,
}: CompositionControlsProps) {
  const zoomPercent = Math.round(composition.zoom * 100);

  if (!isEditing) {
    return (
      <button
        className="pointer-events-auto flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-4 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur hover:bg-slate-50"
        onClick={onStart}
        type="button"
      >
        <Crop className="size-4 text-violet-600" /> 调整构图
      </button>
    );
  }

  return (
    <div className="pointer-events-auto flex items-center gap-3 whitespace-nowrap rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
      <span className="flex items-center gap-1.5 text-xs font-medium text-violet-600">
        <Crop className="size-3.5" /> 构图模式
      </span>
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
      <button
        aria-label="取消构图调整"
        className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        onClick={onCancel}
        type="button"
      >
        <X className="size-4" />
      </button>
      <button
        className="flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-800"
        onClick={onDone}
        type="button"
      >
        <Check className="size-3.5" /> 完成
      </button>
    </div>
  );
}
