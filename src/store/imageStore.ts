import { create } from 'zustand';
import { toast } from 'sonner';
import { decodeImageFile } from '../services/imageDecodeService';
import { UploadedImage, UploadedImageStatus } from '../types/image';

const MEMORY_WARNING_SIZE = 30 * 1024 * 1024;

interface ImageStore {
  images: UploadedImage[];
  selectedImageId: string | null;
  addFiles: (files: File[]) => void;
  selectImage: (id: string) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  updateImageStatus: (id: string, status: UploadedImageStatus) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  selectedImageId: null,
  addFiles: (files) => {
    const hasLargeFile = files.some((file) => file.size > MEMORY_WARNING_SIZE);

    if (hasLargeFile) {
      console.error('Memory Limit Exceeded');
      toast.warning('Memory Limit Exceeded');
    }

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
          toast.error('Image Load Failed');
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
  updateImageStatus: (id, status) =>
    set((state) => ({
      images: state.images.map((image) => (image.id === id ? { ...image, status } : image)),
    })),
}));
