# T004 Image Decode

## Objective

读取图片文件并解析基础信息。

## Scope

包含：

- 读取 File
- 解码图片
- 获取宽高
- 判断方向
- 生成 object URL

不包含：

- 预览 UI 优化
- Canvas 处理

## Requirements

方向规则：

- `width > height`：Landscape
- `height >= width`：Portrait
- Square 按 Portrait 处理

优先使用：

- `createImageBitmap`

Fallback：

- `HTMLImageElement`

## Files Suggested

- `src/services/imageDecodeService.ts`
- `src/utils/imageOrientation.ts`
- `src/types/image.ts`

## Acceptance Criteria

每张图片成功生成：

- [ ] id
- [ ] file
- [ ] fileName
- [ ] width
- [ ] height
- [ ] orientation
- [ ] objectUrl
- [ ] status

## Commit Message

```text
feat: implement image decode
```
