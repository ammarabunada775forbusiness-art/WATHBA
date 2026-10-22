#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {loadCatalog,articlePage} = require('./structured-data.js');
const {blockers} = require('./product-schema.js');
const root = path.resolve(__dirname,'..');
const catalog = loadCatalog(root), facts = require('./product-facts.json');
const counts = {};
let pages = 0;
for (const file of fs.readdirSync(root).filter(f => f.endsWith('.html') && f !== 'product.html')) {
  const html = fs.readFileSync(path.join(root,file),'utf8');
  const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length,1,`${file}: expected one JSON-LD graph`);
  const data = JSON.parse(scripts[0][1]);
  assert.equal(data['@context'],'https://schema.org');
  const nodes = data['@graph'];
  const ids = nodes.map(n => n['@id']);
  assert.equal(new Set(ids).size,ids.length,`${file}: duplicate definitions`);
  assert(nodes.some(n => n['@type'] === 'Organization'));
  assert(nodes.some(n => n['@type'] === 'WebSite'));
  const webpage = nodes.find(n => n['@type'] === 'WebPage');
  assert.equal(webpage.inLanguage,file.endsWith('-en.html') ? 'en' : 'ar');
  const origin = new URL(webpage.url).origin;
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical) assert.equal(webpage.url,canonical,`${file}: canonical/JSON-LD mismatch`);
  const breadcrumb = nodes.find(n => n['@type'] === 'BreadcrumbList');
  if (/^index(?:-en)?\.html$/.test(file)) assert(!breadcrumb);
  else {
    assert(breadcrumb,`${file}: missing breadcrumb`);
    breadcrumb.itemListElement.forEach((n,i) => {assert.equal(n.position,i+1);assert.equal(new URL(n.item).origin,origin);});
    assert.equal(breadcrumb.itemListElement.at(-1).item,webpage.url);
  }
  const article = nodes.find(n => n['@type'] === 'Article');
  assert.equal(!!article,articlePage(file),`${file}: incorrect Article classification`);
  if (article) {
    assert.equal(article.headline,webpage.name);
    assert.equal(article.inLanguage,webpage.inLanguage);
    assert(ids.includes(article.author['@id']));
    assert(html.includes('data-wathba-article-author'));
    assert(!article.datePublished && !article.dateModified,`${file}: unmaintained dates`);
  }
  const walk = value => {
    if (!value || typeof value !== 'object') return;
    if (value['@id']) assert.equal(new URL(value['@id']).origin,origin,`${file}: mixed graph hosts`);
    if (value['@type'] === 'Product') {
      const u = new URL(value.url), id = u.pathname.match(/equipment-(.+?)(?:-en)?\.html$/)?.[1];
      const product = catalog.find(p => p.id === id);
      assert(product,`${file}: unknown product`);
      assert.deepEqual(blockers(product,facts),[],`${file}: unconfirmed commerce data`);
      const index = Number(u.searchParams.get('variant') || 0);
      assert.equal(value.offers.price,product.variants[index]?.price ?? product.price);
      assert.equal(value.offers.priceCurrency,'JOD');
      assert(!value.gtin && !value.aggregateRating && !value.review);
    }
    assert(value['@type'] !== 'VideoObject',`${file}: video has not been supplied`);
    for (const v of Object.values(value)) if (v && typeof v === 'object') Array.isArray(v) ? v.forEach(walk) : walk(v);
  };
  walk(data);
  nodes.forEach(n => counts[n['@type']] = (counts[n['@type']] || 0) + 1);
  pages++;
}
console.log(`Validated JSON-LD in ${pages} pages: ${JSON.stringify(counts)}. Prices, language, IDs and canonical hosts checked.`);
