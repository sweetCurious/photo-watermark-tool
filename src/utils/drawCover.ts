import { ImageComposition } from '../types/image';

export interface DrawRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getCoverRect(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  composition: ImageComposition = { positionX: 0.5, positionY: 0.5, zoom: 1 },
): DrawRect {
  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight) * composition.zoom;
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  const overflowX = width - targetWidth;
  const overflowY = height - targetHeight;

  return {
    x: -overflowX * composition.positionX,
    y: -overflowY * composition.positionY,
    width,
    height,
  };
}

export function drawCover(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  composition?: ImageComposition,
) {
  const rect = getCoverRect(
    sourceWidth,
    sourceHeight,
    targetWidth,
    targetHeight,
    composition,
  );
  context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
  return rect;
}
