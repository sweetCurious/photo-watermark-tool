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
    generatedCanvas.context.drawImage(logos[index].image, rect.x, rect.y, rect.width, rect.height);
  });
  generatedCanvas.context.restore();

  return rects;
}
