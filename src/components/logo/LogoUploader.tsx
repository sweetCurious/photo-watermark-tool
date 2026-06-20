import { ChangeEvent, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useLogoStore } from '../../store/logoStore';
import { LogoAsset } from '../../types/logo';

function isValidLogo(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension === 'png' || extension === 'svg';
}

function LogoPreview({ logo, onRemove }: { logo: LogoAsset; onRemove: () => void }) {
  return (
    <div className="rounded-lg border border-border-default bg-background-upload p-3">
      <img alt={logo.fileName} className="h-14 max-w-full object-contain" src={logo.objectUrl} />
      <p className="mt-2 truncate text-xs text-slate-600">{logo.fileName}</p>
      <button
        className="mt-2 h-8 w-full rounded-md border border-error text-xs font-medium text-error hover:bg-red-50"
        onClick={onRemove}
        type="button"
      >
        删除
      </button>
    </div>
  );
}

export function LogoUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('可上传多个 PNG / SVG');
  const logos = useLogoStore((state) => state.logos);
  const addLogos = useLogoStore((state) => state.addLogos);
  const removeLogo = useLogoStore((state) => state.removeLogo);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (files.length === 0) {
      return;
    }

    const validFiles = files.filter(isValidLogo);

    if (validFiles.length !== files.length) {
      setMessage('已跳过无效品牌标识');
      toast.error('仅支持 PNG / SVG 品牌标识');
    }

    if (validFiles.length > 0) {
      addLogos(validFiles);
      setMessage(`已上传 ${logos.length + validFiles.length} 个品牌标识`);
    }
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-950">品牌标识</p>
          <p className="mt-1 text-xs text-slate-500">{message}</p>
        </div>
        <input
          accept=".png,.svg"
          className="hidden"
          multiple
          onChange={handleChange}
          ref={inputRef}
          type="file"
        />
        <button
          className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          上传
        </button>
      </div>
      {logos.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {logos.map((logo) => (
            <LogoPreview key={logo.id} logo={logo} onRemove={() => removeLogo(logo.id)} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg bg-background-upload p-3 text-sm text-slate-500">
          未上传品牌标识
        </p>
      )}
    </section>
  );
}
