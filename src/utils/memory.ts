export function revokeObjectUrl(objectUrl: string) {
  URL.revokeObjectURL(objectUrl);
}

export function releaseCanvas(canvas: HTMLCanvasElement) {
  canvas.width = 0;
  canvas.height = 0;
}
