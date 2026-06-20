import { ChangeEvent, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useLogoStore } from '../../store/logoStore';
import { LogoAsset, LogoPosition } from '../../types/logo';

function isValidLogo(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension === 'png' || extension === 'svg';
}

function LogoPreview({ logo }: { logo: LogoAsset }) {
  return (
    <div className="mt-3 rounded-lg border border-border-default bg-background-upload p-3">
      <img alt={logo.fileName} className="h-16 max-w-full object-contain" src={logo.objectUrl} />
      <p className="mt-2 truncate text-xs text-slate-600">{logo.fileName}</p>
    </div>
  );
}

export function LogoUploader({ position }: { position: LogoPosition }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('PNG / SVG');
  const logo = useLogoStore((state) => (position === 'left' ? state.leftLogo : state.rightLogo));
  const setLogo = useLogoStore((state) => state.setLogo);
  const removeLogo = useLogoStore((state) => state.removeLogo);
  const label = position === 'left' ? '左侧品牌标识' : '右侧品牌标识';

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!isValidLogo(file)) {
      setMessage('品牌标识无效');
      console.error('Invalid Logo', file.name);
      toast.error('品牌标识无效');
      return;
    }

    setLogo(position, file);
    setMessage('品牌标识已就绪');
  }

  return (
    <section className="rounded-lg border border-border-default p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-slate-950">{label}</h3>
          <p className="mt-1 text-xs text-slate-500">{message}</p>
        </div>
        <input
          accept=".png,.svg"
          className="hidden"
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
      {logo ? (
        <>
          <LogoPreview logo={logo} />
          <button
            className="mt-3 h-9 w-full rounded-lg border border-error text-sm font-medium text-error hover:bg-red-50"
            onClick={() => removeLogo(position)}
            type="button"
          >
            删除品牌标识
          </button>
        </>
      ) : (
        <p className="mt-3 rounded-lg bg-background-upload p-3 text-sm text-slate-500">
          未上传品牌标识
        </p>
      )}
    </section>
  );
}
