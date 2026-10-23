#!/usr/bin/env python3
"""ONE-OFF (already run): series pages + index become split 'flow' views with an All-works sheet."""
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
for p, series in [('index','still-life'),('still-life','still-life'),('landscape','landscape'),('figure','figure'),('drawings','drawings')]:
    f = ROOT/f'{p}.html'; h = f.read_text()
    h1 = re.search(r'<h1 class="sr-only">(.*?)</h1>', h).group(1)
    h = re.sub(r'<main id="main-content".*?</main>',
        f'<main id="main-content" class="series">\n<h1 class="sr-only">{h1}</h1>\n<!-- build:series {series} --><!-- /build:series -->\n</main>', h, flags=re.S)
    h = re.sub(r'\n?<!-- build:dialog -->.*?<!-- /build:dialog -->\n?', '\n', h, flags=re.S)
    if p == 'index':
        h = h.replace('<li><a href="still-life.html">Still Life</a></li>', '<li><a href="still-life.html" class="active" aria-current="page">Still Life</a></li>')
        h = h.replace('  <a href="still-life.html">Still Life</a>', '  <a href="still-life.html" class="active" aria-current="page">Still Life</a>')
    f.write_text(h)
print('ok')
