import { ReactNode } from 'react';
import { JPG_QUALITY } from '../../services/exportService';
import { useSettingsStore, WatermarkSettings } from '../../store/settingsStore';
import { ImageOrientation } from '../../types/image';
import { LogoUploader } from '../logo/LogoUploader';

function SettingsCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-border-default bg-background-panel p-4">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function NumberInput({
  label,
  min,
  onChange,
  value,
}: {
  label: string;
  min: number;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <input
        className="h-9 w-28 rounded-md border border-border-default px-2 text-right"
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
    </label>
  );
}

function ExportCard() {
  const outputSizes = useSettingsStore((state) => state.outputSizes);
  const setOutputSize = useSettingsStore((state) => state.setOutputSize);

  function updateSize(orientation: ImageOrientation, key: 'width' | 'height', value: number) {
    setOutputSize(orientation, {
      ...outputSizes[orientation],
      [key]: value,
    });
  }

  return (
    <SettingsCard title="导出尺寸">
      <div className="space-y-3">
        <p className="text-xs text-slate-500">默认使用小红书横图 / 竖图全屏尺寸，可自由修改。</p>
        <div className="rounded-lg bg-background-upload p-3">
          <p className="mb-2 text-sm font-medium text-slate-950">竖图</p>
          <NumberInput
            label="宽度"
            min={320}
            onChange={(value) => updateSize('portrait', 'width', value)}
            value={outputSizes.portrait.width}
          />
          <NumberInput
            label="高度"
            min={320}
            onChange={(value) => updateSize('portrait', 'height', value)}
            value={outputSizes.portrait.height}
          />
        </div>
        <div className="rounded-lg bg-background-upload p-3">
          <p className="mb-2 text-sm font-medium text-slate-950">横图</p>
          <NumberInput
            label="宽度"
            min={320}
            onChange={(value) => updateSize('landscape', 'width', value)}
            value={outputSizes.landscape.width}
          />
          <NumberInput
            label="高度"
            min={320}
            onChange={(value) => updateSize('landscape', 'height', value)}
            value={outputSizes.landscape.height}
          />
        </div>
      </div>
    </SettingsCard>
  );
}

function WatermarkCard() {
  const watermark = useSettingsStore((state) => state.watermark);
  const setWatermark = useSettingsStore((state) => state.setWatermark);
  const updateWatermark = (settings: Partial<WatermarkSettings>) =>
    setWatermark({
      ...watermark,
      ...settings,
    });

  return (
    <SettingsCard title="水印底栏">
      <label className="block text-sm text-slate-500">
        <span>底栏高度 {Math.round(watermark.barHeightRatio * 100)}%</span>
        <input
          className="mt-2 w-full accent-primary"
          max={30}
          min={0}
          onChange={(event) => updateWatermark({ barHeightRatio: Number(event.target.value) / 100 })}
          type="range"
          value={Math.round(watermark.barHeightRatio * 100)}
        />
      </label>
      <label className="block text-sm text-slate-500">
        <span>透明度 {Math.round(watermark.opacity * 100)}%</span>
        <input
          className="mt-2 w-full accent-primary"
          max={100}
          min={0}
          onChange={(event) => updateWatermark({ opacity: Number(event.target.value) / 100 })}
          type="range"
          value={Math.round(watermark.opacity * 100)}
        />
      </label>
      <label className="flex items-center justify-between gap-3 text-sm text-slate-500">
        <span>背景颜色</span>
        <input
          className="h-9 w-16 rounded-md border border-border-default"
          onChange={(event) => updateWatermark({ background: event.target.value })}
          type="color"
          value={watermark.background}
        />
      </label>
    </SettingsCard>
  );
}

function OutputCard() {
  return (
    <SettingsCard title="输出格式">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">格式</span>
        <span className="font-medium text-slate-950">JPG</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">质量</span>
        <span className="font-medium text-slate-950">{JPG_QUALITY * 100}%</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">文件名</span>
        <span className="font-medium text-slate-950">原文件名_xhs.jpg</span>
      </div>
    </SettingsCard>
  );
}

export function SettingsPanel() {
  return (
    <aside className="flex w-[360px] shrink-0 flex-col border-l border-border-default bg-background-panel">
      <div className="border-b border-border-default px-5 py-4">
        <h2 className="text-lg font-semibold">设置</h2>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
        <SettingsCard title="品牌标识设置">
          <LogoUploader />
        </SettingsCard>
        <ExportCard />
        <WatermarkCard />
        <OutputCard />
      </div>
    </aside>
  );
}
