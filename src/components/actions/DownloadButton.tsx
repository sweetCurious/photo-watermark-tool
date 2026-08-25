import { JpgExportResult } from '../../services/exportService';
import { downloadZip } from '../../services/zipService';
import { Download } from 'lucide-react';

export function DownloadButton({ files }: { files: JpgExportResult[] }) {
  const isDisabled = files.length === 0;

  return (
    <button
      className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:from-violet-700 hover:to-blue-700 disabled:bg-none disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
      disabled={isDisabled}
      onClick={() => {
        void downloadZip(files);
      }}
      type="button"
    >
      <Download className="size-4" />
      下载 ZIP
    </button>
  );
}
