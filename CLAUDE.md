# Design system rules — AI Model Die

Analysis of this repo for Figma MCP / design-to-code integration. **Read this before mapping any Figma design to code here** — this project's structure is unusual (no framework, no build step, no component library), so default assumptions from a typical React/Tailwind design-system integration will not apply.

## 0. What this project actually is

A single static HTML page (`index.html`) rendering an interactive 3D die with three.js, styled as a full-viewport "deep space" scene. No framework, no bundler, no package.json, no component library. Treat any Figma design handed to this repo as **one page's worth of DOM + CSS to hand-write into `index.html`**, not as components to scaffold into a design system.

There are two unrelated visual systems in this repo — do not conflate them:
- **`styles/modernist.css`** — a separate, fully-tokenized design system ("Modernist") from an earlier design-tool iteration. **It is not linked from `index.html` and is not the current visual language of the site.** Kept only for reference (see §7).
- **The live page's own inline theme** — CSS custom properties declared directly in `index.html`'s `<style>` block. This is the system actually in effect today.

If a Figma file uses red-on-white flat/architectural styling, it maps to the *unused* Modernist system. If it uses a dark space/glow aesthetic, it maps to the *live* page. Confirm which one a given Figma frame is targeting before generating code.

## 1. Token definitions

Two independent token sets exist, in two different formats.

### 1a. Live page tokens (current) — `index.html:25-33`

Plain CSS custom properties on `:root`, hand-picked (not generated from a tool):

```css
:root {
  --void-1: #05060a;
  --void-2: #0a0e18;
  --text: #eef1f8;
  --text-dim: rgba(238, 241, 248, 0.5);
  --text-faint: rgba(238, 241, 248, 0.28);
  --accent: #7dd8ff;
  --accent-dim: rgba(125, 216, 255, 0.35);
}
```

No spacing/radius/shadow/font-size tokens exist for this system — those values are hard-coded per rule (e.g. `top: 28px`, `font-size: 13px` at `index.html:98,106`). There is no token transformation pipeline (no Style Dictionary, no Tokens Studio export, no build step of any kind) — the `:root` block *is* the source of truth, edited directly.

A few colors used inside the three.js scene are effectively "tokens" too but live in JS as literals, not CSS:
- `0x23211f` — die resin base color (`index.html:161`)
- `0x6fb8ff` — rim light color, echoes `--accent` (`index.html:379`)
- `rgba(125, 216, 255, ...)` / `rgba(190, 226, 255, ...)` — the accent cyan reused at various opacities inside canvas-drawn label textures (`index.html:227-272`)

If Figma variables are introduced for this page, map Figma color variables to the `:root` custom properties above by name/hex match, and treat any color used inside the 3D scene as a **manual sync point** — it won't update automatically when a CSS variable changes, since three.js materials read plain hex numbers, not CSS.

### 1b. Modernist design system tokens (present, unused) — `styles/modernist.css:4-64`

A complete, generated-looking token set with tonal ramps, e.g.:

```css
:root {
  --color-bg: #f3f2f2;
  --color-surface: #eae9e9;
  --color-text: #201e1d;
  --color-accent: #ec3013;
  --color-neutral-100: #f8f4f4; /* … through --color-neutral-900 */
  --color-accent-100: #fff2ef;  /* … through --color-accent-900 */
  --font-heading: "Archivo", system-ui, sans-serif;
  --space-1: 4.0px; /* … through --space-8: 32.0px */
  --radius-sm: 0px; --radius-md: 0px; --radius-lg: 0px;
  --shadow-sm: 0 1px 2px color-mix(in srgb, #2d2b2b 14%, transparent);
}
```

This was authored by a design tool ("Claude Design" / Modernist system) and documented in `styles/modernist-readme.md`, which records the *intended* usage rules (flush-left labels, 0px radius always, accent used sparingly, etc.) — see §6. `styles/modernist-readme.md` also references a `theme.json` as the machine-readable source these tokens were derived from, but that file was **not included** in this repo (only `styles.css` + `readme.md` were kept; the rest of the original bundle — `templates/`, `foundations/*.html`, `components/*.html`, `theme.json` — was stripped when the site was assembled). Do not assume those referenced files exist.

## 2. Component library

**There is no component library and no component framework.** No React/Vue/Svelte, no `components/` directory, no Storybook, no `.stories` files.

The one reusable unit is a vanilla **Web Component** (custom element), which is the closest thing to a "component" in this repo:

