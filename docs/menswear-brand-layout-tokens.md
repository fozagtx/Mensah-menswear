# Menswear Brand And Layout Tokens

Use these as reusable design direction for the storefront: restrained, product-first, image-heavy, and precise.

## Design Character

- Editorial menswear commerce: minimal, refined, and product-led.
- High trust through quiet typography, generous white space, thin borders, and simple product cards.
- Almost no rounded corners. The system relies on grid discipline instead of decorative shape.
- Palette is warm neutral with black/white contrast and muted utility colors.

## Color Tokens

```css
:root {
  --color-background: #ffffff;
  --color-surface-warm: #f5eee1;
  --color-topbar-bg: #f3f2f1;
  --color-text: oklch(44.4% 0.011 73.639);
  --color-text-strong: oklch(21.6% 0.006 56.043);
  --color-text-muted: oklch(70.9% 0.01 56.259);
  --color-line: oklch(92.3% 0.003 48.717);
  --color-footer-bg: #1e1c1a;
  --color-footer-text: #ffffff;
  --color-accent: #c6512c;
  --color-success: #67785d;
  --color-button-primary-bg: #000000;
  --color-button-primary-text: #ffffff;
}
```

## Type Tokens

```css
:root {
  --font-body: Lato, ui-sans-serif, system-ui, sans-serif;
  --font-display: Lato, ui-sans-serif, system-ui, sans-serif;

  --text-base: 14px;
  --text-xs: 10.5px;
  --text-sm: 12.25px;
  --text-md: 14px;
  --text-lg: 15.75px;
  --text-xl: 17.5px;
  --text-2xl: 21px;
  --text-hero: 60px;

  --line-tight: 1.25;
  --line-normal: 1.5;
  --weight-normal: 400;
}
```

Typography rules:
- Body text is small and calm: `14px / 1.5`, normal weight.
- Navigation uses uppercase `14px` text.
- Hero headings can scale up to `60px` on desktop when set over strong product imagery.
- Letter spacing stays `0`, including uppercase text.

## Spacing And Size Tokens

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  --nav-height: 48px;
  --page-max: 1440px;
  --radius-none: 0;
  --border-width: 1px;
}
```

## Layout Patterns

Header:
- Desktop header supports a utility row and category navigation.
- Nav items are uppercase, `14px`, horizontally spaced by about `24px`.
- Header background is white or subtle secondary background with a thin bottom border.
- Mobile collapses to a single sticky bar with concise actions.

Hero:
- Full-bleed imagery directly under navigation.
- Content sits over the image with white text and no card container.
- Overlay can be black with low opacity for legibility.
- Desktop content padding: `48px`; mobile padding: `24px`.

Product Grid:
- Standard commerce grid: four columns on desktop, two on mobile.
- Cards use square or portrait imagery, compact text, and thin separators.
- Card background is white; image area dominates.
- Badges use muted accent or success tones.

Footer:
- Dark warm near-black background.
- White text, simple columns, no heavy decoration.

## Build Notes

- Keep product imagery square or portrait and use `object-fit: cover`.
- Prefer thin separators over shadows.
- Use `border-radius: 0` for commerce surfaces.
- Avoid oversized SaaS-style hero copy. This style works because imagery carries the first viewport.
- Use muted section labels as wayfinding, then let product cards carry the detail.
