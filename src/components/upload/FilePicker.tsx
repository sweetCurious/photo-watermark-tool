import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { useImageStore } from '../../store/imageStore';
import { validateImageFiles } from '../../utils/fileValidation';

type PickerMode = 'files' | 'folder';

interface FilePickerProps {
  compact?: boolean;
  onMessageChange?: (message: string) => void;
}

export function FilePicker({ compact = false, onMessageChange }: FilePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('支持 JPG、JPEG、PNG、HEIC，最多 20 张。');
  const [isDragging, setIsDragging] = useState(false);
  const images = useImageStore((state) => state.images);
  const addFiles = useImageStore((state) => state.addFiles);

  function updateMessage(nextMessage: string) {
    setMessage(nextMessage);
    onMessageChange?.(nextMessage);
  }

  function handleFiles(fileList: FileList | null) {
    const result = validateImageFiles(Array.from(fileList ?? []), images.length);

    if (!result.isValid) {
      updateMessage(result.message);
      return;
    }

    addFiles(result.files);
    updateMessage(`已添加 ${result.files.length} 张图片`);
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

  function openPicker(mode: PickerMode) {
    if (mode === 'folder') {
      folderInputRef.current?.setAttribute('webkitdirectory', '');
      folderInputRef.current?.click();
      return;
    }

    fileInputRef.current?.click();
  }

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed text-center transition-colors ${
        compact ? 'min-h-0 px-0 py-0' : 'min-h-[320px] w-full max-w-xl px-8 py-10'
      } ${isDragging ? 'border-primary bg-background-panel' : 'border-border-default bg-background-upload'}`}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDrop={handleDrop}
    >
      <input
        accept=".jpg,.jpeg,.png,.heic"
        className="hidden"
        multiple
        onChange={handleInputChange}
        ref={fileInputRef}
        type="file"
      />
      <input
        accept=".jpg,.jpeg,.png,.heic"
        className="hidden"
        multiple
        onChange={handleInputChange}
        ref={folderInputRef}
        type="file"
      />
      {!compact ? (
        <>
          <p className="text-lg font-semibold">上传照片</p>
          <p className="mt-2 text-sm text-slate-500">{message}</p>
        </>
      ) : null}
      <div className={compact ? 'grid w-full grid-cols-2 gap-2' : 'mt-6 flex items-center gap-3'}>
        <button
          className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:bg-primary-disabled"
          disabled={images.length >= 20}
          onClick={() => openPicker('files')}
          type="button"
        >
          选择图片
        </button>
        <button
          className="h-10 rounded-lg border border-border-default bg-background-panel px-4 text-sm font-medium text-slate-700 hover:border-border-hover disabled:bg-background-upload disabled:text-slate-400"
          disabled={images.length >= 20}
          onClick={() => openPicker('folder')}
          type="button"
        >
          选择文件夹
        </button>
      </div>
    </div>
  );
}
