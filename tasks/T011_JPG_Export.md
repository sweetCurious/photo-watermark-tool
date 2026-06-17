# T011 JPG Export

## Objective

将处理后的 Canvas 导出为 JPG 文件。

## Scope

包含：

- Canvas 转 JPG Blob
- JPG Quality 0.9
- 文件命名规则

不包含：

- ZIP 打包

## Requirements

文件名：

- `OriginalName_xhs.jpg`

去除原始扩展名后追加 `_xhs.jpg`。

## Files Suggested

- `src/services/exportService.ts`
- `src/utils/fileName.ts`

## Acceptance Criteria

- [ ] 每张图可导出 JPG Blob
- [ ] 文件名正确
- [ ] JPG 质量为 0.9
- [ ] 不导出 PNG

## Commit Message

```text
feat: implement jpg export
```
