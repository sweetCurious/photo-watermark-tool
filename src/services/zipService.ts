import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { JpgExportResult } from './exportService';

export const ZIP_FILE_NAME = 'xhs_photos.zip';

export async function createZipBlob(files: JpgExportResult[]): Promise<Blob> {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.fileName, file.blob);
  });

  return zip.generateAsync({ type: 'blob' });
}

export async function downloadZip(files: JpgExportResult[]) {
  const blob = await createZipBlob(files);
  saveAs(blob, ZIP_FILE_NAME);
}
