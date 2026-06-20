import { ReactNode, useState } from 'react';
import { JPG_QUALITY } from '../../services/exportService';
import { TemplateSettings, useSettingsStore } from '../../store/settingsStore';
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

function TemplateTabs({
  selectedTemplate,
  setSelectedTemplate,
}: {
  selectedTemplate: ImageOrientation;
  setSelectedTemplate: (orientation: ImageOrientation) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        ['portrait', '竖图模板'],
        ['landscape', '横图模板'],
      ].map(([orientation, label]) => (
        <button
          className={`h-9 rounded-lg border text-sm font-medium ${
            selectedTemplate === orientation
              ? 'border-primary bg-primary text-white'
              : 'border-border-default bg-background-panel text-slate-600 hover:border-border-hover'
          }`}
          key={orientation}
          onClick={() => setSelectedTemplate(orientation as ImageOrientation)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ExportCard({ selectedTemplate }: { selectedTemplate: ImageOrientation }) {
  const outputSizes = useSettingsStore((state) => state.outputSizes);
  const setOutputSize = useSettingsStore((state) => state.setOutputSize);
  const label = selectedTemplate === 'portrait' ? '竖图' : '横图';

  return (
    <SettingsCard title="导出尺寸">
      <p className="text-xs text-slate-500">当前编辑：{label}模板</p>
      <div className="rounded-lg bg-background-upload p-3">
        <p className="mb-2 text-sm font-medium text-slate-950">{label}</p>
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
    <SettingsCard title="模板水印">
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
  const [selectedTemplate, setSelectedTemplate] = useState<ImageOrientation>('portrait');

  return (
    <aside className="flex w-[360px] shrink-0 flex-col border-l border-border-default bg-background-panel">
      <div className="border-b border-border-default px-5 py-4">
        <h2 className="text-lg font-semibold">设置</h2>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
        <SettingsCard title="品牌标识设置">
          <LogoUploader />
        </SettingsCard>
        <SettingsCard title="模板">
          <TemplateTabs
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
        </SettingsCard>
        <ExportCard selectedTemplate={selectedTemplate} />
        <TemplateCard selectedTemplate={selectedTemplate} />
        <OutputCard />
      </div>
    </aside>
  );
}
