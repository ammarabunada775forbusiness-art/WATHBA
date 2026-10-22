#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const identity = require('./site-identity.json');
const {buildProduct,blockers} = require('./product-schema.js');
const START = '<!-- WATHBA_JSON_LD_START -->';
const END = '<!-- WATHBA_JSON_LD_END -->';
const strip = s => s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const decode = s => s.replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n) => String.fromCodePoint(n[0].toLowerCase()==='x' ? parseInt(n.slice(1),16) : +n)).replace(/&(amp|lt|gt|quot|apos|#39);/g,(_,n) => ({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",'#39':"'"}[n]));
const text = s => decode(strip(s));
const filenameFor = (name, lang) => name + (lang === 'en' ? '-en' : '') + '.html';
const articlePage = file => /^academy-(?!en\.html$)[a-z-]+\.html$/.test(file);
function validOrigin(value) {
  const u = new URL(value);
  if (u.protocol !== 'https:' || u.pathname !== '/' || u.search || u.hash || u.username || u.password) throw Error('Structured data requires an HTTPS origin without a path or credentials.');
  return u.origin;
}
function loadCatalog(root) {
  const context = vm.createContext({window:{}});
  vm.runInContext(fs.readFileSync(path.join(root,'assets/js/products-data.js'),'utf8'),context);
  return vm.runInContext('products',context);
}
function graphFor(file, html, {origin, catalog, facts}) {
  origin = validOrigin(origin);
  const lang = file.endsWith('-en.html') ? 'en' : 'ar';
  const english = lang === 'en', home = origin + '/';
  const url = name => origin + (name === 'index.html' ? '/' : '/' + name);
  const current = url(file), org = home + '#organization', website = home + '#website';
  const heading = text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  if (!heading) throw Error(`Missing headline: ${file}`);
  const description = decode(html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] || '');
  const graph = [
    {'@type':'Organization','@id':org,name:identity.name,alternateName:identity.alternateName,url:home,telephone:identity.telephone,sameAs:identity.sameAs},
    {'@type':'WebSite','@id':website,url:home,name:identity.name,alternateName:identity.alternateName,inLanguage:['ar','en'],publisher:{'@id':org}},
    {'@type':'WebPage','@id':current + '#webpage',url:current,name:heading,description,inLanguage:lang,isPartOf:{'@id':website}}
  ];
  const webpage = graph[2];
  if (!/^index(?:-en)?\.html$/.test(file)) {
    const crumbs = [{name:english ? 'Home' : 'الرئيسية',item:url(filenameFor('index',lang))}];
    if (file.startsWith('equipment-')) crumbs.push({name:english ? 'Equipment' : 'المنتجات',item:url(filenameFor('products',lang))});
    if (articlePage(file)) crumbs.push({name:english ? 'Academy' : 'الأكاديمية',item:url(filenameFor('academy',lang))});
    crumbs.push({name:heading,item:current});
    const id = current + '#breadcrumb';
    graph.push({'@type':'BreadcrumbList','@id':id,itemListElement:crumbs.map((c,i) => ({'@type':'ListItem',position:i+1,...c}))});
    webpage.breadcrumb = {'@id':id};
  }
  if (articlePage(file)) {
    const id = current + '#article';
    graph.push({'@type':'Article','@id':id,url:current,headline:heading,description,inLanguage:lang,
      author:{'@id':org},publisher:{'@id':org},mainEntityOfPage:{'@id':webpage['@id']}});
    webpage.mainEntity = {'@id':id};
    // No invented publication dates, reviewer identities, or article photographs.
  }
  if (file.startsWith('equipment-')) {
    const productId = html.match(/data-wathba-product-id="([^"]+)"/)?.[1];
    const product = catalog.find(p => p.id === productId);
    if (!product) throw Error(`Missing product for structured data: ${file}`);
    const node = buildProduct(product,lang,origin,catalog,facts);
    if (node) { graph.push(node); webpage.mainEntity = {'@id':node['@id']}; }
  }
  return {'@context':'https://schema.org','@graph':graph};
}

function buildStructuredData(options = {}) {
  const root = options.root || path.resolve(__dirname,'..');
  const canonical = fs.readFileSync(path.join(root,'index.html'),'utf8').match(/rel="canonical" href="(https:\/\/[^/]+)/)?.[1];
  const origin = validOrigin(options.origin || process.env.WATHBA_SITE_URL || canonical || identity.origin);
  const catalog = loadCatalog(root), facts = JSON.parse(fs.readFileSync(path.join(root,'scripts/product-facts.json'),'utf8'));
  const files = fs.readdirSync(root).filter(f => /^(index|products|about|contact|academy(?:-[a-z-]+)?|equipment-[a-z0-9-]+)(?:-en)?\.html$/.test(f)).sort();
  const counts = {};
  for (const file of files) {
    const location = path.join(root,file);
    let html = fs.readFileSync(location,'utf8');
    html = html.replace(/<!-- WATHBA_JSON_LD_START -->[\s\S]*?<!-- WATHBA_JSON_LD_END -->\n?/g,'');
    // Retire the old launch-only breadcrumb block; one generator owns all JSON-LD.
    html = html.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi, raw => {
      const parsed = JSON.parse(raw.match(/>([\s\S]*?)<\/script>/i)[1]);
      if (parsed['@type'] === 'BreadcrumbList') return '';
      throw Error(`Unmanaged JSON-LD found in ${file}; review before adding a duplicate.`);
    });
    if (articlePage(file) && !html.includes('data-wathba-article-author')) {
      const byline = langByline(file);
      html = html.replace(/(<\/h1>)/i,`$1<p class="academy-article-author" data-wathba-article-author>${byline}</p>`);
    }
    const graph = graphFor(file,html,{origin,catalog,facts});
    graph['@graph'].forEach(node => counts[node['@type']] = (counts[node['@type']] || 0) + 1);
    const json = JSON.stringify(graph).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
    const block = `${START}\n<script type="application/ld+json" id="wathba-structured-data">${json}</script>\n${END}\n`;
    if (!html.includes('</head>')) throw Error(`Missing head: ${file}`);
    fs.writeFileSync(location,html.replace('</head>',block + '</head>'));
  }
  const pending = catalog.map(p => ({id:p.id,pending:blockers(p,facts)}));
  return {origin,pages:files.length,counts,pending};
}
function langByline(file) { return file.endsWith('-en.html') ? 'Prepared by WATHBA Academy' : 'إعداد أكاديمية وثبة'; }
module.exports = {buildStructuredData,graphFor,validOrigin,loadCatalog,articlePage};
if (require.main === module) console.log(JSON.stringify(buildStructuredData({origin:process.argv[2]}),null,2));
