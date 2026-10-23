// Language-aware image descriptions and keyboard navigation in every static shell.
const fs=require('node:fs'),path=require('node:path');
const imageDescriptions={
 'dheeb-standing-1024.webp':{ar:'ذيب على اليسار برباطين أسودين في الوقفة المتدرجة المعتمدة',en:'Dheeb on the left, black wristbands, in the approved relaxed staggered stance'},
 'sakhr-stretch-1024.webp':{ar:'صخر على اليمين برباطين أبيضين يمدد كتفه بذراع ممتدة أمام الصدر',en:'Sakhr on the right, white wristbands, stretching his shoulder with one arm across his chest'},
 '75ba4e2263d8.webp':{ar:'صورة توضيحية لباراليتس بمقابض خشبية',en:'Illustrative photo of parallettes with wooden handles'},
 'f66c8e0cd854.webp':{ar:'صورة توضيحية لتدريب الوقوف على اليدين باستخدام الباراليتس',en:'Illustrative photo of a handstand on parallettes'},
 '685df9e33e98.webp':{ar:'صورة توضيحية لليدين تمسكان بحلقات جمباز خشبية',en:'Illustrative photo of hands gripping wooden gymnastic rings'},
 '459bc04c89c0.webp':{ar:'صورة توضيحية لسطح مقبض معدني',en:'Illustrative close-up of a metal handle surface'},
 '9f72c660958b.webp':{ar:'صورة توضيحية لمساحة تدريب داخلية',en:'Illustrative indoor training space'},
 '5530be571f7b.webp':{ar:'صورة توضيحية لهيكل تدريب بالعقلة والمتوازي',en:'Illustrative pull-up and parallel-bar training rig'}
};
function decorateIcons(html){return html.replace(/<span\b[^>]*class="[^"]*\bmaterial-symbols-outlined\b[^"]*"[^>]*>/g,tag=>tag.includes('aria-hidden=')?tag:tag.replace(/>$/,' aria-hidden="true">'));}
function buildAccessibility(root){
 for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){
  const location=path.join(root,file),lang=file.endsWith('-en.html')?'en':'ar';
  let html=fs.readFileSync(location,'utf8');
  html=html.replace(/<img\b[^>]*>/g,tag=>{
   const name=tag.match(/\bsrc="assets\/images\/(?:site|characters)\/([^"?]+)/)?.[1],alt=imageDescriptions[name]?.[lang];
   if(!alt)return tag;
   tag=tag.replace(/\s(?:alt|data-alt)="[^"]*"/g,'');
   return tag.replace(/<img\b/,`<img alt="${alt}"`);
  });
  html=html.replace(/<!-- WATHBA_SKIP_START -->[\s\S]*?<!-- WATHBA_SKIP_END -->\n?/g,'');
  html=html.replace(/<main\b([^>]*)>/,(_,attrs)=>`<main${attrs.replace(/\s(?:id|tabindex)="[^"]*"/g,'')} id="wathbaMain" tabindex="-1">`);
  html=html.replace(/(<body\b[^>]*>)/,`$1\n<!-- WATHBA_SKIP_START --><a class="wathba-skip-link" href="#wathbaMain">${lang==='ar'?'انتقل إلى المحتوى':'Skip to content'}</a><!-- WATHBA_SKIP_END -->`);
  fs.writeFileSync(location,decorateIcons(html));
 }
}
module.exports={buildAccessibility,decorateIcons};
