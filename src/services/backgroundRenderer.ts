import { GeneratedCanvas } from '../types/canvas';
import { drawContain } from '../utils/drawContain';
import { drawCover } from '../utils/drawCover';

const BACKGROUND_BLUR = 'blur(32px)';

export interface SourceImageDimensions {
  width: number;
  height: number;
}

export function renderBlurBackground(
  generatedCanvas: GeneratedCanvas,
  image: CanvasImageSource,
  sourceDimensions: SourceImageDimensions,
) {
  const { context, width, height } = generatedCanvas;

  drawCover(context, image, sourceDimensions.width, sourceDimensions.height, width, height);

  context.save();
  context.filter = BACKGROUND_BLUR;
  drawCover(context, image, sourceDimensions.width, sourceDimensions.height, width, height);
  context.restore();

  return drawContain(context, image, sourceDimensions.width, sourceDimensions.height, width, height);
}
