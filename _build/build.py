#!/usr/bin/env python3
"""Fill the generated regions of the v2.0 pages. Idempotent: run after editing
_build/artworks.json or regenerating images (images.py).  python3 _build/build.py"""
import json, re, html, datetime
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://andrebowen.com/'
DATA = json.loads((ROOT/'_build/artworks.json').read_text())
IMAP = json.loads((ROOT/'_build/image-map.json').read_text())
OG = 'images/og/the-grove-1200x630.jpg'
PERSON_ID, SITE_ID = SITE + '#person', SITE + '#website'
DIMS = re.compile(r'^\s*(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\s*cm\s*$', re.I)
GALLERIES = ['still-life', 'landscape', 'figure', 'drawings']
e = lambda s: html.escape(s or '', quote=True)

def img_entry(src): return IMAP[src]
def new_src(src): return img_entry(src)['sizes'][-1]['file']

def img(src, alt, sizes, lazy=True, priority=False, cls=''):
    s = img_entry(src)['sizes']; big = s[-1]
    fallback = next((x for x in s if x['w'] >= 800), big)['file']
    srcset = ', '.join(f"{x['file']} {x['w']}w" for x in s)
    attrs = [f'src="{fallback}"', f'srcset="{srcset}"', f'sizes="{sizes}"', f'width="{big["w"]}"', f'height="{big["h"]}"', f'alt="{e(alt)}"']
    attrs += ['fetchpriority="high"', 'decoding="async"'] if priority else (['loading="lazy"', 'decoding="async"'] if lazy else ['decoding="async"'])
    if cls: attrs.insert(0, f'class="{cls}"')
    return '<img ' + ' '.join(attrs) + '>'

def label(a): return a['title'] + (f", {a['year']}" if a.get('year') else '')
def alt(a, cat=None):
    parts = [label(a)]
    meta = ', '.join(x for x in [a.get('medium'), a.get('dims')] if x)
    if meta: parts.append(meta)
    elif cat == 'drawings': parts.append('Drawing')
    return '. '.join(parts) + '.'
def data_attrs(a):
    return f'data-art data-title="{e(a["title"])}" data-year="{e(a.get("year"))}" data-medium="{e(a.get("medium"))}" data-dims="{e(a.get("dims"))}"'
def caption(a, c):
    out = f'<span class="{c}-title">{e(label(a))}</span>'
    if c == 'archive-caption':
        return out + ''.join(f'<span class="{c}-meta">{e(a[k])}</span>' for k in ('medium', 'dims') if a.get(k))
    return out + ''.join(f'<span class="{c}-{k}">{e(a[k])}</span>' for k in ('medium', 'dims') if a.get(k))

def gallery(cat):
    rows = []
    for a in DATA[cat]:
        rows.append(f'''    <figure class="h-item" {data_attrs(a)}>
      <button type="button" class="h-item-bg" aria-label="View larger: {e(label(a))}">{img(a['src'], alt(a, cat), '(min-width: 768px) 410px, 310px')}</button>
      <figcaption class="h-caption">{caption(a, 'h')}</figcaption>
    </figure>''')
    return '\n'.join(rows)

TITLES = {'still-life': 'Still Life', 'landscape': 'Landscape', 'figure': 'Figure', 'drawings': 'Drawings'}
def series(cat):
    works = DATA[cat]; n = len(works); a0 = works[0]
    figs, thumbs = [], []
    for i, a in enumerate(works):
        slug = img_entry(a['src'])['slug']
        cur = ' is-current' if i == 0 else ''
        figs.append(f'''    <figure class="series-work{cur}" data-slug="{slug}" {data_attrs(a)}>
      {img(a['src'], alt(a, cat), '(max-width: 900px) 100vw, 60vw', lazy=i > 0, priority=i == 0)}
    </figure>''')
        thumbs.append(f'''    <figure class="archive-item">
      <a class="archive-btn" href="#work-{slug}" aria-label="{e(label(a))} — view in sequence">{img(a['src'], alt(a, cat), '(max-width: 400px) 45vw, (max-width: 600px) 30vw, 200px')}</a>
      <figcaption class="archive-caption"><span class="archive-caption-title">{e(label(a))}</span></figcaption>
    </figure>''')
    t = TITLES[cat]
    return f'''<section class="series-flow" aria-label="{t}">
  <div class="series-left">
    <p class="series-name">{t}</p>
    <h2 class="dp-title" id="s-title" aria-live="polite">{e(a0['title'])}</h2>
    <p class="dp-year" id="s-year">{e(a0.get('year'))}</p>
    <p class="dp-medium" id="s-medium">{e(a0.get('medium'))}</p>
    <p class="dp-dims" id="s-dims">{e(a0.get('dims'))}</p>
    <div class="series-controls">
      <div class="dp-nav">
        <button type="button" class="dp-nav-btn" id="s-prev" aria-label="Previous work" disabled>Prev</button>
        <button type="button" class="dp-nav-btn" id="s-next" aria-label="Next work"{' disabled' if n < 2 else ''}>Next</button>
      </div>
      <p class="series-count" id="s-count">1 / {n}</p>
      <a class="series-all-btn" href="#all">All works</a>
    </div>
  </div>
  <div class="series-right">
{chr(10).join(figs)}
  </div>
</section>
<section class="series-sheet archive-page" id="all" aria-labelledby="all-title">
  <div class="archive-header">
    <h2 class="archive-title" id="all-title">{t} — all works</h2>
    <span class="archive-count">{n} works</span>
    <a class="series-all-btn series-back" href="#">Back to sequence</a>
  </div>
  <div class="archive-grid">
{chr(10).join(thumbs)}
  </div>
</section>'''

