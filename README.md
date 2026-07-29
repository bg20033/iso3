# IsoMat GmbH – Website

Production-ready React/Vite website for IsoMat GmbH in Spreitenbach.

## Content

- German (`de-CH`) business website with seven solution categories
- 107 unique, optimized reference photographs from the supplied IsoMat archive
- Contact flow that prepares an email to `info@isomat.ch`
- Motion-aware industrial interactions and responsive mobile navigation
- Legal and privacy pages based only on supplied company information

## Design system

Light industrial direction, defined by the tokens at the top of `src/index.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#ffffff` | Base background across every page |
| `--foil` | `#eceeef` | Aluminium band, carries the quilted-pad texture |
| `--ink` / `--ink-soft` / `--ink-faint` | `#0e1112` / `#454c4f` / `#5c6366` | Headline, body, caption text (all ≥ 4.5:1) |
| `--edge` / `--edge-strong` | `#d2d6d8` / `#a9afb2` | Hairline rules and control borders |
| `--signal` | `#d62622` | IsoMat red, the only accent |

Type: Barlow Condensed for headlines and technical labels, Barlow for body copy.

Structural motif: the cross stitch (`+`) from the real insulation pads marks
eyebrows, card corners and list items. Section bands alternate white and
aluminium; the aluminium bands carry the diagonal quilt pattern. The one
saturated surface is the red contact band, the one dark surface the contact card.

Signature element: the component register at the bottom of the hero — the seven
solution categories as a measured index strip that doubles as navigation.

## Commands

```bash
npm run dev
npm run test
npm run lint
npm run build
```

`npm run media` regenerates the optimized WebP library from the local `IsoMat`
source folder. The source photographs, documents and archives are intentionally
not shipped with the production build.
