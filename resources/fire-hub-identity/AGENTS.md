# AGENTS.md — FAO Fire Hub visual identity

Rules for any AI coding assistant (Copilot, Cursor, Claude Code) working in a project that uses this identity. Keep output faithful to the brand below.

## Use the tokens, never hard-code
- Read values from `css/tokens/*.css` (CSS custom properties) or `tokens.json` (JSON).
- Reference CSS variables (`var(--accent)`, `var(--surface-dark)`) instead of literal hex. The only authoritative hex values live in these files.
- To consume in plain HTML/CSS: `<link rel="stylesheet" href="css/styles.css">` — it `@import`s fonts, all tokens, base element styles, and `.fh-*` component styles in the correct order.

## Non-negotiable brand rules
- **Typeface is Lato** (FAO institutional). 900 for display headlines, 700 for sub-heads, 400 body, 300 for large light display. Do not substitute another sans.
- **Petrol `#0c4b66` is the primary surface** (covers, headers, footers, heroes). **Signal orange `#f67d14` is the primary action/accent.** **Rust `#a6361e` is the headline color on light backgrounds**; on dark, headlines are white with gold `#f8af0b` eyebrows.
- **No gradients as a brand device.** Flat color only. No glass, glow, grain, or noise.
- **Crisp corners.** Modest radii: 4px inputs/tags, 8px buttons, 12px cards. Pills (999px) only for chips/tags/avatars.
- **Cool, low-spread shadows** (petrol-tinted `#11323f`). Never heavy or warm.
- **Signature elevation device:** a solid brand-color accent bar (top of cards / 4px left rule on alerts) — used instead of glow.
- **No emoji. No exclamation marks.** UI icons are a Lucide-style 2px line set (`stroke=currentColor`), inlined as SVG. For production, install [Lucide](https://lucide.dev).

## Copy / voice
- Institutional but human; calm, never alarmist. Mostly third-person/collective.
- **Sentence case** for headlines and UI labels. Title Case only for proper nouns. UPPERCASE only for small tracked-out eyebrows.
- Tone words: integrated, sustainable, resilience, landscape, community, partnership, prevention, preparedness, response, recovery.

## Interaction defaults
- Hover: buttons warm orange → flame-orange; cards lift `translateY(-2px)` + larger shadow; links shift petrol-blue → flame-orange.
- Press: `translateY(1px)`; primary buttons deepen to `#d95f0a`.
- Focus: 3px petrol-blue ring `rgba(47,122,154,.45)`.
- Motion: `cubic-bezier(.2,0,0,1)` at 120–200ms. No bounce, no infinite loops, no parallax.

## Assets
- Identity artwork in `assets/identity/` (FAO white logo, full visual identity lockup, mosaic clusters). Recolor only within the palette; keep clear space around the FAO logo; place it on petrol/imagery, not white.
- Petrol deck backgrounds + FAO SDG background in `assets/backgrounds/`.
- Mosaic motifs (flame, hands, globe+network, pine, leaf, water drop, waves, sun) are identity artwork, not a UI icon set.
