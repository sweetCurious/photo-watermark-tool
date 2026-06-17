import { create } from 'zustand';
import { decodeImageFile } from '../services/imageDecodeService';
import { UploadedImage } from '../types/image';

interface ImageStore {
  images: UploadedImage[];
  addFiles: (files: File[]) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  addFiles: (files) => {
    files.forEach((file) => {
      decodeImageFile(file)
        .then((image) =>
          set((state) => ({
            images: [...state.images, image],
          })),
        )
        .catch((error: unknown) => {
          console.error('Image Load Failed', error);
        });
    });
  },
}));
