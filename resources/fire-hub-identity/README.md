# FAO Fire Hub — Visual Identity (portable bundle)

A self-contained folder of the **Global Fire Management Hub** visual identity (FAO), ready to drop into a codebase and read in VS Code. Hosted by the Food and Agriculture Organization of the United Nations.

> These are **design references** — the canonical brand tokens, styles, and artwork. Recreate the look in your own framework (React, Vue, Svelte, SwiftUI, plain HTML…) using these values. They are not a build artifact to ship verbatim.

## What's in here

```
fire-hub-identity/
├─ README.md            ← you are here
├─ AGENTS.md            ← rules AI coding assistants auto-read (Copilot/Cursor/Claude Code)
├─ tokens.json          ← machine-readable design tokens (JSON)
├─ css/
│  ├─ styles.css        ← entry point — @imports everything below in order
│  ├─ components.css    ← namespaced .fh-* component styles (buttons, inputs, cards, alerts…)
│  └─ tokens/
│     ├─ fonts.css      ← Lato webfont (Google Fonts)
│     ├─ colors.css     ← palette + semantic aliases
│     ├─ typography.css ← families, scale, weights, tracking
│     ├─ spacing.css    ← 4px grid, containers
│     ├─ effects.css    ← radii, borders, shadows, motion
│     └─ base.css       ← element defaults
└─ assets/
   ├─ identity/         ← FAO white logo, full visual-identity lockup, mosaic clusters
   └─ backgrounds/      ← petrol deck backgrounds, FAO SDG background
```

## Quick start

**Plain HTML/CSS** — link the entry point and use the variables:
```html
<link rel="stylesheet" href="fire-hub-identity/css/styles.css">

<button class="fh-btn fh-btn--primary fh-btn--md">Explore the Hub</button>
<h1 style="color: var(--text-heading)">One global response to landscape fire</h1>
```

**Any framework** — import `tokens.json` and map it into your theme (Tailwind config, styled-components theme, CSS-in-JS, SwiftUI color set, etc.). Hex values in `tokens.json` and `css/tokens/colors.css` are authoritative.

**Tailwind sketch:**
```js
// tailwind.config.js
import tokens from './fire-hub-identity/tokens.json';
export default {
  theme: { extend: {
    colors: {
      petrol: tokens.color.brand.petrol,
      orange: tokens.color.accent.base,
      rust: tokens.color.brand.rust,
      gold: tokens.color.brand.gold,
    },
    fontFamily: { sans: ['Lato', 'sans-serif'] },
  }},
};
```

## The brand in one paragraph

A balance of opposites: **fire (red → orange → gold)** in dialogue with **water and forest (petrol, sky, greens)**. Deep **petrol `#0c4b66`** is the primary surface; **signal orange `#f67d14`** is the primary action. Headlines are **rust `#a6361e`** on light, white-with-gold-eyebrow on dark. Typeface is **Lato** throughout — heavy (900) for display. Everything is **flat color, crisp corners, cool low-spread shadows** — no gradients, no glow, no emoji. The signature device is a solid brand-color **accent bar** on cards and alerts. See `AGENTS.md` for the full rule set.

## Component classes (`components.css`)
`.fh-btn` (+ `--primary/secondary/outline/ghost/danger`, `--sm/md/lg`, `--block`), `.fh-iconbtn`, `.fh-input` / `.fh-field` / `.fh-label`, `.fh-check` / `.fh-switch`, `.fh-badge` / `.fh-tag`, `.fh-alert` (+ status variants), `.fh-card` (+ `--pad/--hover/__accent`), `.fh-stat`. Wrap anything on a petrol surface in `.fh-on-dark` to flip outline/ghost buttons to light.

## Caveats
- The original vector source (`FIRE HUB.ai`) was not available — logo and mosaic clusters were **extracted from raster PNGs**. Fine at typical sizes; request the `.ai`/SVG for production-grade crispness.
- Only the **white FAO logo** (for dark backgrounds) is included. Request the standard blue lockup for use on white.
- **Lato** is FAO's correct institutional typeface (not a stand-in). Self-host the licensed binaries for production by swapping the `@import` in `css/tokens/fonts.css`.
