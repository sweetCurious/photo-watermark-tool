export function Footer() {
  return (
    <footer className="flex h-[72px] shrink-0 items-center justify-between border-t border-border-default bg-background-panel px-6">
      <div className="flex items-center gap-4 text-sm">
        <span className="font-medium">0 Images</span>
        <span className="rounded-full border border-border-default px-3 py-1 text-xs text-slate-600">
          Ready
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-white opacity-60"
          disabled
          type="button"
        >
          Start Processing
        </button>
        <button
          className="h-10 rounded-lg border border-border-default bg-background-panel px-4 text-sm font-medium text-slate-500"
          disabled
          type="button"
        >
          Download ZIP
        </button>
      </div>
    </footer>
  );
}
