#!/usr/bin/env node
// Regenerate product HTML from the catalog and reviewed editorial copy.
// Run from the repo root: node scripts/build-product-pages.js
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const root = path.resolve(__dirname, "..");
// Generated production pages are also the retained source shells. Normalize asset tags first.
for (const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))) {
  const p=path.join(root,file);
  fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/(assets\/(?:css|js)\/[a-z0-9-]+)\.min\.(css|js)/g,'$1.$2').replace(/<script\s+defer\s+src=/g,'<script src='));
}
const launchOrigin = fs.readFileSync(path.join(root, 'index.html'), 'utf8').match(/rel="canonical" href="(https:\/\/[^/]+)/)?.[1];
const sharedAssets = ['css', 'js'].flatMap(folder => fs.readdirSync(path.join(root, 'assets', folder)).filter(name => /\.(css|js)$/.test(name)).sort().map(name => `assets/${folder}/${name}`));
const sharedAssetPattern = /(assets\/(?:css|js)\/[a-z0-9-]+(?:\.min)?\.(?:css|js))(?:\?v=[^"'\s<>]*)?/g;
const unversion = (page) => page.replace(sharedAssetPattern, "$1");
const template = unversion(fs.readFileSync(path.join(root, "product.html"), "utf8"));
require('./product-images.js').updateImageCatalog({quiet: true});
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/products-data.js"), "utf8"), context);
const catalog = vm.runInContext("products", context);
const education = require("./product-education.js");
const renderTraining = require('./render-product-training.js');
const renderFacts = require('./render-product-facts.js');

function html(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function replaceOnce(page, oldText, replacement) {
  if (!page.includes(oldText) || page.indexOf(oldText) !== page.lastIndexOf(oldText)) {
    throw new Error(`Expected one match in template: ${oldText.slice(0, 65)}`);
  }
  return page.replace(oldText, replacement);
}

function urlFor(productId, lang) {
  return `equipment-${productId}${lang === "en" ? "-en" : ""}.html`;
}

function academyFor(productId, lang) {
  return vm.runInContext(`getAcademyGuide(${JSON.stringify(productId)}, ${JSON.stringify(lang)})`, context);
}

function productPage(product, lang) {
  const entry = education[product.id]?.[lang];
  if (!entry || entry.levels?.length !== 3) throw new Error(`Missing education: ${product.id}/${lang}`);
  const isAr = lang === "ar";
  const labels = isAr ? {
    home: "الرئيسية", products: "المنتجات", category: "معدات الكاليستنكس في الأردن",
    sizes: "الخيارات المذكورة في القائمة", price: "اسأل عن السعر والقياسات",
    buy: "اسأل وثبة عن هذه المعدّة", guide: "اقرأ دليل التدريب المرتبط بها",
    other: "شاهد جميع المعدات", switch: "Read in English",
    use: "كيف تستخدم هذه المعدّة؟", levels: "تمارين تناسب مستويات مختلفة",
    choose: "ما الذي تفحصه قبل الاختيار؟", faq: "سؤال شائع",
    note: "تختلف تفاصيل التصنيع والتركيب حسب القطعة والموقع؛ تأكد من المواصفات مع وثبة قبل الطلب."
  } : {
    home: "Home", products: "Equipment", category: "Calisthenics equipment in Jordan",
    sizes: "Catalog options", price: "Ask for price and dimensions",
    buy: "Ask WATHBA about this equipment", guide: "Read the related training guide",
    other: "Browse all equipment", switch: "اقرأ بالعربية",
    use: "How can you use this equipment?", levels: "Training at different levels",
    choose: "What should you check before choosing?", faq: "Common question",
    note: "Build and installation details depend on the actual item and location. Confirm specifications with WATHBA before ordering."
  };
  const name = product.name[lang];
  const title = isAr
    ? `${name} | معدات الكاليستنكس في الأردن – وثبة`
    : `${name} | Calisthenics Equipment in Jordan – WATHBA`;
  const description = entry.intent;
  const question = isAr
    ? `مرحبًا وثبة، أريد تفاصيل ${name} والقياسات المتاحة وطريقة التركيب والسعر.`
    : `Hi WATHBA, please share the available sizes, installation details and price for ${name}.`;
  const whatsApp = `https://wa.me/962791752349?text=${encodeURIComponent(question)}`;
  const opposite = isAr ? "en" : "ar";
  const staticHero = `<section class="wathba-product-static"><div class="wathba-product-wrap">
    <nav class="wathba-product-crumb" aria-label="Breadcrumb"><a href="index.html">${labels.home}</a><span>/</span><a href="products.html">${labels.products}</a><span>/</span>${html(name)}</nav>
    <div class="wathba-static-panel"><div class="wathba-static-art"><img src="${html(product.image)}" alt="${html(product.images[0]?.temporary ? (isAr ? 'صورة تدريب توضيحية مؤقتة' : 'Temporary illustrative training photo') : name)}" width="${product.images[0]?.width || 1200}" height="${product.images[0]?.height || 900}" loading="eager" decoding="async" fetchpriority="high">${product.images[0]?.temporary ? `<span class="wathba-temporary-image">${isAr ? 'صورة توضيحية مؤقتة' : 'Temporary sample photo'}</span>` : ''}</div>
    <div><span class="wathba-static-category">${html(product.category[lang])} · ${labels.category}</span><h1>${html(name)}</h1><p>${html(product.description[lang])}</p>
    <div class="wathba-static-options"><strong>${labels.sizes}</strong><ul>${product.variants.map((v, index) => `<li><a href="${urlFor(product.id, lang)}?variant=${index}">${html(v[lang])}</a>${typeof v.price === 'number' && Number.isFinite(v.price) && v.price > 0 ? ` — ${v.price} JOD` : ''}</li>`).join("")}</ul><p>${html(vm.runInContext(`getProductPriceText(products.find(p => p.id === ${JSON.stringify(product.id)}), ${JSON.stringify(lang)})`, context))}</p></div>
    <div class="wathba-static-actions"><a href="${html(whatsApp)}">${labels.buy}</a><a href="${html(academyFor(product.id, lang))}">${labels.guide}</a></div></div></div>
  </div></section>`;
  const editorial = renderTraining(product, lang, catalog, academyFor(product.id, lang));
  let page = template;
  page = replaceOnce(page, '<html class="dark" lang="ar" dir="rtl">', `<html class="dark" lang="${lang}" dir="${isAr ? "rtl" : "ltr"}">`);
  page = replaceOnce(page, "<title>معدات الكاليستنكس | وثبة الأردن</title>", `<title>${html(title)}</title>`);
  page = replaceOnce(page, '<meta name="description" content="تعرّف على معدات الكاليستنكس من وثبة في الأردن، وعلى الاستخدام والتمارين المناسبة لكل قطعة." />',
    `<meta name="description" content="${html(description)}" />\n    <meta property="og:type" content="product" />\n    <meta property="og:title" content="${html(title)}" />\n    <meta property="og:description" content="${html(description)}" />`);
  page = replaceOnce(page, '    <meta name="robots" content="noindex,follow" />\n', '');
  page = replaceOnce(page, 'var lang = localStorage.getItem("wathbaLang") || "ar";',
    `var lang = "${lang}";\n            localStorage.setItem("wathbaLang", lang);`);
  page = replaceOnce(page, '<link rel="stylesheet" href="assets/css/academy.css" />',
    '<link rel="stylesheet" href="assets/css/academy.css" />\n    <link rel="stylesheet" href="assets/css/product-seo.css" />');
  page = replaceOnce(page, '<body class="bg-background text-on-surface font-body-md selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">',
    `<body class="bg-background text-on-surface font-body-md selection:bg-tertiary-fixed selection:text-on-tertiary-fixed" data-wathba-product-id="${product.id}" data-product-page-lang="${lang}">`);
  page = replaceOnce(page, '<section id="productDetailsRoot"></section>',
    `<section id="productDetailsRoot">${require('./render-product-shell.js')(root,product.id,lang)}</section>\n        ${renderFacts(product, lang)}\n        ${editorial}`);
  page = replaceOnce(page, '<script src="assets/js/shared-ui.js"></script>',
    '<script src="assets/js/product-language.js"></script>\n    <script src="assets/js/shared-ui.js"></script>');
  page = replaceOnce(page, '    <script src="assets/js/product-legacy-redirect.js"></script>\n', '');
  if (!isAr) page = replaceOnce(page, 'href="academy.html">Academy</a>', 'href="academy-en.html">Academy</a>');
  return page;
}

if (catalog.length !== 14 || Object.keys(education).length !== catalog.length) {
  throw new Error("Catalog/editorial entries changed; check every product before regenerating.");
}
for (const product of catalog) {
  for (const lang of ["ar", "en"]) {
    fs.writeFileSync(path.join(root, urlFor(product.id, lang)), productPage(product, lang));
  }
}

// Give search crawlers normal links from the catalog before any JS runs.
const productsPath = path.join(root, "products.html");
let productsHtml = unversion(fs.readFileSync(productsPath, "utf8"));
const cards = catalog.map((product) => `<article class="wathba-catalog-fallback"><span>${html(product.category.ar)}</span><h2><a href="${urlFor(product.id, "ar")}">${html(product.name.ar)}</a></h2><p>${html(product.description.ar)}</p><a href="${html(academyFor(product.id, "ar"))}">دليل التدريب ↗</a></article>`).join("\n                ");
const catalogMarker = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter" id="allProducts">';
const catalogPattern = /(<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter" id="allProducts">)[\s\S]*?(<\/div>\s*<\/section>)/;
if (!productsHtml.includes('WATHBA_SLOT:allProducts:START')) {
  if (!catalogPattern.test(productsHtml)) throw new Error("Catalog fallback location missing");
  productsHtml = productsHtml.replace(catalogPattern, `${catalogMarker}\n<!-- WATHBA_SLOT:allProducts:START -->${cards}<!-- WATHBA_SLOT:allProducts:END -->\n            </div>\n        </section>`);
}
if (!productsHtml.includes('href="assets/css/product-seo.css"')) {
  productsHtml = productsHtml.replace('<link rel="stylesheet" href="assets/css/academy.css" />',
    '<link rel="stylesheet" href="assets/css/academy.css" />\n    <link rel="stylesheet" href="assets/css/product-seo.css" />');
}
fs.writeFileSync(productsPath, productsHtml);

// Academy article links should point to the same language as the article.
for (const filename of fs.readdirSync(root).filter((name) => /^academy(?:-[a-z-]+)?\.html$/.test(name))) {
  const filepath = path.join(root, filename);
  const lang = filename.endsWith("-en.html") ? "en" : "ar";
  const before = fs.readFileSync(filepath, "utf8");
  const after = before.replace(/href="product\.html\?id=([a-z0-9-]+)"/g, (match, id) => {
    if (!catalog.some((product) => product.id === id)) throw new Error(`Unknown Academy product: ${id}`);
    return `href="${urlFor(id, lang)}"`;
  });
  if (before !== after) fs.writeFileSync(filepath, after);
}

// A content-based version refreshes cached shared UI on every actual change.
// Only asset URLs change; page content and layouts stay as authored.
const languagePages = require('./build-language-pages.js');
require('./build-academy-pages.js').buildAcademy(catalog);
languagePages.buildCorePages();
require('./build-site-links.js').buildSiteLinks(catalog, academyFor);
languagePages.finalizeLanguageLinks();
require('./editorial.js').applyEditorial(root);
require('./build-accessibility.js').buildAccessibility(root);
require('node:child_process').execFileSync(process.execPath, [path.join(__dirname,'build-performance.js')], {cwd:root,stdio:'inherit'});
const structuredData = require('./structured-data.js').buildStructuredData({origin: launchOrigin});
const assetHash = crypto.createHash("sha256");
for (const asset of sharedAssets) assetHash.update(fs.readFileSync(path.join(root, asset)));
const assetVersion = assetHash.digest("hex").slice(0, 12);
for (const filename of fs.readdirSync(root).filter((name) => name.endsWith(".html"))) {
  const filepath = path.join(root, filename);
  const before = fs.readFileSync(filepath, "utf8");
  const after = before.replace(sharedAssetPattern, (_, asset) => `${asset}?v=${assetVersion}`);
  if (before !== after) fs.writeFileSync(filepath, after);
}

if (launchOrigin) require('node:child_process').execFileSync(process.execPath, [path.join(__dirname,'publish-seo.js'), launchOrigin], {cwd:root});
require('./package-site.js')(root);
console.log(`Built ${catalog.length * 2} localized product pages and catalog links. Shared UI: ${assetVersion}. JSON-LD: ${structuredData.pages} pages.`);
