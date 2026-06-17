import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { useImageStore } from '../../store/imageStore';
import { validateImageFiles } from '../../utils/fileValidation';

export function ImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('支持 JPG、JPEG、PNG、HEIC，最多 20 张。');
  const [isDragging, setIsDragging] = useState(false);
  const images = useImageStore((state) => state.images);
  const addFiles = useImageStore((state) => state.addFiles);

  function handleFiles(fileList: FileList | null) {
    const selectedFiles = Array.from(fileList ?? []);
    const result = validateImageFiles(selectedFiles, images.length);

    if (!result.isValid) {
      setMessage(result.message);
      return;
    }

    addFiles(result.files);
    setMessage(`已暂存 ${images.length + result.files.length} 张图片。`);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFiles(event.target.files);
    event.target.value = '';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  return (
    <div
      className={`flex min-h-[320px] w-full max-w-xl flex-col items-center justify-center rounded-xl border border-dashed px-8 text-center transition-colors ${
        isDragging
          ? 'border-primary bg-background-panel'
          : 'border-border-default bg-background-upload'
      }`}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        accept=".jpg,.jpeg,.png,.heic"
        className="hidden"
        multiple
        onChange={handleInputChange}
        ref={inputRef}
        type="file"
      />
      <p className="text-lg font-semibold">Upload Photos</p>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
      <button
        className="mt-6 h-10 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        Select Images
      </button>
    </div>
  );
}
