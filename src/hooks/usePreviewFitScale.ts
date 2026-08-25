import { useEffect, useRef, useState } from 'react';
import { OutputSize } from '../store/settingsStore';

export function usePreviewFitScale(outputSize: OutputSize | null) {
  const [fitScale, setFitScale] = useState(0.4);
  const previewViewportRef = useRef<HTMLDivElement>(null);
  const outputHeight = outputSize?.height;
  const outputWidth = outputSize?.width;

  useEffect(() => {
    const viewport = previewViewportRef.current;

    if (!viewport || !outputHeight || !outputWidth) {
      return;
    }

    const updateFitScale = () => {
      const availableWidth = Math.max(viewport.clientWidth - 80, 160);
      const availableHeight = Math.max(viewport.clientHeight - 64, 160);
      setFitScale(Math.min(availableWidth / outputWidth, availableHeight / outputHeight, 1));
    };
    const resizeObserver = new ResizeObserver(updateFitScale);

    updateFitScale();
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, [outputHeight, outputWidth]);

  return { fitScale, previewViewportRef };
}
