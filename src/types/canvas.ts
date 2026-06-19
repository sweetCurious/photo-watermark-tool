import { ImageOrientation } from './image';

export interface GeneratedCanvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  orientation: ImageOrientation;
  width: number;
  height: number;
}
