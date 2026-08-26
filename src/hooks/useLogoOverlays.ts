import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createDrawableLogos } from '../services/imageProcessingService';
import { createLogoCanvas, getLogoRects } from '../services/logoRenderer';
import { OutputSize, TemplateSettings } from '../store/settingsStore';
import { LogoAsset } from '../types/logo';
import { revokeObjectUrl } from '../utils/memory';
import { canvasToObjectUrl, LogoOverlay } from '../components/image/previewUtils';

interface UseLogoOverlaysParams {
  enabled: boolean;
  logos: LogoAsset[];
  outputSize: OutputSize | null;
  template: TemplateSettings | null;
}

export function useLogoOverlays({
  enabled,
  logos,
  outputSize,
  template,
}: UseLogoOverlaysParams) {
  const [overlays, setOverlays] = useState<LogoOverlay[]>([]);

  useEffect(() => {
    if (!enabled || !outputSize || !template) {
      setOverlays((currentOverlays) => {
        currentOverlays.forEach((overlay) => revokeObjectUrl(overlay.objectUrl));
        return [];
      });
      return;
    }

    const currentOutputSize = outputSize;
    const currentTemplate = template;
    const abortController = new AbortController();

    async function createOverlays() {
      let drawableLogos: Awaited<ReturnType<typeof createDrawableLogos>> = [];
      let nextOverlays: LogoOverlay[] = [];

      try {
        drawableLogos = await createDrawableLogos(logos, abortController.signal);
        const bottomBarHeight =
          currentOutputSize.height * currentTemplate.watermark.barHeightRatio;
        const bottomBar = {
          height: bottomBarHeight,
          width: currentOutputSize.width,
          x: 0,
          y: currentOutputSize.height - bottomBarHeight,
        };
        const rects = getLogoRects(
          drawableLogos,
          bottomBar,
          currentTemplate.logo,
          currentOutputSize,
        );

        nextOverlays = await Promise.all(
          rects.map(async (rect, index) => {
            const canvas = createLogoCanvas(
              drawableLogos[index],
              currentTemplate.logo.removeBackground,
            );
            const objectUrl = await canvasToObjectUrl(canvas);

            return {
              ...rect,
              fileName: logos[index].fileName,
              objectUrl,
            };
          }),
        );

        if (abortController.signal.aborted) {
          nextOverlays.forEach((overlay) => revokeObjectUrl(overlay.objectUrl));
          return;
        }

        setOverlays((currentOverlays) => {
          currentOverlays.forEach((overlay) => revokeObjectUrl(overlay.objectUrl));
          return nextOverlays;
        });
      } catch (error) {
        nextOverlays.forEach((overlay) => revokeObjectUrl(overlay.objectUrl));

        if (!abortController.signal.aborted) {
          console.error('Logo Preview Failed', error);
          toast.error('品牌标识预览失败');
        }
      } finally {
        drawableLogos.forEach((logo) => logo.dispose());
      }
    }

    void createOverlays();
    return () => abortController.abort();
  }, [enabled, logos, outputSize, template]);

  useEffect(
    () => () => {
      overlays.forEach((overlay) => revokeObjectUrl(overlay.objectUrl));
    },
    [overlays],
  );

  return { overlays, setOverlays };
}
