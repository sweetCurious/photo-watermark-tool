import { UploadedImage } from '../../types/image';
import { useImageStore } from '../../store/imageStore';

function formatFileSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function ImageItem({
  image,
  isSelected,
  onSelect,
  onRemove,
}: {
  image: UploadedImage;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={`rounded-lg border p-2 transition-colors ${
        isSelected ? 'border-primary bg-blue-50' : 'border-border-default bg-background-panel'
      }`}
    >
      <button className="w-full rounded-lg text-left" onClick={onSelect} type="button">
        <img
          alt={image.fileName}
          className="h-28 w-full rounded-lg object-cover"
          src={image.objectUrl}
        />
        <p className="mt-2 truncate text-sm font-medium text-slate-950">{image.fileName}</p>
        <p className="mt-1 text-xs text-slate-500">
          {image.width} x {image.height} · {formatFileSize(image.size)}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
          <span className="rounded-full bg-slate-100 px-2 py-1 capitalize text-slate-700">
            {image.orientation}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-1 capitalize text-slate-700">
            {image.status}
          </span>
        </div>
      </button>
      <button
        className="mt-2 h-8 w-full rounded-md border border-error text-xs font-medium text-error hover:bg-red-50"
        onClick={onRemove}
        type="button"
      >
        Delete
      </button>
    </div>
  );
}

export function ImageList() {
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const selectImage = useImageStore((state) => state.selectImage);
  const removeImage = useImageStore((state) => state.removeImage);
  const clearImages = useImageStore((state) => state.clearImages);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {images.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No images
          </div>
        ) : (
          images.map((image) => (
            <ImageItem
              image={image}
              isSelected={image.id === selectedImageId}
              key={image.id}
              onRemove={() => removeImage(image.id)}
              onSelect={() => selectImage(image.id)}
            />
          ))
        )}
      </div>
      <div className="border-t border-border-default p-4">
        <button
          className="h-10 w-full rounded-lg border border-error text-sm font-medium text-error hover:bg-red-50 disabled:bg-background-upload disabled:opacity-50"
          disabled={images.length === 0}
          onClick={clearImages}
          type="button"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
