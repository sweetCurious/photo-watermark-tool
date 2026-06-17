# T013 Processing State

## Objective

实现图片批处理状态管理。

## Scope

包含：

- Ready
- Processing
- Success
- Failed
- Progress
- 当前处理数量
- 总数量

不包含：

- 新图片处理算法

## Requirements

使用：

- `Promise.allSettled`

不得使用：

- `Promise.all`

单张失败不影响整体流程。

## Files Suggested

- `src/store/processingStore.ts`
- `src/hooks/useImageProcessing.ts`
- `src/components/progress/ProgressBar.tsx`

## Acceptance Criteria

- [ ] 处理时按钮禁用
- [ ] 处理进度可见
- [ ] 每张图片状态正确更新
- [ ] 失败图片显示 Failed
- [ ] 成功图片显示 Success

## Commit Message

```text
feat: implement processing state
```
