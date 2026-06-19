import { BottomBarRect } from './watermarkRenderer';
import { GeneratedCanvas } from '../types/canvas';
import { LogoPosition } from '../types/logo';
import { getLogoRect } from '../utils/logoScale';

export interface DrawableLogo {
  image: CanvasImageSource;
  width: number;
  height: number;
}

export function renderLogo(
  generatedCanvas: GeneratedCanvas,
  bottomBar: BottomBarRect,
  logo: DrawableLogo,
  position: LogoPosition,
) {
  const rect = getLogoRect(logo.width, logo.height, bottomBar, position);

  generatedCanvas.context.drawImage(logo.image, rect.x, rect.y, rect.width, rect.height);

  return rect;
}

export function renderLogos(
  generatedCanvas: GeneratedCanvas,
  bottomBar: BottomBarRect,
  logos: Partial<Record<LogoPosition, DrawableLogo>>,
) {
  return {
    left: logos.left ? renderLogo(generatedCanvas, bottomBar, logos.left, 'left') : null,
    right: logos.right ? renderLogo(generatedCanvas, bottomBar, logos.right, 'right') : null,
  };
}
