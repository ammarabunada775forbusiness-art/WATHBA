const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..", "public");
const UI = require("../public/assets/js/ui.js");
const { escape: esc, icon, pageUrl, productArt } = UI;
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/products-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/config.js"), "utf8"), context);
const catalog = context.window.WATHBA_PRODUCTS;
const categories = context.window.WATHBA_CATEGORIES;
const config = context.window.WATHBA_CONFIG;
const productUrl = (id, lang) => `equipment-${id}${lang === "en" ? "-en" : ""}.html`;
const guideUrl = (id, lang) => vm.runInContext(`getAcademyGuide(${JSON.stringify(id)},${JSON.stringify(lang)})`, context);
const priceText = (p, lang) => vm.runInContext(`getProductPriceText(products.find(p=>p.id===${JSON.stringify(p.id)}),${JSON.stringify(lang)})`, context);
const text = (lang) => (ar, en) => lang === "ar" ? ar : en;
const waUrl = (message) => `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;

function media(product, lang, eager = false) {
  const t = text(lang);
  const source = [product.image,...(product.gallery || [])].find(src=>fs.existsSync(path.join(root,src)));
  if (source) {
    return `<div class="equipment-media"><img src="${esc(source)}" alt="${esc(product.name[lang])}" width="600" height="450" loading="${eager ? "eager" : "lazy"}" decoding="async"></div>`;
  }
  return `<div class="equipment-media"><span class="equipment-media-mark" aria-hidden="true">WATHBA</span>${productArt(product.id)}<span class="equipment-illustration-note">${t("رسم توضيحي للمعدّة", "Equipment illustration")}</span></div>`;
}
function card(product, lang) {
  const t = text(lang), link = productUrl(product.id, lang);
  const group = categories.find(c => c.ids.includes(product.id));
  const multiple = product.variants.length > 1;
  const search = [product.name.ar, product.name.en, product.category.ar, product.category.en, product.description.ar, product.description.en].join(" ");
  return `<article class="equipment-card" data-product-card data-product-id="${product.id}" data-category="${group.key}" data-search="${esc(search)}">
    <a href="${link}" aria-label="${esc(product.name[lang])}">${media(product, lang)}</a>
    <div class="equipment-content"><span class="equipment-category">${esc(group[lang])}</span><h3><a href="${link}">${esc(product.name[lang])}</a></h3><p class="equipment-description">${esc(product.description[lang])}</p>
    <p class="equipment-price">${esc(priceText(product, lang))}</p><div class="equipment-actions"><a class="site-button" href="${link}">${t("التفاصيل", "Details")}</a>${multiple ? `<a class="site-button soft" href="${link}#product-options">${t("اختر القياس", "Choose size")}</a>` : `<button class="site-button soft" type="button" data-add-product="${product.id}">${icon("plus")}${t("أضف للسلة", "Add to cart")}</button>`}</div>
    <a class="equipment-learn" href="${guideUrl(product.id, lang)}">${icon("book")}${t("تعلّم التمارين المناسبة", "Explore the training guide")} ↗</a></div>
  </article>`;
}

function header(filename, lang) {
  const t = text(lang), current = filename.startsWith("equipment-") || filename === "product.html" ? "products" : filename.startsWith("academy") ? "academy" : filename.replace(/-en\.html$|\.html$/g, "");
  const opposite = lang === "ar" ? "en" : "ar";
  const base = filename === "product.html" ? "products" : filename.replace(/-en\.html$/, ".html").replace(/\.html$/, "");
  const oppositeUrl = pageUrl(base, opposite);
  const links = [["index",t("الرئيسية","Home")],["products",t("المنتجات","Equipment")],["academy",t("الأكاديمية","Academy")],["about",t("من نحن","About")],["contact",t("تواصل معنا","Contact")]];
  const navLinks = links.map(([base,label]) => `<a href="${pageUrl(base, lang)}"${current === base ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  return `<a class="skip-link" href="#content">${t("انتقل إلى المحتوى", "Skip to content")}</a>
  <header class="site-header"><nav class="site-container site-nav" aria-label="${t("القائمة الرئيسية","Main navigation")}"><a class="wathba-logo" href="${pageUrl("index",lang)}" aria-label="${t("وثبة، الرئيسية","WATHBA home")}" lang="en">WATHBA</a><div class="site-nav-links">${navLinks}</div><div class="wathba-top-tools">
    <a class="wathba-lang-btn" href="${oppositeUrl}" lang="${opposite}" hreflang="${opposite}" aria-label="${lang === "ar" ? "Read this page in English" : "اقرأ هذه الصفحة بالعربية"}">${lang === "ar" ? "EN" : "AR"}</a>
    <button class="wathba-cart-toggle" type="button" aria-label="${t("سلة الطلبات","Order cart")}" aria-controls="wathbaCartDrawer" aria-expanded="false">${icon("bag")}<span class="wathba-cart-count" aria-hidden="true">0</span></button>
    <button class="wathba-menu-toggle" type="button" aria-label="${t("افتح القائمة","Open menu")}" aria-controls="wathbaMobileMenu" aria-expanded="false">${icon("menu")}</button></div></nav></header>
  <nav class="wathba-mobile-menu" id="wathbaMobileMenu" aria-label="${t("تصفح الموقع والمعدات","Explore pages and equipment")}" hidden><div class="menu-links">${navLinks}</div><p class="menu-category-label">${t("اختر حسب التصنيف","Shop by category")}</p><div class="menu-categories">${categories.map(c=>`<a href="${pageUrl("products",lang)}?filter=${c.key}">${esc(c[lang])}</a>`).join("")}</div><div class="menu-socials">${Object.values(config.socials).map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`).join("")}</div></nav>`;
}
function footer(lang) {
  const t = text(lang);
  let original = fs.readFileSync(path.resolve(__dirname, "..", "content", "pages", lang, "footer.html"), "utf8").trim();
  if (lang === "en") original = original.replace(/href="(index|products|about|contact)\.html(?=["?#])/g, 'href="$1-en.html');
  return original + `\n    <div id="sharedWhatsApp"><div class="whatsapp-widget"><a class="whatsapp-float" href="${waUrl(t("مرحبًا وثبة، أحتاج مساعدة في اختيار المعدّة.","Hi WATHBA, I need help choosing equipment."))}" target="_blank" rel="noopener noreferrer" aria-label="${t("راسل وثبة عبر واتساب","Message WATHBA on WhatsApp")}">${icon("whatsapp")}</a></div></div>
    <div class="wathba-cart-drawer" id="wathbaCartDrawer" hidden></div><div class="wathba-toast" id="wathbaToast" role="status" aria-live="polite" hidden></div>`;
}
function layout({ filename, lang, title, description, main, scripts = [], academy = false, noindex = false, type = "website" }) {
  return `<!doctype html>
