# Architecture Decision Records

Project: Photo Watermark Tool

## ADR-001 Frontend Only

Status：Accepted

Date：2026-06-18

Decision：本项目采用纯前端架构。所有图片处理均在浏览器本地完成。不引入任何后端服务。

Reason：

- 图片涉及隐私
- 无服务器成本
- 部署简单
- 浏览器性能足够满足 10-20 张图片批量处理

Consequence：禁止 API、数据库、图片上传、云存储。

## ADR-002 Desktop First

Status：Accepted

Decision：仅支持桌面浏览器。不考虑移动端适配。

Reason：用户主要在电脑处理活动照片。

## ADR-003 Single Page Application

Status：Accepted

Decision：整个产品仅一个页面。不使用 Router。

Reason：工具型产品无需页面跳转。

## ADR-004 Canvas Rendering

Status：Accepted

Decision：统一使用 Canvas API 完成图片处理。

Reason：浏览器兼容性最好，性能稳定，无需大型依赖。

## ADR-005 Blur Background

Status：Accepted

Decision：背景采用原图放大 + 高斯模糊。

禁止拉伸图片、裁剪主体、纯色补边。

Reason：保持摄影构图，适配不同尺寸。

## ADR-006 Bottom Watermark

Status：Accepted

Decision：

- 底栏高度 10%
- 颜色 Black
- 透明度 30%
- 支持左 Logo
- 支持右 Logo

Reason：统一品牌视觉，避免遮挡主体。

## ADR-007 Output Specification

Status：Accepted

Decision：

- Portrait：1242 x 1656
- Landscape：1600 x 1200
- JPG
- Quality：90%
- 文件名：OriginalName_xhs.jpg

## ADR-008 Task Driven Development

Status：Accepted

Decision：一个 Task 对应一个 Commit，不得跨 Task 开发。

Reason：方便 AI Coding，降低上下文复杂度。

## ADR-009 Dependency Policy

Status：Accepted

Decision：优先浏览器原生 API。新增 npm 包必须有明确理由。避免重复能力依赖。

## ADR-010 Future Features

Status：Planned

包括：

- 抖音模板
- 视频号模板
- EXIF
- AI 主体识别
- Logo 模板

V1 不开发。
