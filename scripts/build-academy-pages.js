const fs=require('node:fs');
const path=require('node:path');
const {localize,sources}=require('./product-training.js');
const guides=require('./academy-guides.js');
const root=path.resolve(__dirname,'..');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const prose=s=>esc(s).replace(/\d+(?:[–-]\d+)+/g,'<bdi dir="ltr">$&</bdi>');
const existing=[
 {slug:'beginner',title:{ar:'بداية الكاليستنكس',en:'Start calisthenics'},description:{ar:'الحركات الأساسية وحصة قوة متوازنة دون اشتراط مهارة أو شراء معدّة.',en:'Basic movements and a balanced strength session without a required skill or purchase.'}},
 {slug:'first-pull-up',title:{ar:'كيف أعمل أول عقلة؟',en:'Your first pull-up'},description:{ar:'التعلق والسحب المساعد والتحكم بالنزول مع تدرّج حسب القدرة.',en:'Hanging, assisted pulling and controlled lowering with scalable practice.'}},
 {slug:'parallettes',title:{ar:'ما هي الباراليتس؟',en:'What are parallettes?'},description:{ar:'الضغط والدعم وL-sit ومقارنة الخشب والحديد وارتفاع المقابض.',en:'Push-ups, support and L-sits, plus materials and handle-height choices.'}}
];
function buildAcademy(catalog){
 const available=new Map(catalog.map(p=>[p.id,p]));
 const cards=[...existing,...guides];
 for(const lang of ['ar','en']){
  const ar=lang==='ar',text=(a,b)=>ar?a:b;
  const filename=slug=>`academy${slug?'-'+slug:''}${ar?'':'-en'}.html`;
  const productUrl=id=>`equipment-${id}${ar?'':'-en'}.html`;
  const section=(id,title,body)=>`<section class="academy-section" id="${id}"><h2>${esc(title)}</h2>${body}</section>`;
  const paragraphs=values=>values.map(p=>`<p>${prose(p)}</p>`).join('');
  const links=slugs=>`<div class="academy-products">${slugs.map(slug=>{const found=cards.find(c=>c.slug===slug);if(!found)throw Error('Missing Academy link: '+slug);return `<a href="${filename(slug)}">${esc(found.title[lang])} ↗</a>`;}).join('')}</div>`;
  const template=fs.readFileSync(path.join(root,filename('beginner')),'utf8');
  const header=(title,lead,tags)=>`<div class="academy-container academy-breadcrumb"><a href="${ar?'index.html':'index-en.html'}">${text('الرئيسية','Home')}</a><span aria-hidden="true">/</span><a href="${filename('')}">${text('الأكاديمية','Academy')}</a></div><header class="academy-hero"><div class="academy-container"><span class="academy-eyebrow">WATHBA / ${text('الأكاديمية','Academy')}</span><h1>${esc(title)}</h1><p>${prose(lead)}</p><div class="academy-pills">${tags.map(tag=>`<span>${esc(tag)}</span>`).join('')}</div></div></header>`;
  const publish=(file,source,title,description,main)=>{
   let html=source.replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(title)} | ${text('أكاديمية وثبة','WATHBA Academy')}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/,`$1${esc(description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/,`$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/,`$1${esc(description)}$2`)
    .replace(/(<main\b[^>]*>)[\s\S]*?<\/main>/,`$1${main}</main>`);
   fs.writeFileSync(path.join(root,file),html);
  };
  for(const raw of guides){
   const guide=localize(raw,lang),sections=[...guide.sections];
   const table=`<p>${text('هذه أمثلة قابلة للتخفيف. اختر المرحلة أو الحركة المناسبة لقدرتك وتجهيزك؛ لا تجمع الصفوف كلها كحصة واحدة.','These examples can be reduced. Choose a stage or drill for your ability and setup; do not combine every row into one session.')}</p><div class="academy-table-wrap" role="region" aria-label="${text('أمثلة التدرّج','Progression examples')}" tabindex="0"><table class="academy-table"><thead><tr><th scope="col">${text('الحركة أو المرحلة','Drill or stage')}</th><th scope="col">${text('مثال للمقدار','Example dose')}</th><th scope="col">${text('نقطة التنفيذ','Execution cue')}</th></tr></thead><tbody>${guide.levels.map(row=>`<tr><th scope="row">${esc(row.exercise)}</th><td>${prose(row.dose)}</td><td>${prose(row.cue)}</td></tr>`).join('')}</tbody></table></div>`;
   let article=sections.map(s=>section(s.id,s.title,paragraphs(s.paragraphs))).join('');
   const headings=sections.map(s=>[s.id,s.title]);
   for(const [id,title,body]of [
    ['progressions',text('أمثلة التدرّج حسب قدرتك','Examples to match your ability'),table],
    ['program',text('حصة نموذجية وكيف تتقدم','Example session and progression'),paragraphs(guide.program)],
    ['mistakes',text('أخطاء شائعة','Common mistakes'),`<ul>${guide.mistakes.map(s=>`<li>${prose(s)}</li>`).join('')}</ul>`],
    ['faq',text('أسئلة شائعة','Frequently asked questions'),`<div class="academy-faq">${guide.faqs.map(f=>`<details><summary>${esc(f.q)}</summary><p>${prose(f.a)}</p></details>`).join('')}</div>`],
    ['related',text('تابع التعلم','Continue learning'),links(guide.related)+(guide.products.length?`<h3>${text('معدات مرتبطة بهذا التدريب','Equipment related to this practice')}</h3><div class="academy-products">${guide.products.map(id=>{if(!available.has(id))throw Error('Unlisted Academy product: '+id);return `<a href="${productUrl(id)}">${esc(available.get(id).name[lang])} ↗</a>`;}).join('')}</div>`:'')],
    ['sources',text('المراجع وإعداد الدليل','References and editorial notes'),`<p>${text('أمثلة الحصص والتدرّج من إعداد وثبة للراشدين الأصحاء، وليست برنامجًا فرديًا. توقف عن الحركة المؤلمة وخفف التدريب عند فقدان التحكم. المراجع للشرح العام وليست شهادة اعتماد للمعدّة.','Sessions and progressions are WATHBA educational examples for healthy adults, rather than individual prescriptions. Stop painful movements and regress when control fades. References provide background rather than equipment certification.')}</p><ul class="academy-sources">${guide.sources.map(id=>{const s=sources[id];if(!s)throw Error('Missing source: '+id);return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label[lang])} ↗</a></li>`;}).join('')}</ul><p>${text('تحرير أكاديمية وثبة · مراجعة','WATHBA Academy editorial · reviewed')} <time datetime="2026-10-21" dir="ltr">2026-10-21</time></p>`]
   ]){headings.push([id,title]);article+=section(id,title,body);}
   const aside=`<aside class="academy-toc" aria-label="${text('في هذا الدليل','In this guide')}"><strong>${text('في هذا الدليل','In this guide')}</strong>${headings.map(([id,title])=>`<a href="#${id}">${esc(title)}</a>`).join('')}</aside>`;
   publish(filename(guide.slug),template,guide.title,guide.description,header(guide.title,guide.lead,guide.tags)+`<div class="academy-container academy-article-layout"><article>${article}</article>${aside}</div><section class="academy-container academy-next"><h2>${text('اختر خطوتك التالية','Choose your next step')}</h2><a class="academy-button" href="${filename('')}">${text('كل أدلة الأكاديمية','All Academy guides')} ↗</a></section>`);
  }
  const hubPath=path.join(root,filename('')),hub=fs.readFileSync(hubPath,'utf8');
  const title=text('تعلّم الكاليستنكس حسب هدفك والمعدّة','Learn calisthenics by goal and equipment');
  const description=text('أكاديمية وثبة: أدلة البداية والعقلة والباراليتس والمتوازي والحلقات والمونكي بارز والقبضة والسلم السويدي والقفز بالحبل، مع تدرّج عملي.','WATHBA Academy: practical guides to starting calisthenics, pull-ups, parallettes, dips, rings, monkey bars, grip, wall bars and jump rope.');
  const cardHtml=cards.map((guide,i)=>`<div class="academy-card"><span class="academy-number">${String(i+1).padStart(2,'0')}</span><h3>${esc(guide.title[lang])}</h3><p>${esc(guide.description[lang])}</p><a href="${filename(guide.slug)}">${text('اقرأ الدليل','Read the guide')} ↗</a></div>`).join('');
  let hubBody=header(title,text('ابدأ بالسؤال الذي تريد حله: كيف أعمل أول عقلة؟ كيف أتعلم الديبس؟ أو كيف أستخدم الحلقات والحبل؟ اختر دليلًا مستقلًا بمراحل وتمارين وأخطاء شائعة، ثم قارن المعدات إذا احتجتها.','Start with the question you want to solve: your first pull-up, learning dips or using rings and a rope. Choose a guide with stages, practice examples and common mistakes, then compare equipment if you need it.'),[text('9 أدلة تدريبية','9 training guides'),text('بالعربية والإنجليزية','Arabic and English'),text('حسب القدرة الحالية','For your current ability')]);
  hubBody+=`<div class="academy-container"><article>`+section('start',text('اختر مسارك','Choose your path'),`<div class="academy-grid">${cardHtml}</div>`);
  const topics=[['pulling',text('السحب والتعلق والانتقال','Pulling, hanging and traversing'),['first-pull-up','monkey-bars','swiss-ladder']],['pushing',text('الدفع والدعم والتحكم','Pushing, support and control'),['dips','parallettes']],['rings',text('تدريب الحلقات','Ring training'),['rings']],['grip',text('القبضة والإكسسوارات','Grip and accessories'),['grip','jump-rope']],['custom',text('اختر المعدّة بعد تحديد الحركة','Choose equipment after defining the movement'),['beginner']]];
  for(const[id,heading,slugs]of topics)hubBody+=section(id,heading,links(slugs)+(id==='custom'?`<p>${text('قارن مساحة الحركة والتثبيت وطريقة الوصول والقياسات المؤكدة. حجم القطعة لا يصنف مستوى اللاعب، ووجود دليل في الأكاديمية لا يعني أن المعدّة معروضة للبيع.','Compare movement space, mounting, access and confirmed dimensions. Equipment size does not rank ability, and an Academy guide does not imply that the item is sold.')}</p><div class="academy-products"><a href="${ar?'products.html':'products-en.html'}">${text('قارن معدات المتجر','Compare store equipment')} ↗</a></div>`:''));
  hubBody+='</article></div>';
  publish(filename(''),hub,title,description,hubBody);
 }
 // Preserve old inbound links without leaving a retired commercial page behind.
 for(const name of fs.readdirSync(root).filter(n=>n.endsWith('.html'))){
  let old=fs.readFileSync(path.join(root,name),'utf8'),next=old.replace(/equipment-swiss-ladder(-en)?\.html/g,(_,en)=>`academy-swiss-ladder${en||''}.html`);
  if(old!==next)fs.writeFileSync(path.join(root,name),next);
 }
 for(const lang of ['','-en']){const file=path.join(root,`equipment-swiss-ladder${lang}.html`);if(fs.existsSync(file))fs.unlinkSync(file);}
}
module.exports={buildAcademy};