<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}" class="dark" data-wathba-lang="${lang}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title><meta name="description" content="${esc(description)}">
${noindex ? '  <meta name="robots" content="noindex,follow">\n' : ''}
  <meta name="theme-color" content="#131313"><meta property="og:type" content="${type}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta name="twitter:card" content="summary">
  <link rel="icon" href="assets/images/wathba-mark.svg" type="image/svg+xml">
  <link rel="preload" href="assets/fonts/anton-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/${lang === "ar" ? "noto-sans-arabic-arabic-wght-normal.woff2" : "be-vietnam-pro-latin-400-normal.woff2"}" as="font" type="font/woff2" crossorigin>
  ${academy ? "" : '<link rel="stylesheet" href="assets/css/classic-utilities.css">'}\n  <link rel="stylesheet" href="assets/css/shared-ui.css"><link rel="stylesheet" href="assets/css/academy.css"><link rel="stylesheet" href="assets/css/site.css">\n  ${academy ? "" : '<link rel="stylesheet" href="assets/css/classic.css"><link rel="stylesheet" href="assets/css/product-seo.css">'}
  ${["ui", "config", "products-data", "shared-ui", ...scripts].map(name=>`<script src="assets/js/${name}.js" defer></script>`).join("\n  ")}
</head>
<body class="site-page${academy ? " academy-page" : ""}" data-site-lang="${lang}"${academy ? "" : ` data-classic-page="${filename.startsWith("equipment-") ? "equipment" : filename.replace(/-en\.html$|\.html$/g, "")}"`}>
  ${header(filename,lang)}
  ${main}
  ${footer(lang)}
</body>
</html>
`;
}
function breadcrumbs(lang, current, parent = null) {
  const t = text(lang);
  return `<nav class="site-container breadcrumbs" aria-label="${t("مسار التنقل","Breadcrumb")}"><a href="${pageUrl("index",lang)}">${t("الرئيسية","Home")}</a><span aria-hidden="true">/</span>${parent ? `<a href="${parent.url}">${esc(parent.name)}</a><span aria-hidden="true">/</span>` : ""}<span>${esc(current)}</span></nav>`;
}
function hero(lang, eyebrow, title, lead, pills = []) {
  return `<header class="page-hero"><div class="site-container"><span class="site-eyebrow">${esc(eyebrow)}</span><h1>${esc(title)}</h1><p class="lead">${esc(lead)}</p>${pills.length ? `<div class="site-pills">${pills.map(p=>`<span>${esc(p)}</span>`).join("")}</div>` : ""}</div></header>`;
}
module.exports = { root, esc, icon, pageUrl, catalog, categories, config, productUrl, guideUrl, priceText, text, waUrl, media, card, layout, breadcrumbs, hero };
