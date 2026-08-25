# Photo Watermark Tool

A local-first desktop web tool for batch processing photos into Xiaohongshu-ready images.

## Architecture

- Pure frontend
- Browser local processing
- No backend
- No upload
- No database
- No cloud storage

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Zustand
- Canvas API
- JSZip

## Commands

```text
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

## Development

Development is task-driven. Complete tasks strictly from `tasks/T001_Project_Init.md` through `tasks/T018_Final_Acceptance.md`.

## V1 Workflow

1. Choose one portrait or landscape canvas for the batch.
2. Upload JPG, JPEG, PNG, or browser-supported HEIC photos.
3. Upload optional PNG/SVG logos.
4. Start processing; each photo scales proportionally to cover the canvas.
5. Drag and zoom each photo to adjust its non-destructive composition.
6. Download all successful outputs as `xhs_photos.zip`.

All processing runs in the browser. Photos and logos are kept in memory only and are not uploaded.

## V1 Acceptance Test Cases

- Upload one portrait image.
- Upload one landscape image.
- Upload 20 mixed images.
- Upload left logo, right logo, both logos, and no logo.
- Delete one image and clear all images.
- Process images and verify failed images do not stop successful images.
- Download `xhs_photos.zip`.
- Verify JPG dimensions, filename suffix, bottom bar height, and logo aspect ratio.
