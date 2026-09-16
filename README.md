# AI Model Die

A basketball-scale d6 (240mm, 12mm filleted edges) rendered live in the browser with three.js and auto-rotating in place — drag to orbit, scroll to zoom, right-drag to pan. The cube sits centered in a full-bleed, dark, minimalist "deep space" scene: a twinkling canvas starfield, a slow-drifting nebula glow, and a thin HUD-style overlay (brand mark, spec readout, orbit hint, export toolbar) — no chrome, no page scroll.

## Run it

Static site, no build step. Serve the directory over HTTP (the ES module imports and import map need a real origin, not `file://`):

```
npx serve .
# or: python3 -m http.server
```

Then open `index.html`.

## Structure

- `index.html` — the page: the space background (gradient + canvas starfield + drifting nebula glow), the HUD overlay (brand, spec readout), the `<three-d-stage>` viewport, and the script that builds the die geometry.
- `three-d-stage.js` — a reusable `<three-d-stage>` custom element: scene/lighting/camera setup, orbit + autorotate controls, and a toolbar (restyled as dark glass to match the theme) that exports the current object as OBJ+MTL or GLB.
- `styles/modernist.css` — the Modernist design system (tokens + component classes) used in an earlier iteration of this page; kept for reference but no longer linked from `index.html`. See `styles/modernist-readme.md` for usage guidance.
- `chats/` — transcripts from the design sessions that produced this bundle, kept for context on how the design decisions were made.

## Current state

The die body ships blank (no face marks or pips) — a clean starting point for downstream marking. Exports as a single `die-body` node with the `ink-resin` material, ready to open in Blender.
