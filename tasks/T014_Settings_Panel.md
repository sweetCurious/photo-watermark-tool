# T014 Settings Panel

## Objective

实现右侧设置面板展示。

## Scope

包含：

- Logo 区域
- Export 区域
- Watermark 区域
- Output 区域

不包含：

- 可编辑配置

## Requirements

所有参数只读：

- Portrait 1242 x 1656
- Landscape 1600 x 1200
- Bottom Bar Height 10%
- Opacity 30%
- Format JPG
- Quality 90%
- Filename OriginalName_xhs.jpg

## Files Suggested

- `src/components/settings/SettingsPanel.tsx`
- `src/components/settings/ExportCard.tsx`
- `src/components/settings/WatermarkCard.tsx`
- `src/components/settings/OutputCard.tsx`

## Acceptance Criteria

- [ ] 右侧面板信息完整
- [ ] 参数不可编辑
- [ ] UI 符合 UI_SPEC

## Commit Message

```text
feat: implement settings panel
```
