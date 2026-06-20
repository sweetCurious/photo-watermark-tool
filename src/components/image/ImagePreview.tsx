import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createDrawableLogos, renderProcessedCanvas } from '../../services/imageProcessingService';
import { useImageStore } from '../../store/imageStore';
import { useLogoStore } from '../../store/logoStore';
import { useSettingsStore } from '../../store/settingsStore';
import { releaseCanvas, revokeObjectUrl } from '../../utils/memory';
import { ImageUpload } from '../upload/ImageUpload';

export function ImagePreview() {
  const [previewScale, setPreviewScale] = useState(55);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const logos = useLogoStore((state) => state.logos);
  const outputSizes = useSettingsStore((state) => state.outputSizes);
  const templates = useSettingsStore((state) => state.templates);
  const selectedImage = images.find((image) => image.id === selectedImageId) ?? null;

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }

    const currentImage = selectedImage;
    const abortController = new AbortController();
    let nextPreviewUrl: string | null = null;

    async function renderPreview() {
      let drawableLogos: Awaited<ReturnType<typeof createDrawableLogos>> = [];

      try {
        drawableLogos = await createDrawableLogos(logos, abortController.signal);
        const canvas = await renderProcessedCanvas(
          currentImage,
          drawableLogos,
          outputSizes[currentImage.orientation],
          templates[currentImage.orientation],
          abortController.signal,
        );

        canvas.toBlob((blob) => {
          drawableLogos.forEach((logo) => logo.dispose());
          releaseCanvas(canvas);

          if (!blob || abortController.signal.aborted) {
            return;
          }

          nextPreviewUrl = URL.createObjectURL(blob);
          setPreviewUrl((currentUrl) => {
            if (currentUrl) {
              revokeObjectUrl(currentUrl);
            }

            return nextPreviewUrl;
          });
        }, 'image/jpeg', 0.9);
      } catch (error) {
        drawableLogos.forEach((logo) => logo.dispose());

        if (!abortController.signal.aborted) {
          console.error('Preview Render Failed', error);
          toast.error('预览生成失败');
        }
      }
    }

    void renderPreview();

    return () => {
      abortController.abort();

      if (nextPreviewUrl) {
        revokeObjectUrl(nextPreviewUrl);
      }
    };
  }, [logos, outputSizes, selectedImage, templates]);

  if (!selectedImage) {
    return <ImageUpload />;
  }

  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-default bg-background-panel px-6">
        <div className="min-w-0 truncate text-sm text-slate-600">
          {selectedImage.fileName} · {selectedImage.width} x {selectedImage.height}
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-600">
          <span>预览大小</span>
          <input
            className="w-40 accent-primary"
            max="100"
            min="25"
            onChange={(event) => setPreviewScale(Number(event.target.value))}
            step="5"
            type="range"
            value={previewScale}
          />
          <span className="w-10 text-right">{previewScale}%</span>
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-8">
        <div className="flex h-full min-h-[320px] items-center justify-center">
          <img
            alt={selectedImage.fileName}
            className="object-contain"
            src={previewUrl ?? selectedImage.objectUrl}
            style={{
              maxHeight: `${previewScale}%`,
              maxWidth: `${previewScale}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
