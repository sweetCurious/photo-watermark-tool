import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { JpgExportResult } from '../services/exportService';
import { isProcessingCanceled, processImages } from '../services/imageProcessingService';
import { useImageStore } from '../store/imageStore';
import { useLogoStore } from '../store/logoStore';
import { useSettingsStore } from '../store/settingsStore';

interface ProcessingProgress {
  current: number;
  total: number;
}

export function useImageProcessing() {
  const images = useImageStore((state) => state.images);
  const updateImageStatus = useImageStore((state) => state.updateImageStatus);
  const logos = useLogoStore((state) => state.logos);
  const outputSizes = useSettingsStore((state) => state.outputSizes);
  const watermark = useSettingsStore((state) => state.watermark);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({ current: 0, total: 0 });
  const [exportedFiles, setExportedFiles] = useState<JpgExportResult[]>([]);

  function cancelProcessing() {
    abortControllerRef.current?.abort();
  }

  async function startProcessing() {
    if (isProcessing || images.length === 0) {
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setIsProcessing(true);
    setExportedFiles([]);
    setProgress({ current: 0, total: images.length });

    try {
      const files = await processImages({
        images,
        logos,
        outputSizes,
        watermark,
        signal: abortController.signal,
        onImageStatus: updateImageStatus,
        onProgress: () =>
          setProgress((currentProgress) => ({
            ...currentProgress,
            current: currentProgress.current + 1,
          })),
        onImageError: (error) => {
          console.error('Processing Failed', error);
          toast.error('处理失败');
        },
      });

      setExportedFiles(files);
    } catch (error) {
      console.error('Processing Failed', error);
      toast.error(isProcessingCanceled(error) ? '已取消处理' : '处理失败');
    } finally {
      abortControllerRef.current = null;
      setIsProcessing(false);
    }
  }

  return {
    cancelProcessing,
    exportedFiles,
    imageCount: images.length,
    isProcessing,
    progress,
    startProcessing,
  };
}
