import { GeneratedCanvas } from '../types/canvas';
import { ImageOrientation } from '../types/image';
import { releaseCanvas } from '../utils/memory';
import type { OutputSize } from '../store/settingsStore';

export function createOutputCanvas(orientation: ImageOrientation, spec: OutputSize): GeneratedCanvas {
  const canvas = document.createElement('canvas');
  canvas.width = spec.width;
  canvas.height = spec.height;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas context unavailable');
  }

  return {
    canvas,
    context,
    orientation,
    width: spec.width,
    height: spec.height,
  };
}

export function releaseGeneratedCanvas(generatedCanvas: GeneratedCanvas) {
  releaseCanvas(generatedCanvas.canvas);
}
