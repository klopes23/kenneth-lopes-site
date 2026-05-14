# Claude Code — Mobile Build Handoff

**Project:** kennethlopes.com mobile experience
**Author of this doc:** design pass · 2026-05
**Branch suggestion:** `mobile-v2`

## TL;DR — what to ship

The mobile site goes from "scrolling page version of desktop" to **app-feel native mobile**. Three big moves:

1. **Deck (`cases/deck.html`)** becomes a horizontal scroll-snap card stack — one slide per viewport, one bottom rail, sheet TOC. Replaces the three sticky chromes from v1.
2. **Site pages** (door, portfolio, case study, dashboard, media kit, experience) get mobile-first treatments matching the deck's chrome language. All share the same `mobile.css` + `mobile.js` shell.
3. **Charts:** Recharts is killed on the deck (inline SVG sparkline instead). Recharts stays on the standalone dashboard.

**Ground truth:** every screen has a pixel reference in `Mobile Site Overview.html` (design canvas, 13 phones) and the deck is live in `Mobile Deck Focus.html` (swipable). Open both before changing code.

**Pass criteria:**
- Recruiter opens `cases/deck.html` on iPhone 14. First frame is full-bleed headshot + name + swipe hint. Zero scroll required to grasp the cover.
- 7 slides flick L↔R with snap stop. Bottom rail visible at all times. Tap ☰ → sheet of slides.
- Tap `?solo` link → single-slide standalone view, with a "← Full deck" return.
- No console errors. Lighthouse mobile a11y ≥ 95.

---

## Files in this handoff

```
handoff/
├── CLAUDE_CODE_HANDOFF.md       ← you are here
├── mobile.css.additions          ← APPEND to existing mobile.css
├── mobile.js                     ← REPLACE existing mobile.js
├── manifest.json                 ← REPLACE existing manifest.json
├── deck-mobile.jsx               ← NEW · drop into cases/
└── deck-mobile-shared.jsx        ← NEW · drop into cases/
```

Reference prototypes (already in this project — keep for visual reference, don't ship):
```
proto/
├── mobile-shared.jsx             ← same as handoff/deck-mobile-shared.jsx with proto asset paths
├── deck-mobile.jsx               ← same as handoff/deck-mobile.jsx with proto asset paths
├── screen-door.jsx               ← reference for index.html mobile
├── screen-portfolio.jsx          ← reference for portfolio.html mobile
├── screen-case.jsx               ← reference for cs0X-*.html mobile
├── screen-dashboard.jsx          ← reference for cs03-dashboard.html mobile
├── screen-mediakit.jsx           ← reference for media-kit.html mobile
└── screen-experience.jsx         ← reference for experience.html mobile

Mobile Site Overview.html         ← open this first
Mobile Deck Focus.html            ← swipe through to feel the deck
```

> **About the `screen-*.jsx` files:** they're React prototypes showing the target visual language. You are **not** asked to convert the site pages to React. You're asked to translate the visual language into the existing HTML/CSS site files using `mobile.css` overrides. The prototype is the spec; the implementation is plain CSS additions plus the patches below.

---

## 1 · Deck migration (`cases/deck.html`) — primary work

The deck is React-in-Babel already. We add a mobile branch that runs at `(max-width: 768px)` and renders the new horizontal card stack. Desktop stays untouched.

### 1a. Body marker

```html
<body data-deck="true">
```

This single attribute drives both the new CSS scopes and the `mobile.js` sheet swap.

### 1b. Load the mobile component files

In `cases/deck.html`, after the existing React/Babel/Recharts script tags but **before** the existing inline `<script type="text/babel">` deck implementation, add:

```html
<script type="text/babel" src="./deck-mobile-shared.jsx"></script>
<script type="text/babel" src="./deck-mobile.jsx"></script>
```

(Place both files in `cases/` alongside `deck.html`.)

### 1c. Branch on viewport at render time

Find the existing render call near the end of `cases/deck.html`:

```jsx
createRoot(document.getElementById('root')).render(<DeckShell />);
```

Replace with:

```jsx
const isMobile = window.matchMedia('(max-width: 768px)').matches;
createRoot(document.getElementById('root')).render(
  isMobile ? <DeckMobile /> : <DeckShell />
);
```

(`DeckMobile` is exposed on `window` by `deck-mobile.jsx`.)

### 1d. Solo-slide deep link

`#/2?solo` should render slide 3 standalone. Inside `DeckMobile` (already in `deck-mobile.jsx`), add a `useEffect` that reads the hash on mount:

```js
useEffect(() => {
  const m = window.location.hash.match(/^#\/(\d+)(\?solo)?$/);
  if (!m) return;
  const idx = Math.min(Math.max(parseInt(m[1]), 0), DECK_SLIDES.length - 1);
  if (m[2]) setSolo(true);
  setTimeout(() => go(idx), 50);
}, []);
```

In the render, when `solo === true`, render only the current slide (no horizontal track) and a "← Full deck" button:

```jsx
if (solo) {
  const Slide = SLIDE_COMPONENTS[current];
  return (
    <div style={{ position: 'relative', height: '100%', background: MS_C.bg }}>
      <Slide slide={DECK_SLIDES[current]} total={DECK_SLIDES.length} />
      <a href={`#/${current}`} onClick={() => setSolo(false)} className="deck-solo-back">
        ← Full deck
      </a>
    </div>
  );
}
```

CSS for `.deck-solo-back` (add to `cases/deck.html` mobile block):

```css
.deck-solo-back {
  position: fixed; left: 14px; bottom: calc(14px + env(safe-area-inset-bottom));
  z-index: 250; padding: 10px 18px; border-radius: 999px;
  background: #1B2A1B; color: #F2EBDA;
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600;
  text-decoration: none; box-shadow: 0 8px 24px rgba(0,0,0,0.18);
}
```

### 1e. Share button (per-slide URL copy)

In `Rail`'s `onShare` handler (currently a placeholder toast in the prototype), do the real copy:

```js
const share = async () => {
  const url = `${location.origin}${location.pathname}#/${current}?solo`;
  try {
    await navigator.clipboard.writeText(url);
    setToast(`Slide ${current + 1} link copied`);
  } catch {
    setToast('Copy failed — long-press URL bar');
  }
  setTimeout(() => setToast(''), 1800);
};
```

### 1f. Speaker-notes / parent postMessage

Already wired in `DeckMobile` — `useEffect` posts `{slideIndexChanged: current}` to `window.parent` on every change. If this deck is embedded anywhere with speaker-notes infrastructure, it Just Works.

### 1g. Detail reveals are inline

Slides 2 (Multi-Site) and 3 (RAG) demonstrate the `<DetailReveal>` pattern. To add a detail block to any other slide, wrap supporting content:

```jsx
<DetailReveal accent={MS_C.accent} label="↓ See dashboard detail">
  <YourSupportingContent />