def archive():
    rows = []
    for i, a in enumerate(DATA['archive']):
        rows.append(f'''    <figure class="archive-item" data-cat="{a['cat']}" data-order="{i}" {data_attrs(a)}>
      <button type="button" class="archive-btn" aria-label="View larger: {e(label(a))}">{img(a['src'], alt(a, a['cat']), '(max-width: 400px) 45vw, (max-width: 600px) 30vw, 200px')}</button>
      <figcaption class="archive-caption">{caption(a, 'archive-caption')}</figcaption>
    </figure>''')
    return '\n'.join(rows)

def hero():
    a = DATA['home']['hero'][0]
    meta = ' · '.join(x for x in [a.get('year'), a.get('medium'), a.get('dims')] if x)
    return f'''<div data-lightbox>
  <figure class="hero" {data_attrs(a)}>
    <button type="button" class="hero-btn" aria-label="View larger: {e(label(a))}">{img(a['src'], alt(a), 'calc(100vw - 48px)', priority=True)}</button>
    <figcaption class="hero-info"><h2>{e(a['title'])}</h2><p>{e(meta)}</p></figcaption>
  </figure>
</div>'''

def featured():
    groups = []
    for g in DATA['home']['featured']:
        items = '\n'.join(f'''      <figure class="featured-item" {data_attrs(a)}>
        <button type="button" class="featured-btn" aria-label="View larger: {e(label(a))}">{img(a['src'], alt(a), '(max-width: 600px) 30vw, 240px')}</button>
        <figcaption class="featured-caption">{e(label(a))}</figcaption>
      </figure>''' for a in g['items'])
        groups.append(f'''  <div class="featured-group">
    <h2 class="featured-title"><a href="{g['href']}">{e(g['title'])}</a></h2>
    <div class="featured-row" data-lightbox>
{items}
    </div>
  </div>''')
    return '<section class="featured" aria-label="Selected works">\n' + '\n'.join(groups) + '\n</section>'

DIALOG = '''<div id="detail-panel" role="dialog" aria-modal="true" aria-labelledby="dp-title" tabindex="-1">
  <div class="dp-left">
    <button type="button" class="dp-close">Back</button>
    <h2 class="dp-title" id="dp-title"></h2>
    <p class="dp-year" id="dp-year"></p>
    <p class="dp-medium" id="dp-medium"></p>
    <p class="dp-dims" id="dp-dims"></p>
    <div class="dp-nav">
      <button type="button" class="dp-nav-btn" id="dp-prev" aria-label="Previous work">Prev</button>
      <button type="button" class="dp-nav-btn" id="dp-next" aria-label="Next work">Next</button>
    </div>
  </div>
  <div class="dp-right"><img id="dp-img" alt=""></div>
</div>'''

def og():
    u = SITE + OG
    return (f'<meta property="og:image" content="{u}">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n'
            f'  <meta property="og:image:alt" content="The Grove, 2019, oil on linen, by André Bowen">\n  <meta name="twitter:image" content="{u}">')

HEADSHOT = 'images/Photos/Headshot Andre Bowen.webp'
CONTACT_IMG = 'images/Still life/Andre Bowen_Flowers in a Striped Vase_2019_oil on panel_41x50cm.webp'

