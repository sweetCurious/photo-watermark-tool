# CHANGELOG

All notable changes to this project will be documented in this file.

## Version 1.0.0

Status: Released

Date: 2026-06-19

### Added

- README
- PRD
- UI_SPEC
- TECH_SPEC
- AGENTS
- PROJECT_RULES
- TASK_INDEX
- TASK_TEMPLATE
- DECISIONS
- Project initialization scaffold
- Desktop three-column workspace
- Batch image upload, decode, list, preview, delete, and clear-all flow
- Left and right logo upload with preview and removal
- Canvas output generation for portrait and landscape specs
- Blur background rendering, bottom watermark bar, and logo rendering
- JPG export and ZIP download
- Batch processing state, progress, and error toasts
- Memory cleanup for image object URLs and generated canvas references
- UI polish for focus, hover, disabled, empty, and desktop-only states

### Changed

- Release status updated from planning to released.

### Fixed

None

### Performance

- Released object URLs on image removal and clear-all.
- Added generated canvas release helper after export.

### Release Note

V1.0.0 delivers the local-first Photo Watermark Tool workflow: upload photos, upload optional logos, process images locally with Canvas, export JPG outputs, and download them as a ZIP.

### Removed

None

## Version Rules

- 新增功能：Added
- 需求修改：Changed
- 删除功能：Removed
- Bug 修复：Fixed
- 性能优化：Performance
- 重构：Refactor

## Release Rule

每完成一个 Sprint，更新一次 Version。

每发布一个版本，新增 Release Note。

禁止覆盖历史版本记录。
