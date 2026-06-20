const MAX_IMAGE_COUNT = 20;
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'heic']);

export type FileValidationResult =
  | { isValid: true; files: File[] }
  | { isValid: false; message: string };

function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() ?? '';
}

export function validateImageFiles(files: File[], existingCount: number): FileValidationResult {
  if (files.length === 0) {
    return { isValid: false, message: '未选择文件。' };
  }

  if (existingCount + files.length > MAX_IMAGE_COUNT) {
    return { isValid: false, message: '最多一次上传 20 张图片。' };
  }

  const invalidFile = files.find((file) => !ALLOWED_EXTENSIONS.has(getFileExtension(file.name)));

  if (invalidFile) {
    return {
      isValid: false,
      message: `不支持的文件格式：${invalidFile.name}`,
    };
  }

  return { isValid: true, files };
}
