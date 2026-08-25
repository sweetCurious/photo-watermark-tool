# PRD

# Photo Watermark Tool

Version: V1.0

Status: Ready for Development

Product Manager: Yu

## 1. Product Overview

## 1.1 Background

摄影活动结束后，通常需要将手机和相机导出的照片批量处理为适合小红书发布的图片。

目前主要依赖 Photoshop、Lightroom 或在线工具，存在以下问题：

- 需要逐张处理
- 操作重复
- 输出尺寸不统一
- 品牌 Logo 需要重复添加
- 导出效率低

本项目旨在提供一个纯前端、本地运行的网页工具，实现图片批量处理，一次完成尺寸适配、背景扩展、水印添加及导出。

## 2. Product Goals

实现以下目标：

- 支持批量处理 10-20 张照片
- 自动适配小红书推荐尺寸
- 保持原图比例，不拉伸图片
- 等比例缩放并填满用户预先选择的画布
- 自动添加品牌底栏
- 一键导出 ZIP

整个流程无需后端参与。

## 3. Target Users

主要用户：

- AI 社群运营
- 活动摄影人员
- 品牌运营
- 产品经理
- 市场运营

用户特点：

- 不熟悉 Photoshop
- 希望 30 秒内完成全部处理
- 不希望上传照片到云端

## 4. Product Scope

V1 包含：

- 图片上传
- Logo 上传
- 图片预览
- 画布方向选择
- 自动尺寸适配
- 等比例 Cover 填充
- 底栏生成
- Logo 绘制
- JPG 导出
- ZIP 下载

V1 不包含：

- AI 修图
- AI 去水印
- AI 抠图
- 云同步
- 用户系统
- 多语言

## 5. Functional Requirements

## FR-001 图片上传

支持 JPG、JPEG、PNG、HEIC（浏览器支持时）。

支持拖拽上传和点击上传。

支持一次上传 10-20 张图片。

## FR-002 图片预览

上传完成后显示缩略图列表。

每张图片展示：

- 文件名
- 分辨率
- 横图 / 竖图

支持删除单张图片。

支持清空全部。

## FR-003 Logo 上传

支持左 Logo 和右 Logo。

Logo 支持 PNG、SVG、透明背景。

支持替换 Logo。

支持删除 Logo。

## FR-004 画布方向选择

上传图片前选择 Portrait 或 Landscape 画布。

同一批次的全部照片使用统一画布。

切换画布后，预览和导出同步更新。

## FR-005 输出尺寸

Portrait：1242 x 1656，Ratio 3:4。

Landscape：1600 x 1200，Ratio 4:3。

禁止修改输出尺寸。

## FR-006 图片适配

禁止拉伸图片。

采用保持原图比例的 Cover 缩放。

图片默认居中，用户可以逐张调整取景位置。

Cover 为非破坏式画布取景，不修改原文件。

支持逐张拖动照片位置，并在 100%-300% 范围内调整构图缩放。

## FR-007 画布填充

照片必须完整覆盖画布，不留白，不生成模糊背景。

照片比例与画布不一致时，画布隐藏超出边缘的部分，用户可拖动照片调整最终取景。

## FR-008 底栏

生成图片后，底部增加品牌栏。

属性：

- 高度：图片高度 x 10%
- 颜色：Black
- 透明度：30%
- 宽度：100%

## FR-009 Logo

左 Logo 默认左对齐。

右 Logo 默认右对齐。

Logo 保持比例缩放。

Logo 高度：底栏高度 x 60%。

上下居中。

## FR-010 图片导出

格式：JPG。

质量：90%。

颜色空间：sRGB。

文件名：原文件名_xhs.jpg。

## FR-011 ZIP 下载

全部处理完成后生成 ZIP。

点击 Download 下载全部图片。

## 6. User Flow

Choose Canvas

Upload Images

Preview

Upload Logos

Process Images

Preview Result（可选）

Download ZIP

## 7. UI Pages

仅包含一个页面。

页面区域：

- 顶部：标题
- 中间：图片上传区域
- 左侧：图片列表
- 右侧：Logo 设置
- 底部：处理按钮、下载按钮

## 8. Business Rules

- Rule-001：不得修改原图比例
- Rule-002：采用非破坏式 Cover 填充，画布只隐藏边缘且不修改原图
- Rule-003：图片默认居中，允许用户逐张调整取景位置
- Rule-003A：用户调整后的逐张构图必须保留至当前页面刷新
- Rule-004：Logo 自动保持比例
- Rule-005：Logo 不允许超出底栏
- Rule-006：处理失败图片不得影响其它图片继续处理
- Rule-007：浏览器刷新后数据不保留

## 9. Performance Requirements

- 上传：20 张
- 总容量：<= 500MB
- 开始处理：<= 1 秒
- 全部处理：<= 30 秒
- 页面不得卡死
- 处理过程中允许取消任务

## 10. Error Handling

- 图片读取失败：Image Load Failed
- Logo 无法读取：Invalid Logo
- ZIP 生成失败：Export Failed
- 浏览器内存不足：Memory Limit Exceeded

## 11. Acceptance Criteria

所有功能满足以下条件：

- 成功上传图片
- 成功选择统一画布方向
- 成功生成目标尺寸
- 图片无拉伸
- 图片保持比例并填满画布
- 无模糊背景或空白边缘
- 底栏位置正确
- Logo 显示正确
- JPG 正确导出
- ZIP 可下载

全部通过后，V1 验收完成。

## 12. Future Versions

V1.1：

- 更多平台模板
- 自定义输出尺寸
- EXIF 日期
- 多种底栏模板

V1.2：

- AI 主体识别
- 自动避让主体
- Logo 模板管理
- 批量命名规则
