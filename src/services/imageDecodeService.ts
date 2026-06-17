import { UploadedImage } from '../types/image';
import { detectImageOrientation } from '../utils/imageOrientation';

interface DecodedDimensions {
  width: number;
  height: number;
}

function createImageId() {
  return crypto.randomUUID();
}

function decodeWithImageElement(objectUrl: string): Promise<DecodedDimensions> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.onerror = () => reject(new Error('Image Load Failed'));
    image.src = objectUrl;
  });
}

async function decodeDimensions(file: File, objectUrl: string): Promise<DecodedDimensions> {
  if ('createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file);
      const dimensions = {
        width: bitmap.width,
        height: bitmap.height,
      };
      bitmap.close();
      return dimensions;
    } catch {
      return decodeWithImageElement(objectUrl);
    }
  }

  return decodeWithImageElement(objectUrl);
}

export async function decodeImageFile(file: File): Promise<UploadedImage> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const dimensions = await decodeDimensions(file, objectUrl);

    return {
      id: createImageId(),
      file,
      fileName: file.name,
      size: file.size,
      width: dimensions.width,
      height: dimensions.height,
      orientation: detectImageOrientation(dimensions.width, dimensions.height),
      objectUrl,
      status: 'ready',
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}
