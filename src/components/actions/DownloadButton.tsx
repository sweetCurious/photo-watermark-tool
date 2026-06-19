import { JpgExportResult } from '../../services/exportService';
import { downloadZip } from '../../services/zipService';

export function DownloadButton({ files }: { files: JpgExportResult[] }) {
  const isDisabled = files.length === 0;

  return (
    <button
      className="h-10 rounded-lg border border-border-default bg-background-panel px-4 text-sm font-medium text-slate-700 disabled:text-slate-400"
      disabled={isDisabled}
      onClick={() => {
        void downloadZip(files);
      }}
      type="button"
    >
      Download ZIP
    </button>
  );
}