- `three-d-stage.js` defines `<three-d-stage>` (`customElements.define('three-d-stage', ThreeDStage)` at the bottom of the file), a self-contained 3D viewer/exporter shell with its own Shadow DOM, styles, and public API (`stage.ready`, `stage.setObject(object)`, attributes `name` / `background` / `autorotate`).
- It's consumed exactly once, in `index.html:146`: `<three-d-stage name="ai-model-die" background="transparent" autorotate></three-d-stage>`.
- Its internal look (toolbar buttons, orbit-hint note, error state) is styled via a template-literal stylesheet inside the class (`three-d-stage.js`, top of file) — encapsulated by Shadow DOM, so it **cannot be reached by page-level CSS or by any Figma-generated global stylesheet**. To restyle it, edit the stylesheet string in `three-d-stage.js` directly (already done once, to convert its default light "glass" toolbar to the dark theme — see the comment at the top of that file: *"The copied file is yours: adjust the lights, shadow, or background in `_boot()` when the object needs a different look."*).

Everything else on the page (HUD brand mark, spec readout, the die's face "buttons") is plain markup styled with plain CSS classes — there is no component abstraction, no props system, and no templating. If a Figma design implies a reusable component (e.g. "the button used in 3 places"), the correct translation here is a **CSS class reused on plain elements**, not a JS component — see `.hud`/`.brand`/`.specs` in `index.html:94-119` for the existing pattern.

## 3. Frameworks & libraries

- **UI framework:** none. Plain HTML + vanilla JS (`<script type="module">` and one plain `<script>`).
- **3D/graphics library:** [three.js](https://threejs.org) r0.184, loaded via a browser **import map**, not npm — `index.html:7-22`. Modules used: core `three`, `three/addons/controls/OrbitControls.js`, `three/addons/exporters/OBJExporter.js`, `three/addons/exporters/GLTFExporter.js`.
- **CDN + integrity:** all four map to pinned `unpkg.com` URLs with SHA-384 Subresource Integrity hashes (`index.html:9-21`). This exact map is mandated by the usage docs at the top of `three-d-stage.js` — **do not swap CDNs or drop the integrity block** when editing this file; a mismatched hash breaks module loading outright. (The only sanctioned exception found in this repo's history is a temporary jsdelivr-based copy built solely for previewing inside a sandboxed Artifact viewer that blocks `unpkg.com` — that copy is not part of the deployed site.)
- **Styling framework:** none — no Tailwind, no CSS-in-JS, no preprocessor (no Sass/Less/PostCSS).
- **Build system / bundler:** **none.** There is no `package.json`, no `node_modules`, no build step. The page is served as static files as-is (see `README.md`: `npx serve .` or `python3 -m http.server`). Any Figma-to-code output for this repo must be plain, runnable HTML/CSS/JS — no JSX, no TypeScript, no import of anything that isn't either a relative file or the pinned import map above.

## 4. Asset management

There are effectively **no static image/video/font asset files** in this repo — everything visual is generated at runtime:

- The die's geometry is procedural (`THREE.ExtrudeGeometry` over a hand-built rounded-square `THREE.Shape`, `index.html:164-189`) — not an imported model file (no glTF/OBJ import anywhere; the exporters in the import map are for *outbound* export only, via the stage's own "Download OBJ + MTL" / "Download GLB" toolbar buttons).
- All six face labels are textures drawn at runtime onto an offscreen `<canvas>` (`makeLabelTexture`, `index.html:193-279`) and uploaded as a `THREE.CanvasTexture` — there is no image file per label, and no sprite sheet.
- The environment reflection map is likewise a procedural gradient drawn to a small canvas and converted via `THREE.PMREMGenerator` (`makeEnvironmentTexture`, `index.html:333-375`) — not an HDRI file.
- The starfield, comets, nebula glow, and "planet" are all drawn with CSS gradients (`index.html:49-89`) and a 2D-canvas particle loop (`index.html:433-513`) — no PNG/SVG backgrounds.
- `project/.thumbnail` (a design-tool preview image from the original Claude Design export) was deliberately deleted during cleanup — it is gone, not just unreferenced.

**Implication for Figma imports:** if a Figma frame includes raster/vector image assets (icons, photos, illustrations), there is currently no established place to put them (no `/public`, `/assets`, or `/static` directory) and no optimization/CDN pipeline. The nearest precedent for "how this repo prefers to render simple flat graphics" is to draw them procedurally in CSS or canvas rather than importing a file, per every example above — follow that precedent unless the asset is genuinely photographic.

## 5. Icon system

There is no icon library (no Lucide/Heroicons/Font Awesome, no SVG sprite, no icon font). The entire icon vocabulary in this project is:

- One Unicode glyph, `↗`, used as a plain character inside canvas-drawn button-affordance text: `ctx.fillText('TAP TO OPEN ↗', ...)` (`index.html:273`).
- A CSS-drawn dot (a `div` with `border-radius: 50%` and a colored background/box-shadow) used as the brand mark (`.brand .dot`, `index.html:101-104`, markup at `index.html:135`) — this is the closest thing to a "logo mark," and it's shape-via-CSS, not an SVG file.

(Note: `styles/modernist-readme.md` documents "Use Lucide icons throughout" as a rule for the *unused* Modernist system — that convention was never carried over into the live page and should not be assumed to apply here.)

If a Figma design specifies icons, the two established precedents are: (a) a literal Unicode character where one exists and reads clearly at small size, or (b) a small inline shape built from CSS (as the brand dot does). Introducing an actual icon library/SVG set would be a new pattern for this repo, not an extension of an existing one.

## 6. Styling approach

- **Methodology:** plain CSS in a single `<style>` block in `<head>` (`index.html:24-125`). No CSS Modules, no styled-components, no BEM enforcement, no utility-class framework. Class names are short and semantic (`.brand`, `.specs`, `.hud`, `.nebula`, `.die-glow`, `.planet`).
- **Global styles:** `html, body` reset (`index.html:34-40`) sets box-sizing, zero margin, fixed height, and the base background/font/color from the tokens in §1a. `three-d-stage:not(:defined) { visibility: hidden; }` (`index.html:91`) prevents a flash of unstyled content before the custom element upgrades.
- **Layering discipline (important, and non-obvious):** every background/decorative layer (`.space`, `.nebula`, `#stars`, `.planet`, `.die-glow`) is `position: fixed` with **`z-index: 0`**, never negative. This is called out explicitly in a comment at `index.html:42-48`: a `position: fixed` element with a *negative* z-index paints **behind** the page's own promoted canvas background in every browser, so it silently never renders no matter how it's styled. The 3D stage sits at `z-index: 1` and the HUD at `z-index: 2` so normal (non-negative) stacking keeps the visible order correct. **Any new full-bleed decorative layer must follow this same z-index-0-or-above convention**, or it will invisibly fail exactly the way this repo's first draft did.
- **Responsive design:** a single `@media (max-width: 640px)` breakpoint (`index.html:121-124`) hides the `.specs` HUD panel and tightens the brand mark's corner offset. There is no fluid/container-query system and no tablet-specific breakpoint — this is a minimal, single-breakpoint adjustment, not a full responsive grid.
- **Interactive states:** hover/press states for the die's face labels are implemented by swapping a pre-rendered "hover" canvas texture for a "normal" one on the mesh material (`index.html:227-235` draws both variants; the swap happens in the `pointermove` handler at `index.html:402-416`) — this is **not** a CSS `:hover` state, because the target is a 3D mesh, not a DOM element. Cursor feedback (`canvasEl.style.cursor = hit ? 'pointer' : ''`) is applied imperatively via JS raycasting against the mesh, not a CSS selector.
- The `styles/modernist.css` file (unused, see §0/§1b) follows a completely different, much more conventional methodology: a token layer plus a component-class layer (`.btn`, `.card`, `.tag`, `.nav`, `.table`, `.dialog`, etc.), documented per-class in `styles/modernist-readme.md`. If that system is ever re-linked, follow its own documented rules rather than the live page's conventions above.

## 7. Project structure

Flat, non-nested static site — everything relevant lives at the repo root:

```
/
├── index.html              # the entire page: markup, CSS, and the die-building/interaction script
├── three-d-stage.js        # the <three-d-stage> custom element (3D viewer shell, reusable, currently used once)
├── styles/
│   ├── modernist.css       # unused legacy design system (tokens + component classes) — see §0
│   └── modernist-readme.md # usage guide for modernist.css
├── chats/                  # transcripts from the design sessions that produced this bundle (historical context only)
│   ├── chat1.md
│   └── chat2.md
└── README.md               # how to run the site, current file structure, current die state
```

There is no `src/`, no feature-folder pattern, no route-based organization — because there is exactly one page and one script. `chats/` is documentation/history, not code, and should not be treated as source when reasoning about current behavior; `README.md`'s "Current state" section and the live `index.html` are the sources of truth for what the page actually does today.

### Practical checklist for a Figma → code pass in this repo

1. Confirm which visual system the Figma frame targets (§0) — dark space theme (live) vs. Modernist (unused/reference only).
2. Pull colors from `index.html:25-33` (or `styles/modernist.css:4-42` if targeting Modernist) rather than inventing new hex values.
3. There's no component to scaffold — add markup + a CSS class directly in `index.html`, following the existing flat class-per-element pattern.
4. Any full-viewport decorative layer must be `position: fixed` with `z-index: 0` or higher (§6) — never negative.
5. Any icon need: prefer a Unicode glyph or a tiny CSS shape (§5) over introducing a new icon library, unless the design explicitly calls for one.
6. Any image/illustration need: check whether it can be procedural (CSS gradient or canvas draw, §4) before introducing a binary asset file, since there is no established asset pipeline yet.
7. Do not touch the `three-d-stage.js` import map versions/hashes or the pinned `unpkg.com` URLs in `index.html:7-22` as part of a styling change — they're unrelated to visual design and fragile to edit.
