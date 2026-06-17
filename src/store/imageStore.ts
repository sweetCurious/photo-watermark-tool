import { create } from 'zustand';
import { decodeImageFile } from '../services/imageDecodeService';
import { UploadedImage } from '../types/image';

interface ImageStore {
  images: UploadedImage[];
  selectedImageId: string | null;
  addFiles: (files: File[]) => void;
  selectImage: (id: string) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  selectedImageId: null,
  addFiles: (files) => {
    files.forEach((file) => {
      decodeImageFile(file)
        .then((image) =>
          set((state) => ({
            images: [...state.images, image],
            selectedImageId: state.selectedImageId ?? image.id,
          })),
        )
        .catch((error: unknown) => {
          console.error('Image Load Failed', error);
        });
    });
  },
  selectImage: (id) => set({ selectedImageId: id }),
  removeImage: (id) =>
    set((state) => {
      const imageIndex = state.images.findIndex((image) => image.id === id);
      const nextImages = state.images.filter((image) => image.id !== id);
      const shouldMoveSelection = state.selectedImageId === id;
      const nextSelectedImage = nextImages[imageIndex] ?? nextImages[imageIndex - 1] ?? null;

      return {
        images: nextImages,
        selectedImageId: shouldMoveSelection ? nextSelectedImage?.id ?? null : state.selectedImageId,
      };
    }),
  clearImages: () =>
    set({
      images: [],
      selectedImageId: null,
    }),
}));
