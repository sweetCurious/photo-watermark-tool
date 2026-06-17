# T006 Logo Upload

## Objective

实现左右 Logo 上传。

## Scope

包含：

- 左 Logo 上传
- 右 Logo 上传
- Logo 预览
- 删除 Logo
- 替换 Logo

不包含：

- Logo 绘制到 Canvas

## Requirements

支持：

- png
- svg

Logo 仅保存在浏览器内存。

刷新页面后不保留。

## Files Suggested

- `src/components/logo/LogoUploader.tsx`
- `src/store/logoStore.ts`
- `src/types/logo.ts`

## Acceptance Criteria

- [ ] 可上传左 Logo
- [ ] 可上传右 Logo
- [ ] 可预览 Logo
- [ ] 可删除 Logo
- [ ] Logo 状态可供后续 Canvas 使用

## Commit Message

```text
feat: implement logo upload
```
