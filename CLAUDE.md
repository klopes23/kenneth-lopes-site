# Project rules for Claude — kennethlopes.com

Read this before making changes. Conventions that exist outside the code.

## Workflow

- Cloudflare Workers Static Assets deploys from `main`. Every push to `main` ships.
- **Never merge to `main` without the user previewing first.** Open a PR, let Cloudflare build the preview, link the user to it, wait for explicit approval.
- New work goes on a short-lived branch named after the change (`fix/`, `feat/`, `revert/`).
- Commits use Conventional Commits (`feat:`, `fix:`, `revert:`). Include a "why" line in the body, not just a "what."

## Media-kit data-update rule (HARD RULE)

**Anytime you change any analytical number on `media-kit.html` — followers, view counts, audience splits, geo lists, watch-time metrics, brand collab numbers, anything sourced from creator analytics — you MUST also update `LAST_DATA_UPDATE` near line 1801 in the same edit.**

Single source of truth lives at:

```js
// media-kit.html
var LAST_DATA_UPDATE = 'MM/DD/YYYY';
```

It feeds every `[data-last-updated]` element on both mobile and desktop hero rows. Forgetting the bump means the page lies about freshness — treat this as part of the data edit, not an afterthought.

Format: `MM/DD/YYYY`. Use today's date in the user's timezone.

## Topnav

The 3-item topnav (`Home · Portfolio · Creator`) is the agreed structure. Don't add `Experience` or other items without the user asking — the user has explicitly rejected a 4-item nav. Experience page is reachable via the work-cta on portfolio.

Brand marks:
- Pro side (index, portfolio, experience, cs0X, deck): `K · L`
- Creator side (media-kit, desktop AND mobile km-topbar): `N · F`
- No `nav-pill` chips on any brand mark.

## Media-kit PDF print

The "Download media kit (PDF)" flow uses CSS `zoom: var(--print-zoom)` (default 0.82) on `.desktop-view` and `.print-bw-clone` to scale-to-fit one Letter page each. This is the robust mechanism — do NOT replace it with a brittle `max-height: Xin; overflow: hidden` cap, which silently chops content when sections grow.

When adding new top-level sections to media-kit:
- If the page now overflows one Letter sheet after the zoom, lower `--print-zoom` (e.g., 0.78). It lives near line 1565 in the `@media print` block.
- The `:nth-child(n+7)` cap on `.desktop-view > *` is a safety net (caps at 6 direct children).
- Keep brand-tier labels hidden in print (`.brand-tier__lab { display: none }`) — the colored caption strips already differentiate tiers.

Always download the PDF on phone + desktop after any media-kit section change to confirm one-page-color + one-page-grayscale still ships.

## Design system

- `tokens.css` is the source of truth for colors, typography, stat cards, image frames, and cross-page CTAs. Don't redefine these per-page.
- Palette is set via `<body data-palette="pro">` or `<body data-palette="creator">`.
- Mobile-specific overrides live in `mobile.css` (loaded after page styles). Specificity escalates with `html body[data-palette="…"]` if needed.
