export function Header() {
  return (
    <header className="z-[100] flex h-16 shrink-0 items-center justify-between border-b border-border-default bg-background-panel px-6">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
          P
        </div>
        <h1 className="text-2xl font-semibold">Photo Watermark Tool</h1>
      </div>
      <div className="flex items-center gap-4 text-sm text-slate-500">
        <span>GitHub</span>
        <span>Version 1.0</span>
      </div>
    </header>
  );
}
