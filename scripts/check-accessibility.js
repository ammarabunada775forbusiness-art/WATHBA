#!/usr/bin/env node
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
let pages=0,images=0,headings=0;
for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html')&&f!=='product.html')){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,file+': one primary heading');
 let previous=0;
 for(const h of html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)){
  const level=Number(h[1]);
  assert(level<=previous+1,file+': skipped heading level '+h[2].replace(/<[^>]+>/g,'').trim());
  previous=level;headings++;
 }
 for(const img of html.match(/<img\b[^>]*>/g)||[]){
  assert(/\balt="[^"]*"/.test(img),file+': image needs a text alternative or explicit decorative alt');
  if(file.endsWith('-en.html'))assert(!/[\u0600-\u06ff]/.test(img.match(/\balt="([^"]*)"/)[1]),file+': untranslated image description');
  images++;
 }
 const skip=html.match(/<a\b[^>]*class="wathba-skip-link"[^>]*>([^<]+)<\/a>/g)||[];
 assert.equal(skip.length,1,file+': one keyboard skip link');
 assert(/<main\b[^>]*id="wathbaMain"[^>]*tabindex="-1"/.test(html),file+': focusable skip destination');
 assert(skip[0].includes('href="#wathbaMain"'),file+': valid skip target');
 assert(!/<aside\b[^>]*role="dialog"/.test(html),file+': invalid native landmark/dialog role combination');
 pages++;
}
console.log(`Accessibility structure checked: ${pages} pages, ${images} image descriptions, ${headings} ordered headings and keyboard skip links. Automated checks do not certify complete accessibility.`);
