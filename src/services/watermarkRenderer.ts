import { WatermarkSettings } from '../store/settingsStore';
import { GeneratedCanvas } from '../types/canvas';

export interface BottomBarRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getBottomBarRect(width: number, height: number, barHeightRatio: number): BottomBarRect {
  const barHeight = height * barHeightRatio;

  return {
    x: 0,
    y: height - barHeight,
    width,
    height: barHeight,
  };
}

export function renderBottomBar(
  generatedCanvas: GeneratedCanvas,
  settings: WatermarkSettings,
): BottomBarRect {
  const { context, width, height } = generatedCanvas;
  const rect = getBottomBarRect(width, height, settings.barHeightRatio);

  context.save();
  context.globalAlpha = settings.opacity;
  context.fillStyle = settings.background;
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
  context.restore();

  return rect;
}