</DetailReveal>
```

---

## 2 · Site shell (`mobile.css` + `mobile.js`) — shared work

### 2a. `mobile.css`

Open `mobile.css`. Inside the existing `@media (max-width: 768px) { … }` block, **append** the contents of `handoff/mobile.css.additions`.

### 2b. `mobile.js`

**Replace** the entire file with `handoff/mobile.js`. The new version is a strict superset of the old: same sheet pattern, same edge-swipe-back, same idempotency guard. New behavior: when `<body data-deck="true">` is present, the sheet shows the 7 slide list instead of the site nav.

### 2c. `manifest.json`

Replace with `handoff/manifest.json`. Adds `theme_color: #1B2A1B` and a maskable icon entry. **You'll need to generate three icon PNGs**:

- `/assets/icon-192.png` — 192×192, full bleed `#1B2A1B` background, white "K·L" centered in Fraunces 600
- `/assets/icon-512.png` — 512×512, same composition scaled up
- `/assets/icon-512-maskable.png` — 512×512, same but with the K·L sized to fit inside a 410×410 safe zone (centered)

Use any tooling (Figma, Sketch, ImageMagick). The brief is: dark forest bg, cream "K·L" wordmark.

---

## 3 · Per-page changes

For each page below, the recipe is the same: add `<body data-deck="true">` is **deck-only**. Other pages get the mobile shell upgrade for free via `mobile.css` + `mobile.js`. The patches below cover anything page-specific.

### 3a. `index.html` (Door)

The current mobile rule (`@media (max-width: 680px)`) stacks the two doors. **Reference:** `proto/screen-door.jsx`.

Patch the existing mobile rule:

```css
@media (max-width: 768px) {  /* unify breakpoint with mobile.css */
  .cards-area { padding: 18px; gap: 22px; }
  .door-wrap { height: 60vw; min-height: 240px; }
  .door-wrap--creator::before { transform: translate(0, var(--shadow)); }
  /* shadow blocks become offset same-direction stacks on mobile so they don't fight each other */
  .door-wrap--pro::before { transform: translate(8px, 8px); }
  .door-wrap--creator::before { transform: translate(-8px, 8px); }

  /* Tighten footer — site-footer was 3-col, becomes 1-col centered */
  .site-footer { grid-template-columns: 1fr; gap: 8px; text-align: center; }
  .footer-email, .footer-location { text-align: center; }
}
```

