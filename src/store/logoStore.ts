import { create } from 'zustand';
import { LogoAsset } from '../types/logo';

interface LogoStore {
  logos: LogoAsset[];
  addLogos: (files: File[]) => void;
  removeLogo: (id: string) => void;
}

function createLogoAsset(file: File): LogoAsset {
  return {
    id: crypto.randomUUID(),
    file,
    fileName: file.name,
    objectUrl: URL.createObjectURL(file),
    size: file.size,
  };
}

export const useLogoStore = create<LogoStore>((set) => ({
  logos: [],
  addLogos: (files) =>
    set((state) => ({
      logos: [...state.logos, ...files.map(createLogoAsset)],
    })),
  removeLogo: (id) =>
    set((state) => {
      const logo = state.logos.find((item) => item.id === id);

      if (logo) {
        URL.revokeObjectURL(logo.objectUrl);
      }

      return {
        logos: state.logos.filter((item) => item.id !== id),
      };
    }),
}));
