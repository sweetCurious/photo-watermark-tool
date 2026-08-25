import { LogoRect } from '../../services/logoRenderer';

export interface LogoOverlay extends LogoRect {
  fileName: string;
  objectUrl: string;
}

export function canvasToObjectUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Preview Render Failed'));
        return;
      }

      resolve(URL.createObjectURL(blob));
    }, 'image/png');
  });
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
