import { renderBlurBackground } from './backgroundRenderer';
import { createOutputCanvas } from './canvasService';
import { exportCanvasToJpg, JpgExportResult } from './exportService';
import { DrawableLogo, renderLogos } from './logoRenderer';
import { renderBottomBar } from './watermarkRenderer';
import type { OutputSize, TemplateSettings } from '../store/settingsStore';
import { UploadedImage, UploadedImageStatus } from '../types/image';
import { LogoAsset } from '../types/logo';
import { releaseCanvas } from '../utils/memory';

const MAX_CONCURRENT_IMAGES = 3;
const CANCELED_ERROR = 'Processing Canceled';

interface DrawableImage {
  image: CanvasImageSource;
  width: number;
  height: number;
  dispose: () => void;
}

interface ProcessImagesParams {
  images: UploadedImage[];
  logos: LogoAsset[];
  outputSizes: Record<UploadedImage['orientation'], OutputSize>;
  templates: Record<UploadedImage['orientation'], TemplateSettings>;
  signal: AbortSignal;
  onImageError: (error: unknown) => void;
  onImageStatus: (id: string, status: UploadedImageStatus) => void;
  onProgress: () => void;
}

function throwIfCanceled(signal: AbortSignal) {
  if (signal.aborted) {
    throw new Error(CANCELED_ERROR);
  }
}

function isCanceled(error: unknown) {
  return error instanceof Error && error.message === CANCELED_ERROR;
}

function loadImageElement(objectUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image Load Failed'));
    image.src = objectUrl;
  });
}

function createImageElementDrawable(image: HTMLImageElement): DrawableImage {
  return {
    image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    dispose: () => undefined,
  };
}

async function createDrawableImage(file: File, objectUrl: string): Promise<DrawableImage> {
  if ('createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file);

      return {
        image: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        dispose: () => bitmap.close(),
      };
    } catch {
      const image = await loadImageElement(objectUrl);
      return createImageElementDrawable(image);
    }
  }

  const image = await loadImageElement(objectUrl);
  return createImageElementDrawable(image);
}

export async function createDrawableLogos(logos: LogoAsset[], signal: AbortSignal) {
  const drawableLogos: DrawableLogo[] = [];

  try {
    for (const logo of logos) {
      throwIfCanceled(signal);
      const drawableLogo = await createDrawableImage(logo.file, logo.objectUrl);
      drawableLogos.push({
        ...drawableLogo,
        id: logo.id,
      });
    }

    return drawableLogos;
  } catch (error) {
    drawableLogos.forEach((logo) => logo.dispose());
    throw error;
  }
}

export async function renderProcessedCanvas(
  image: UploadedImage,
  logos: DrawableLogo[],
  outputSize: OutputSize,
  template: TemplateSettings,
  signal: AbortSignal,
): Promise<HTMLCanvasElement> {
  throwIfCanceled(signal);

  const sourceImage = await createDrawableImage(image.file, image.objectUrl);
  const generatedCanvas = createOutputCanvas(image.orientation, outputSize);

  try {
    throwIfCanceled(signal);
    renderBlurBackground(generatedCanvas, sourceImage.image, {
      width: sourceImage.width,
      height: sourceImage.height,
    });
    const bottomBar = renderBottomBar(generatedCanvas, template.watermark);
    renderLogos(generatedCanvas, bottomBar, logos, template.logo);
    throwIfCanceled(signal);
    return generatedCanvas.canvas;
  } finally {
    sourceImage.dispose();
  }
}

export async function processImages({
  images,
  logos,
  onImageError,
  onImageStatus,
  onProgress,
  outputSizes,
  signal,
  templates,
}: ProcessImagesParams): Promise<JpgExportResult[]> {
  let nextIndex = 0;
  const exportedFiles: JpgExportResult[] = [];
  const drawableLogos = await createDrawableLogos(logos, signal);

  async function worker() {
    while (nextIndex < images.length) {
      throwIfCanceled(signal);

      const image = images[nextIndex];
      nextIndex += 1;
      onImageStatus(image.id, 'processing');

      try {
        const canvas = await renderProcessedCanvas(
          image,
          drawableLogos,
          outputSizes[image.orientation],
          templates[image.orientation],
          signal,
        );
        try {
          const exportedFile = await exportCanvasToJpg(canvas, image.fileName);
          exportedFiles.push(exportedFile);
        } finally {
          releaseCanvas(canvas);
        }
        onImageStatus(image.id, 'success');
      } catch (error) {
        onImageStatus(image.id, isCanceled(error) ? 'ready' : 'failed');

        if (isCanceled(error)) {
          throw error;
        }

        onImageError(error);
      } finally {
        onProgress();
      }
    }
  }

  try {
    const workerCount = Math.min(MAX_CONCURRENT_IMAGES, images.length);
    const workers = Array.from({ length: workerCount }, () => worker());
    await Promise.allSettled(workers);

    throwIfCanceled(signal);

    return exportedFiles;
  } finally {
    drawableLogos.forEach((logo) => logo.dispose());
  }
}

export function isProcessingCanceled(error: unknown) {
  return isCanceled(error);
}
