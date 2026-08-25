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

export interface LogoPosition {
  xRatio: number;
  yRatio: number;
}

export interface LogoSettings {
  sizeRatio: number;
  opacity: number;
  removeBackground: boolean;
  positions: Record<string, LogoPosition>;
}

export interface TemplateSettings {
  logo: LogoSettings;
  watermark: WatermarkSettings;
}

interface SettingsStore {
  canvasOrientation: ImageOrientation | null;
  outputSizes: Record<ImageOrientation, OutputSize>;
  templates: Record<ImageOrientation, TemplateSettings>;
  setCanvasOrientation: (orientation: ImageOrientation) => void;
  setOutputSize: (orientation: ImageOrientation, size: OutputSize) => void;
  setTemplate: (orientation: ImageOrientation, template: TemplateSettings) => void;
}

const DEFAULT_TEMPLATE: TemplateSettings = {
  logo: {
    sizeRatio: 0.6,
    opacity: 1,
    removeBackground: true,
    positions: {},
  },
  watermark: {
    barHeightRatio: BOTTOM_BAR_HEIGHT_RATIO,
    opacity: 0.3,
    background: '#000000',
  },
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  canvasOrientation: null,
  outputSizes: OUTPUT_IMAGE_SPECS,
  templates: {
    landscape: DEFAULT_TEMPLATE,
    portrait: DEFAULT_TEMPLATE,
  },
  setCanvasOrientation: (orientation) => set({ canvasOrientation: orientation }),
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
