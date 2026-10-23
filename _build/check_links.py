#!/usr/bin/env python3
"""Verify every internal href/src/srcset/url() in v2.0 resolves to a real file (case-sensitive)."""
import re, os, sys, json
from pathlib import Path
from urllib.parse import unquote, urlparse
ROOT = Path(__file__).resolve().parent.parent
def exists_cs(p):
    p = p.resolve(); parts = p.relative_to(ROOT).parts; cur = ROOT
    for part in parts:
        if part not in os.listdir(cur): return False
        cur = cur / part
    return True
bad, n = [], 0
for f in list(ROOT.glob('*.html')) + [ROOT/'css/styles.css', ROOT/'manifest.webmanifest', ROOT/'sitemap.xml', ROOT/'llms.txt', ROOT/'llms-full.txt']:
    t = f.read_text(); refs = re.findall(r'(?:href|src)="([^"]+)"', t) + re.findall(r"url\('([^']+)'\)", t) + re.findall(r'"src": "([^"]+)"', t)
    for ss in re.findall(r'srcset="([^"]+)"', t): refs += [x.strip().split(' ')[0] for x in ss.split(',')]
    refs += re.findall(r'https://andrebowen\.com/([^\s"<)\]]*)', t)
    for r in refs:
        u = urlparse(r)
        if u.scheme in ('mailto', 'tel', 'data') or (u.netloc and u.netloc != 'andrebowen.com') or r.startswith('#'): continue
        path = unquote(u.path).lstrip('/') if u.netloc or r.startswith('/') else unquote(u.path)
        base = ROOT if (u.netloc or r.startswith('/') or f.parent == ROOT) else f.parent
        tgt = (base / path) if path else ROOT/'index.html'
        if tgt.is_dir(): tgt = tgt/'index.html'
        n += 1
        if not tgt.exists() or not exists_cs(tgt): bad.append(f'{f.name}: {r}')
print(f'{n} refs checked, {len(bad)} broken'); print('\n'.join(sorted(set(bad))))
sys.exit(1 if bad else 0)
