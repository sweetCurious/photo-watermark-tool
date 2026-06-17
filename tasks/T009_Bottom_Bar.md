# T009 Bottom Bar

## Objective

在 Canvas 底部绘制半透明黑色底栏。

## Scope

包含：

- 底栏高度计算
- 半透明黑色绘制
- 固定底部位置

不包含：

- Logo 绘制

## Requirements

底栏高度：

- Canvas Height x 10%

颜色：

- `rgba(0,0,0,0.3)`

宽度：

- 100%

位置：

- 底部

## Files Suggested

- `src/services/watermarkRenderer.ts`
- `src/constants/watermarkSpecs.ts`

## Acceptance Criteria

- [ ] 所有导出画布底部都有黑色半透明栏
- [ ] 高度为图片高度 10%
- [ ] 不影响背景和原图绘制

## Commit Message

```text
feat: implement bottom watermark bar
```
