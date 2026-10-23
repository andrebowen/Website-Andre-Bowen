#!/usr/bin/env python3
"""Generate responsive webp sizes with slugged names.
Reads masters/ (read-only) when present, else the existing webp. Never upscales.
Writes images/<cat-slug>/<slug>-<w>.webp and _build/image-map.json.
Old files are moved to ../v2.0-removed/images-original/ (not deleted)."""
import json, re, shutil, sys
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parent.parent          # v2.0
MASTERS = ROOT.parent / 'masters'
REMOVED = ROOT.parent / 'v2.0-removed' / 'images-original'
WIDTHS = [400, 800, 1200, 1600]
TARGET = 200_000

def slug(s):
    s = s.strip()
    s = re.sub(r'\s+copy$', '', s, flags=re.I)
    s = re.sub(r'^andre[ _]bowen_', '', s, flags=re.I)
    s = s.lower().replace('&', 'and')
    s = re.sub(r'[^a-z0-9.]+', '-', s).replace('.', '-')
    return re.sub(r'-+', '-', s).strip('-')

def save(im, path, width):
    q = 80
    while True:
        im.save(path, 'WEBP', quality=q, method=6)
        if width < 1600 or path.stat().st_size <= TARGET or q <= 60:
            return q
        q -= 4

out = {}
src_files = sorted(p for p in (ROOT/'images').rglob('*.webp') if not re.search(r'-(400|800|1200|1600)\.webp$', p.name))
for p in src_files:
    rel = p.relative_to(ROOT).as_posix()
    cat = p.parent.name
    master = None
    for ext in ('.png', '.jpg', '.tif', '.tiff'):
        m = MASTERS / cat / (p.stem + ext)
        if m.exists(): master = m; break
    src = master or p
    im = Image.open(src); im.load()
    if im.mode not in ('RGB', 'RGBA'): im = im.convert('RGB')
    dest_dir = ROOT/'images'/slug(cat); dest_dir.mkdir(parents=True, exist_ok=True)
    s = slug(p.stem)
    sizes = []
    for w in WIDTHS:
        if w > im.width and sizes: break
        tw = min(w, im.width)
        th = round(im.height * tw / im.width)
        r = im.resize((tw, th), Image.LANCZOS) if tw != im.width else im
        f = dest_dir / f'{s}-{w}.webp'
        q = save(r, f, w)
        sizes.append({'w': tw, 'h': th, 'file': f.relative_to(ROOT).as_posix(), 'bytes': f.stat().st_size, 'q': q})
        if tw == im.width: break
    out[rel] = {'slug': s, 'cat': slug(cat), 'source': 'master' if master else 'webp',
                'orig_bytes': p.stat().st_size, 'sizes': sizes}
    print(rel, '->', s, [x['bytes']//1000 for x in sizes], file=sys.stderr)

(ROOT/'_build'/'image-map.json').write_text(json.dumps(out, indent=1, ensure_ascii=False))
# move originals out (not deleted)
for p in src_files:
    d = REMOVED / p.relative_to(ROOT/'images'); d.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(p), str(d))
for d in sorted((ROOT/'images').iterdir()):
    if d.is_dir() and not any(d.iterdir()): d.rmdir()
