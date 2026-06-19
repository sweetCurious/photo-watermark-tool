import { DrawRect } from './drawCover';

export function getContainRect(sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number): DrawRect {
  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;

  return {
    x: (targetWidth - width) / 2,
    y: (targetHeight - height) / 2,
    width,
    height,
  };
}

export function drawContain(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
) {
  const rect = getContainRect(sourceWidth, sourceHeight, targetWidth, targetHeight);
  context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
  return rect;
}
