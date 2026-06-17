# T003 Image Upload

## Objective

实现图片上传入口。

## Scope

包含：

- 点击上传
- 拖拽上传
- 多文件选择
- 文件类型校验
- 上传数量限制

不包含：

- 图片解码
- 图片预览
- Canvas 处理

## Requirements

支持格式：

- jpg
- jpeg
- png
- heic

一次最多 20 张。

超过数量提示错误。

非法格式提示错误。

## Files Suggested

- `src/components/upload/ImageUpload.tsx`
- `src/utils/fileValidation.ts`
- `src/types/image.ts`

## Acceptance Criteria

- [ ] 可选择多张图片
- [ ] 可拖拽上传
- [ ] 非图片文件被拒绝
- [ ] 超过 20 张被拒绝
- [ ] 文件暂存在前端状态中

## Commit Message

```text
feat: implement image upload
```
