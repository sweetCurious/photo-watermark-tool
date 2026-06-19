import { create } from 'zustand';
import { LogoAsset, LogoPosition } from '../types/logo';

interface LogoStore {
  leftLogo: LogoAsset | null;
  rightLogo: LogoAsset | null;
  setLogo: (position: LogoPosition, file: File) => void;
  removeLogo: (position: LogoPosition) => void;
}

function createLogoAsset(position: LogoPosition, file: File): LogoAsset {
  return {
    file,
    fileName: file.name,
    objectUrl: URL.createObjectURL(file),
    position,
    size: file.size,
  };
}

export const useLogoStore = create<LogoStore>((set) => ({
  leftLogo: null,
  rightLogo: null,
  setLogo: (position, file) =>
    set((state) => {
      const currentLogo = position === 'left' ? state.leftLogo : state.rightLogo;

      if (currentLogo) {
        URL.revokeObjectURL(currentLogo.objectUrl);
      }

      const nextLogo = createLogoAsset(position, file);

      return position === 'left' ? { leftLogo: nextLogo } : { rightLogo: nextLogo };
    }),
  removeLogo: (position) =>
    set((state) => {
      const currentLogo = position === 'left' ? state.leftLogo : state.rightLogo;

      if (currentLogo) {
        URL.revokeObjectURL(currentLogo.objectUrl);
      }

      return position === 'left' ? { leftLogo: null } : { rightLogo: null };
    }),
}));
