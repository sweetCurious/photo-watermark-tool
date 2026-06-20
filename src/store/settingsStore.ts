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

export interface LogoSettings {
  sizeRatio: number;
  opacity: number;
  removeBackground: boolean;
}

export interface TemplateSettings {
  logo: LogoSettings;
  watermark: WatermarkSettings;
}

interface SettingsStore {
  outputSizes: Record<ImageOrientation, OutputSize>;
  templates: Record<ImageOrientation, TemplateSettings>;
  setOutputSize: (orientation: ImageOrientation, size: OutputSize) => void;
  setTemplate: (orientation: ImageOrientation, template: TemplateSettings) => void;
}

const DEFAULT_TEMPLATE: TemplateSettings = {
  logo: {
    sizeRatio: 0.6,
    opacity: 1,
    removeBackground: true,
  },
  watermark: {
    barHeightRatio: BOTTOM_BAR_HEIGHT_RATIO,
    opacity: 0.3,
    background: '#000000',
  },
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  outputSizes: OUTPUT_IMAGE_SPECS,
  templates: {
    landscape: DEFAULT_TEMPLATE,
    portrait: DEFAULT_TEMPLATE,
  },
  setOutputSize: (orientation, size) =>
    set((state) => ({
      outputSizes: {
        ...state.outputSizes,
        [orientation]: size,
      },
    })),
  setTemplate: (orientation, template) =>
    set((state) => ({
      templates: {
        ...state.templates,
        [orientation]: template,
      },
    })),
}));
