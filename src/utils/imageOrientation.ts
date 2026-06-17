import { ImageOrientation } from '../types/image';

export function detectImageOrientation(width: number, height: number): ImageOrientation {
  return width > height ? 'landscape' : 'portrait';
}
