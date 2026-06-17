# T005 Image List and Preview

## Objective

实现图片列表和当前图片预览。

## Scope

包含：

- 左侧图片列表
- 缩略图
- 文件名
- 分辨率
- 方向标签
- 删除单张
- 清空全部
- 中间预览

不包含：

- 处理后预览
- Canvas 生成

## Requirements

点击图片后切换中间预览。

删除当前选中图片后，自动选中下一张。

## Files Suggested

- `src/components/image/ImageList.tsx`
- `src/components/image/ImageItem.tsx`
- `src/components/image/ImagePreview.tsx`
- `src/store/imageStore.ts`

## Acceptance Criteria

- [ ] 上传图片后可看到列表
- [ ] 可点击切换预览
- [ ] 可删除图片
- [ ] 可清空全部
- [ ] UI 符合三栏布局

## Commit Message

```text
feat: implement image list and preview
```
