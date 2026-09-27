#!/usr/bin/env node
// Regenerate product HTML from the catalog and reviewed editorial copy.
// Run from the repo root: node scripts/build-product-pages.js
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const template = fs.readFileSync(path.join(root, "product.html"), "utf8");
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/products-data.js"), "utf8"), context);
const catalog = vm.runInContext("products", context);
const education = require("./product-education.js");

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
  const description = `${entry.intent} ${product.description[lang]}`;
  const question = isAr
    ? `مرحبًا وثبة، أريد تفاصيل ${name} والقياسات المتاحة وطريقة التركيب والسعر.`
    : `Hi WATHBA, please share the available sizes, installation details and price for ${name}.`;
  const whatsApp = `https://wa.me/962791752349?text=${encodeURIComponent(question)}`;
  const opposite = isAr ? "en" : "ar";
  const staticHero = `<section class="wathba-product-static"><div class="wathba-product-wrap">
    <nav class="wathba-product-crumb" aria-label="Breadcrumb"><a href="index.html">${labels.home}</a><span>/</span><a href="products.html">${labels.products}</a><span>/</span>${html(name)}</nav>
    <div class="wathba-static-panel"><div class="wathba-static-art" aria-hidden="true"><strong>WATHBA</strong><span>CALISTHENICS / JORDAN</span></div>
    <div><span class="wathba-static-category">${html(product.category[lang])} · ${labels.category}</span><h1>${html(name)}</h1><p>${html(product.description[lang])}</p>
    <div class="wathba-static-options"><strong>${labels.sizes}</strong><ul>${product.variants.map((v) => `<li>${html(v[lang])}</li>`).join("")}</ul><p>${labels.price}</p></div>
    <div class="wathba-static-actions"><a href="${html(whatsApp)}">${labels.buy}</a><a href="${html(academyFor(product.id, lang))}">${labels.guide}</a></div></div></div>
  </div></section>`;
  const editorial = `<section class="wathba-product-education" aria-labelledby="equipment-guide-title"><div class="wathba-product-wrap">
    <span class="wathba-product-eyebrow">WATHBA / ${isAr ? "دليل المعدات" : "Equipment guide"}</span>
    <h2 id="equipment-guide-title">${isAr ? `كيف أختار ${html(name)} وأتدرّب عليها؟` : `How to choose and train with ${html(name)}`}</h2>
    <p class="wathba-product-intro">${html(entry.intent)}</p><div class="wathba-product-columns">
      <div class="wathba-product-box"><h3>${labels.use}</h3><p>${html(entry.use)}</p></div>
      <div class="wathba-product-box"><h3>${labels.levels}</h3><ul>${entry.levels.map((level) => `<li>${html(level)}</li>`).join("")}</ul></div>
      <div class="wathba-product-box full"><h3>${labels.choose}</h3><p>${html(entry.choose)}</p><p>${labels.note}</p></div>
    </div><div class="wathba-product-faq"><h3>${labels.faq}: ${html(entry.question)}</h3><p>${html(entry.answer)}</p></div>
    <div class="wathba-product-footlinks"><a href="${html(academyFor(product.id, lang))}">${labels.guide} ↗</a><a href="products.html">${labels.other} ↗</a><a href="${urlFor(product.id, opposite)}" lang="${opposite}" hreflang="${opposite}">${labels.switch} ↗</a></div>
  </div></section>`;
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
    `<section id="productDetailsRoot">${staticHero}</section>\n        ${editorial}`);
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
let productsHtml = fs.readFileSync(productsPath, "utf8");
const cards = catalog.map((product) => `<article class="wathba-catalog-fallback"><span>${html(product.category.ar)}</span><h2><a href="${urlFor(product.id, "ar")}">${html(product.name.ar)}</a></h2><p>${html(product.description.ar)}</p><a href="${html(academyFor(product.id, "ar"))}">دليل التدريب ↗</a></article>`).join("\n                ");
const catalogMarker = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter" id="allProducts">';
const catalogPattern = /(<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter" id="allProducts">)[\s\S]*?(<\/div>\s*<\/section>)/;
if (!catalogPattern.test(productsHtml)) throw new Error("Catalog fallback location missing");
productsHtml = productsHtml.replace(catalogPattern, `${catalogMarker}\n                ${cards}\n            </div>\n        </section>`);
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

console.log(`Built ${catalog.length * 2} localized product pages and catalog links.`);
