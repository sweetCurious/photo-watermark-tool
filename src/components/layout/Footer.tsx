import { useImageProcessing } from '../../hooks/useImageProcessing';
import { CircleStop, Play, ShieldCheck } from 'lucide-react';
import { DownloadButton } from '../actions/DownloadButton';

export function Footer() {
  const { cancelProcessing, exportedFiles, imageCount, isProcessing, progress, startProcessing } =
    useImageProcessing();
  const statusText = isProcessing ? '处理中' : '就绪';
  const progressText = progress.total > 0 ? `${progress.current} / ${progress.total}` : '0 / 0';

  return (
    <footer className="flex h-[76px] shrink-0 items-center justify-between border-t border-border-default bg-background-panel px-6 shadow-[0_-4px_16px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="size-4 text-emerald-500" /> 浏览器本地处理
        </span>
        <span className="h-4 w-px bg-slate-200" />
        <span className="font-medium text-slate-700">{imageCount} 张照片</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
          {statusText}
        </span>
        {progress.total > 0 ? (
          <div className="flex w-48 items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-500">{progressText}</span>
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <button
          className="flex h-11 min-w-32 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400"
          disabled={imageCount === 0}
          onClick={() => {
            if (isProcessing) {
              cancelProcessing();
              return;
            }

            void startProcessing();
          }}
          type="button"
        >
          {isProcessing ? <CircleStop className="size-4" /> : <Play className="size-4 fill-current" />}
          {isProcessing ? '取消处理' : '开始处理'}
        </button>
        <DownloadButton files={exportedFiles} />
      </div>
    </footer>
  );
}
