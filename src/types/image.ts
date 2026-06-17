export type ImageOrientation = 'portrait' | 'landscape';

export type UploadedImageStatus = 'ready';

export interface UploadedImage {
  id: string;
  file: File;
  fileName: string;
  size: number;
  width: number;
  height: number;
  orientation: ImageOrientation;
  objectUrl: string;
  status: UploadedImageStatus;
}
