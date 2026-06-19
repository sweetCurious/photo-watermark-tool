import { DrawRect } from './drawCover';

export const LOGO_MARGIN = 24;
export const LOGO_HEIGHT_RATIO = 0.6;

export function getLogoRect(
  logoWidth: number,
  logoHeight: number,
  bottomBar: DrawRect,
  position: 'left' | 'right',
): DrawRect {
  const height = bottomBar.height * LOGO_HEIGHT_RATIO;
  const width = logoWidth * (height / logoHeight);
  const x = position === 'left' ? LOGO_MARGIN : bottomBar.width - LOGO_MARGIN - width;
  const y = bottomBar.y + (bottomBar.height - height) / 2;

  return {
    x,
    y,
    width,
    height,
  };
}
