# WATHBA – project memory for Claude

This file is read automatically at the start of every Claude Code session in this repository. Keep it current: at the end of each work session, update "Current status" and "Next steps". This repository is public, so keep business plans, prices that are not yet published and other sensitive details out of it.

## Who and what
- WATHBA (وثبة) is the owner's own calisthenics brand: an equipment store and training academy website, Arabic by default with English twin pages. Treat it as a real business.
- Dheeb (ذيب) and Sakhr (صخر) are the brand characters. Their identity rules live in the public repo `ammartheeb/wathba-manufacturing-docs` (character reference version 2.1), together with manufacturing guides and YouTube production plans.
- HIJAZI Apartments is a separate business with its own repo (`ammartheeb/hijazi-apartments`); never mix the two.

## How the owner wants to work
- Talk in a natural Jordanian/Palestinian Arabic dialect unless asked for English.
- Commit straight to `main` and push; no pull requests. Commit as the owner and add no Claude or co-author lines:
  `git -c user.name="عمار ذيب" -c user.email="ammarabunada775forbusiness@gmail.com" commit ...`
- Pushing to `main` deploys the live site on Vercel immediately, so run the build and the checks before every push.
- Install tools, skills and MCP servers at the user level, never inside this repo, unless asked.
- Ask before creating project-memory or setup files in a repo.
- Never invent facts (prices, specifications, distances, reviews). Keep the brand look: dark background, white, Anton headings.
- Explain trade-offs briefly and give a clear recommendation; prefer simple solutions.

## Layout (details in README.md)
- `site/`: the published website (all pages, `assets/`, `robots.txt`). URLs are the file names at the site root.
- `content/`: texts and data the pages are built from; most edits happen here.
- `scripts/build/` build steps, `scripts/checks/` quality checks, `scripts/data/` generated registries, `scripts/tools/` optional manual tools.
- `docs/`: documentation (index in `docs/README.md`). `legacy/`: unused old files.
- Generated, never edit by hand: English core pages, `equipment-*.html`, `category-*.html`, the six generated academy guides, `*.min.*`, `production.css`, `web-vitals.js`. Keep the `WATHBA_COPY` and `WATHBA_SLOT` markers in the Arabic templates.

## Build and checks
- Node 22: `npm ci`, `npm run build`, `npm run check`. Extra checks: `node scripts/checks/check-product-facts.js` and `node scripts/checks/test-structured-data.js`.
- The build writes the pages in `site/` and packages `dist/` (gitignored); Vercel serves `dist/`.
- When moving or renaming build files, compare `dist/` before and after; it should match byte for byte.

## Characters on the homepage
- Follow reference 2.1: no glow behind or around the characters, Dheeb on the viewer's left, Sakhr on the right in every language and on mobile, never redraw, mirror or retouch the art.
- The hero uses glow-free copies (`*-noglow-*.webp`) derived by `scripts/tools/remove-character-glow.py` (Python with NumPy, SciPy, Pillow); every ink pixel keeps its exact value.
- `site/assets/js/home-hero.js`: each character has its own WebGL canvas and a small 2D skeleton. One calm idle motion only (breathing heave, slow sway, head drift that follows the pointer); the owner rejected rotating moves as too busy. Feet never move. Tests in `scripts/checks/check-hero.js`; details in `docs/HERO-CHARACTERS.md`.
- The pause control is invisible unless reached with the keyboard (the owner asked to hide it; keyboard access keeps it accessible).

## Scroll reveal
- "WATHBA SCROLL REVEAL" at the end of `site/assets/js/shared-ui.js` and `site/assets/css/shared-ui.css`, classes `wathba-sr-*`. An older reveal was disabled because it left content hidden on some devices; this one must never hide content that is on screen, without JavaScript or with reduced motion. Test phone and desktop after any change.

## Current status (2026-11-11)
- Hero: Dheeb and Sakhr separated, glow removed, rigged animation reduced to one calm idle motion with a head that follows the visitor; pause control hidden.
- Scroll reveal added across the site; the owner is evaluating whether to keep it.
- Repository reorganized into `site/`, `content/`, `scripts/*`, `docs/`; build output verified identical and the live deploy confirmed.
- Character reference 2.1 (no glow) committed in the manufacturing docs repo.
- Tried and reverted: a bento redesign of the "THE WATHBA STANDARD" section (the owner disliked it).
- A first trial YouTube Short was rendered outside the repo to show the video workflow.

## Next steps
1. "THE WATHBA STANDARD" section: the `fitbit` icon shows as the word FITBIT instead of an icon (it does not resolve in the self-hosted icon font). Swap it for an icon that renders, once the owner agrees.
2. English copy for `index-033` and `index-037` in `content/page-translations.json` does not match the Arabic meaning; confirm wording with the owner.
3. Owner decides whether to keep the scroll reveal.
4. YouTube channel (@WATHBA-Calisthenics): the owner records the voice; new poses follow reference 2.1 without glow; build a repeatable video pipeline once the trial style is approved.
5. Domain launch: follow `docs/SEO-LAUNCH.md` (publish the sitemap with the final domain, Search Console). Real product photos, confirmed specifications and prices are still pending (`docs/PRODUCT-DATA.md`).
