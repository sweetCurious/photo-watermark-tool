import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { FolderOpen, Images, Plus, UploadCloud } from 'lucide-react';
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
      className={`flex flex-col items-center justify-center text-center transition-all ${
        compact
          ? 'min-h-0'
          : 'min-h-[340px] w-full max-w-xl rounded-3xl border-2 border-dashed px-8 py-10 shadow-sm'
      } ${isDragging ? 'border-primary bg-blue-50' : compact ? '' : 'border-slate-300 bg-white/70'}`}
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
          <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-600">
            <UploadCloud className="size-7" />
          </div>
          <p className="mt-5 text-lg font-bold text-slate-800">拖入照片，开始制作</p>
          <p className="mt-2 text-sm text-slate-500">{message}</p>
          <p className="mt-1 text-xs text-slate-400">所有处理均在当前浏览器中完成</p>
        </>
      ) : null}
      <div className={compact ? 'grid w-full grid-cols-2 gap-2' : 'mt-6 flex items-center gap-3'}>
        <button
          className={`flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${
            compact
              ? 'border border-border-default bg-white text-slate-700 hover:bg-slate-50'
              : 'bg-slate-900 text-white shadow-sm hover:bg-slate-800 disabled:bg-slate-300'
          }`}
          disabled={images.length >= 20}
          onClick={() => openPicker('files')}
          type="button"
        >
          {compact ? <Plus className="size-4" /> : <Images className="size-4" />}
          {compact ? '添加照片' : '选择图片'}
        </button>
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border-default bg-background-panel px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:bg-background-upload disabled:text-slate-400"
          disabled={images.length >= 20}
          onClick={() => openPicker('folder')}
          type="button"
        >
          <FolderOpen className="size-4" />
          选择文件夹
        </button>
      </div>
    </div>
  );
}
