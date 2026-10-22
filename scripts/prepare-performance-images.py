# Optional asset refresh: Python 3 + Pillow. Never required during deployment.
from pathlib import Path
from PIL import Image
import re,urllib.request,html,json,hashlib,io,concurrent.futures
root=Path(__file__).resolve().parent.parent
texts='\n'.join(p.read_text() for p in root.glob('*.html'))
urls=sorted(set(html.unescape(s) for s in re.findall(r'https://(?:lh3\.googleusercontent\.com|images\.unsplash\.com)[^"\s<>]+',texts)))
out=root/'assets/images/site';out.mkdir(parents=True,exist_ok=True)
def download(u):
 name=hashlib.sha256(u.encode()).hexdigest()[:12]+'.webp';p=out/name
 data=urllib.request.urlopen(u,timeout=35).read()
 im=Image.open(io.BytesIO(data)).convert('RGB');im.thumbnail((1440,1440));im.save(p,'WEBP',quality=80,method=6)
 return u,{'src':str(p.relative_to(root)),'width':im.width,'height':im.height,'sourceBytes':len(data),'bytes':p.stat().st_size}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex: mapping=dict(ex.map(download,urls))
(root/'scripts/site-images.json').write_text(json.dumps(mapping,indent=2)+'\n')
# Reuse equal content between catalog folders, preserving original image hashes and temporary status.
responsive={};out=root/'assets/images/optimized';out.mkdir(parents=True,exist_ok=True)
for p in list(root.glob('assets/images/products/*/*.webp'))+list(root.glob('assets/images/site/*.webp')):
 data=p.read_bytes();digest=hashlib.sha256(data).hexdigest()[:12];im=Image.open(p)
 candidates=[]
 for width in [480,960]:
  if width>=im.width:continue
  size=(width,round(im.height*width/im.width));dest=out/f'{digest}-{width}.webp'
  if not dest.exists():im.resize(size,Image.Resampling.LANCZOS).save(dest,'WEBP',quality=76,method=6)
  candidates.append(f'{dest.relative_to(root)} {width}w')
 candidates.append(f'{p.relative_to(root)} {im.width}w')
 responsive[str(p.relative_to(root))]={'srcset':', '.join(candidates),'width':im.width,'height':im.height,'sha256':hashlib.sha256(data).hexdigest()}
(root/'scripts/responsive-images.json').write_text(json.dumps(responsive,indent=2)+'\n')
print('Site images',len(mapping),'unique responsive files',len(list(out.glob('*'))),'external bytes',sum(v['sourceBytes'] for v in mapping.values()),'local bytes',sum(v['bytes'] for v in mapping.values()))
