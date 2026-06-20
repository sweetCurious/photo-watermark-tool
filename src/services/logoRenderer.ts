import { BottomBarRect } from './watermarkRenderer';
import { GeneratedCanvas } from '../types/canvas';
import { LOGO_MARGIN } from '../utils/logoScale';
import type { LogoSettings } from '../store/settingsStore';

export interface DrawableLogo {
  image: CanvasImageSource;
  width: number;
  height: number;
}

interface LogoRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RgbColor {
  blue: number;
  green: number;
  red: number;
}

const BACKGROUND_DISTANCE_TRANSPARENT = 48;
const BACKGROUND_DISTANCE_SOFT_EDGE = 78;

function getPixelColor(data: Uint8ClampedArray, pixelIndex: number): RgbColor {
  return {
    red: data[pixelIndex],
    green: data[pixelIndex + 1],
    blue: data[pixelIndex + 2],
  };
}

function getColorDistance(color: RgbColor, targetColor: RgbColor) {
  const red = color.red - targetColor.red;
  const green = color.green - targetColor.green;
  const blue = color.blue - targetColor.blue;

  return Math.sqrt(red * red + green * green + blue * blue);
}

function getCornerBackgroundColor(data: Uint8ClampedArray, width: number, height: number): RgbColor {
  const lastColumn = width - 1;
  const lastRow = height - 1;
  const cornerIndexes = [
    0,
    lastColumn * 4,
    lastRow * width * 4,
    (lastRow * width + lastColumn) * 4,
  ];
  const colors = cornerIndexes.map((index) => getPixelColor(data, index));

  return {
    red: Math.round(colors.reduce((sum, color) => sum + color.red, 0) / colors.length),
    green: Math.round(colors.reduce((sum, color) => sum + color.green, 0) / colors.length),
    blue: Math.round(colors.reduce((sum, color) => sum + color.blue, 0) / colors.length),
  };
}

function createTransparentLogo(logo: DrawableLogo): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = logo.width;
  canvas.height = logo.height;

  if (!context) {
    return canvas;
  }

  context.drawImage(logo.image, 0, 0, logo.width, logo.height);

  const imageData = context.getImageData(0, 0, logo.width, logo.height);
  const backgroundColor = getCornerBackgroundColor(imageData.data, logo.width, logo.height);

  for (let index = 0; index < imageData.data.length; index += 4) {
    const alpha = imageData.data[index + 3];

    if (alpha === 0) {
      continue;
    }

    const distance = getColorDistance(getPixelColor(imageData.data, index), backgroundColor);

    if (distance <= BACKGROUND_DISTANCE_TRANSPARENT) {
      imageData.data[index + 3] = 0;
    } else if (distance <= BACKGROUND_DISTANCE_SOFT_EDGE) {
      const fade =
        (distance - BACKGROUND_DISTANCE_TRANSPARENT) /
        (BACKGROUND_DISTANCE_SOFT_EDGE - BACKGROUND_DISTANCE_TRANSPARENT);
      imageData.data[index + 3] = Math.round(alpha * fade);
    }
  }

  context.putImageData(imageData, 0, 0);

  return canvas;
}

function getLogoRects(
  logos: DrawableLogo[],
  bottomBar: BottomBarRect,
  settings: LogoSettings,
): LogoRect[] {
  const logoHeight = bottomBar.height * settings.sizeRatio;
  const rects = logos.map((logo) => ({
    x: 0,
    y: bottomBar.y + (bottomBar.height - logoHeight) / 2,
    width: logo.width * (logoHeight / logo.height),
    height: logoHeight,
  }));
  const totalWidth =
    rects.reduce((sum, rect) => sum + rect.width, 0) + Math.max(0, rects.length - 1) * LOGO_MARGIN;
  const availableWidth = bottomBar.width - LOGO_MARGIN * 2;
  const scale = totalWidth > availableWidth ? availableWidth / totalWidth : 1;
  let nextX = LOGO_MARGIN;

  return rects.map((rect) => {
    const nextRect = {
      ...rect,
      x: nextX,
      width: rect.width * scale,
      height: rect.height * scale,
      y: bottomBar.y + (bottomBar.height - rect.height * scale) / 2,
    };
    nextX += nextRect.width + LOGO_MARGIN * scale;
    return nextRect;
  });
}

export function renderLogos(
  generatedCanvas: GeneratedCanvas,
  bottomBar: BottomBarRect,
  logos: DrawableLogo[],
  settings: LogoSettings,
) {
  const rects = getLogoRects(logos, bottomBar, settings);

  generatedCanvas.context.save();
  generatedCanvas.context.globalAlpha = settings.opacity;
  rects.forEach((rect, index) => {
    const logoImage = settings.removeBackground ? createTransparentLogo(logos[index]) : logos[index].image;
    generatedCanvas.context.drawImage(logoImage, rect.x, rect.y, rect.width, rect.height);
  });
  generatedCanvas.context.restore();

  return rects;
}
