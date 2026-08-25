import { Maximize2, Minus, Plus } from 'lucide-react';
import { OutputSize } from '../../store/settingsStore';

interface PreviewToolbarProps {
  fileName: string;
  originalHeight: number;
  originalWidth: number;
  outputSize: OutputSize;
  previewScale: number;
  setPreviewScale: (scale: number | ((current: number) => number)) => void;
}

export function PreviewToolbar({
  fileName,
  originalHeight,
  originalWidth,
  outputSize,
  previewScale,
  setPreviewScale,
}: PreviewToolbarProps) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-default bg-white/90 px-5 backdrop-blur">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-700">{fileName}</p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          原图 {originalWidth} × {originalHeight} · 输出 {outputSize.width} × {outputSize.height}
        </p>
      </div>
      <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        <button
          aria-label="缩小预览"
          className="flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
          disabled={previewScale <= 50}
          onClick={() => setPreviewScale((scale) => Math.max(50, scale - 10))}
          type="button"
        >
          <Minus className="size-3.5" />
        </button>
        <button
          className="flex h-7 min-w-16 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
          onClick={() => setPreviewScale(100)}
          type="button"
        >
          <Maximize2 className="size-3" /> {previewScale}%
        </button>
        <button
          aria-label="放大预览"
          className="flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
          disabled={previewScale >= 150}
          onClick={() => setPreviewScale((scale) => Math.min(150, scale + 10))}
          type="button"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
