export function createXhsFileName(fileName: string): string {
  const extensionStart = fileName.lastIndexOf('.');
  const baseName = extensionStart > 0 ? fileName.slice(0, extensionStart) : fileName;

  return `${baseName}_xhs.jpg`;
}
