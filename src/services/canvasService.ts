import { OUTPUT_IMAGE_SPECS } from '../constants/imageSpecs';
import { GeneratedCanvas } from '../types/canvas';
import { ImageOrientation } from '../types/image';

export function createOutputCanvas(orientation: ImageOrientation): GeneratedCanvas {
  const spec = OUTPUT_IMAGE_SPECS[orientation];
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
