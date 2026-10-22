const fs=require('node:fs'),path=require('node:path');
const structure=require('../assets/js/site-structure.js');
const content=require('./category-content.js');
const training=require('./product-training.js');
const root=path.resolve(__dirname,'..');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const productUrl=(id,lang)=>`equipment-${id}${lang==='en'?'-en':''}.html`;
const core=(name,lang)=>`${name}${lang==='en'?'-en':''}.html`;
function withStyles(html){return html.includes('href="assets/css/product-seo.css')?html:html.replace('</head>','<link rel="stylesheet" href="assets/css/product-seo.css">\n</head>');}
function replaceBlock(html,key,body,before='</main>'){
 const start=`<!-- WATHBA_LINKS_${key}_START -->`,end=`<!-- WATHBA_LINKS_${key}_END -->`;
 const pattern=new RegExp(start+'[\\s\\S]*?'+end+'\\n?','g');
 html=html.replace(pattern,'');
 if(!html.includes(before))throw Error('Missing internal link location: '+key);
 return withStyles(html.replace(before,`${start}${body}${end}\n${before}`));
}
function categoryLinks(lang){return structure.categories.map(c=>`<a href="${structure.categoryUrl(c.key,lang)}">${esc(c[lang])}</a>`).join('');}
function buildSiteLinks(catalog,academyFor){
 const ids=new Set(catalog.map(p=>p.id));
 if(structure.categories.flatMap(c=>c.ids).length!==ids.size||new Set(structure.categories.flatMap(c=>c.ids)).size!==ids.size)throw Error('Every catalog product must belong to one category');
 for(const lang of ['ar','en']){
  const ar=lang==='ar',t=(a,b)=>ar?a:b;
  const productCards=category=>category.ids.map(id=>{
   const p=catalog.find(p=>p.id===id);if(!p)throw Error('Missing category product: '+id);
   const img=p.images[0],alt=img?.temporary?t('صورة توضيحية مؤقتة — ','Temporary illustrative photo — ')+p.name[lang]:p.name[lang];
   return `<article class="wathba-category-product"><a href="${productUrl(id,lang)}"><img src="${esc(p.image)}" alt="${esc(alt)}" width="${img?.width||1200}" height="${img?.height||900}" loading="lazy" decoding="async">${img?.temporary?`<p class="wathba-category-photo-note">${t('صورة توضيحية مؤقتة','Temporary illustrative photo')}</p>`:''}<h3>${esc(p.name[lang])}</h3></a><p>${esc(p.description[lang])}</p><div class="academy-products"><a href="${productUrl(id,lang)}">${t('التفاصيل والقياسات','Details and dimensions')} ↗</a><a href="${productUrl(id,lang)}#equipment-choose">${t('دليل اختيار المعدّة','Equipment choice guide')} ↗</a><a href="${esc(academyFor(id,lang))}">${t('دليل الاستخدام والتعلّم','Use and learning guide')} ↗</a></div></article>`;
  }).join('');
  const template=fs.readFileSync(path.join(root,core('academy-beginner',lang)),'utf8');
  for(const category of structure.categories){
   const copy=content[category.key],file=structure.categoryUrl(category.key,lang);
   const main=`<div class="academy-container academy-breadcrumb"><a href="${core('index',lang)}">${t('الرئيسية','Home')}</a><span>/</span><a href="${core('products',lang)}">${t('كل المعدات','All equipment')}</a><span>/</span><span>${esc(category[lang])}</span></div><header class="academy-hero"><div class="academy-container"><span class="academy-eyebrow">WATHBA / ${t('فئات المعدات','Equipment categories')}</span><h1>${esc(category[lang])}</h1><p>${esc(copy.lead[lang])}</p></div></header><div class="academy-container"><section class="academy-section"><h2>${t('ابدأ باختيار الاستخدام','Start with the intended use')}</h2><ul>${copy.checks.map(v=>`<li>${esc(v[lang])}</li>`).join('')}</ul></section><section class="academy-section" id="category-products"><h2>${t('معدات هذه الفئة','Equipment in this category')}</h2><div class="wathba-category-grid">${productCards(category)}</div></section><section class="academy-section"><h2>${t('قارن فئة أخرى','Compare another category')}</h2><nav class="wathba-discovery-links" aria-label="${t('فئات المعدات','Equipment categories')}">${categoryLinks(lang)}</nav></section></div>`;
   let html=template.replace(/<!-- WATHBA_JSON_LD_START -->[\s\S]*?<!-- WATHBA_JSON_LD_END -->\n?/g,'')
    .replace(/<!-- WATHBA_ABSOLUTE_SEO_START -->[\s\S]*?<!-- WATHBA_ABSOLUTE_SEO_END -->\n?/g,'')
    .replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(category[lang])} | ${t('معدات وثبة في الأردن','WATHBA Equipment in Jordan')}</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/,`$1${esc(copy.lead[lang])}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/,`$1${esc(category[lang])}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/,`$1${esc(copy.lead[lang])}"`)
    .replace(/(<meta property="og:type" content=")[^"]*"/,'$1website"')
    .replace(/data-academy-lang="[^"]*"/,`data-wathba-category="${category.key}"`)
    .replace(/<script src="assets\/js\/academy-language\.js[^>]*><\/script>\n?/,'')
    .replace(/(<main\b[^>]*>)[\s\S]*?<\/main>/,`$1${main}</main>`);
   fs.writeFileSync(path.join(root,file),withStyles(html));
  }
  for(const name of ['index','products']){
   const file=path.join(root,core(name,lang));let html=fs.readFileSync(file,'utf8');
   const body=`<section class="wathba-discovery"><div class="wathba-product-wrap"><h2>${t('تصفّح حسب المعدّة','Browse by equipment')}</h2><p>${t('اختر الفئة، قارن المعدات، ثم افتح دليل الاختيار والتدريب المناسب.','Choose a category, compare equipment, then open its selection and practice guides.')}</p><nav class="wathba-discovery-links" aria-label="${t('فئات معدات وثبة','WATHBA equipment categories')}">${categoryLinks(lang)}</nav><p><a href="${core('academy',lang)}">${t('تعلّم حسب هدفك في أكاديمية وثبة','Learn by goal in WATHBA Academy')} ↗</a></p></div></section>`;
   fs.writeFileSync(file,replaceBlock(html,'CATEGORIES',body));
  }
  for(const product of catalog){
   const category=structure.categoryForProduct(product.id),file=path.join(root,productUrl(product.id,lang));
   let html=fs.readFileSync(file,'utf8');
   const mode=training.entries[product.id].mode,practical=mode==='planning'||mode==='accessory';
   const guide=academyFor(product.id,lang),practice=structure.practiceUrl(guide);
   const steps=`<a href="${productUrl(product.id,lang)}#equipment-choose">${t('قارن الخيارات قبل الطلب','Compare options before ordering')}</a><a href="${esc(practice)}">${practical?t('دليل الاستخدام أو تجهيز الطلب','Use or order-planning guide'):t('شرح التمارين والتدرّج','Exercise technique and progression')}</a>${!practical?`<a href="${productUrl(product.id,lang)}#equipment-exercises">${t('اختر مستوى الممارسة','Choose a practice level')}</a>`:''}`;
   const body=`<section class="wathba-discovery wathba-product-path"><div class="wathba-product-wrap"><nav aria-label="Breadcrumb" class="wathba-path-crumb"><a href="${core('index',lang)}">${t('الرئيسية','Home')}</a><span>/</span><a href="${core('products',lang)}">${t('المعدات','Equipment')}</a><span>/</span><a href="${structure.categoryUrl(category.key,lang)}">${esc(category[lang])}</a><span>/</span><span>${esc(product.name[lang])}</span></nav><h2>${t('من اختيار المعدّة إلى استخدامها','From choosing equipment to using it')}</h2><nav class="wathba-discovery-links" aria-label="${t('مسار الاختيار والتعلّم','Selection and learning path')}">${steps}</nav></div></section>`;
   fs.writeFileSync(file,replaceBlock(html,'PRODUCT_PATH',body,'<section id="productDetailsRoot">'));
  }
  const guideNames=[...new Set(catalog.map(p=>academyFor(p.id,lang).split('#')[0]))].filter(f=>f!==core('academy',lang));
  for(const guide of guideNames){
   const related=catalog.filter(p=>academyFor(p.id,lang).split('#')[0]===guide),file=path.join(root,guide);
   let html=fs.readFileSync(file,'utf8');
   const categories=[...new Set(related.map(p=>structure.categoryForProduct(p.id).key))];
   const body=`<section class="academy-section wathba-guide-equipment" id="guide-equipment-path"><h2>${t('قارن المعدات المرتبطة بهذا الدليل','Compare equipment related to this guide')}</h2><div class="academy-products">${related.map(p=>`<a href="${productUrl(p.id,lang)}#equipment-choose">${t('اختيار ','Choose ')}${esc(p.name[lang])} ↗</a>${!['planning','accessory'].includes(training.entries[p.id].mode)?`<a href="${productUrl(p.id,lang)}#equipment-exercises">${t('مستويات الممارسة: ','Practice levels: ')}${esc(p.name[lang])} ↗</a>`:''}`).join('')}${categories.map(key=>`<a href="${structure.categoryUrl(key,lang)}">${t('تصفّح ','Browse ')}${esc(structure.categories.find(c=>c.key===key)[lang])} ↗</a>`).join('')}</div></section>`;
   fs.writeFileSync(file,replaceBlock(html,'GUIDE_EQUIPMENT',body,'</article>'));
  }
 }
 return {categories:structure.categories.length*2};
}
module.exports={buildSiteLinks};
