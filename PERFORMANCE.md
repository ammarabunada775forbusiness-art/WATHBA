# Performance and mobile experience

Stage 10 removes the Tailwind Play CDN from all 71 HTML files (70 indexable pages and the legacy product entry). Tailwind 3.4 is compiled with the existing theme, forms and container-query plugins. Only detected utilities are emitted; the three handwritten stylesheets are purged conservatively and minified. Menu/cart/gallery interaction classes are retained. Readable source CSS/JS remains editable; pages request the generated `.min` files. Classic scripts are deferred in dependency order and retain their shared global bindings.

## Build and checks

Use Node 22 or newer:

```sh
npm ci
npm run build
npm run check
node scripts/check-product-facts.js
node scripts/test-structured-data.js
```

`npm run build` regenerates products, category and Academy pages, editorial attribution, production assets, language links and JSON-LD. The output is committed so the site also works as plain static files. Vercel builds from the lockfile. Two consecutive builds must produce identical HTML. The browser uses the same product markup as the initial HTML to reduce hydration-related shifts. Initial content is visible without waiting for JavaScript.

## Images and fonts

Six previously remote page images are served locally as WebP: **2,049,682 bytes of source images became 85,644 bytes** at up to 1440px. This is a file-size comparison, not a Lighthouse score or total page-transfer claim. Product originals are preserved, including temporary-photo provenance. Content-addressed 480/960px derivatives are shared between identical images. All rendered images have intrinsic dimensions; above-the-fold priority imagery remains eager, other images are lazy. Responsive candidates are used in static HTML and runtime galleries/cards. A source hash prevents old responsive derivatives from being attached to a newly uploaded original.

Fonts are hosted locally: Anton Latin, Be Vietnam Pro Latin at 400/500/700 and a 44-icon Material Symbols subset (5,512 bytes). Font licenses are in `assets/fonts/`. Text fonts use `font-display: optional`; the Arabic system-font fallback is preserved. Essential icons and Anton are preloaded. Asset responses use a one-hour public cache with stale-while-revalidate; existing content versions refresh CSS, JS and product images.

Optional asset refresh (Python 3, Pillow for images; network required for source assets/fonts):

```sh
python3 scripts/prepare-performance-images.py
python3 scripts/prepare-performance-fonts.py
npm run build
```

Original source URLs and local geometry are recorded in `scripts/site-images.json`; responsive source hashes/candidates in `scripts/responsive-images.json`; the icon inventory in `scripts/font-icons.json`. These refresh commands are separate from the offline build. The local images remain illustrations where previously labeled temporary; optimization does not establish that they are photographs of WATHBA's actual manufactured equipment.

## Measurements and limits

The self-hosted official `web-vitals` package observes CLS, LCP and INP for the current visit. Results are exposed as `window.WATHBA_VITALS` for local diagnostics only: no requests, identifiers, cookies, storage or analytics collection. INP needs real interactions; a null value is not a passing score. Visit-level measurements are not the 28-day, 75th-percentile field assessment used by CrUX/Search Console.

The unauthenticated PageSpeed Insights API returned HTTP 429 during this work, so it did not provide a trustworthy before/after Lighthouse score. Mobile-width browser testing is not a physical-phone test. Record observed visit metrics separately from field data and do not claim a Core Web Vitals pass without the latter.

Official references:
- https://v3.tailwindcss.com/docs/content-configuration
- https://developers.google.com/fonts/docs/material_symbols
- https://web.dev/articles/vitals
- https://web.dev/articles/inp

## Editorial attribution (limited stage 9 scope)

Academy and equipment guides identify WATHBA Academy as preparer and WATHBA as the responsible editorial organization, link existing guide sources, and explicitly state that no named specialist reviewer is documented. Unsubstantiated review dates are removed. No named author, specialist credential or reviewer is invented, and no `reviewedBy` schema is emitted. The other commercial/legal pages from stage 9 were excluded at the owner's request.
