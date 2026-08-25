import { GeneratedCanvas } from '../types/canvas';
import { drawCover } from '../utils/drawCover';

export interface SourceImageDimensions {
  width: number;
  height: number;
}

export function renderCoverImage(
  generatedCanvas: GeneratedCanvas,
  image: CanvasImageSource,
  sourceDimensions: SourceImageDimensions,
) {
  const { context, width, height } = generatedCanvas;

  return drawCover(context, image, sourceDimensions.width, sourceDimensions.height, width, height);
}
