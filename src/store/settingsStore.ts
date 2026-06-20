import { create } from 'zustand';
import { OUTPUT_IMAGE_SPECS } from '../constants/imageSpecs';
import { BOTTOM_BAR_HEIGHT_RATIO } from '../constants/watermarkSpecs';
import type { ImageOrientation } from '../types/image';

export interface OutputSize {
  width: number;
  height: number;
}

export interface WatermarkSettings {
  barHeightRatio: number;
  opacity: number;
  background: string;
}

interface SettingsStore {
  outputSizes: Record<ImageOrientation, OutputSize>;
  watermark: WatermarkSettings;
  setOutputSize: (orientation: ImageOrientation, size: OutputSize) => void;
  setWatermark: (watermark: WatermarkSettings) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  outputSizes: OUTPUT_IMAGE_SPECS,
  watermark: {
    barHeightRatio: BOTTOM_BAR_HEIGHT_RATIO,
    opacity: 0.3,
    background: '#000000',
  },
  setOutputSize: (orientation, size) =>
    set((state) => ({
      outputSizes: {
        ...state.outputSizes,
        [orientation]: size,
      },
    })),
  setWatermark: (watermark) => set({ watermark }),
}));