def jsonld(page):
    person = {'@type': 'Person', '@id': PERSON_ID, 'name': 'André Bowen', 'url': SITE, 'jobTitle': 'Oil Painter',
      'description': 'Australian oil painter working in still life, landscape, and figurative studies. Based in the Northern Rivers, NSW.',
      'address': {'@type': 'PostalAddress', 'addressRegion': 'Northern Rivers, New South Wales', 'addressCountry': 'AU'},
      'image': SITE + next(x for x in IMAP[HEADSHOT]['sizes'] if x['w'] >= 800 or x is IMAP[HEADSHOT]['sizes'][-1])['file'],
      'email': 'mailto:andrebowen@me.com', 'sameAs': ['https://www.instagram.com/andrebowen']}
    if page == 'about':
        person.update({'nationality': 'Australian', 'alumniOf': [
          {'@type': 'EducationalOrganization', 'name': 'UNSW College of Fine Arts, Sydney'},
          {'@type': 'EducationalOrganization', 'name': 'National Art School, Sydney'},
          {'@type': 'EducationalOrganization', 'name': 'Art Students League of New York'}],
          'award': ['Defiance Gallery Prize, Paddington Art Prize 2018']})
    graph = [person, {'@type': 'WebSite', '@id': SITE_ID, 'url': SITE, 'name': 'André Bowen', 'publisher': {'@id': PERSON_ID}}]
    if page in GALLERIES and page != 'index':
        url = SITE + page + '.html'
        for a in DATA[page]:
            w = {'@type': 'VisualArtwork', 'name': a['title'], 'artform': 'Drawing' if page == 'drawings' else 'Painting',
                 'image': SITE + new_src(a['src']), 'creator': {'@id': PERSON_ID}, 'url': url}
            if a.get('year'): w['dateCreated'] = a['year']
            if a.get('medium'): w['artMedium'] = a['medium']
            m = DIMS.match(a.get('dims') or '')
            if m:  # data is HEIGHT x WIDTH (cm), confirmed by Andre
                w['height'] = {'@type': 'Distance', 'name': f'{m.group(1)} cm'}
                w['width'] = {'@type': 'Distance', 'name': f'{m.group(2)} cm'}
            graph.append(w)
    body = json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, indent=1)
    return f'<script type="application/ld+json">\n{body}\n  </script>'

def fill(h, name, content):
    pat = re.compile(r'(<!-- build:%s(?: [^>]*)? -->).*?(<!-- /build:%s -->)' % (name, name), re.S)
    assert pat.search(h), name
    return pat.sub(lambda m: m.group(1) + '\n' + content + '\n' + m.group(2), h)

def fix_paths(h):
    # any remaining old image path (raw or %20-encoded) -> largest new size
    for old, v in IMAP.items():
        h = h.replace(old, v['sizes'][-1]['file']).replace(old.replace(' ', '%20'), v['sizes'][-1]['file'])
    return h

PAGES = ['index', 'still-life', 'landscape', 'figure', 'drawings', 'archive', 'about']
for p in PAGES:
    f = ROOT/f'{p}.html'; h = f.read_text()
    h = fill(h, 'og', og()); h = fill(h, 'jsonld', jsonld(p)); h = fill(h, 'dialog', DIALOG) if 'build:dialog' in h else h
    if 'build:series' in h: h = fill(h, 'series', series(re.search(r'<!-- build:series (\S+) -->', h).group(1)))
    if p == 'archive':
        n = len(DATA['archive'])
        h = fill(h, 'archive', archive())
        h = fill(h, 'count', f'<span class="archive-count" id="archive-count" aria-live="polite">{n} works</span>')
    if p == 'about': h = fill(h, 'img', img(HEADSHOT, 'André Bowen', '(max-width: 900px) 100vw, 40vw', lazy=False, priority=True))
    f.write_text(fix_paths(h))

for t in ['llms.txt', 'llms-full.txt']:
    f = ROOT/t; f.write_text(fix_paths(f.read_text()))

today = datetime.date.today().isoformat()
urls = ['', 'still-life.html', 'landscape.html', 'figure.html', 'drawings.html', 'archive.html', 'about.html']
(ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + ''.join(f'  <url><loc>{SITE}{u}</loc><lastmod>{today}</lastmod></url>\n' for u in urls) + '</urlset>\n')

todo = ['# Alt text TODO', '', 'Current alt text is built from title, year, medium and size only (see _build/build.py `alt()`).',
        'Add a short visual description per work (what is depicted, palette, mood) as an `alt` field in _build/artworks.json,',
        'then extend `alt()` to use it and re-run `python3 _build/build.py`.', '']
seen = set()
for cat in GALLERIES:
    todo.append(f'## {cat}'); todo.append('')
    for a in DATA[cat]:
        todo.append(f'- [ ] {label(a)} ({a.get("medium") or "no medium listed"}) - `{new_src(a["src"])}`')
    todo.append('')
(ROOT/'_build/alt-text-todo.md').write_text('\n'.join(todo))
print('built')
