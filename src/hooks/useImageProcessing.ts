import { useState } from 'react';
import { toast } from 'sonner';
import { useImageStore } from '../store/imageStore';
import { UploadedImage } from '../types/image';

interface ProcessingProgress {
  current: number;
  total: number;
}

function processImageState(image: UploadedImage) {
  return new Promise<string>((resolve, reject) => {
    window.setTimeout(() => {
      if (!image.objectUrl) {
        reject(new Error('Image Load Failed'));
        return;
      }

      resolve(image.id);
    }, 0);
  });
}

export function useImageProcessing() {
  const images = useImageStore((state) => state.images);
  const updateImageStatus = useImageStore((state) => state.updateImageStatus);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({ current: 0, total: 0 });

  async function startProcessing() {
    if (isProcessing || images.length === 0) {
      return;
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: images.length });

    const jobs = images.map(async (image) => {
      updateImageStatus(image.id, 'processing');

      try {
        await processImageState(image);
        updateImageStatus(image.id, 'success');
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

    await Promise.allSettled(jobs);
    setIsProcessing(false);
  }

  return {
    imageCount: images.length,
    isProcessing,
    progress,
    startProcessing,
  };
}
