import { useCallback, useEffect, useRef, useState } from 'react';
import { ImageComposition, UploadedImage } from '../types/image';

interface UseCompositionModeParams {
  image: UploadedImage | null;
  resetKey: string;
  updateComposition: (id: string, composition: ImageComposition) => void;
}

export function useCompositionMode({
  image,
  resetKey,
  updateComposition,
}: UseCompositionModeParams) {
  const [isEditing, setIsEditing] = useState(false);
  const snapshotRef = useRef<ImageComposition | null>(null);

  const start = useCallback(() => {
    if (!image || isEditing) {
      return;
    }

    snapshotRef.current = image.composition;
    setIsEditing(true);
  }, [image, isEditing]);

  const cancel = useCallback(() => {
    if (image && snapshotRef.current) {
      updateComposition(image.id, snapshotRef.current);
    }

    snapshotRef.current = null;
    setIsEditing(false);
  }, [image, updateComposition]);

  const finish = useCallback(() => {
    snapshotRef.current = null;
    setIsEditing(false);
  }, []);

  useEffect(() => {
    snapshotRef.current = null;
    setIsEditing(false);
  }, [resetKey]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cancel, isEditing]);

  return { cancel, finish, isEditing, start };
}
