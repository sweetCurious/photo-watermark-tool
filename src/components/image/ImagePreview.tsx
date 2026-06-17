import { useImageStore } from '../../store/imageStore';
import { ImageUpload } from '../upload/ImageUpload';

export function ImagePreview() {
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const selectedImage = images.find((image) => image.id === selectedImageId) ?? null;

  if (!selectedImage) {
    return <ImageUpload />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
      <img
        alt={selectedImage.fileName}
        className="max-h-full max-w-full object-contain"
        src={selectedImage.objectUrl}
      />
      <div className="rounded-full bg-background-panel px-4 py-2 text-sm text-slate-600">
        {selectedImage.fileName} · {selectedImage.width} x {selectedImage.height}
      </div>
    </div>
  );
}
