# WATHBA – project memory for Claude

This file is read automatically at the start of every Claude Code session. Keep it current: at the end of each work session, update "Current status" and "Next steps" (ask the owner before changing it).

## Who and what
- WATHBA (وثبة) is the owner's own calisthenics brand: equipment, an Academy (training guides) and a bilingual website. Treat it as a real business, not an experiment.
- Arabic is the default language; every page has its own Arabic and English URL (`page.html` / `page-en.html`).
- Hosted on Vercel from this repo (`npm run build` → `dist/`). Preview URL so far: `wathba-rosy.vercel.app`; final domain not bought yet.

## How the owner wants to work
- Talk in a natural Jordanian/Palestinian Arabic dialect unless asked for English.
- Explain what a change does and why before making large changes; the owner likes to understand and approve. Small requested fixes can go ahead.
- Do not modify, restructure or replace files without explicit authorization. Preserve the existing design and working functionality.
- Never invent facts: prices, measurements, delivery, warranty, reviews or test results. If data is missing, say so and ask.
- Before creating project-memory files or similar setup in a repo, ask the owner first and remind them what will be created.

## Build and checks (Node 22+)
```sh
npm ci
npm run build   # regenerates product, category and Academy pages, assets, language links, JSON-LD
npm run check   # links, structured data, performance, accessibility, hero
node scripts/check-product-facts.js
node scripts/test-structured-data.js
```
- Generated files are committed so the site also works as plain static files. Two consecutive builds must produce identical HTML.
- Do NOT hand-edit generated `equipment-*.html`, category or Academy pages: edit the sources in `scripts/` (`product-training.js`, `product-education.js`, `academy-guides.js`, `jump-rope-content.js`, `page-translations.json`, `category-content.js`) and `assets/js/products-data.js`, then rebuild.
- Keep the `WATHBA_COPY` and `WATHBA_SLOT` comments in Arabic templates; the build depends on them.

## Fixed brand and product decisions (do not change casually)
- Homepage hero: Dheeb on the viewer's LEFT (black wristbands), Sakhr on the RIGHT (white wristbands, shoulder stretch). Same order in Arabic, English and mobile. Details and checksums in `HERO-CHARACTERS.md`.
- Accessory order: hand gripper, jump rope, grip tape, resistance bands.
- The Swiss ladder is Academy-only; its old product URLs redirect via `vercel.json`.
- Steel tube/pipe wall thickness is 2 mm (owner-confirmed 2026-10-21). Plates 6 mm, brackets 1.5 mm.
- Reference prices in `PRODUCT-DATA.md` are NOT approved store prices. Do not publish prices or `Offer` schema without the owner's confirmation.
- Delivery, warranty and returns are deliberately deferred; do not invent policies.

## Reference docs in this repo
`README.md`, `PRODUCT-DATA.md`, `PRODUCT-IMAGES.md`, `STRUCTURED-DATA.md`, `INTERNAL-LINKS.md`, `SEO-LAUNCH.md`, `PERFORMANCE.md`, `HERO-CHARACTERS.md`. Manufacturing source of truth: the `WATHBA-Manufacturing-Docs` repo (ignore its "دليل قديم غير منقح" folder).

## Current status (2026-11-11)
- Site is technically strong: 71 pages, bilingual, Academy, JSON-LD, Lighthouse-level performance, no JS errors.
- All 14 products still use temporary Unsplash photos labelled "صورة توضيحية مؤقتة".
- All products show "اسأل عن السعر" / "السعر حسب القياس".
- No domain yet, so no sitemap or canonical; `node scripts/publish-seo.js https://DOMAIN` does this once a domain exists.

## Next steps (from the 2026-11-10 review, none done yet)
1. Real product photos: replace `assets/images/products/<id>/1.webp`, `2.webp` (see `PRODUCT-IMAGES.md`).
2. Owner to confirm prices, at least "from X JOD" per product.
3. Mobile product pages: the H1 sits about 939px down, below breadcrumbs and nav buttons. Move image, name, price and order button to the top.
4. Desktop homepage: the floating WhatsApp bubble ("راسلنا") overlaps the hero buttons, and the third button is cut off at 1366×800.
5. On the Arabic homepage the big headline is English ("ENGINEERED FOR POWER"). Owner to decide whether Arabic should lead.
6. Before launch: buy the domain, run `publish-seo.js`, add short delivery info.
