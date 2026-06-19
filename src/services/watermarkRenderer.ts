import { BOTTOM_BAR_FILL_STYLE, BOTTOM_BAR_HEIGHT_RATIO } from '../constants/watermarkSpecs';
import { GeneratedCanvas } from '../types/canvas';

export interface BottomBarRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getBottomBarRect(width: number, height: number): BottomBarRect {
  const barHeight = height * BOTTOM_BAR_HEIGHT_RATIO;

  return {
    x: 0,
    y: height - barHeight,
    width,
    height: barHeight,
  };
}

export function renderBottomBar(generatedCanvas: GeneratedCanvas): BottomBarRect {
  const { context, width, height } = generatedCanvas;
  const rect = getBottomBarRect(width, height);

  context.save();
  context.fillStyle = BOTTOM_BAR_FILL_STYLE;
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
  context.restore();

  return rect;
}
