import { ImageIcon, RectangleHorizontal, RectangleVertical, SlidersHorizontal } from 'lucide-react';
import { ReactNode } from 'react';
import { JPG_QUALITY } from '../../services/exportService';
import { useImageStore } from '../../store/imageStore';
import { TemplateSettings, useSettingsStore } from '../../store/settingsStore';
import { ImageOrientation } from '../../types/image';
import { LogoUploader } from '../logo/LogoUploader';

function SettingsCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="border-b border-border-default px-5 py-5 last:border-b-0">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h3>
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
        className="h-9 w-24 rounded-lg border border-border-default bg-slate-50 px-2 text-right text-slate-700"
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
    </label>
  );
}

function ExportCard({ selectedTemplate }: { selectedTemplate: ImageOrientation }) {
  const outputSizes = useSettingsStore((state) => state.outputSizes);
  const setOutputSize = useSettingsStore((state) => state.setOutputSize);
  const label = selectedTemplate === 'portrait' ? '竖图' : '横图';

  return (
    <SettingsCard title="画布尺寸">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="mb-3 flex items-center justify-between text-sm font-medium text-slate-700">
          <span>{label}模板</span>
          <span className="rounded-full bg-white px-2 py-1 text-[11px] font-normal text-slate-400 shadow-sm">当前画布</span>
        </p>
        <NumberInput
          label="宽度"
          min={320}
          onChange={(value) =>
            setOutputSize(selectedTemplate, { ...outputSizes[selectedTemplate], width: value })
          }
          value={outputSizes[selectedTemplate].width}
        />
        <NumberInput
          label="高度"
          min={320}
          onChange={(value) =>
            setOutputSize(selectedTemplate, { ...outputSizes[selectedTemplate], height: value })
          }
          value={outputSizes[selectedTemplate].height}
        />
      </div>
    </SettingsCard>
  );
}

function RangeInput({
  label,
  max,
  onChange,
  value,
}: {
  label: string;
  max: number;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="block text-sm text-slate-500">
      <span>
        {label} {value}%
      </span>
      <input
        className="mt-2 w-full accent-primary"
        max={max}
        min={0}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
    </label>
  );
}

function CheckboxInput({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm text-slate-500">
      <span>{label}</span>
      <input
        checked={checked}
        className="h-4 w-4 accent-primary"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
    </label>
  );
}

function TemplateCard({ selectedTemplate }: { selectedTemplate: ImageOrientation }) {
  const template = useSettingsStore((state) => state.templates[selectedTemplate]);
  const setTemplate = useSettingsStore((state) => state.setTemplate);
  const updateTemplate = (settings: Partial<TemplateSettings>) =>
    setTemplate(selectedTemplate, {
      ...template,
      ...settings,
      logo: {
        ...template.logo,
        ...settings.logo,
      },
      watermark: {
        ...template.watermark,
        ...settings.watermark,
      },
    });

  return (
    <SettingsCard title="水印外观">
      <RangeInput
        label="Logo 大小"
        max={120}
        onChange={(value) => updateTemplate({ logo: { ...template.logo, sizeRatio: value / 100 } })}
        value={Math.round(template.logo.sizeRatio * 100)}
      />
      <RangeInput
        label="Logo 透明度"
        max={100}
        onChange={(value) => updateTemplate({ logo: { ...template.logo, opacity: value / 100 } })}
        value={Math.round(template.logo.opacity * 100)}
      />
      <CheckboxInput
        checked={template.logo.removeBackground}
        label="Logo 背景透明化"
        onChange={(checked) =>
          updateTemplate({ logo: { ...template.logo, removeBackground: checked } })
        }
      />
      <RangeInput
        label="底栏高度"
        max={30}
        onChange={(value) =>
          updateTemplate({ watermark: { ...template.watermark, barHeightRatio: value / 100 } })
        }
        value={Math.round(template.watermark.barHeightRatio * 100)}
      />
      <RangeInput
        label="底栏透明度"
        max={100}
        onChange={(value) =>
          updateTemplate({ watermark: { ...template.watermark, opacity: value / 100 } })
        }
        value={Math.round(template.watermark.opacity * 100)}
      />
      <label className="flex items-center justify-between gap-3 text-sm text-slate-500">
        <span>底栏颜色</span>
        <input
          className="h-9 w-16 rounded-md border border-border-default"
          onChange={(event) =>
            updateTemplate({ watermark: { ...template.watermark, background: event.target.value } })
          }
          type="color"
          value={template.watermark.background}
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
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const selectImage = useImageStore((state) => state.selectImage);
  const canvasOrientation = useSettingsStore((state) => state.canvasOrientation);
  const setCanvasOrientation = useSettingsStore((state) => state.setCanvasOrientation);
  const selectedImage = images.find((image) => image.id === selectedImageId);
  const selectedTemplate: ImageOrientation =
    selectedImage?.orientation ?? canvasOrientation ?? 'portrait';
  const orientationLabel = selectedTemplate === 'portrait' ? '竖图' : '横图';

  function selectOrientation(orientation: ImageOrientation) {
    const matchingImage = images.find((image) => image.orientation === orientation);

    if (matchingImage) {
      selectImage(matchingImage.id);
      return;
    }

    setCanvasOrientation(orientation);
  }

  return (
    <aside className="flex w-[340px] shrink-0 flex-col border-l border-border-default bg-background-panel">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-slate-400" />
          <h2 className="text-sm font-semibold">设计设置</h2>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-600">
          <ImageIcon className="size-3" /> {orientationLabel}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <SettingsCard title="画布方向">
          <div className="grid grid-cols-2 gap-2">
            {([
              ['portrait', '竖版', RectangleVertical],
              ['landscape', '横版', RectangleHorizontal],
            ] as const).map(([orientation, label, Icon]) => (
              <button
                className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-medium ${
                  selectedTemplate === orientation
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                key={orientation}
                onClick={() => selectOrientation(orientation)}
                type="button"
              >
                <Icon className="size-4" /> {label}
              </button>
            ))}
          </div>
          <p className="text-xs leading-5 text-slate-400">
            竖图和横图分别保存设置；选择照片时会自动切换对应画布。
          </p>
        </SettingsCard>
        <SettingsCard title="品牌标识">
          <LogoUploader />
        </SettingsCard>
        <ExportCard selectedTemplate={selectedTemplate} />
        <TemplateCard selectedTemplate={selectedTemplate} />
        <OutputCard />
      </div>
    </aside>
  );
}
