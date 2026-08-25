import { RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { ImageOrientation } from '../../types/image';

const CANVAS_OPTIONS: Array<{
  description: string;
  icon: typeof RectangleVertical;
  label: string;
  orientation: ImageOrientation;
  size: string;
}> = [
  {
    description: '适合小红书图文与封面',
    icon: RectangleVertical,
    label: '竖版画布',
    orientation: 'portrait',
    size: '1242 × 1656',
  },
  {
    description: '适合横向照片与展示图',
    icon: RectangleHorizontal,
    label: '横版画布',
    orientation: 'landscape',
    size: '1600 × 1200',
  },
];

export function CanvasSetup() {
  const setCanvasOrientation = useSettingsStore((state) => state.setCanvasOrientation);

  return (
    <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-500">第一步</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">先选择画布</h2>
        <p className="mt-2 text-sm text-slate-500">整批照片将等比例缩放并填满同一个画布</p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4">
        {CANVAS_OPTIONS.map((option) => {
          const Icon = option.icon;

          return (
            <button
              className="group rounded-2xl border-2 border-slate-200 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-100"
              key={option.orientation}
              onClick={() => setCanvasOrientation(option.orientation)}
              type="button"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-violet-100 group-hover:text-violet-600">
                <Icon className="size-6" />
              </div>
              <p className="mt-4 text-base font-bold text-slate-800">{option.label}</p>
              <p className="mt-1 text-sm font-medium text-violet-600">{option.size}</p>
              <p className="mt-2 text-xs text-slate-400">{option.description}</p>
            </button>
          );
        })}
      </div>
      <p className="mt-5 text-center text-xs text-slate-400">比例不同的照片会居中裁切超出画布的边缘</p>
    </div>
  );
}
