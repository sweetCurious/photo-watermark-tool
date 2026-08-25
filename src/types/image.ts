export type ImageOrientation = 'portrait' | 'landscape';

export type UploadedImageStatus = 'ready' | 'processing' | 'success' | 'failed';

export interface ImageComposition {
  positionX: number;
  positionY: number;
  zoom: number;
}

export interface UploadedImage {
  composition: ImageComposition;
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
