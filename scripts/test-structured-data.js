#!/usr/bin/env node
// Synthetic commerce fixtures stay in memory; no example price reaches generated HTML.
const assert = require('node:assert/strict');
const path = require('node:path');
const {loadCatalog,graphFor,validOrigin} = require('./structured-data.js');
const {buildProduct,blockers} = require('./product-schema.js');
const catalog = JSON.parse(JSON.stringify(loadCatalog(path.resolve(__dirname,'..'))));
const facts = JSON.parse(JSON.stringify(require('./product-facts.json')));
const origin = 'https://schema-fixture.test';
const byId = id => catalog.find(p => p.id === id);
let checks = 0;
function ok(condition,message) { assert(condition,message); checks++; }
function approve(id) {
  const p = byId(id), f = facts.products[id];
  f.specificationsConfirmed = true; f.commerce.priceConfirmed = true;
  p.images = [{src:'assets/images/products/'+id+'/1.webp',temporary:false}];
  p.variants.forEach((v,i) => v.price = 11 + i * 7);
  return p;
}
const bar = byId('wall-pull-up-bar');
ok(buildProduct(bar,'ar',origin,catalog,facts) === null,'Incomplete catalog must emit no Product/Offer');
approve(bar.id);
const group = buildProduct(bar,'ar',origin,catalog,facts);
ok(group['@type'] === 'ProductGroup' && group.hasVariant.length === 2,'Two sizes share one group');
ok(group.productGroupID === bar.id && group.variesBy[0] === 'https://schema.org/size','Stable group identity and dimension');
ok(group.hasVariant[0].offers.price === 11 && group.hasVariant[1].offers.price === 18,'Variant prices come from corresponding catalog options');
ok(group.hasVariant.every((v,i) => v.url.endsWith('?variant='+i) && v.isVariantOf['@id'] === group['@id']),'Distinct URLs link variants back to parent');
ok(new Set(group.hasVariant.map(v => v.sku)).size === 2,'Persistent internal SKUs are unique');
bar.variants[1].price = null;
ok(buildProduct(bar,'ar',origin,catalog,facts) === null,'One missing price suppresses the whole group');
bar.variants[1].price = 18; bar.images[0].temporary = true;
ok(buildProduct(bar,'ar',origin,catalog,facts) === null,'An illustrative photo cannot become a product image');
bar.images[0].temporary = false; facts.products[bar.id].commerce.availability = 'Maybe';
ok(blockers(bar,facts).includes('valid availability'),'Unknown availability is rejected');
facts.products[bar.id].commerce.availability = null;
const individual = approve('full-wooden-parallettes');
ok(buildProduct(individual,'en',origin,catalog,facts)['@type'] === 'Product','A single real product has no invented parent group');
approve('freestanding-parallel-bars-small');
ok(buildProduct(byId('freestanding-parallel-bars-small'),'en',origin,catalog,facts) === null,'Both pages of the freestanding family must be ready');
approve('freestanding-parallel-bars-large');
const a = buildProduct(byId('freestanding-parallel-bars-small'),'en',origin,catalog,facts);
const b = buildProduct(byId('freestanding-parallel-bars-large'),'en',origin,catalog,facts);
ok(JSON.stringify(a) === JSON.stringify(b),'Multi-page groups remain self-contained and consistent');
ok(!a.url && a.hasVariant.every(v => !v.url.includes('?variant=')),'Multi-page group has actual member URLs and no fictional canonical');
const html = '<h1>Guide &amp; practice</h1><meta name="description" content="A guide">';
const article = graphFor('academy-grip-en.html',html,{origin,catalog,facts})['@graph'];
ok(article.some(n => n['@type'] === 'Article' && n.headline === 'Guide & practice' && n.inLanguage === 'en'),'Article uses visible headline and language');
ok(!graphFor('academy-en.html',html,{origin,catalog,facts})['@graph'].some(n => n['@type'] === 'Article'),'Academy index is not an article');
ok(!article.some(n => n['@type'] === 'VideoObject'),'No video metadata without actual videos');
for (const invalid of ['http://schema-fixture.test','https://schema-fixture.test/path','https://user:secret@schema-fixture.test']) {
  assert.throws(() => validOrigin(invalid)); checks++;
}
console.log(`${checks} structured-data fixture checks passed; fixture commerce data was not written to site files.`);
