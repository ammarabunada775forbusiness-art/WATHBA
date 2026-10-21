#!/usr/bin/env node
// Reuse the original HTML shell. Replace only marked translated fragments.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const routes = require('../assets/js/language.js');
const copy = require('./page-translations.json');
const root = path.resolve(__dirname, '..');
const cores = ['index', 'products', 'about', 'contact'];
const metadata = {
  index: {
    ar: ['معدات الكاليستنكس في الأردن | وثبة WATHBA', 'اكتشف معدات الكاليستنكس من وثبة في الأردن: عقلة حائط، باراليتس، متوازي، حلقات وتجهيزات مخصصة. تعلّم التمارين واختر المعدات المناسبة لهدفك.'],
    en: ['Calisthenics Equipment in Jordan | WATHBA', 'Explore WATHBA calisthenics equipment in Jordan: pull-up bars, parallettes, parallel bars, rings and custom setups. Learn how to choose and train with your equipment.']
  },
  products: {
    ar: ['معدات الكاليستنكس والعقلة والباراليتس | وثبة الأردن', 'تصفح معدات الكاليستنكس لدى وثبة في الأردن: عقلة حائط، باراليتس، متوازي، حلقات جمباز وتجهيزات حسب الطلب، مع أدلة تعليمية لاستخدامها.'],
    en: ['Pull-up Bars, Parallettes & Calisthenics Gear | WATHBA Jordan', 'Browse WATHBA pull-up bars, parallettes, parallel bars, gymnastic rings and custom calisthenics equipment in Jordan. Compare options and explore training guides.']
  },
  about: {
    ar: ['عن وثبة | معدات الكاليستنكس في الأردن', 'تعرّف على وثبة ومعدات الكاليستنكس للمنزل والمساحات التدريبية في الأردن، وكيفية طلب تجهيزات تناسب هدفك ومساحتك.'],
    en: ['About WATHBA | Calisthenics Equipment in Jordan', 'Learn about WATHBA, our approach to calisthenics equipment in Jordan and how to choose a home or custom training setup for your space and goals.']
  },
  contact: {
    ar: ['تواصل مع وثبة | معدات الكاليستنكس في الأردن', 'تواصل مع وثبة في الأردن للاستفسار عن عقلة الحائط والباراليتس والمتوازي وتجهيزات الكاليستنكس حسب الطلب عبر واتساب.'],
    en: ['Contact WATHBA | Calisthenics Equipment in Jordan', 'Contact WATHBA in Jordan on WhatsApp to ask about calisthenics equipment, dimensions, product options, prices and custom training setups.']
  }
};
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const slotPattern = /<!-- WATHBA_SLOT:([a-zA-Z]+):START -->[\s\S]*?<!-- WATHBA_SLOT:\1:END -->/g;

function renderSlots(page, lang) {
  const hosts = {};
  const host = id => hosts[id] ||= {innerHTML: '', classList: {add() {}}, querySelectorAll: () => []};
  const document = {
    documentElement: {lang}, readyState: 'complete',
    getElementById: host, querySelector: () => null, querySelectorAll: () => [], addEventListener() {}
  };
  const window = {location: {pathname: `/${page}${lang === 'en' ? '-en' : ''}.html`, search: '', hash: ''}, addEventListener() {}};
  const context = vm.createContext({document, window, localStorage: {getItem: () => lang, setItem() {}}, URL, URLSearchParams, setTimeout: () => 0, clearTimeout() {}, console});
  for (const file of ['config', 'language', 'products-data', ...(page === 'index' ? ['main'] : page === 'products' ? ['products'] : []), 'shared-ui']) {
    vm.runInContext(fs.readFileSync(path.join(root, `assets/js/${file}.js`), 'utf8'), context);
  }
  vm.runInContext('wathbaRenderFooter()', context);
  return Object.fromEntries(Object.entries(hosts).map(([id, node]) => [id, node.innerHTML]));
}

function localizedLinks(html, lang) {
  return html.replace(/<a\b[^>]*>/g, tag => {
    if (/\bhreflang=|\bdata-wathba-language-switch\b/.test(tag)) return tag;
    return tag.replace(/\bhref="([^"]*)"/, (_, href) => `href="${routes.href(href, lang)}"`);
  });
}

