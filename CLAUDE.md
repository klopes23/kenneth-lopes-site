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

## Design system

- `tokens.css` is the source of truth for colors, typography, stat cards, image frames, and cross-page CTAs. Don't redefine these per-page.
- Palette is set via `<body data-palette="pro">` or `<body data-palette="creator">`.
- Mobile-specific overrides live in `mobile.css` (loaded after page styles). Specificity escalates with `html body[data-palette="…"]` if needed.
