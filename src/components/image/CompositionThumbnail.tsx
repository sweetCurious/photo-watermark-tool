import { OutputSize, TemplateSettings } from '../../store/settingsStore';
import { UploadedImage } from '../../types/image';
import { getCoverRect } from '../../utils/drawCover';
import { LogoOverlay } from './previewUtils';

const THUMBNAIL_SIZE = 56;

interface CompositionThumbnailProps {
  image: UploadedImage;
  index: number;
  logoOverlays: LogoOverlay[];
  outputSize: OutputSize;
  template: TemplateSettings;
}

export function CompositionThumbnail({
  image,
  index,
  logoOverlays,
  outputSize,
  template,
}: CompositionThumbnailProps) {
  const scale = Math.min(THUMBNAIL_SIZE / outputSize.width, THUMBNAIL_SIZE / outputSize.height);
  const canvasWidth = outputSize.width * scale;
  const canvasHeight = outputSize.height * scale;
  const photoRect = getCoverRect(
    image.width,
    image.height,
    outputSize.width,
    outputSize.height,
    image.composition,
  );

  return (
    <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-200">
      <div
        className="relative overflow-hidden bg-white shadow-sm"
        style={{ height: canvasHeight, width: canvasWidth }}
      >
        <img
          alt={`${image.fileName} 最终构图`}
          className="absolute max-w-none select-none"
          draggable={false}
          src={image.objectUrl}
          style={{
            height: photoRect.height * scale,
            left: photoRect.x * scale,
            top: photoRect.y * scale,
            width: photoRect.width * scale,
          }}
        />
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            backgroundColor: template.watermark.background,
            height: outputSize.height * template.watermark.barHeightRatio * scale,
            opacity: template.watermark.opacity,
          }}
        />
        {logoOverlays.map((overlay) => (
          <img
            alt=""
            className="absolute max-w-none"
            key={overlay.id}
            src={overlay.objectUrl}
            style={{
              height: overlay.height * scale,
              left: overlay.x * scale,
              opacity: template.logo.opacity,
              top: overlay.y * scale,
              width: overlay.width * scale,
            }}
          />
        ))}
      </div>
      <span className="absolute bottom-1 left-1 rounded bg-black/65 px-1.5 py-0.5 text-[9px] font-medium text-white">
        {index + 1}
      </span>
    </div>
  );
}
