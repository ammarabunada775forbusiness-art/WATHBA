#!/usr/bin/env node
// Crawl generated HTML rather than relying on browser JavaScript or the sitemap.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const structure=require('../assets/js/site-structure.js');
const routes=require('../assets/js/language.js');
const {loadCatalog}=require('./structured-data.js');
const root=path.resolve(__dirname,'..'),catalog=loadCatalog(root);
const names=fs.readdirSync(root).filter(n=>n.endsWith('.html')&&n!=='product.html');
const pages=new Map(names.map(n=>[n,fs.readFileSync(path.join(root,n),'utf8')]));
const ids=new Map(),links=new Map();let edges=0;
for(const[file,html]of pages){
 const allIds=[...html.matchAll(/<[a-z][^>]*\sid="([^"]+)"/gi)].map(m=>m[1]);
 assert.equal(new Set(allIds).size,allIds.length,`${file}: duplicate section IDs`);
 ids.set(file,new Set(allIds));
 links.set(file,[...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>/gi)].map(m=>({href:m[1].replace(/&amp;/g,'&'),tag:m[0]})));
}
const graph=new Map(names.map(n=>[n,new Set()]));
for(const[file,anchors]of links){
 const lang=file.endsWith('-en.html')?'en':'ar';
 for(const a of anchors){
  if(!a.href||/^(https?:|mailto:|tel:|javascript:)/.test(a.href))continue;
  const u=new URL(a.href,'https://internal-links.test/'+file),target=u.pathname.slice(1)||'index.html';
  if(!target.endsWith('.html'))continue;
  assert(pages.has(target),`${file}: broken destination ${a.href}`);
  assert(!u.hash||ids.get(target).has(decodeURIComponent(u.hash.slice(1))),`${file}: broken section ${a.href}`);
  if(!/hreflang=|data-wathba-language-switch/.test(a.tag)&&routes.isPage(target))assert.equal(routes.pageFile(target,lang),target,`${file}: link changes language ${a.href}`);
  graph.get(file).add(target);edges++;
 }
}
for(const lang of ['ar','en']){
 const home=lang==='ar'?'index.html':'index-en.html',depth=new Map([[home,0]]),queue=[home];
 while(queue.length){const node=queue.shift();for(const target of graph.get(node)){if((target.endsWith('-en.html')?'en':'ar')!==lang||depth.has(target))continue;depth.set(target,depth.get(node)+1);queue.push(target);}}
 const expected=names.filter(n=>(n.endsWith('-en.html')?'en':'ar')===lang);
 for(const f of expected)assert(depth.has(f),`${f}: orphan page in ${lang}`);
 for(const cat of structure.categories){
  const f=structure.categoryUrl(cat.key,lang),s=pages.get(f);
  assert(graph.get(home).has(f),`${home}: category has no direct link ${f}`);
  const section=s.match(/<section[^>]*id="category-products"[^>]*>([\s\S]*?)<\/section>/)?.[1];assert(section,`${f}: missing product listing`);
  const productNames=[...section.matchAll(/href="equipment-([a-z0-9-]+?)(?:-en)?\.html(?:#[^"]*)?"/g)].map(m=>m[1]);
  assert.deepEqual([...new Set(productNames)],cat.ids,`${f}: wrong products or order`);
  for(const id of cat.ids){const p=`equipment-${id}${lang==='en'?'-en':''}.html`;assert(graph.get(f).has(p));assert(graph.get(p).has(f));assert(depth.get(p)<=2,`${p}: too far from home`);}
 }
}
for(const p of catalog){
 const mode=require('./product-training.js').entries[p.id].mode;
 for(const lang of ['ar','en']){const f=`equipment-${p.id}${lang==='en'?'-en':''}.html`;
  if(['planning','accessory'].includes(mode))assert(!ids.get(f).has('equipment-level-beginner'),`${f}: fabricated training levels`);
  else for(const level of ['beginner','intermediate','advanced'])assert(ids.get(f).has('equipment-level-'+level),`${f}: unreachable level`);
 }
}
for(const lang of ['','-en']){
 const f='academy-swiss-ladder'+lang+'.html';
 assert(!links.get(f).some(a=>a.href.startsWith('equipment-')),`${f}: ladder must stay educational`);
 assert(!pages.has('equipment-swiss-ladder'+lang+'.html'));
}
console.log(`Crawled ${pages.size} HTML pages and ${edges} internal links: no broken sections, mixed-language links or orphan pages. All 14 products reachable within two links from each homepage.`);
