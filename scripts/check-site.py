#!/usr/bin/env python3
"""Check crawlable HTML, local navigation, assets and domain finalization."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import hashlib, json, re, shutil, subprocess, tempfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(); self.tags=[]; self.ids=[]; self.resources=[]; self.links=[]; self.lang=None; self.direction=None; self.noindex=False; self.title=''; self.description=None; self.in_title=False; self.language_link=None
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        attr=dict(attrs); self.tags.append(tag)
        if 'id' in attr: self.ids.append(attr['id'])
        if tag == 'html': self.lang=attr.get('lang'); self.direction=attr.get('dir')
        if tag == 'title': self.in_title=True
        if tag == 'meta' and attr.get('name') == 'description': self.description=attr.get('content')
        if tag == 'meta' and attr.get('name') == 'robots': self.noindex='noindex' in attr.get('content','')
        if tag == 'a':
            self.links.append(attr.get('href',''))
            if 'wathba-lang-btn' in attr.get('class',''): self.language_link=attr.get('href')
        if tag in ('img','script','link'):
            resource=attr.get('src') or (attr.get('href') if tag == 'link' and attr.get('rel') in ('stylesheet','icon','preload') else None)
            if resource: self.resources.append(resource)
        if tag == 'img': assert attr.get('alt') is not None and attr.get('width') and attr.get('height'), 'Image needs alt and dimensions'
        if tag == 'script' and attr.get('src'): assert 'defer' in attr, 'JavaScript must not block parsing'
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title=False
    def handle_data(self, data):
        if self.in_title: self.title+=data

pages={p.name:Page(p.read_text()) for p in ROOT.glob('*.html')}
titles=set(); descriptions=set()
for filename,page in pages.items():
    assert page.tags.count('h1') == 1 and page.tags.count('main') == 1, filename+' needs one H1/main'
    assert len(page.ids) == len(set(page.ids)), filename+' has duplicate IDs'
    assert page.lang in ('ar','en') and page.direction == ('rtl' if page.lang=='ar' else 'ltr'), filename+' language mismatch'
    assert page.description and page.title, filename+' metadata missing'
    if not page.noindex:
        assert page.title not in titles, filename+' duplicate title'
        assert page.description not in descriptions, filename+' duplicate description'
        titles.add(page.title); descriptions.add(page.description)
        other=pages.get(page.language_link)
        assert other and other.language_link==filename and other.lang!=page.lang, filename+' language link mismatch'
    for href in page.links+page.resources:
        parsed=urlsplit(href)
        if parsed.scheme or parsed.netloc:
            assert href not in page.resources, filename+' uses a remote rendering dependency'
            continue
        target=unquote(parsed.path) or filename
        assert (ROOT/target).is_file(), filename+' missing '+href
        if parsed.fragment and target in pages: assert unquote(parsed.fragment) in pages[target].ids, filename+' broken anchor '+href
    assert 'wathba-ui-loading' not in (ROOT/filename).read_text(), filename+' hides content until JS'
for css in (ROOT/'assets/css').glob('*.css'):
    for resource in re.findall(r'url\(["\']?([^\)"\']+)',css.read_text()):
        if not resource.startswith(('data:','http:','https:')): assert (css.parent/resource).is_file(), 'Missing CSS resource '+resource

def hashes(directory):
    return {p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in directory.glob('*.html')}
before=hashes(ROOT)
subprocess.run(['node','scripts/build-site.js'],cwd=ROOT,check=True,capture_output=True)
assert before==hashes(ROOT), 'Static build is not reproducible'

with tempfile.TemporaryDirectory(prefix='wathba-seo-test-') as temp:
    clone=Path(temp)/'site'
    shutil.copytree(ROOT,clone,ignore=shutil.ignore_patterns('.git','node_modules','test-results','__pycache__'))
    subprocess.run(['node','scripts/publish-seo.js','https://wathba.test'],cwd=clone,check=True,capture_output=True)
    subprocess.run(['node','scripts/build-site.js'],cwd=clone,check=True,capture_output=True)
    sitemap=ET.parse(clone/'sitemap.xml').getroot()
    assert len(sitemap)==len(titles), 'Sitemap must include every indexable page'
    ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9','x':'http://www.w3.org/1999/xhtml'}
    for entry in sitemap:
        assert len(entry.findall('x:link',ns))==2, 'Every sitemap URL needs both language alternatives'
        assert not any(x in entry.find('s:loc',ns).text for x in ('404','/product.html')), 'Noindex URL in sitemap'
    for filename,page in pages.items():
        source=(clone/filename).read_text()
        if page.noindex: continue
        assert source.count('rel="canonical"')==1 and source.count('rel="alternate"')==2, filename+' absolute SEO lost after rebuild'
        for data in re.findall(r'<script type="application/ld\+json">(.*?)</script>',source): json.loads(data)
    assert not (ROOT/'scripts/seo-origin.json').exists() or json.loads((ROOT/'scripts/seo-origin.json').read_text())['origin']!='https://wathba.test'
print(f'Passed: {len(pages)} HTML pages, {len(titles)} indexable pages, local links/assets, locale pairs, reproducible build and post-build sitemap metadata.')
