# T001 Project Init

## Status

Ready

## Priority

High

## Estimated Time

20 Minutes

## Objective

初始化整个项目。

搭建所有基础开发环境。

本 Task 不实现任何业务功能。

仅完成项目骨架。

## Expected Result

执行：

```text
pnpm dev
```

能够启动项目。

浏览器打开：

```text
http://localhost:5173
```

显示：

```text
Photo Watermark Tool
```

## Scope

本 Task 仅包括：

- React
- Vite
- TypeScript
- TailwindCSS
- ESLint
- Prettier
- 项目目录
- Git Ignore

禁止：

- 图片上传
- Canvas
- Logo
- ZIP
- 任何业务功能

## Tech Stack

必须：

- React 18
- TypeScript
- Vite
- TailwindCSS
- pnpm

## Directory

创建：

```text
src/
components/
pages/
hooks/
store/
services/
utils/
types/
constants/
assets/
styles/
```

创建：

```text
docs/
tasks/
public/
```

## Install

安装：

- react
- react-dom
- typescript
- vite
- tailwindcss
- zustand
- lucide-react
- sonner
- jszip
- file-saver

安装：

- eslint
- prettier
- @types/node

## Entry

首页：

```text
src/pages/Home.tsx
```

内容：

```text
Photo Watermark Tool
```

## Routing

V1 无需 Router。

整个项目一个页面。

## App

`App.tsx` 仅负责：

```tsx
<Home />
```

不得写业务。

## Tailwind

完成 Tailwind 初始化。

全局背景：

```text
#F8F9FA
```

字体：

```text
Inter
```

Fallback：

```text
system-ui
```

## Build

必须：

```text
pnpm dev
```

成功。

必须：

```text
pnpm build
```

成功。

## ESLint

必须无 Error。

## TypeScript

开启 Strict。

禁止关闭。

## Acceptance Criteria

- [ ] 能够启动项目
- [ ] 显示 Photo Watermark Tool
- [ ] Build Success
- [ ] Lint Success
- [ ] Type Check Success
- [ ] 目录正确
- [ ] 无 Warning

## Out of Scope

不得：

- 上传图片
- 增加组件
- 增加状态管理
- 增加 Canvas
- 增加任何业务逻辑

## Commit Message

```text
feat: initialize project structure
```