### 3b. `portfolio.html`

**Reference:** `proto/screen-portfolio.jsx`.

The hero photo currently rotates `-0.8deg` on desktop. **Mobile.css.additions already cancels the rotation and tightens the shadow offset.** Beyond that:

```css
@media (max-width: 768px) {
  /* Hero name: bump down a hair so it doesn't fight the photo */
  .hero-name, .hero-name-italic { font-size: clamp(58px, 16vw, 78px) !important; line-height: 0.9 !important; }
  /* Hero grid was 2-col on desktop — stack it */
  .hero-inner { grid-template-columns: 1fr !important; gap: 40px !important; }
  /* CS cards: bring the title and stat onto the same baseline */
  .cs-caption-row { flex-wrap: wrap; gap: 8px !important; }
}
```

### 3c. `cs0[1-5]-*.html` (Long-form case study template)

**Reference:** `proto/screen-case.jsx`.

The case studies share a template. Mobile additions:

```css
@media (max-width: 768px) {
  /* Hero stat tiles: 4-up → 2x2 */
  .cs-stats-inner { grid-template-columns: 1fr 1fr !important; gap: 1px !important; background: var(--line) !important; }
  .cs-stat-cell { padding: 18px 16px !important; background: var(--bg); }
  .cs-stat-num { font-size: clamp(28px, 8vw, 38px) !important; }

  /* Page titlebar (sticky back + meta) — see .page-titlebar in mobile.css.additions */
  /* Add this HTML to each cs0X file under the topnav: */
  /* <div class="page-titlebar"><a class="back" href="../portfolio.html#work">← Portfolio</a><span class="meta">CS / 0N</span></div> */

  /* Foot-nav: prev/next stacks */
  .foot-nav { grid-template-columns: 1fr !important; }
}
```

### 3d. `cs03-dashboard.html` (Live dashboard)

**Reference:** `proto/screen-dashboard.jsx`.

Keep Recharts here. The mobile treatment trades the desktop 2-col grid for a stack with a hero "WAU = 41" metric and tighter Recharts.

```css
@media (max-width: 768px) {
  .dash-grid { grid-template-columns: 1fr !important; gap: 18px !important; }
  .dash-hero { padding: 22px !important; }
  .dash-hero .num { font-size: clamp(48px, 13vw, 64px) !important; }
  /* Recharts wrappers: cap height so they don't dominate the fold */
  .dash-chart { height: 220px !important; }
  .recharts-cartesian-axis-tick text { font-size: 9.5px !important; }
  /* Filter chips: horizontal scroll-snap */
  .dash-filters {
    display: flex; gap: 8px; overflow-x: auto;
    padding: 0 var(--m-pad); margin-left: calc(-1 * var(--m-pad)); margin-right: calc(-1 * var(--m-pad));
    scrollbar-width: none;
  }
  .dash-filters::-webkit-scrollbar { display: none; }
}
```

### 3e. `media-kit.html`

**Reference:** `proto/screen-mediakit.jsx`.

The existing `Nesi Family Media Kit Mobile.html` already has a strong mobile treatment — reuse those patterns. Net-new mobile additions for the canonical `media-kit.html`:

```css
@media (max-width: 768px) {
  /* Platform stat cards: horizontal swipe instead of 5-up grid */
  .platform-grid {
    display: flex !important; gap: 8px;
    overflow-x: auto; scroll-snap-type: x mandatory;
    padding: 0 var(--m-pad);
    margin-left: calc(-1 * var(--m-pad)); margin-right: calc(-1 * var(--m-pad));
    scrollbar-width: none;
  }
  .platform-grid::-webkit-scrollbar { display: none; }
  .platform-card { flex: 0 0 50%; aspect-ratio: 4/5; scroll-snap-align: start; }

  /* Pillars: 3-col → 1-col rows with thumb left + text right */
  .pillars { grid-template-columns: 1fr !important; }
  .pillar { grid-template-columns: 110px 1fr !important; padding: 14px !important; }
}
```

### 3f. `experience.html`

**Reference:** `proto/screen-experience.jsx`.

Adds the timeline rail + accent dot per role.

