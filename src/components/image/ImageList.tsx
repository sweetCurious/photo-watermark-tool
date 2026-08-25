import { Check, ImageIcon, LoaderCircle, Trash2, X } from 'lucide-react';
import { useImageStore } from '../../store/imageStore';
import { UploadedImage } from '../../types/image';
import { FilePicker } from '../upload/FilePicker';

function getOrientationLabel(orientation: string) {
  return orientation === 'portrait' ? '竖图' : '横图';
}

function StatusIcon({ status }: { status: UploadedImage['status'] }) {
  if (status === 'processing') {
    return <LoaderCircle className="size-3.5 animate-spin text-primary" />;
  }

  if (status === 'success') {
    return <Check className="size-3.5 text-emerald-500" strokeWidth={3} />;
  }

  if (status === 'failed') {
    return <X className="size-3.5 text-error" strokeWidth={3} />;
  }

  return <span className="size-1.5 rounded-full bg-slate-300" />;
}

function ImageItem({
  image,
  index,
  isSelected,
  onRemove,
  onSelect,
}: {
  image: UploadedImage;
  index: number;
  isSelected: boolean;
  onRemove: () => void;
  onSelect: () => void;
}) {
  return (
    <div
      className={`group relative flex items-center gap-3 rounded-xl border p-2 transition-all ${
        isSelected
          ? 'border-primary/40 bg-blue-50 shadow-sm'
          : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
      }`}
    >
      <button
        aria-label={`预览 ${image.fileName}`}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        onClick={onSelect}
        type="button"
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
          <img alt={image.fileName} className="h-full w-full object-cover" src={image.objectUrl} />
          <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white">
            {index + 1}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-800">{image.fileName}</p>
          <p className="mt-1 text-[11px] text-slate-400">
            {image.width} × {image.height}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="rounded bg-slate-100 px-1.5 py-0.5">
              {getOrientationLabel(image.orientation)}
            </span>
            <StatusIcon status={image.status} />
          </div>
        </div>
      </button>
      <button
        aria-label={`删除 ${image.fileName}`}
        className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-lg bg-white/90 text-slate-400 opacity-0 shadow-sm transition-opacity hover:text-error group-hover:opacity-100 focus:opacity-100"
        onClick={onRemove}
        type="button"
      >
        <Trash2 className="size-3.5" />
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
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="size-4 text-slate-400" />
          <h2 className="text-sm font-semibold">照片</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {images.length}
          </span>
        </div>
        {images.length > 0 ? (
          <button className="text-xs text-slate-400 hover:text-error" onClick={clearImages} type="button">
            清空
          </button>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
        {images.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <ImageIcon className="size-5" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-600">照片会显示在这里</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">一次可添加 10–20 张照片</p>
          </div>
        ) : (
          images.map((image, index) => (
            <ImageItem
              image={image}
              index={index}
              isSelected={image.id === selectedImageId}
              key={image.id}
              onRemove={() => removeImage(image.id)}
              onSelect={() => selectImage(image.id)}
            />
          ))
        )}
      </div>
      {images.length > 0 ? (
        <div className="border-t border-border-default p-3">
          <FilePicker compact />
        </div>
      ) : null}
    </div>
  );
}
