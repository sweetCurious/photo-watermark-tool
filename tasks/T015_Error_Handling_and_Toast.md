# T015 Error Handling and Toast

## Objective

实现统一错误提示。

## Scope

包含：

- 图片读取失败
- Logo 无效
- ZIP 失败
- 内存警告
- 处理失败

## Requirements

使用：

- Sonner Toast

所有异常必须：

- `console.error`
- toast 用户友好提示
- 不阻塞其它图片继续处理

## Files Suggested

- `src/services/errorService.ts`
- `src/components/common/ToastProvider.tsx`

## Acceptance Criteria

- [ ] 错误有提示
- [ ] 单张失败不影响整体
- [ ] 无未捕获异常

## Commit Message

```text
feat: implement error handling
```
