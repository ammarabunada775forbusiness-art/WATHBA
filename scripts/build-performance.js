#!/usr/bin/env node
const crypto=require('node:crypto');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const CleanCSS=require('clean-css'),{PurgeCSS}=require('purgecss'),{minify}=require('terser');
const root=path.resolve(__dirname,'..');
const images=require('./site-images.json'),responsive=require('./responsive-images.json');
const unversion=s=>s.replace(/\?v=[^"'\s<>]*/g,'');
async function build(){
 process.chdir(root);
 const files=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
 for(const f of files){
  let html=fs.readFileSync(f,'utf8');
  html=html.replace(/<link\b[^>]*href="https:\/\/fonts\.(?:googleapis|gstatic)\.com[^>]*>\s*/g,'')
   .replace(/<script\b[^>]*src="https:\/\/cdn\.tailwindcss\.com[^>]*><\/script>\s*/g,'')
   .replace(/<script\b[^>]*src="assets\/js\/tailwind-config\.js[^>]*><\/script>\s*/g,'')
   .replace(/<link\b[^>]*href="assets\/css\/(?:production|fonts)\.css[^>]*>\s*/g,'')
   .replace(/<link\b[^>]*data-wathba-font-preload[^>]*>\s*/g,'');
  for(const [url,image] of Object.entries(images))html=html.replaceAll(url,image.src).replaceAll(url.replaceAll('&','&amp;'),image.src);
  html=html.replace(/<img\b[^>]*>/g,tag=>{
   const src=tag.match(/\bsrc="([^"]+)"/)?.[1]?.split('?')[0],image=responsive[src];
   if(!image || image.sha256 !== crypto.createHash('sha256').update(fs.readFileSync(path.join(root,src))).digest('hex'))return tag;
   tag=tag.replace(/\s(?:width|height|srcset|sizes|decoding)="[^"]*"/g,'');
   const hero=/id="hero-product"|fetchpriority="high"/.test(tag);
   if(!/\bloading=/.test(tag))tag=tag.replace(/\s*\/?>$/,` loading="${hero?'eager':'lazy'}">`);
   if(hero&&!tag.includes('fetchpriority='))tag=tag.replace(/\s*\/?>$/,' fetchpriority="high">');
   const sizes=hero?'(max-width: 1023px) 100vw, 60vw':'(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw';
   return tag.replace(/\s*\/?>$/,` width="${image.width}" height="${image.height}" decoding="async" srcset="${image.srcset}" sizes="${sizes}">`);
  });
  html=html.replace(/<script\b([^>]*?)src="assets\/js\/([^"?]+)(?:\?v=[^"]*)?"([^>]*)><\/script>/g,(_,a,name,b)=>`<script${a.replace(/\bdefer\s*/g,'')}defer src="assets/js/${name.replace(/\.min\.js$/,'.js')}"${b}></script>`);
  if(!html.includes('assets/js/performance.js'))html=html.replace('</head>','<script type="module" src="assets/js/performance.js"></script>\n</head>');
  html=html.replace(/(<script\b)/,'<link data-wathba-font-preload rel="preload" href="assets/fonts/symbols-0.woff2" as="font" type="font/woff2" crossorigin>\n<link data-wathba-font-preload rel="preload" href="assets/fonts/anton-2.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="stylesheet" href="assets/css/fonts.css">\n<link rel="stylesheet" href="assets/css/production.css">\n$1');
  fs.writeFileSync(f,html);
 }
 const input=path.join(root,'node_modules/.cache/wathba-tailwind.css');fs.mkdirSync(path.dirname(input),{recursive:true});fs.writeFileSync(input,'@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
 cp.execFileSync(process.execPath,[require.resolve('tailwindcss/lib/cli.js'),'-c','tailwind.config.cjs','-i',input,'-o','assets/css/production.css','--minify'],{stdio:'inherit'});
 // Preserve all interaction states and media rules; purge only selectors absent from every template/script.
 const cssFiles=['shared-ui','academy','product-seo'];
 const purged=await new PurgeCSS().purge({content:['./*.html','./assets/js/*.js','./scripts/*.js','./scripts/*.json'],css:cssFiles.map(f=>'assets/css/'+f+'.css'),safelist:[/^wathba-/,/^academy-/,/^home-/,/^product-/,/^(open|active|dark|hidden|show)$/],keyframes:false,variables:false,fontFace:false});
 for(let i=0;i<purged.length;i++){
  const result=new CleanCSS({level:{1:{all:true},2:{all:false}}}).minify(purged[i].css);
  if(result.errors.length)throw Error(result.errors.join('\n'));
  fs.writeFileSync('assets/css/'+cssFiles[i]+'.min.css',result.styles);
 }
 // Keep global declarations: separate classic scripts intentionally share lexical bindings.
 for(const file of fs.readdirSync('assets/js').filter(f=>f.endsWith('.js')&&!f.endsWith('.min.js')&&!['tailwind-config.js','performance.js','web-vitals.js'].includes(f))){
  const result=await minify(fs.readFileSync('assets/js/'+file,'utf8'),{compress:{passes:2},mangle:true,format:{comments:false}});
  fs.writeFileSync('assets/js/'+file.replace('.js','.min.js'),result.code);
 }
 fs.copyFileSync(path.join(root,'node_modules/web-vitals/dist/web-vitals.js'),'assets/js/web-vitals.js');
 for(const file of files){
  let html=fs.readFileSync(file,'utf8');
  html=html.replace(/(assets\/css\/(?:shared-ui|academy|product-seo))(?:\.min)?\.css(?:\?v=[^"'\s<>]*)?/g,'$1.min.css')
   .replace(/(src="assets\/js\/)([a-z0-9-]+)\.js"/g,(all,prefix,name)=>['performance','web-vitals'].includes(name)?all:prefix+name+'.min.js"');
  fs.writeFileSync(file,html.replace(/[\t ]+$/gm,''));
 }
 console.log('Static production CSS, responsive images and deferred/minified JavaScript built.');
}
build().catch(e=>{console.error(e);process.exit(1)});
