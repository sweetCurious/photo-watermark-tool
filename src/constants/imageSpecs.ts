import { ImageOrientation } from '../types/image';

export const OUTPUT_IMAGE_SPECS: Record<ImageOrientation, { width: number; height: number }> = {
  portrait: {
    width: 1242,
    height: 1656,
  },
  landscape: {
    width: 1600,
    height: 1200,
  },
};
