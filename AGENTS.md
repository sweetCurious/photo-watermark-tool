# AI Development Rules

Project: Photo Watermark Tool

Version: V1.0

Status: Locked

## Mission

完成 Photo Watermark Tool：一个纯前端、浏览器本地图片处理工具。

任何开发都必须遵守本文件。禁止自行修改架构。

## Architecture Rules

必须保持 Frontend Only。

禁止：

- Backend
- API
- Database
- Upload Service
- Cloud

图片不得上传网络。所有处理必须在浏览器完成。

## Tech Stack

固定：

- React 18
- TypeScript
- Vite
- TailwindCSS
- Zustand
- Canvas API
- JSZip

不得替换。不得新增大型框架。

## Development Strategy

必须 Task Driven。

一次只完成一个 Task。

禁止一次完成多个 Task。禁止提前开发未来功能。

## File Modification Rules

仅允许修改当前 Task 涉及文件。

禁止修改无关模块。禁止大范围重构。禁止自行调整目录。

## Code Style

必须 TypeScript Strict。

不得使用 `any`。不得关闭类型检查。

必须使用函数式组件和 Hooks。

## Component Rules

- 一个组件 <= 300 lines
- 一个 Hook <= 150 lines
- 一个 Utils 单一职责

禁止 God Component。禁止 God Function。

## Image Rules

必须保持图片比例。

不得拉伸图片。必须使用 Cover 等比例缩放填满画布。

照片与画布比例不一致时，允许居中裁切超出画布的边缘。禁止 Blur Background。

Logo 保持比例。Bottom Bar 固定 10%。

## State Rules

统一 Zustand。

禁止 Redux、Mobx、Context 作为全局状态。

## Canvas Rules

每张图片使用独立 Canvas。

处理结束释放引用。

禁止 Canvas 共用。禁止污染全局状态。

## Performance Rules

图片处理异步。

不得阻塞 UI。

允许 `Promise.allSettled`。

禁止 `Promise.all`。

## Error Rules

所有异常必须捕获。

所有失败必须继续处理下一张。

不得因为一张失败停止全部任务。

## UI Rules

桌面优先。三栏布局。

禁止修改布局。禁止增加页面。禁止修改交互流程。

## Logging

Development 允许 Console。

Production 禁止 Console。

不得打印 Base64。不得打印图片数据。

## Dependency Rules

新增依赖前必须确认是否已有能力实现。

优先浏览器原生 API。

避免大型第三方库。禁止重复功能依赖。

## Security Rules

不得联网。不得上传图片。不得缓存图片。不得保存 LocalStorage。

Logo 仅存在内存。刷新页面全部释放。

## Git Rules

一个 Task 一次 Commit。

Commit Message 必须符合：

- `feat:`
- `fix:`
- `refactor:`
- `docs:`
- `style:`
- `test:`
- `chore:`

## Testing Rules

完成 Task 后必须 Build、Lint、Type Check。

通过后允许进入下一 Task。

## Definition of Done

一个 Task 完成标准：

- Build Success
- ESLint Pass
- Type Check Pass
- UI 正常
- 功能完成
- 无 Console Error
- 无 Memory Leak

否则 Task 未完成。

## Forbidden

禁止修改需求。禁止猜测需求。禁止增加隐藏功能。

禁止修改输出尺寸。禁止修改 Logo 规则。禁止修改底栏规则。

禁止增加配置项。

所有新增功能必须来自新的 Task。

## Development Order

必须严格按照 T001、T002、T003 继续。

不得跳过。不得提前开发。

## Priority

Bug Fix > Current Task > Refactor > Future Feature

任何未来功能不得影响当前开发。

## AI Behavior

如果需求不明确：不要猜测，不要自行设计，不要增加交互。

保持最小实现。严格执行 Task 文档。

任何架构修改必须由产品文档更新后再执行。
