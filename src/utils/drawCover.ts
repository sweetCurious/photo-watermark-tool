export interface DrawRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getCoverRect(sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number): DrawRect {
  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;

  return {
    x: (targetWidth - width) / 2,
    y: (targetHeight - height) / 2,
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
) {
  const rect = getCoverRect(sourceWidth, sourceHeight, targetWidth, targetHeight);
  context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
  return rect;
}
