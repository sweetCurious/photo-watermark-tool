import { useImageProcessing } from '../../hooks/useImageProcessing';

export function Footer() {
  const { imageCount, isProcessing, progress, startProcessing } = useImageProcessing();
  const statusText = isProcessing ? 'Processing' : 'Ready';
  const progressText = progress.total > 0 ? `${progress.current} / ${progress.total}` : '0 / 0';

  return (
    <footer className="flex h-[72px] shrink-0 items-center justify-between border-t border-border-default bg-background-panel px-6">
      <div className="flex items-center gap-4 text-sm">
        <span className="font-medium">{imageCount} Images</span>
        <span className="rounded-full border border-border-default px-3 py-1 text-xs text-slate-600">
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
          className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover disabled:bg-primary-disabled disabled:text-white"
          disabled={imageCount === 0 || isProcessing}
          onClick={() => {
            void startProcessing();
          }}
          type="button"
        >
          Start Processing
        </button>
        <button
          className="h-10 rounded-lg border border-border-default bg-background-panel px-4 text-sm font-medium text-slate-500 hover:border-border-hover disabled:bg-background-upload disabled:text-slate-400"
          disabled
          type="button"
        >
          Download ZIP
        </button>
      </div>
    </footer>
  );
}