```css
@media (max-width: 768px) {
  .role { padding-left: 56px !important; }
  .role::before {  /* rail */
    content: ''; position: absolute; left: 32px; top: 0; bottom: 0;
    width: 1px; background: var(--line);
  }
  .role::after {  /* dot */
    content: ''; position: absolute; left: 26px; top: 28px;
    width: 13px; height: 13px; border-radius: 50%;
    background: var(--accent, #C76F3D);
    border: 3px solid var(--bg);
    box-shadow: 0 0 0 1px var(--line);
  }
  .role:last-child::before { display: none; }

  /* Skill chips wrap at 8px gap */
  .skill-chips { gap: 8px; }
}
```

---

## 4 · Ship order (one PR each)

1. **PR 1 — Foundation** · `mobile.css.additions` → append to `mobile.css`. Replace `mobile.js`. Replace `manifest.json` + add 3 icon PNGs. Verify nothing breaks at desktop.
2. **PR 2 — Deck scaffolding** · `<body data-deck="true">` + the two new script tags + the `isMobile` branch. Render still uses `DeckShell` for now (mobile renders blank — that's fine, you'll see the fallback). Verify desktop deck unchanged.
3. **PR 3 — Deck mobile slides** · Drop in `deck-mobile.jsx` + `deck-mobile-shared.jsx`. Flip mobile branch to `<DeckMobile />`. Smoke test all 7 slides on a real phone.
4. **PR 4 — Solo + share** · Hash routing, clipboard.
5. **PR 5 — Per-page polish** · Each page's CSS patch. Each can ship independently; they don't depend on each other.
6. **PR 6 — PWA polish** · Splash screen color metadata, OG image audit, `theme-color` per page if needed.

---

## 5 · Smoke test checklist (per PR 3)

On a real device (or Chrome DevTools iPhone 14 Pro emulation):

- [ ] **Cover slide:** full-bleed headshot, name 60+ px Fraunces, swipe hint visible, 4 stat chips horizontally scrollable
- [ ] **Swipe L/R** works on every slide; snap-stop prevents over-scroll
- [ ] **Dots in rail** update on every slide change
- [ ] **Hamburger → sheet** opens, lists 7 slides, tap navigates, swipe-down dismisses
- [ ] **Share button** copies `…#/N?solo` to clipboard, toast confirms
- [ ] **Solo URL** (`…#/3?solo`) opens that one slide standalone with "← Full deck" CTA
- [ ] **Slide 2 (Multi-Site)** and **Slide 3 (RAG)** "↓ See detail" expands smoothly
- [ ] **Slide 7 (Creator)** angle toggle (PM / Platform / Data) updates kicker, headline, bullets
- [ ] **CEC slide (5/7)** photo carousel scroll-snaps through 4 PoCs
- [ ] **No console errors**
- [ ] **Lighthouse mobile a11y ≥ 95**, performance ≥ 80

---

## 6 · What's intentionally NOT in this build

Documented so future-you doesn't wonder where they went:

- **Stories-style auto-progress** (5s per slide) — recruiters skim at their own pace; auto-advance is hostile.
- **Pinch-to-overview gesture** — non-discoverable, weight not worth the code.
- **Haptic feedback** — Safari support is patchy; cost vs. delight is bad.
- **Service worker / offline cache** — the recruiter use case (open once, swipe through) doesn't need it. Add it if you start updating the deck weekly.
- **Per-slide thumbnails in the TOC sheet** — your existing text-list sheet matches the site aesthetic; thumbnails would feel like a different product.

---

## 7 · Desktop notes (propose-separately)

A few things I'd suggest revisiting on desktop, separately from this mobile build:

1. **Slide 3 (RAG) Recharts**: the WAU area chart has 24 weeks crammed into a 340px wide pane. Consider monthly grouping or a sparkline + drilldown.
2. **Slide 6 (Mexico) layout**: the right column has 3 stacked metric cards that visually compete with the bottom-emphasized highlight card. Demoting two of them to chip-stats would let the 11% conversion be the hero.
3. **Slide 7 (Creator) Snapchat phone**: the cream-yellow phone reads as a typo against the cream page bg. Either invert (dark bg, yellow accent) or pin to forest.

These are not blockers for this mobile build.

---

## 8 · Open questions for you

1. Solo-slide URLs (`?solo`) — should they be **canonical** (used in social shares) or just an in-product affordance? If canonical, generate per-slide OG images.
2. Should `?solo` change the page title? E.g. `Slide 3 · RAG + HITL — Kenneth Lopes`. Yes, probably.
3. Should the rail show an "Email" CTA for the recruiter when they reach slide 7? Low cost, high signal.

Default plan unless you say otherwise: `?solo` is in-product only (no OG variants), page title doesn't change, no email CTA on rail (keeps the deck pure).
