# FireHub — GAC Deliverables Catalogue

A static, single-page catalogue of the FAO **Global Fire Management Hub** /
**Integrated Fire Management (IFM / MIF)** deliverables produced under the
GAC-funded **FireHub** project (*GCP/GLO/1351/CAN*, Global Affairs Canada) across
Bolivia, Peru, Colombia, Ecuador and the Pan-Amazon.

Open **`index.html`** in a browser. It reads `catalog-data.js` and renders every
document in the `GAC deliverables/` folder, grouped into categories, with free-text
search and Type / Country filters. PDFs open in the browser; Office files download.

## Project layout

```
FireHub/
├─ index.html                       ← the catalogue page (open this)
├─ marvel.html                      ← MARVEL results & indicators page
├─ learnings.html                   ← Learnings page (lessons / practices / findings / recs)
├─ learnings.js                     ← Learnings data + render (the L array)
├─ executive-summary.html           ← donor terminal executive summary (print-ready A4)
├─ catalog-data.js                  ← AUTO-GENERATED list of all documents
├─ rename-log.csv                   ← AUTO-GENERATED old→new rename log (undo source)
├─ css/firehub.css                  ← shared layout + top nav (uses the identity tokens)
├─ css/marvel.css                   ← MARVEL + Learnings layout (functions, indicators, gauge, cards)
├─ css/es.css                       ← executive-summary (A4 print) layout
├─ assets/es-photos/                ← photos & graphics for the summary (mined from deliverables)
├─ scripts/
│   ├─ build-catalog.mjs            ← scans "GAC deliverables/" → catalog-data.js
│   ├─ classify.mjs                 ← shared filename → category/country rules
│   ├─ classification.json          ← FROZEN category/country per file (build prefers this)
│   ├─ rename-map.mjs               ← old → new filename map (single source of truth)
│   ├─ rename-files.mjs             ← apply / --check / --undo the renames
│   └─ freeze-classification.mjs    ← lock categories before renaming changes names
├─ resources/
│   └─ fire-hub-identity/           ← official FAO Global Fire Management Hub identity
│       ├─ css/styles.css           ← tokens + components (linked by index.html)
│       ├─ tokens.json              ← machine-readable design tokens
│       └─ assets/                  ← FAO logo, deck backgrounds, mosaic artwork
├─ assets/                          ← (room for project-specific images)
└─ GAC deliverables/                ← SOURCE documents (PDF / DOCX / XLSX / PPTX)
```

## Rebuild the catalogue

Run this whenever you **add or remove** files in `GAC deliverables/`:

```bash
node scripts/build-catalog.mjs
```

It re-scans the folder and rewrites `catalog-data.js`. For each file it uses the
**frozen** category/country in `scripts/classification.json` if present; any file
not listed there is auto-classified by the filename rules in `scripts/classify.mjs`
(first match wins). The console prints a per-category count.

### Categories

Outcome Reports · Project Reporting & Management · Training & Education ·
Concept Notes & Agendas · Attendance & Participation · Communication Products ·
Dialogues & Workshops · Data & Technical · Best Practices & Diagnostics ·
Country Reports & Roadmaps · Other Deliverables. The search box and the
Category / Type / Country facets cover anything that lands in an unexpected bucket.

## Renaming source files

The 135 source files were renamed to clean, consistent titles
("Outcome 2.1 - State Fire Policies (EN)", "Cartilha 03 - IFM Plan PMIF (PT)", …).
This is **fully reversible**:

```bash
node scripts/rename-files.mjs --check   # dry run: show plan, flag problems
node scripts/rename-files.mjs           # apply, writing rename-log.csv
node scripts/rename-files.mjs --undo    # revert every rename using rename-log.csv
```

The map lives in `scripts/rename-map.mjs`. Because the catalogue classifier is
filename-based, the rename would otherwise re-bucket files — so the workflow is:
**(1)** `freeze-classification.mjs` (locks each file's category onto its new name),
**(2)** `rename-files.mjs`, **(3)** `build-catalog.mjs`. To rename more files, add
entries to `rename-map.mjs`, then re-run those three in order.

## MARVEL & Learnings pages

A shared top nav (`.topnav` in `firehub.css`) links three pages: **Catalogue**,
**MARVEL** and **Learnings**.

`marvel.html` presents **MARVEL** (Monitoring, Assessment, Reporting, Verification,
Evaluation and Learning) — the results-and-learning system developed by Marcelo
Rezende under the DSL-IP, applied here to the IFM work. It frames MARVEL as six
**modular core functions** (assembled and customised per country context for
evidence-based decision-making) and visualises the project's **results-framework
indicators** (delivered vs target) and **activity delivery**. The indicator/activity
values are transcribed from `GAC deliverables/Project CRT - GCP GLO 1351 CAN.xlsx`
into the inline `IND` / `groups` data arrays — update them if the tracker changes.
Each indicator, activity and the delivery gauge has a **source tooltip** pinpointing
the CRT sheet/column the figure comes from.

`learnings.html` is the **Learning** layer: lessons learned, best practices, key
findings and technical recommendations distilled from the deliverables, clustered by
theme and filterable by type/theme, each citing its source document. Cards are
summarised; selecting one opens a printable **A4 one-pager** (summary · why it matters
· sources). Every learning has a project code **`FH-<THEME>-<NN>`**
(THEME = POL/IND/CAP/DAT/REG/COM/KNO) and is deep-linkable, e.g.
`learnings.html#FH-POL-01`. Content lives in the `L` array in `learnings.js`
(fields `t`/`x`/`why`/`s`); add entries (and `SRC` for new sources) to extend it.

## Terminal executive summary

`executive-summary.html` is a **donor-focused terminal executive summary** (~25 print
pages) built on the identity as A4 `.sheet` pages — cover, project facts, results
against targets, the five strategic pillars/outputs, a photo essay, materials produced,
country highlights, lessons and acknowledgements. Open it and use **Print / Save as PDF**
(the screen helper bar is hidden in print; `@page size:A4`, one page per `.sheet`).
Photos and graphics in `assets/es-photos/` were mined from the project's own Word
deliverables (workshop/course/evidence reports) and the report's logos/charts — i.e.
genuine project imagery, not stock. Facts are from the terminal report and the CRT.

## Visual identity

The page uses the **official FAO Global Fire Management Hub identity** in
`resources/fire-hub-identity/` — petrol `#0c4b66` surfaces, signal-orange `#f67d14`
accents, rust `#a6361e` headlines, Lato type, flat colour with the signature
accent-bar device. `index.html` links the kit's `css/styles.css`; `css/firehub.css`
adds only catalogue layout and references the brand tokens via `var(--…)` (never
hard-coded hex). See `resources/fire-hub-identity/AGENTS.md` for the full rule set.

## Notes

- **Lato is loaded from Google Fonts** (online), per the identity kit. The page
  still works offline with a system-sans fallback; to make it fully offline, self-host
  Lato and swap the `@import` in
  `resources/fire-hub-identity/css/tokens/fonts.css`.
- **Don't rename source files by hand** without re-running the build — the catalogue
  links to exact filenames in `GAC deliverables/`.
- The identity kit notes its logo/mosaics were extracted from raster PNGs; request the
  original `.ai`/SVG and the standard blue FAO lockup for production-grade output.
