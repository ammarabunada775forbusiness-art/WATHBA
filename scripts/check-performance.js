#!/usr/bin/env node
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
let pages=0,images=0;
for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 assert(!/cdn\.tailwindcss\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(html),file+': runtime CSS or remote fonts');
 assert(html.includes('assets/css/production.css'),file+': static utility CSS');
 for(const tag of html.match(/<script\b[^>]*src=[^>]*>/g)||[]) {
  assert(/\bdefer\b|type="module"/.test(tag),file+': blocking script');
  const src=tag.match(/src="([^"]+)"/)?.[1]?.split('?')[0];
  if(src?.startsWith('assets/')) assert(fs.existsSync(path.join(root,src)),file+': missing script '+src);
 }
 for(const tag of html.match(/<img\b[^>]*>/g)||[]) {
  assert(!/src="https?:/.test(tag),file+': remote image');
  assert(/\bwidth="\d+"/.test(tag)&&/\bheight="\d+"/.test(tag),file+': missing image dimensions');
  assert(/\bloading="(?:lazy|eager)"/.test(tag),file+': missing loading policy');
  if(/fetchpriority="high"/.test(tag))assert(!/loading="lazy"/.test(tag),file+': lazy priority image');
  const src=tag.match(/\bsrc="([^"]+)"/)?.[1]?.split('?')[0];
  assert(src&&fs.existsSync(path.join(root,src)),file+': missing image '+src);
  images++;
 }
 if(file.startsWith('equipment-')) {
  assert(html.includes('id="mainProductImage"'),file+': product must start with the interactive layout');
  assert(html.includes('wathba-editorial-note'),file+': attribution');
 }
 pages++;
}
assert(!/wathba-ui-loading body\s*\{\s*opacity:\s*0/.test(fs.readFileSync(path.join(root,'assets/css/shared-ui.css'),'utf8')),'content hidden until JS');
const icons=require('./font-icons.json');
for(const token of ['menu','close','shopping_bag','add_shopping_cart','delete','grid_view','timer','verified'])assert(icons.includes(token),'missing icon '+token);
for(const file of ['production.css','shared-ui.min.css','academy.min.css','product-seo.min.css'])assert(fs.statSync(path.join(root,'assets/css',file)).size>500,file+': empty CSS');
console.log(`Performance contracts passed: ${pages} pages, ${images} images, static CSS, deferred scripts, image geometry and editorial attribution.`);
