// Original storefront layouts, using crawlable bilingual HTML and current cart hooks.
const fs = require("node:fs"), path = require("node:path");
const { root, esc, icon, pageUrl, catalog, categories, config, productUrl, guideUrl, priceText, text, waUrl, breadcrumbs } = require("./site-layout");
const education = require("../content/products/education");
const sourceRoot = path.resolve(__dirname, "..", "content", "pages");
const manifestPath = path.join(root, "assets/images/classic/manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const featured = ["wall-pull-up-bar", "steel-wood-parallettes", "freestanding-parallel-bars-large", "gymnastic-rings", "multi-rig", "resistance-bands"];

function localizeLinks(html, lang) {
  if (lang !== "en") return html;
  return html.replace(/href="(index|products|about|contact)\.html(?=["?#])/g, 'href="$1-en.html');
}
function replaceIcons(html) {
  const names = { chat: "whatsapp", menu_book: "book", architecture: "check", fitbit: "plus", home_work: "pin", call: "whatsapp", groups: "arrow", share: "arrow", location_on: "pin", schedule: "check", add: "plus", bolt: "plus", fitness_center: "plus", add_shopping_cart: "bag" };
  return html.replace(/<span\b([^>]*class="[^"]*material-symbols-outlined[^"]*"[^>]*)>\s*([a-z_]+)\s*<\/span>/g,
    (_, attr, name) => '<span ' + attr + ' aria-hidden="true">' + icon(names[name] || "check") + "</span>");
}
function media(product, lang, large = false) {
  const source = [product.image, ...(product.gallery || [])].find(src => fs.existsSync(path.join(root, src)));
  return '<div class="equipment-media classic-product-media' + (large ? ' classic-product-media-large' : '') + '">' +
    (source ? '<img src="' + esc(source) + '" alt="' + esc(product.name[lang]) + '" width="600" height="450" loading="' + (large ? "eager" : "lazy") + '">' : '<div class="classic-media-placeholder" aria-hidden="true">WATHBA</div>') + '</div>';
}
function card(product, lang, home = false) {
  const t = text(lang), url = productUrl(product.id, lang), group = categories.find(c => c.ids.includes(product.id));
  const multiple = product.variants.length > 1;
  const search = [product.name.ar, product.name.en, product.description.ar, product.description.en, product.category.ar, product.category.en].join(" ");
  return '<article class="' + (home ? "home-product-card " : "product-card ") + 'classic-product-card group relative flex flex-col bg-surface-container-low border border-outline-variant/10 rounded-lg overflow-hidden" data-product-card data-product-id="' + product.id + '" data-category="' + group.key + '" data-search="' + esc(search) + '">' +
    '<a class="classic-card-media ' + (home ? "home-product-media" : "") + '" href="' + url + '" aria-label="' + esc(product.name[lang]) + '">' + media(product, lang) +
    '<div class="classic-variant-badges">' + product.variants.map(v => '<span>' + esc(v[lang]) + '</span>').join("") + '</div></a>' +
    '<div class="classic-card-content"><span class="classic-card-category">' + esc(group[lang]) + '</span><h3><a href="' + url + '">' + esc(product.name[lang]) + '</a></h3><p class="classic-card-description">' + esc(product.description[lang]) + '</p>' +
    '<div class="classic-card-actions"><span>' + esc(priceText(product, lang)) + '</span><div><a class="classic-card-explore" href="' + url + '">' + t("استكشف", "Explore") + '</a>' +
    (multiple ? '<a class="wathba-add-cart-btn" href="' + url + '#product-options">' + icon("bag") + t("اختر القياس", "Choose size") + '</a>' : '<button class="wathba-add-cart-btn" type="button" data-add-product="' + product.id + '">' + icon("bag") + t("أضف للسلة", "Add to cart") + '</button>') +
    '</div></div><a class="wathba-academy-card-link" href="' + guideUrl(product.id, lang) + '">' + icon("book") + t("تعلّم التمارين المناسبة", "Explore the training guide") + '</a></div></article>';
}
function corePage(base, lang) {
  const t = text(lang);
  let html = fs.readFileSync(path.join(sourceRoot, lang, base + ".html"), "utf8");
  html = html.replace(/{{MEDIA:([a-z-]+)}}/g, (_, key) => {
    if (!manifest[key]?.file) throw new Error("Missing reference media: " + key);
    return manifest[key].file;
  });
  html = html.replace("<!-- WATHBA_FEATURED_PRODUCTS -->", featured.map(id => card(catalog.find(p => p.id === id), lang, true)).join("\n"));
  html = html.replace("<!-- WATHBA_CATALOG_PRODUCTS -->", catalog.map(p => card(p, lang)).join("\n"));
  html = html.replace("<!-- WATHBA_CATEGORY_FILTERS -->",
    '<div class="classic-catalog-topline"><label class="catalog-search">' + icon("search") + '<span class="sr-only">' + t("ابحث عن معدّة", "Search equipment") + '</span><input type="search" id="productSearch" placeholder="' + t("ابحث عن عقلة، باراليتس، حلقات…", "Search bars, parallettes, rings…") + '" autocomplete="off"></label><p id="catalogCount" class="catalog-count" role="status" aria-live="polite">' + catalog.length + ' ' + t("منتجًا", "products") + '</p></div>' +
    '<div class="category-filters"><button type="button" data-filter="all" aria-pressed="true">' + t("كل المعدات", "All equipment") + '</button>' + categories.map(c => '<button type="button" data-filter="' + c.key + '" aria-pressed="false">' + esc(c[lang]) + '</button>').join("") + '</div>');
  if (base === "products") html = html.replace("</main>", '<section class="classic-catalog-empty" id="catalogEmpty" hidden><h2>' + t("لم نجد معدّة بهذا البحث", "No equipment matches your search") + '</h2><button class="site-button" type="button" data-clear-filters>' + t("عرض كل المعدات", "Show all equipment") + '</button></section></main>');
  if (base === "contact") html = html.replace("</form>", '<button type="submit" class="wathba-contact-wa-hero">' + icon("whatsapp") + t("تابع عبر واتساب", "Continue on WhatsApp") + '</button><p class="classic-form-note">' + t("راجع الرسالة في واتساب ثم أرسلها عندما تكون جاهزًا.", "Review the message in WhatsApp and send it when ready.") + '</p></form>');
  return replaceIcons(localizeLinks(html, lang));
}
function equipment(product, lang) {
  const t = text(lang), entry = education[product.id][lang], multiple = product.variants.length > 1;
  const group = categories.find(c => c.ids.includes(product.id));
  const related = catalog.filter(p => p.id !== product.id).sort((a,b) => Number(group.ids.includes(b.id)) - Number(group.ids.includes(a.id))).slice(0,3);
  const gallery = [product.image, ...(product.gallery || [])].filter(src => fs.existsSync(path.join(root, src)));
  const thumbs = gallery.length > 1 ? '<div class="product-thumbnails">' + gallery.map((src,i) => '<button type="button" data-gallery-src="' + esc(src) + '" aria-pressed="' + (i === 0) + '" aria-label="' + t("صورة ", "Image ") + (i+1) + '"><img src="' + esc(src) + '" alt="' + esc(product.name[lang]) + '" width="120" height="90" loading="lazy"></button>').join("") + '</div>' : "";
  return '<main class="classic-main classic-equipment pt-32" id="content">' + breadcrumbs(lang, product.name[lang], {url:pageUrl("products",lang),name:t("المعدات","Equipment")}) +
    '<section id="productDetailsRoot" class="classic-equipment-grid"><figure class="product-visual">' + media(product, lang, true) + thumbs + '<figcaption>' + t("تحقق من أبعاد القطعة وطريقة تركيبها قبل الطلب.", "Confirm actual dimensions and installation before ordering.") + '</figcaption></figure>' +
    '<div class="classic-equipment-intro"><span class="classic-card-category">' + esc(group[lang]) + ' / WATHBA</span><h1>' + esc(product.name[lang]) + '</h1><p class="classic-equipment-description">' + esc(product.description[lang]) + '</p>' +
    '<form id="productOrderForm" data-product-id="' + product.id + '"><fieldset class="product-options" id="product-options"><legend>' + t("اختر القياس / النوع", "SELECT SIZE / TYPE") + '</legend><div class="product-variant-list">' + product.variants.map((v,i) => '<label class="product-variant"><input type="radio" name="variant" value="' + i + '" required ' + (!multiple ? "checked" : "") + '><span>' + esc(v[lang]) + '</span></label>').join("") + '</div></fieldset>' +
    '<div class="classic-equipment-pricing"><small>' + t("السعر", "PRICING") + '</small><strong>' + esc(priceText(product,lang)) + '</strong></div><button class="wathba-add-cart-btn wathba-add-cart-btn-large product-submit" type="submit">' + icon("bag") + t("أضف إلى سلة الطلبات", "ADD TO CART") + '</button><p class="product-guidance">' + t("اختر الخيار المطلوب. نؤكد التوفر والسعر النهائي عبر واتساب.", "Select your option. Availability and final price are confirmed on WhatsApp.") + '</p></form>' +
    '<a class="site-button" href="' + waUrl(t("مرحبًا وثبة، أريد تفاصيل " + product.name.ar, "Hi WATHBA, please share details for " + product.name.en)) + '" target="_blank" rel="noopener noreferrer">' + icon("whatsapp") + t("استفسر مباشرة", "Ask us directly") + '</a><a class="wathba-academy-detail-link" href="' + guideUrl(product.id,lang) + '">' + icon("book") + t("كيف أتدرّب بهذه المعدّة؟ اقرأ دليل أكاديمية وثبة", "How do I train with this equipment? Read the WATHBA Academy guide") + ' ↗</a></div></section>' +
    '<section class="wathba-product-education"><div class="wathba-product-wrap"><span class="wathba-product-eyebrow">WATHBA / ' + t("دليل المعدات", "Equipment guide") + '</span><h2>' + t("الاستخدام والتدرّج والاختيار", "Use, progression and selection") + '</h2><p class="wathba-product-intro">' + esc(entry.intent) + '</p><div class="wathba-product-columns"><article class="wathba-product-box"><h3>' + t("كيف تستخدمها؟", "How can you use it?") + '</h3><p>' + esc(entry.use) + '</p></article><article class="wathba-product-box"><h3>' + t("نقطة بداية لكل مستوى", "A starting point for each level") + '</h3><ul>' + entry.levels.map(level=>'<li>'+esc(level)+'</li>').join("") + '</ul></article><article class="wathba-product-box full"><h3>' + t("قبل أن تختار", "Before you choose") + '</h3><p>' + esc(entry.choose) + '</p></article></div><div class="wathba-product-faq"><h3>' + esc(entry.question) + '</h3><p>' + esc(entry.answer) + '</p></div><div class="wathba-product-footlinks"><a href="' + guideUrl(product.id,lang) + '">' + t("أكمل التعلّم في الأكاديمية", "Continue learning in the Academy") + ' ↗</a></div></div></section>' +
    '<section class="classic-related"><h2>' + t("معدات قد تناسب تجهيزك", "More for your setup") + '</h2><div class="classic-related-grid">' + related.map(p => card(p,lang)).join("") + '</div></section></main>';
}
module.exports = { home:lang=>corePage("index",lang), productsPage:lang=>corePage("products",lang), about:lang=>corePage("about",lang), contact:lang=>corePage("contact",lang), equipment };
