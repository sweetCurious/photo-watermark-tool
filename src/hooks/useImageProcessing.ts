import { useState } from 'react';
import { toast } from 'sonner';
import { renderBlurBackground } from '../services/backgroundRenderer';
import { createOutputCanvas, releaseGeneratedCanvas } from '../services/canvasService';
import { exportCanvasToJpg, JpgExportResult } from '../services/exportService';
import { DrawableLogo, renderLogos } from '../services/logoRenderer';
import { renderBottomBar } from '../services/watermarkRenderer';
import { useImageStore } from '../store/imageStore';
import { useLogoStore } from '../store/logoStore';
import { UploadedImage } from '../types/image';
import { LogoAsset, LogoPosition } from '../types/logo';

interface ProcessingProgress { current: number; total: number }

interface DrawableImage { image: CanvasImageSource; width: number; height: number; dispose: () => void }

function createImageElementDrawable(image: HTMLImageElement): DrawableImage {
  return {
    image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    dispose: () => undefined,
  };
}

function loadImageElement(objectUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image Load Failed'));
    image.src = objectUrl;
  });
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

async function processImage(
  image: UploadedImage,
  logos: Partial<Record<LogoPosition, DrawableLogo>>,
): Promise<JpgExportResult> {
  const sourceImage = await createDrawableImage(image.file, image.objectUrl);
  const generatedCanvas = createOutputCanvas(image.orientation);

  try {
    renderBlurBackground(generatedCanvas, sourceImage.image, {
      width: sourceImage.width,
      height: sourceImage.height,
    });
    const bottomBar = renderBottomBar(generatedCanvas);
    renderLogos(generatedCanvas, bottomBar, logos);
    return await exportCanvasToJpg(generatedCanvas.canvas, image.fileName);
  } finally {
    sourceImage.dispose();
    releaseGeneratedCanvas(generatedCanvas);
  }
}

export function useImageProcessing() {
  const images = useImageStore((state) => state.images);
  const updateImageStatus = useImageStore((state) => state.updateImageStatus);
  const leftLogo = useLogoStore((state) => state.leftLogo);
  const rightLogo = useLogoStore((state) => state.rightLogo);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({ current: 0, total: 0 });
  const [exportedFiles, setExportedFiles] = useState<JpgExportResult[]>([]);

  async function startProcessing() {
    if (isProcessing || images.length === 0) {
      return;
    }

    setIsProcessing(true);
    setExportedFiles([]);
    setProgress({ current: 0, total: images.length });

    const logos: Partial<Record<LogoPosition, DrawableImage>> = {};
    const logoEntries: Array<[LogoPosition, LogoAsset | null]> = [['left', leftLogo], ['right', rightLogo]];

    try {
      for (const [position, logo] of logoEntries) {
        if (logo) {
          logos[position] = await createDrawableImage(logo.file, logo.objectUrl);
        }
      }

      const jobs = images.map(async (image) => {
        updateImageStatus(image.id, 'processing');

        try {
          const exportedFile = await processImage(image, logos);
          updateImageStatus(image.id, 'success');
          return exportedFile;
        } catch (error) {
          updateImageStatus(image.id, 'failed');
          console.error('Processing Failed', error);
          toast.error('Processing Failed');
          throw error;
        } finally {
          setProgress((currentProgress) => ({
            ...currentProgress,
            current: currentProgress.current + 1,
          }));
        }
      });

      const results = await Promise.allSettled(jobs);
      setExportedFiles(
        results.reduce<JpgExportResult[]>((files, result) => {
          if (result.status === 'fulfilled') {
            files.push(result.value);
          }

          return files;
        }, []),
      );
    } catch (error) {
      console.error('Processing Failed', error);
      toast.error('Processing Failed');
    } finally {
      Object.values(logos).forEach((logo) => logo.dispose());
      setIsProcessing(false);
    }
  }

  return {
    exportedFiles, imageCount: images.length, isProcessing, progress, startProcessing,
  };
}
