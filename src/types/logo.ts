export type LogoPosition = 'left' | 'right';

export interface LogoAsset {
  file: File;
  fileName: string;
  objectUrl: string;
  position: LogoPosition;
  size: number;
}
