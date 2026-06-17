# T002 Layout

## Objective

实现页面基础三栏布局。

## Scope

包含：

- Header
- Left Panel
- Center Preview Panel
- Right Settings Panel
- Footer Action Bar

不包含：

- 图片上传逻辑
- 图片处理逻辑
- Logo 上传逻辑

## Requirements

布局必须符合 `docs/UI_SPEC.md`：

- Header 高度 64px
- Left Panel 宽度 280px
- Right Panel 宽度 360px
- Footer 高度 72px
- Desktop First
- 不做移动端适配

## Files Suggested

- `src/pages/Home.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/LeftPanel.tsx`
- `src/components/layout/PreviewPanel.tsx`
- `src/components/layout/SettingsPanel.tsx`

## Acceptance Criteria

- [ ] 页面展示完整三栏布局
- [ ] 无业务功能
- [ ] Build 通过
- [ ] Lint 通过
- [ ] Type Check 通过

## Commit Message

```text
feat: implement base layout
```
