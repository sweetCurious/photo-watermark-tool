# Project Rules

Version: V1.0

## 1. Single Source of Truth

所有开发必须遵循以下优先级：

1. PRD.md
2. UI_SPEC.md
3. TECH_SPEC.md
4. AGENTS.md
5. 当前 Task

不得自行推断需求。

## 2. Scope Control

禁止开发未在 PRD 中定义的功能。

任何新增功能必须新增 Task。

不得在当前 Task 中顺便实现未来功能。

## 3. File Modification

每个 Task 最多修改 5 个文件。

不得跨模块重构。

不得修改历史 Task 已验收代码。

## 4. Dependency

新增依赖前优先使用浏览器原生 API。

没有必要不得新增 npm 包。

## 5. Commit

一个 Task 对应一个 Commit。

禁止多个 Task 混合提交。

## 6. Refactor

只有以下情况允许重构：

- Bug 修复
- 性能优化
- PRD 更新

其它情况禁止重构。

## 7. Performance

不得为了代码简洁牺牲性能。

不得同步阻塞 UI。

## 8. Review Checklist

每完成一个 Task：

- Build 成功
- Lint 通过
- Type Check 通过
- UI 正常
- 无 Console Error
- Commit
