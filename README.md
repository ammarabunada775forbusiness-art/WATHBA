# WATHBA storefront

Static Arabic/English calisthenics catalog and Academy. The Academy defines the shared visual system. WhatsApp handles order enquiries; there is no backend or online payment.

## Build and check

```sh
node scripts/build-site.js
python3 scripts/check-site.py
```

For browser checks, install the development dependency and Playwright Chromium, then run:

```sh
npm ci
npx playwright install chromium
npm run test:browser
```

`WATHBA_BROWSER_PATH` can point the browser checks to an existing Chromium executable. Deploy the generated HTML and `assets/`; no production Node process or npm dependency is required.

## Edit

- Catalog and category map: `assets/js/products-data.js`.
- Product learning copy: `scripts/product-education.js`.
- Core page copy/layouts: `scripts/build-site.js` and `scripts/site-layout.js`.
- Existing Academy articles: edit the article body in `academy*.html`; the builder preserves it and applies the shared shell.
- Colors, fonts and shared controls: `assets/css/shared-ui.css`. Page layouts: `assets/css/site.css`. Academy editorial layouts: `assets/css/academy.css`.
- Shared navigation/cart: `assets/js/shared-ui.js`. Filters: `assets/js/products.js`. Product options: `assets/js/product-details.js`.
- Fonts are self-hosted WOFF2 files with their OFL licenses in `assets/fonts/`.

Run the builder after edits. `scripts/build-product-pages.js` remains a compatibility command for the same build. The `legacy/` directory is retained and is not loaded by current pages.

See `SITE-STATUS.md` for the requirements map and `SEO-LAUNCH.md` for domain launch steps.
