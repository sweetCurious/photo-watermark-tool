# UI_SPEC

# Photo Watermark Tool

Version: V1.0

## 1. Design Principle

本项目定位为桌面端网页工具（Desktop First）。

不考虑移动端适配。

页面宽度：

- 1440px 以上最佳
- 最小支持 1280px

整体风格：

- 简洁
- 现代
- 工具型
- 减少装饰性设计

## 2. Layout

页面采用三栏布局。

```text
Header
Image List | Preview | Settings
Footer
```

布局比例：

- 左侧：280px
- 中间：Auto
- 右侧：360px
- 底部：72px

## 3. Header

高度：64px

内容：

- Logo
- 标题：Photo Watermark Tool
- 右侧：GitHub（预留）
- Version（预留）

## 4. Left Panel

名称：Image List

宽度：280px

功能：显示上传图片。

每项展示：

- 缩略图
- 文件名
- 图片尺寸
- 方向标签：Portrait / Landscape
- 状态：Ready / Processing / Success / Failed

支持删除单张。

支持滚动。

底部：Clear All 按钮。

## 5. Center Panel

名称：Preview

默认：画布选择状态。

选择画布后进入图片上传；上传图片后显示当前选中图片。

支持放大适配，保持比例。

背景：`#F5F5F5`

预览使用 Cover 等比例缩放，展示最终居中裁切效果。

处理完成后展示最终效果。

## 6. Right Panel

名称：Settings

宽度：360px

分为 Card。

Section 1 Logo：

- Upload Left Logo
- Upload Right Logo
- Logo Preview
- Remove Logo

Section 2 Export：

- Portrait / Landscape 画布选择
- Portrait 1242 x 1656
- Landscape 1600 x 1200
- 只读，不可修改

Section 3 Watermark：

- Bottom Bar Height 10%
- Opacity 30%
- Background Black
- 只读

Section 4 Output：

- Format JPG
- Quality 90%
- Filename OriginalName_xhs.jpg
- 只读

## 7. Footer

高度：72px

左侧：

- 图片数量，例如 20 Images
- 处理中状态，例如 Ready

右侧：

- Primary Button：Start Processing
- Secondary Button：Download ZIP

Download 默认 Disabled，处理完成后 Enabled。

## 8. Upload Area

首次进入页面中央显示 Upload Area。

支持：

- Drag & Drop
- Click Upload
- 多文件
- JPG / JPEG / PNG / HEIC

上传成功后隐藏 Upload Area。

## 9. Buttons

Primary：

- Blue
- Hover Dark Blue
- Disabled Gray

Secondary：

- White
- Border Gray

Danger：

- Red
- 用于 Clear All / Delete

## 10. Loading

处理过程中显示 Progress Bar。

百分比显示 Current / Total，例如 `12 / 20`。

Estimated Time 预留。

## 11. Empty State

无图片：显示 Upload Photos 按钮。

Logo 未上传：显示 No Logo。

处理中：按钮 Disabled。

## 12. Error State

图片失败：红色状态，Tooltip：Image Load Failed。

Logo 错误：Invalid Logo。

ZIP 错误：Export Failed。

## 13. Color

- Background：`#F8F9FA`
- Panel：`#FFFFFF`
- Border：`#E5E7EB`
- Primary：`#2563EB`
- Success：`#22C55E`
- Warning：`#F59E0B`
- Error：`#EF4444`

## 14. Typography

Font：Inter

Fallback：system-ui

- Title：24px
- Section：16px
- Body：14px
- Caption：12px

## 15. Component List

必须拆分组件：

- Header
- Footer
- ImageUpload
- ImageList
- ImageItem
- ImagePreview
- SettingsPanel
- LogoUploader
- WatermarkCard
- ExportCard
- ProgressBar
- ActionBar
- Modal（预留）
- Toast

## 16. Interaction Rules

- 上传图片：自动生成缩略图
- 点击图片：中央预览切换
- 删除图片：立即刷新数量
- 开始处理：按钮 Disabled
- 完成处理：自动启用 Download
- 下载完成：保持结果，不自动清空

## 17. Responsive

仅支持 Desktop。

无需移动端。无需平板。

## 18. Accessibility

所有按钮必须支持 Keyboard Focus。

所有图片必须具有 Alt。

所有状态必须有文字。

禁止仅使用颜色表示状态。
