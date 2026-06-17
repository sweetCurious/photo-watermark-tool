# T012 ZIP Export

## Objective

将所有处理完成的 JPG 打包为 ZIP 下载。

## Scope

包含：

- 使用 JSZip
- 使用 FileSaver 下载
- ZIP 命名

不包含：

- 图片处理逻辑新增

## Requirements

ZIP 文件名：

- `xhs_photos.zip`

单张失败不得影响其它图片下载。

## Files Suggested

- `src/services/zipService.ts`
- `src/components/actions/DownloadButton.tsx`

## Acceptance Criteria

- [ ] 多张图片可打包下载
- [ ] ZIP 内文件名正确
- [ ] 下载按钮在处理完成后可用
- [ ] 未处理时下载按钮禁用

## Commit Message

```text
feat: implement zip export
```
