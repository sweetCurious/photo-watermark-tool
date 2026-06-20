import { ReactNode } from 'react';
import { OUTPUT_IMAGE_SPECS } from '../../constants/imageSpecs';
import { BOTTOM_BAR_HEIGHT_RATIO } from '../../constants/watermarkSpecs';
import { JPG_QUALITY } from '../../services/exportService';
import { LogoUploader } from '../logo/LogoUploader';

interface ReadonlyRow {
  label: string;
  value: string;
}

function SettingsCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-border-default bg-background-panel p-4">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function ReadonlyInfoList({ rows }: { rows: ReadonlyRow[] }) {
  return (
    <dl className="space-y-3">
      {rows.map((row) => (
        <div className="flex items-center justify-between gap-4 text-sm" key={row.label}>
          <dt className="text-slate-500">{row.label}</dt>
          <dd className="font-medium text-slate-950">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function LogoSettingsCard() {
  return (
    <SettingsCard title="品牌标识设置">
      <LogoUploader position="left" />
      <LogoUploader position="right" />
    </SettingsCard>
  );
}

function ExportCard() {
  return (
    <SettingsCard title="导出尺寸">
      <ReadonlyInfoList
        rows={[
          {
            label: '竖图',
            value: `${OUTPUT_IMAGE_SPECS.portrait.width} x ${OUTPUT_IMAGE_SPECS.portrait.height}`,
          },
          {
            label: '横图',
            value: `${OUTPUT_IMAGE_SPECS.landscape.width} x ${OUTPUT_IMAGE_SPECS.landscape.height}`,
          },
        ]}
      />
    </SettingsCard>
  );
}

function WatermarkCard() {
  return (
    <SettingsCard title="水印底栏">
      <ReadonlyInfoList
        rows={[
          {
            label: '底栏高度',
            value: `${BOTTOM_BAR_HEIGHT_RATIO * 100}%`,
          },
          {
            label: '透明度',
            value: '30%',
          },
          {
            label: '背景',
            value: '黑色',
          },
        ]}
      />
    </SettingsCard>
  );
}

function OutputCard() {
  return (
    <SettingsCard title="输出格式">
      <ReadonlyInfoList
        rows={[
          {
            label: '格式',
            value: 'JPG',
          },
          {
            label: '质量',
            value: `${JPG_QUALITY * 100}%`,
          },
          {
            label: '文件名',
            value: '原文件名_xhs.jpg',
          },
        ]}
      />
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
        <LogoSettingsCard />
        <ExportCard />
        <WatermarkCard />
        <OutputCard />
      </div>
    </aside>
  );
}
