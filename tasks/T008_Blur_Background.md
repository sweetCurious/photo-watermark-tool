# T008 Blur Background

## Objective

实现模糊背景扩边。

## Scope

包含：

- 使用原图生成背景
- 背景铺满目标 Canvas
- 背景高斯模糊
- 原图居中覆盖

不包含：

- 底栏
- Logo
- JPG 导出

## Requirements

必须保持原图比例。

不得拉伸原图。

不得裁剪主体。

背景可以放大铺满并模糊。

原图必须完整显示在画布中央。

## Files Suggested

- `src/services/backgroundRenderer.ts`
- `src/utils/drawContain.ts`
- `src/utils/drawCover.ts`

## Acceptance Criteria

- [ ] 横图和竖图都能正确扩边
- [ ] 原图无变形
- [ ] 原图完整显示
- [ ] 背景为模糊版原图

## Commit Message

```text
feat: implement blur background rendering
```
