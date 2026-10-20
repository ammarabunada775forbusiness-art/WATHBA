#!/usr/bin/env node
// Build the original storefront layouts and the unchanged Academy article layouts.
const fs = require("node:fs");
const path = require("node:path");
const { root, esc, icon, pageUrl, catalog, categories, config, productUrl, guideUrl, priceText, text, waUrl, media, card, layout, breadcrumbs, hero } = require("./site-layout");
const education = require("../content/products/education");
fs.mkdirSync(root, { recursive: true });
const write = (filename, contents) => fs.writeFileSync(path.join(root, filename), contents);
const buttons = (items) => `<div class="site-actions">${items.join("")}</div>`;
const link = (url, label, primary = false) => `<a class="site-button${primary ? " primary" : ""}" href="${esc(url)}">${label}</a>`;
const decode = value => value.replace(/&(amp|quot|lt|gt|#39);/g, entity => ({"&amp;":"&","&quot;":'"',"&lt;":"<","&gt;":">","&#39;":"'"})[entity]);

const { home, productsPage, about, contact, equipment } = require("./classic-layout");

const metadata = {
  index: ["معدات الكاليستنكس في الأردن | وثبة WATHBA","Calisthenics Equipment in Jordan | WATHBA","معدات كاليستنكس من وثبة في الأردن: عقلة، باراليتس، متوازي وحلقات وتجهيزات مخصصة، مع أدلة تدريب للمبتدئ والمتوسط والمتقدم.","Explore WATHBA calisthenics equipment in Jordan: pull-up bars, parallettes, parallel bars, rings and custom setups with practical training guides."],
  products: ["معدات الكاليستنكس والعقلة والباراليتس | وثبة الأردن","Pull-up Bars, Parallettes & Calisthenics Gear | WATHBA Jordan","تصفح معدات الكاليستنكس من وثبة: عقلة حائط، باراليتس، متوازي، حلقات وإكسسوارات وتجهيزات حسب الطلب، مع خيارات القياسات وأدلة التدريب.","Browse WATHBA pull-up bars, parallettes, parallel bars, rings, accessories and custom equipment with size options and linked training guides."],
  about: ["عن وثبة | معدات الكاليستنكس في الأردن","About WATHBA | Calisthenics Equipment in Jordan","تعرّف على وثبة، مشروع معدات كاليستنكس من الأردن يجمع أدلة التدريب وخيارات المعدات والتجهيزات المخصصة للمنزل ومساحات التدريب.","Meet WATHBA, a Jordanian calisthenics equipment project connecting training guides, equipment choices and custom setups for home and training spaces."],
  contact: ["تواصل مع وثبة | معدات الكاليستنكس في الأردن","Contact WATHBA | Calisthenics Equipment in Jordan","تواصل مع وثبة في عمّان عبر واتساب للاستفسار عن المعدات والمقاسات والتجهيزات المخصصة، وتأكيد التوفر والسعر والتوصيل والتركيب.","Contact WATHBA in Amman on WhatsApp for equipment, size options and custom setups. Confirm availability, price, delivery and installation details."]
};

for (const lang of ["ar","en"]) {
  for (const [base, make] of [["index",home],["products",productsPage],["about",about],["contact",contact]]) {
    const meta = metadata[base], filename = pageUrl(base,lang);
    write(filename,layout({filename,lang,title:meta[lang==="ar"?0:1],description:meta[lang==="ar"?2:3],main:make(lang),scripts:base==="products"?["products","classic"]:base==="contact"?["contact","classic"]:["classic"]}));
  }
  for (const product of catalog) {
    const filename = productUrl(product.id,lang), entry = education[product.id][lang];
    write(filename,layout({filename,lang,title:`${product.name[lang]} | ${lang === "ar" ? "معدات الكاليستنكس في الأردن – وثبة" : "Calisthenics Equipment in Jordan – WATHBA"}`,description:entry.intent,main:equipment(product,lang),scripts:["product-details"],type:"product"}));
  }
  const filename = pageUrl("404",lang),t=text(lang);
  write(filename,layout({filename,lang,title:t("الصفحة غير موجودة | وثبة","Page not found | WATHBA"),description:t("ارجع إلى معدات وثبة أو أكاديمية التدريب.","Return to WATHBA equipment or the training Academy."),noindex:true,main:`<main class="site-main" id="content">${hero(lang,"WATHBA / 404",t("لنرجع إلى المسار.","Let's get you back on track."),t("هذا الرابط غير موجود. يمكنك متابعة التعلّم أو استكشاف المعدات.","This page does not exist. Continue learning or explore the equipment."))}<section class="site-container site-section">${buttons([link(pageUrl("index",lang),t("الرئيسية","Home"),true),link(pageUrl("products",lang),t("المعدات","Equipment")),link(pageUrl("academy",lang),t("الأكاديمية","Academy"))])}</section></main>`}));
}

// Academy authoring sources stay separate from generated public pages.
for (const lang of ["ar", "en"]) {
  const sourceDir = path.resolve(__dirname, "..", "content", "academy", lang);
  for (const sourceName of fs.readdirSync(sourceDir).filter(name => name.endsWith(".html")).sort()) {
    const slug = sourceName.slice(0, -5);
    const filename = pageUrl(slug === "index" ? "academy" : `academy-${slug}`, lang);
    const before = fs.readFileSync(path.join(sourceDir, sourceName), "utf8");
    const mainMatch = before.match(/<main\b[\s\S]*?<\/main>/i);
    const title = before.match(/<title>([^<]+)<\/title>/i)?.[1];
    const description = before.match(/<meta name="description" content="([^"]*)"/i)?.[1];
    if (!mainMatch || !title || !description) throw new Error(`Academy metadata missing: ${sourceName} (${lang})`);
    let main = mainMatch[0].replace(/<main\b[^>]*>/, '<main class="academy-main" id="content">');
    if (lang === "en") main = main.replace(/href="(index|products|about|contact)\.html/g, 'href="$1-en.html');
    write(filename, layout({ filename, lang, title: decode(title), description: decode(description), main, academy: true, type: slug === "index" ? "website" : "article" }));
  }
}

write("product.html",layout({filename:"product.html",lang:"ar",title:"معدات الكاليستنكس | وثبة الأردن",description:"انتقل إلى صفحة المنتج ضمن معدات وثبة.",noindex:true,scripts:["product-legacy-redirect"],main:`<main class="site-main" id="content">${hero("ar","WATHBA / المعدات","اختر معدّتك من الكتالوج","كل منتج له صفحة فيها خياراته ودليل استخدامه.")}<section class="site-container site-section">${link("products.html","انتقل إلى المعدات",true)}</section></main>`}));
console.log(`Built 8 core pages, ${catalog.length*2} equipment pages, 8 Academy pages, 2 error pages and a legacy redirect.`);
if (fs.existsSync(path.join(__dirname,"seo-origin.json"))) {
  const result = require("node:child_process").spawnSync(process.execPath,[path.join(__dirname,"publish-seo.js")],{cwd:root,stdio:"inherit"});
  if (result.status !== 0) process.exit(result.status || 1);
}
