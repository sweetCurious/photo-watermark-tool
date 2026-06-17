# T007 Canvas Generator

## Objective

根据图片方向生成目标 Canvas。

## Scope

包含：

- Portrait Canvas
- Landscape Canvas
- 输出尺寸常量
- Canvas 创建函数

不包含：

- 背景模糊
- 原图绘制
- 水印绘制

## Requirements

Portrait：

- 1242 x 1656

Landscape：

- 1600 x 1200

不得允许用户修改。

## Files Suggested

- `src/constants/imageSpecs.ts`
- `src/services/canvasService.ts`
- `src/types/canvas.ts`

## Acceptance Criteria

- [ ] 竖图生成 1242 x 1656 Canvas
- [ ] 横图生成 1600 x 1200 Canvas
- [ ] 输出尺寸正确

## Commit Message

```text
feat: implement canvas generator
```
