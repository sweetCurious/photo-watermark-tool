# TECH_SPEC

# Photo Watermark Tool

Version: V1.0

Status: Locked

## 1. Architecture

项目采用 Pure Frontend Architecture 和 Browser Local Processing。

所有图片处理均在浏览器本地完成。

禁止：

- Backend
- API
- Upload Server
- Database
- Cloud Storage

所有图片不得离开浏览器。

## 2. Tech Stack

- Framework：React 18
- Language：TypeScript
- Build Tool：Vite
- Package Manager：pnpm
- Runtime：Browser

## 3. UI

- CSS：TailwindCSS
- Icons：Lucide React
- Notification：Sonner
- Dialog：Radix UI
- Animation：Framer Motion（仅页面动画）

禁止：

- Bootstrap
- Material UI
- Ant Design
- Element Plus

## 4. State Management

统一使用 Zustand。

Store：`src/store/`

禁止 Redux、Mobx、Context API 作为全局状态。

## 5. Image Processing

统一使用：

- Canvas API
- `createImageBitmap()`
- `Image()`

禁止：

- Fabric.js
- Konva
- PixiJS
- SVG Rendering

所有图片绘制必须基于 Canvas。

## 6. ZIP

统一使用 JSZip。

下载使用 FileSaver。

禁止后端压缩。

## 7. Image Decode

优先 `createImageBitmap()`。

Fallback：`HTMLImageElement`。

不得同步读取图片。

## 8. Image Pipeline

每张图片必须按照以下顺序处理：

1. Read File
2. Decode
3. Detect Orientation
4. Create Canvas
5. Generate Blur Background
6. Render Background
7. Render Original Image
8. Render Bottom Bar
9. Render Left Logo
10. Render Right Logo
11. Export JPG

不得修改顺序。

## 9. Canvas Rules

每张图片独立 Canvas。

Canvas 使用完成立即释放引用。

避免内存泄漏。

## 10. Blur Background

流程：

1. 复制原图
2. 放大
3. 铺满画布
4. Gaussian Blur
5. 绘制

禁止纯色背景。禁止拉伸背景。

## 11. Original Image

保持原比例。

不得拉伸。不得裁剪主体。

默认 Center。

## 12. Bottom Bar

- 高度：Canvas Height x 10%
- 颜色：Black
- Opacity：30%
- 位置：Bottom
- 宽度：100%

## 13. Logo

支持 Left 和 Right。

Logo 保持比例。

Height：Bottom Bar Height x 60%。

Margin：24px。

上下 Center。

禁止裁切 Logo。

## 14. Output

- Format：JPEG
- Quality：0.9
- Color：sRGB
- Filename：OriginalName_xhs.jpg

## 15. Browser Memory

最多 20 张。

建议单张 <= 30MB。

超过提示 Memory Warning。

不得导致浏览器崩溃。

## 16. Async

所有图片使用 Promise。

使用 `Promise.allSettled()`。

禁止 `Promise.all()`。

避免一张失败导致全部失败。

## 17. Worker

预留 Web Worker。

V1 无需实现。

## 18. Folder Structure

```text
src/
components/
pages/
hooks/
store/
utils/
types/
services/
constants/
assets/
```

## 19. Component Rules

- 每个组件 <= 300 Lines
- 每个 Hook <= 150 Lines
- Utils 单一职责

禁止超大组件。

## 20. Naming

- Component：PascalCase
- Hook：useXXX
- Store：xxxStore
- Utils：camelCase
- Constants：UPPER_CASE

## 21. TypeScript

开启 Strict Mode。

禁止 `any`。

优先 `type`。

复杂对象使用 `interface`。

不得关闭类型检查。

## 22. Error Handling

统一 `try / catch`。

统一 Toast。

所有异常 Console Error。

用户友好提示。

## 23. Performance

一次处理 20 张。

UI 不得冻结。

目标 FPS > 50。

图片处理异步。

## 24. Logging

Development：Console。

Production：关闭。

不得打印图片数据。不得打印 Base64。

## 25. Security

不得联网。不得上传图片。不得缓存图片。不得保存 LocalStorage。

Logo 仅保存在内存。

刷新全部释放。

## 26. Testing

至少验证：

- JPG
- PNG
- HEIC（浏览器支持时）
- 横图
- 竖图
- 超大图
- 损坏图片
- Logo 缺失
- Logo 超大
- ZIP 下载

## 27. Code Quality

ESLint。

Prettier。

Husky 预留。

Lint 必须通过。

Build 必须成功。

禁止 Warning。

## 28. Build

- 开发：`pnpm dev`
- 生产：`pnpm build`
- 输出：`dist/`

支持 GitHub Pages、Vercel、Netlify。

无需 Node Server。

## 29. Future

预留接口：

- Platform Template
- Logo Template
- EXIF
- AI Subject Detection
- Batch Rename
- Video Support

## 30. Definition of Done

- 所有图片成功导出
- 图片无变形
- Logo 正确
- 底栏正确
- ZIP 可下载
- Build Success
- ESLint Pass
- Type Check Pass
