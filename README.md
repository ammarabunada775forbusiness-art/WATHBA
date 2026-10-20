# WATHBA storefront

Arabic/English calisthenics catalog and Academy, with the original black/white storefront design and an editorial Academy. Orders are enquiries through WhatsApp.

## Project folders

| Folder | Contents |
|---|---|
| `public/` | Deployable website: generated HTML, images, fonts, CSS and browser JavaScript |
| `content/pages/ar/`, `content/pages/en/` | Restored bilingual storefront content from the pre-redesign version |
| `content/media/classic.json` | Six original editorial reference images, cached locally during build |
| `content/academy/ar/`, `content/academy/en/` | Academy article sources: title, description and main content |
| `content/products/education.js` | Bilingual product learning and selection copy |
| `scripts/` | Shared layouts, page builder, SEO publishing, checks and local preview |
| `tests/` | Browser interaction and responsive checks |
| `docs/` | Requirements status and domain/SEO launch instructions |
| `legacy/` | Archived code, excluded from the deployed website |

The deployment document root is **public**, so `public/products.html` is served at `/products.html`. Existing page URLs stay the same. Root-level documentation and build sources are not published.

## Build and preview

Use Node.js 20 or newer. The build and static checks use only Node's built-in modules. The first build downloads the six original reference images; subsequent builds reuse the local cache.

```sh
npm run build
npm run dev
```

Open `http://127.0.0.1:3000`. `PORT` can select another local port.

`npm run build` generates all pages and checks local links, assets, metadata, language pairs, a clean rebuild and domain-specific SEO in a temporary copy. `npm test` reruns those checks.

Vercel reads `vercel.json`: install production dependencies only, run `npm run build`, and publish `public/`. No production npm dependency or Node server is needed to serve the finished website. Other static hosts should also publish `public/`.

## Edit the site

- Catalog, category map and product image paths: `public/assets/js/products-data.js`.
- Product learning copy: `content/products/education.js`.
- Academy articles: `content/academy/{ar,en}/*.html`; the builder applies shared navigation, footer and metadata.
- Core page content: `content/pages/{ar,en}/*.html`. Storefront cards and product layouts: `scripts/classic-layout.js`. Shared shell: `scripts/site-layout.js`.
- Shared black/white palette, fonts and controls: `public/assets/css/shared-ui.css`. Original storefront layouts: `public/assets/css/classic.css`; static utilities: `public/assets/css/classic-utilities.css`. Academy layout: `public/assets/css/academy.css`.
- Navigation/cart: `public/assets/js/shared-ui.js`. Filters: `public/assets/js/products.js`. Product options: `public/assets/js/product-details.js`.
- Self-hosted fonts and licenses: `public/assets/fonts/`.

Run `npm run build` after edits. Do not edit generated `public/*.html`; rebuild them from the sources. They remain committed for direct inspection. `node scripts/build-product-pages.js` remains a compatibility command for page generation.

## Browser checks

```sh
npm ci
npx playwright install chromium
npm run test:browser
```

`WATHBA_BROWSER_PATH` can select an existing Chromium executable. These optional checks are separate from the production installation.

See [requirements and remaining work](docs/SITE-STATUS.md) and [domain/SEO launch instructions](docs/SEO-LAUNCH.md).
