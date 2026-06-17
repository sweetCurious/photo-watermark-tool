# DESIGN_TOKENS

# Photo Watermark Tool

Version: V1.0

Status: Locked

## Purpose

本文件定义整个项目唯一的设计 Token。

所有组件必须引用本文件中的 Token。

禁止组件内部自行定义颜色、圆角、间距、字号、阴影。

## Theme

- Mode：Light
- Dark Mode：Not Supported（V1）

## Color

Background：

- `background.default`：`#F8F9FA`
- `background.panel`：`#FFFFFF`
- `background.upload`：`#FAFAFA`

Border：

- `border.default`：`#E5E7EB`
- `border.hover`：`#CBD5E1`

Primary：

- `primary`：`#2563EB`
- `primary.hover`：`#1D4ED8`
- `primary.disabled`：`#94A3B8`

Semantic：

- Success：`#22C55E`
- Warning：`#F59E0B`
- Error：`#EF4444`

Bottom Bar：

- `rgba(0,0,0,0.3)`，固定，不得修改

## Typography

- Font：Inter
- Fallback：system-ui

Size：

- Display：32px
- Title：24px
- Section：18px
- Body：14px
- Caption：12px
- Button：14px

Weight：

- Regular：400
- Medium：500
- Semibold：600
- Bold：700

## Radius

- Small：6px
- Medium：8px
- Large：12px
- Round：999px

## Shadow

- Card：`0 2px 8px rgba(0,0,0,.08)`
- Hover：`0 6px 20px rgba(0,0,0,.12)`

禁止自定义 Shadow。

## Spacing

统一使用：

- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40
- 48

不得出现 17px、23px、29px。

## Layout Tokens

- Header Height：64px
- Footer Height：72px
- Left Panel Width：280px
- Right Panel Width：360px

## Bottom Bar

- Height：10%
- Opacity：30%

## Logo

- Margin：24px
- Height：BottomBar x 60%
- Alignment：Vertical Center

## Button

- Height：40px
- Padding：16px
- Radius：8px

## Upload Area

- Min Height：320px
- Border：Dashed
- Radius：12px

## Thumbnail

- Width：100%
- Radius：8px
- Gap：12px

## Progress Bar

- Height：8px
- Radius：999px

## Animation

- Duration：200ms
- Timing：ease-in-out

禁止超过 300ms。

## Transition

- Hover：200ms
- Click：150ms

## Icon

- Size：20px
- Stroke：2
- Library：Lucide React

## Grid

- Desktop：3 Columns
- Gap：24px

## Z-Index

- Header：100
- Dialog：1000
- Toast：1100

## Responsive

- Minimum Width：1280px
- Recommended Width：1440px
- Maximum Width：Unlimited
- Mobile：Not Supported
- Tablet：Not Supported

## Images

- Preview：contain
- Thumbnail：cover
- Canvas：contain

不得 stretch。

## Accessibility

- Focus Ring：必须
- Keyboard：必须
- ARIA：推荐

## Rule

任何组件不得硬编码颜色、字体、圆角、间距。

全部引用本文件定义。
