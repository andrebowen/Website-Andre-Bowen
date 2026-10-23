#!/usr/bin/env python3
"""ONE-OFF migration v1 -> v2.0 (already run; kept for the record).
Extracts the inline ARTWORKS data to _build/artworks.json and rewrites page chrome.
Generated regions are marked <!-- build:x --> ... <!-- /build:x --> and filled by build.py."""
import json, re
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
PAGES = ['index','still-life','landscape','figure','drawings','archive','about','contact']
OBJ = re.compile(r"\{([^{}]*)\}")
FIELD = re.compile(r"(\w+):\s*'((?:[^'\\]|\\.)*)'")
def parse(arr): return [dict(FIELD.findall(o)) for o in OBJ.findall(arr)]
def array(html, name):
    m = re.search(r"const %s = \[(.*?)\n\];" % name, html, re.S); return parse(m.group(1)) if m else None

data = {}
for p in PAGES:
    h = (ROOT/f'{p}.html').read_text()
    if p in ('still-life','landscape','figure','drawings'): data[p] = array(h,'ARTWORKS')
    if p == 'archive': data['archive'] = array(h,'ALL_WORKS')
    if p == 'index':
        data['home'] = {'hero': array(h,'heroArt'), 'featured': [
            {'title':'Still Life','href':'still-life.html','items':array(h,'stillFeatured')},
            {'title':'Landscape','href':'landscape.html','items':array(h,'landFeatured')},
            {'title':'Figure','href':'figure.html','items':array(h,'figFeatured')}]}
(ROOT/'_build/artworks.json').write_text(json.dumps(data, indent=1, ensure_ascii=False))

TOGGLE = re.compile(r'\s*<button class="theme-toggle" aria-label="Toggle dark mode">(.*?)</button>', re.S)
HAMB = re.compile(r'\s*<button class="hamburger" aria-label="Open menu">\s*<span></span><span></span>\s*</button>')
for p in PAGES:
    f = ROOT/f'{p}.html'; h = f.read_text()
    h = h.replace("gtag('js', new Date());", "gtag('consent', 'default', {\n      analytics_storage: 'granted',\n      ad_storage: 'denied',\n      ad_user_data: 'denied',\n      ad_personalization: 'denied'\n    });\n    gtag('js', new Date());")
    h = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', '', h, flags=re.S)
    h = re.sub(r'\s*<style>.*?</style>', '', h, flags=re.S)  # archive inline CSS moved to styles.css
    h = re.sub(r'<meta property="og:image" content="[^"]*">', '<!-- build:og --><!-- /build:og -->', h)
    h = re.sub(r'\s*<meta name="twitter:image" content="[^"]*">', '', h)
    h = h.replace('<meta name="color-scheme" content="light dark">',
      '<meta name="color-scheme" content="light dark">\n'
      '  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">\n'
      '  <meta name="theme-color" content="#1c1c1e" media="(prefers-color-scheme: dark)">\n'
      '  <link rel="manifest" href="manifest.webmanifest">\n'
      '  <link rel="preload" href="fonts/figtree-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>')
    h = h.replace('</head>', '  <!-- build:jsonld --><!-- /build:jsonld -->\n</head>', 1)
    t = TOGGLE.search(h).group(1)
    h = TOGGLE.sub('', h)
    h = HAMB.sub('\n    <button type="button" class="theme-toggle" aria-label="Toggle dark mode" aria-pressed="false">' + t + '</button>'
                 '\n    <button type="button" class="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">\n      <span></span><span></span>\n    </button>', h)
    h = re.sub(r'<div class="mobile-nav">(.*?)</div>', r'<nav id="mobile-nav" class="mobile-nav" aria-label="Menu">\1</nav>', h, flags=re.S)
    h = h.replace('<header>\n  <nav>', '<header>\n  <nav aria-label="Main">')
    h = h.replace('rel="noopener" class="footer-instagram" aria-label="Instagram">',
                  'rel="noopener" class="footer-instagram" aria-label="Instagram (opens in a new tab)" title="Instagram (opens in a new tab)">')
    h = h.replace('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">\n        <rect',
                  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">\n        <rect')
    # detail panel + inline data scripts
    h = re.sub(r'<div id="detail-panel">.*?(<script src="js/main.js"></script>).*?(</body>)', r'<!-- build:dialog --><!-- /build:dialog -->\n\n\1\n\2', h, flags=re.S)
    if p in ('still-life','landscape','figure','drawings'):
        title = re.search(r'<title>(.*?) —', h).group(1)
        h = re.sub(r'<div class="h-gallery-wrap">\s*<div class="h-gallery" id="gallery"></div>\s*</div>',
          f'<main id="main-content" class="h-gallery-wrap">\n  <h1 class="sr-only">{title}</h1>\n  <div class="h-gallery" id="gallery" data-lightbox>\n<!-- build:gallery {p} --><!-- /build:gallery -->\n  </div>\n</main>', h)
    if p == 'index':
        h = re.sub(r'<h1 class="sr-only">(.*?)</h1>\s*<!-- Hero -->.*?(<footer>)',
          r'<main id="main-content">\n<h1 class="sr-only">\1</h1>\n<!-- build:hero --><!-- /build:hero -->\n<!-- build:featured --><!-- /build:featured -->\n</main>\n\n\2', h, flags=re.S)
    if p == 'archive':
        h = h.replace('<div class="archive-grid" id="archive-grid"></div>', '<div class="archive-grid" id="archive-grid" data-lightbox>\n<!-- build:archive --><!-- /build:archive -->\n  </div>')
        h = h.replace('<span class="archive-count" id="archive-count" aria-live="polite"></span>', '<!-- build:count --><!-- /build:count -->')
        h = re.sub(r'<button class="chip( active)?" data-filter', lambda m: f'<button type="button" class="chip{m.group(1) or ""}" aria-pressed="{"true" if m.group(1) else "false"}" data-filter', h)
    if p in ('about','contact'):
        h = re.sub(r'<h1 class="sr-only">(.*?)</h1>\s*<div id="main-content" class="(\w+-\w+)">', r'<main id="main-content" class="\2">\n<h1 class="sr-only">\1</h1>', h)
        h = h.replace('<div id="main-content" class="contact-wrap">', '<main id="main-content" class="contact-wrap">')
        h = re.sub(r'</div>(\s*<footer>)', r'</main>\1', h)
        h = re.sub(r'<div class="about-section-label">(.*?)</div>', r'<h2 class="about-section-label">\1</h2>', h)
        h = re.sub(r'<img src="images/[^"]+" alt="([^"]*)">', lambda m: '<!-- build:img %s --><!-- /build:img -->' % ('headshot' if p=='about' else 'contact'), h)
    f.write_text(h)
print('ok')
