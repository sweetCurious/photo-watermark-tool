import { useState } from 'react';
import { useImageStore } from '../../store/imageStore';
import { ImageUpload } from '../upload/ImageUpload';

export function ImagePreview() {
  const [previewScale, setPreviewScale] = useState(55);
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const selectedImage = images.find((image) => image.id === selectedImageId) ?? null;

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
            src={selectedImage.objectUrl}
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
