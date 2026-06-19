import { createXhsFileName } from '../utils/fileName';

export const JPG_MIME_TYPE = 'image/jpeg';
export const JPG_QUALITY = 0.9;

export interface JpgExportResult {
  blob: Blob;
  fileName: string;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Export Failed'));
          return;
        }

        resolve(blob);
      },
      JPG_MIME_TYPE,
      JPG_QUALITY,
    );
  });
}

export async function exportCanvasToJpg(
  canvas: HTMLCanvasElement,
  originalFileName: string,
): Promise<JpgExportResult> {
  const blob = await canvasToBlob(canvas);

  return {
    blob,
    fileName: createXhsFileName(originalFileName),
  };
}
