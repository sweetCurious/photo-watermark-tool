import { renderBlurBackground } from './backgroundRenderer';
import { createOutputCanvas, releaseGeneratedCanvas } from './canvasService';
import { exportCanvasToJpg, JpgExportResult } from './exportService';
import { DrawableLogo, renderLogos } from './logoRenderer';
import { renderBottomBar } from './watermarkRenderer';
import { UploadedImage, UploadedImageStatus } from '../types/image';
import { LogoAsset, LogoPosition } from '../types/logo';

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
  leftLogo: LogoAsset | null;
  rightLogo: LogoAsset | null;
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

async function createDrawableLogos(
  leftLogo: LogoAsset | null,
  rightLogo: LogoAsset | null,
  signal: AbortSignal,
) {
  const logos: Partial<Record<LogoPosition, DrawableImage>> = {};
  const logoEntries: Array<[LogoPosition, LogoAsset | null]> = [['left', leftLogo], ['right', rightLogo]];

  try {
    for (const [position, logo] of logoEntries) {
      throwIfCanceled(signal);

      if (logo) {
        logos[position] = await createDrawableImage(logo.file, logo.objectUrl);
      }
    }

    return logos;
  } catch (error) {
    Object.values(logos).forEach((logo) => logo.dispose());
    throw error;
  }
}

async function processImage(
  image: UploadedImage,
  logos: Partial<Record<LogoPosition, DrawableLogo>>,
  signal: AbortSignal,
): Promise<JpgExportResult> {
  throwIfCanceled(signal);

  const sourceImage = await createDrawableImage(image.file, image.objectUrl);
  const generatedCanvas = createOutputCanvas(image.orientation);

  try {
    throwIfCanceled(signal);
    renderBlurBackground(generatedCanvas, sourceImage.image, {
      width: sourceImage.width,
      height: sourceImage.height,
    });
    const bottomBar = renderBottomBar(generatedCanvas);
    renderLogos(generatedCanvas, bottomBar, logos);
    throwIfCanceled(signal);
    return await exportCanvasToJpg(generatedCanvas.canvas, image.fileName);
  } finally {
    sourceImage.dispose();
    releaseGeneratedCanvas(generatedCanvas);
  }
}

export async function processImages({
  images,
  leftLogo,
  onImageError,
  onImageStatus,
  onProgress,
  rightLogo,
  signal,
}: ProcessImagesParams): Promise<JpgExportResult[]> {
  let nextIndex = 0;
  const exportedFiles: JpgExportResult[] = [];
  const logos = await createDrawableLogos(leftLogo, rightLogo, signal);

  async function worker() {
    while (nextIndex < images.length) {
      throwIfCanceled(signal);

      const image = images[nextIndex];
      nextIndex += 1;
      onImageStatus(image.id, 'processing');

      try {
        const exportedFile = await processImage(image, logos, signal);
        exportedFiles.push(exportedFile);
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
    Object.values(logos).forEach((logo) => logo.dispose());
  }
}

export function isProcessingCanceled(error: unknown) {
  return isCanceled(error);
}
