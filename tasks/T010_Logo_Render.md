# T010 Logo Render

## Objective

将左 Logo 和右 Logo 绘制到底栏中。

## Scope

包含：

- 左 Logo 绘制
- 右 Logo 绘制
- Logo 等比例缩放
- Logo 垂直居中
- Logo 边距

不包含：

- Logo 上传

## Requirements

Logo 高度：

- Bottom Bar Height x 60%

左右边距：

- 24px

左 Logo 左对齐。

右 Logo 右对齐。

Logo 不得变形。

## Files Suggested

- `src/services/logoRenderer.ts`
- `src/utils/logoScale.ts`

## Acceptance Criteria

- [ ] 左 Logo 正确显示
- [ ] 右 Logo 正确显示
- [ ] 只上传一个 Logo 时也正常
- [ ] Logo 不变形
- [ ] Logo 不超出底栏

## Commit Message

```text
feat: implement logo rendering
```
