import { create } from 'zustand';

export type UploadedImageStatus = 'ready';

export interface UploadedImage {
  id: string;
  file: File;
  fileName: string;
  size: number;
  status: UploadedImageStatus;
}

interface ImageStore {
  images: UploadedImage[];
  addFiles: (files: File[]) => void;
}

function createImageId() {
  return crypto.randomUUID();
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  addFiles: (files) =>
    set((state) => ({
      images: [
        ...state.images,
        ...files.map((file) => ({
          id: createImageId(),
          file,
          fileName: file.name,
          size: file.size,
          status: 'ready' as const,
        })),
      ],
    })),
}));
