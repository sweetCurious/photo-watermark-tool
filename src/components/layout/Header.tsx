import { Check, ImagePlus, LockKeyhole, Sparkles } from 'lucide-react';
import { useImageStore } from '../../store/imageStore';
import { useSettingsStore } from '../../store/settingsStore';
import { HistoryControls } from '../actions/HistoryControls';

function FlowStep({
  active,
  complete,
  label,
  number,
}: {
  active: boolean;
  complete: boolean;
  label: string;
  number: number;
}) {
  return (
    <div className={`flex items-center gap-2 ${active ? 'text-slate-950' : 'text-slate-400'}`}>
      <span
        className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
          complete
            ? 'bg-emerald-500 text-white'
            : active
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-400'
        }`}
      >
        {complete ? <Check className="size-3.5" strokeWidth={3} /> : number}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function Header() {
  const imageCount = useImageStore((state) => state.images.length);
  const canvasOrientation = useSettingsStore((state) => state.canvasOrientation);
  const hasCanvas = canvasOrientation !== null;

  return (
    <header className="z-[100] flex h-[72px] shrink-0 items-center justify-between border-b border-border-default bg-background-panel px-6 shadow-sm shadow-slate-200/40">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-sm">
          <Sparkles className="size-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight">照片水印</h1>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
            <LockKeyhole className="size-3" /> 本地处理，照片不会上传
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 rounded-full border border-slate-200 bg-slate-50/80 px-4 py-2">
        <FlowStep active={!hasCanvas} complete={hasCanvas} label="设置画布" number={1} />
        <span className="h-px w-7 bg-slate-200" />
        <FlowStep
          active={hasCanvas && imageCount === 0}
          complete={imageCount > 0}
          label="添加照片"
          number={2}
        />
        <span className="h-px w-7 bg-slate-200" />
        <FlowStep
          active={imageCount > 0}
          complete={false}
          label="处理导出"
          number={3}
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <HistoryControls />
        <ImagePlus className="size-4" />
        <span>{imageCount} 张照片</span>
      </div>
    </header>
  );
}
