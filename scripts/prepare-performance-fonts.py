# Optional asset refresh. Never required during deployment.
from pathlib import Path
import re,urllib.request,urllib.parse,concurrent.futures
root=Path(__file__).resolve().parent.parent;out=root/'assets/fonts';out.mkdir(exist_ok=True)
texts='\n'.join(p.read_text() for p in [*root.glob('*.html'),*root.glob('assets/js/*.js')])
icons=set()
for s in re.findall(r'material-symbols-outlined[^>]*>\s*([^<]+)',texts):
 s=s.strip()
 if re.fullmatch('[a-z_]+',s):icons.add(s)
icons.update(re.findall(r'icon:\s*["\']([a-z_]+)', texts))
icons.update('menu close shopping_bag shopping_cart add_shopping_cart add remove delete expand_more expand_less chevron_left chevron_right arrow_forward arrow_back check check_circle info warning chat menu_book tune search home fitness_center done fullscreen star location_on call mail language'.split())
ua={'User-Agent':'Mozilla/5.0 AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'}
queries=[('anton','Anton'),('vietnam','Be+Vietnam+Pro:wght@400;500;700'),('symbols','Material+Symbols+Outlined:opsz,wght@24,400&icon_names='+urllib.parse.quote(','.join(sorted(icons))))]
rules=[]
for slug,q in queries:
 css=urllib.request.urlopen(urllib.request.Request('https://fonts.googleapis.com/css2?family='+q+'&display=swap',headers=ua),timeout=25).read().decode()
 blocks=re.findall(r'(?:/\*[^*]+\*/\s*)?@font-face\s*\{[^}]+\}',css)
 for i,b in enumerate(blocks):
  if slug!='symbols' and '/* latin */' not in b:continue
  u=re.search(r'url\(([^)]+)\)',b).group(1);name=f'{slug}-{i}.woff2';data=urllib.request.urlopen(u,timeout=25).read();(out/name).write_bytes(data)
  rules.append(re.sub(r'url\([^)]+\)',f'url(../fonts/{name})',b).replace('font-display: swap','font-display: swap' if slug=='anton' else ('font-display: optional' if slug!='symbols' else 'font-display: block')))
 if slug=='symbols':
  extra=css[css.rfind('}')+1:]
  # Google emits an icon class after font face; preserve only the known class explicitly below.
rules.append(".material-symbols-outlined{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;font-size:24px;line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:'liga';-webkit-font-smoothing:antialiased}")
(root/'assets/css/fonts.css').write_text('\n'.join(rules)+'\n')
for name,repo in [('anton','anton'),('vietnam','bevietnampro'),('symbols','materialsymbolsoutlined')]:
 u=('https://raw.githubusercontent.com/google/material-design-icons/master/LICENSE' if name=='symbols' else 'https://raw.githubusercontent.com/google/fonts/main/ofl/'+repo+'/OFL.txt')
 try:(out/(name+('-LICENSE.txt' if name=='symbols' else '-OFL.txt'))).write_bytes(urllib.request.urlopen(u,timeout=20).read())
 except Exception as e: print('License fetch',name,e)
(root/'scripts/font-icons.json').write_text(__import__('json').dumps(sorted(icons),indent=2)+'\n')
print('font files',[(p.name,p.stat().st_size) for p in out.iterdir()])
print('icons',','.join(sorted(icons)))
