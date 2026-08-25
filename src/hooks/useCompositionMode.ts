import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistoryStore } from '../store/historyStore';
import { useImageStore } from '../store/imageStore';
import { ImageComposition, UploadedImage } from '../types/image';

interface CompositionSnapshot {
  composition: ImageComposition;
  imageId: string;
}

function isSameComposition(left: ImageComposition, right: ImageComposition) {
  return (
    left.positionX === right.positionX &&
    left.positionY === right.positionY &&
    left.zoom === right.zoom
  );
}

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
  const snapshotRef = useRef<CompositionSnapshot | null>(null);

  const commit = useCallback(() => {
    const snapshot = snapshotRef.current;

    if (!snapshot) {
      return;
    }

    const currentImage = useImageStore
      .getState()
      .images.find((candidate) => candidate.id === snapshot.imageId);

    if (currentImage && !isSameComposition(snapshot.composition, currentImage.composition)) {
      const before = snapshot.composition;
      const after = currentImage.composition;
      const imageId = snapshot.imageId;

      useHistoryStore.getState().record({
        label: '调整照片构图',
        redo: () => updateComposition(imageId, after),
        undo: () => updateComposition(imageId, before),
      });
    }

    snapshotRef.current = null;
  }, [updateComposition]);

  const start = useCallback(() => {
    if (!image || isEditing) {
      return;
    }

    snapshotRef.current = {
      composition: image.composition,
      imageId: image.id,
    };
    setIsEditing(true);
  }, [image, isEditing]);

  const cancel = useCallback(() => {
    if (snapshotRef.current) {
      updateComposition(snapshotRef.current.imageId, snapshotRef.current.composition);
    }

    snapshotRef.current = null;
    setIsEditing(false);
  }, [updateComposition]);

  const finish = useCallback(() => {
    commit();
    setIsEditing(false);
  }, [commit]);

  useEffect(() => {
    commit();
    setIsEditing(false);
  }, [commit, resetKey]);

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
