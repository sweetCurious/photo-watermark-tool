# T016 Performance Optimization

## Objective

优化 10-20 张图片批处理性能和内存释放。

## Scope

包含：

- Object URL 释放
- Canvas 引用释放
- 避免 Base64 存储
- 大文件警告

不包含：

- Web Worker
- WASM
- AI 处理

## Requirements

不得在 Zustand 中保存 Base64。

不得打印图片数据。

图片删除时释放 object URL。

清空全部时释放全部 object URL。

## Files Suggested

- `src/utils/memory.ts`
- `src/store/imageStore.ts`
- `src/services/canvasService.ts`

## Acceptance Criteria

- [ ] 删除图片后 object URL 被释放
- [ ] 清空后内存引用释放
- [ ] 20 张图片处理后页面不崩溃
- [ ] 无明显 UI 卡死

## Commit Message

```text
perf: optimize image processing memory usage
```
