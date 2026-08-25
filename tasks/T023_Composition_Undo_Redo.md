# T023 Composition Undo and Redo

## Goal

为非破坏式照片构图提供可靠的撤销与重做。

## Scope

- 构图点击完成时记录一次历史，而不是为每次拖动记录历史。
- 切换照片时自动提交当前构图历史。
- 顶部提供撤销、重做按钮。
- 支持 Ctrl/Cmd+Z、Ctrl/Cmd+Shift+Z 和 Ctrl/Cmd+Y。
- 最多保留 30 条历史。
- 删除照片或清空照片后清空历史，避免无效引用。

## Acceptance

- 撤销恢复调整前的缩放和位置。
- 重做恢复撤销前的缩放和位置。
- 新操作后清空重做栈。
- Build、Lint、Type Check 全部通过。
