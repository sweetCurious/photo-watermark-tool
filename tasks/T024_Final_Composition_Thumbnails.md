# T024 Final Composition Thumbnails

## Goal

左侧照片列表显示与最终导出一致的画布构图缩略图，提升批量检查效率。

## Scope

- 缩略图保持当前画布比例，不再强制裁成方形原图。
- 同步照片 positionX、positionY、zoom。
- 同步底栏颜色、高度和透明度。
- 同步处理后的 Logo、位置、尺寸和透明度。
- 构图、画布或品牌设置变化时自动更新。
- 复用一组 Logo 预览资源，避免每张照片重复解码。

## Acceptance

- 缩略图与中央画布的照片取景一致。
- 竖版与横版缩略图比例正确。
- 20 张图片时不为每张图片重复创建 Logo 资源。
- Build、Lint、Type Check 全部通过。