function buildCorePages() {
  for (const page of cores) {
    const template = fs.readFileSync(path.join(root, page + '.html'), 'utf8');
    if (!template.includes('WATHBA_COPY:')) throw Error('Missing language source markers: ' + page);
    for (const lang of ['ar', 'en']) {
      const slots = renderSlots(page, lang);
      let html = template.replace(/<!-- WATHBA_COPY:([a-z0-9-]+):START -->[\s\S]*?<!-- WATHBA_COPY:\1:END -->/g, (_, id) => {
        if (typeof copy[id]?.[lang] !== 'string') throw Error('Missing translated fragment: ' + id + '/' + lang);
        return `<!-- WATHBA_COPY:${id}:START -->${copy[id][lang]}<!-- WATHBA_COPY:${id}:END -->`;
      });
      html = html.replace(slotPattern, (_, id) => `<!-- WATHBA_SLOT:${id}:START -->${slots[id] || ''}<!-- WATHBA_SLOT:${id}:END -->`);
      html = html.replace(/<html\b[^>]*>/, tag => tag.replace(/lang="[^"]*"/, `lang="${lang}"`).replace(/dir="[^"]*"/, `dir="${lang === 'ar' ? 'rtl' : 'ltr'}"`));
      html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(metadata[page][lang][0])}</title>`)
        .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escape(metadata[page][lang][1])}" />`);
      html = html.replace(/<script id="wathba-(?:home|products|about|contact)-page-translation">[\s\S]*?<\/script>/g, tag => tag.slice(0, tag.indexOf('>') + 1) + '</script>');
      html = html.replace(/var lang = localStorage\.getItem\("wathbaLang"\) \|\| "ar";/, 'var lang = document.documentElement.lang;\n            try { localStorage.setItem("wathbaLang", lang); } catch (_) {}');
      html = localizedLinks(html, lang);
      if (lang === 'en') html = html.replace(/\bclass="[^"]*"/g, tag => tag.replace(/\s*wathba-ar-text\b/g, ''));
      if (page === 'products') html = html.replace(/(<div class=")([^"]*)(" id="allProducts")/, (_, before, classes, after) => before + (classes.includes('wathba-products-grid') ? classes : classes + ' wathba-products-grid') + after);
      html = html.replace(/[\t ]+$/gm, '');
      fs.writeFileSync(path.join(root, routes.pageFile(page + '.html', lang)), html);
    }
  }
}

function finalizeLanguageLinks() {
  for (const file of fs.readdirSync(root).filter(name => name.endsWith('.html'))) {
    let html = fs.readFileSync(path.join(root, file), 'utf8');
    const lang = file.endsWith('-en.html') ? 'en' : 'ar';
    html = localizedLinks(html, lang);
    if (!html.includes('src="assets/js/language.js')) html = html.replace(/(<script src="assets\/js\/tailwind-config\.js[^>]*><\/script>)/, '$1\n    <script src="assets/js/language.js"></script>');
    if (routes.isPage(file)) {
      const other = lang === 'ar' ? 'en' : 'ar';
      const otherFile = routes.pageFile(file, other);
      html = html.replace(/<!-- WATHBA_STATIC_TOOLS_START -->[\s\S]*?<!-- WATHBA_STATIC_TOOLS_END -->\n?/g, '');
      const tools = `<!-- WATHBA_STATIC_TOOLS_START --><div class="wathba-top-tools"><a class="wathba-lang-btn" data-wathba-language-switch href="${otherFile}" hreflang="${other}" lang="${other}" aria-label="${lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}">${other.toUpperCase()}</a><button class="wathba-menu-toggle" type="button" aria-label="${lang === 'ar' ? 'فتح القائمة' : 'Open menu'}" aria-controls="wathbaMobileMenu" aria-expanded="false"><span class="material-symbols-outlined">menu</span></button></div><!-- WATHBA_STATIC_TOOLS_END -->`;
      html = html.replace(/(<body\b[^>]*>)/, '$1\n' + tools);
      html = html.replace(/<!-- WATHBA_LANGUAGE_ALTERNATES_START -->[\s\S]*?<!-- WATHBA_LANGUAGE_ALTERNATES_END -->\n?/g, '');
      const existingOrigin = html.match(/rel="canonical" href="(https:\/\/[^/]+)/)?.[1];
      const origin = new URL(process.env.WATHBA_SITE_URL || existingOrigin || 'https://wathba-rosy.vercel.app').origin;
      const absolute = name => origin + (name === 'index.html' ? '/' : '/' + name);
      const ar = routes.pageFile(file, 'ar'), en = routes.pageFile(file, 'en');
      const alternates = `<!-- WATHBA_LANGUAGE_ALTERNATES_START -->\n<link rel="alternate" hreflang="ar" href="${absolute(ar)}">\n<link rel="alternate" hreflang="en" href="${absolute(en)}">\n<link rel="alternate" hreflang="x-default" href="${absolute(ar)}">\n<!-- WATHBA_LANGUAGE_ALTERNATES_END -->`;
      html = html.replace(/<\/head>/i, alternates + '\n</head>');
    }
    fs.writeFileSync(path.join(root, file), html);
  }
}

module.exports = {buildCorePages, finalizeLanguageLinks, localizedLinks};
if (require.main === module) {buildCorePages();finalizeLanguageLinks();console.log('Built 8 static core pages in Arabic and English.');}
