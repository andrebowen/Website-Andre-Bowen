/* André Bowen — v2.0. Gallery markup is static HTML (see _build/build.py);
   this script only adds theme, drawer, lightbox, carousel controls and archive filtering. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const withTransition = fn => (document.startViewTransition && !reduceMotion) ? document.startViewTransition(fn) : (fn(), null);
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/* Theme */
const THEME_KEY = 'md-theme';
const isDark = () => {
  const t = document.documentElement.getAttribute('data-theme');
  return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
};
const toggle = $('.theme-toggle');
const syncToggle = () => toggle && toggle.setAttribute('aria-pressed', String(isDark()));
toggle?.addEventListener('click', () => {
  const v = isDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', v);
  try { localStorage.setItem(THEME_KEY, v); } catch (_) {}
  syncToggle();
});
syncToggle();

/* Active nav */
$$('.nav-links a, .mobile-nav a').forEach(a => {
  const here = location.pathname.replace(/\/$/, '/index.html');
  if (a.pathname === here || a.pathname === location.pathname) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
});

/* Header tone on scroll */
const header = $('header');
if (header) addEventListener('scroll', () => header.classList.toggle('elevated', scrollY > 4), { passive: true });

/* Drawer */
const burger = $('.hamburger'), drawer = $('#mobile-nav');
if (burger && drawer) {
  const scrim = document.createElement('div');
  scrim.className = 'nav-drawer-scrim';
  document.body.appendChild(scrim);
  const open = () => {
    drawer.classList.add('open'); scrim.classList.add('open'); burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    $('a', drawer)?.focus();
  };
  const close = (returnFocus = true) => {
    if (!drawer.classList.contains('open')) return;
    drawer.classList.remove('open'); scrim.classList.remove('open'); burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    if (returnFocus) burger.focus();
  };
  burger.addEventListener('click', () => burger.getAttribute('aria-expanded') === 'true' ? close() : open());
  scrim.addEventListener('click', () => close());
  $$('a', drawer).forEach(a => a.addEventListener('click', () => close(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* Lightbox (dialog) */
const dp = $('#detail-panel');
let items = [], idx = 0, opener = null;
if (dp) {
  const img = $('#dp-img'), prev = $('#dp-prev'), next = $('#dp-next');
  dp.hidden = true;
  const render = () => {
    const fig = items[idx], d = fig.dataset, src = $('img', fig);
    img.srcset = src.getAttribute('srcset') || '';
    img.sizes = '(max-width: 900px) 100vw, 60vw';
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    $('#dp-title').textContent = d.title; $('#dp-year').textContent = d.year || '';
    $('#dp-medium').textContent = d.medium || '';
    $('#dp-dims').textContent = d.dims || '';
    prev.disabled = idx === 0;
    next.disabled = idx === items.length - 1;
  };
  const openAt = (list, i, trigger) => {
    items = list; idx = i; opener = trigger;
    const thumb = $('img', list[i]);
    const show = () => {
      render(); dp.hidden = false; dp.classList.add('open');
      document.body.style.overflow = 'hidden';
      img.style.viewTransitionName = 'painting'; thumb.style.viewTransitionName = '';
    };
    thumb.style.viewTransitionName = 'painting';
    const t = withTransition(show);
    if (!t) thumb.style.viewTransitionName = '';
    $('.dp-close', dp).focus({ preventScroll: true });
    t?.finished.finally(() => $('.dp-close', dp).focus({ preventScroll: true }));
  };
  const closeDp = () => {
    if (dp.hidden) return;
    const hide = () => { dp.classList.remove('open'); dp.hidden = true; document.body.style.overflow = ''; img.style.viewTransitionName = ''; };
    const t = withTransition(hide);
    const done = () => { img.removeAttribute('src'); img.removeAttribute('srcset'); opener?.focus({ preventScroll: true }); };
    t ? t.finished.finally(done) : done();
  };
  const step = n => { const j = idx + n; if (j >= 0 && j < items.length) withTransition(() => { idx = j; render(); }); };

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-lightbox] [data-art] button');
    if (!btn) return;
    const fig = btn.closest('[data-art]');
    const list = $$('[data-art]', fig.closest('[data-lightbox]')).filter(f => !f.hidden);
    openAt(list, list.indexOf(fig), btn);
  });
  $('.dp-close', dp).addEventListener('click', closeDp);
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  $('.dp-right', dp).addEventListener('click', () => { if (matchMedia('(max-width: 600px)').matches) closeDp(); });
  document.addEventListener('keydown', e => {
    if (dp.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDp(); }
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'Tab') {                       // focus trap
      const f = $$(FOCUSABLE, dp).filter(el => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dp)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* Horizontal gallery controls (replaces missing initHGalleryArrows) */
$$('.h-gallery').forEach(gal => {
  const wrap = gal.closest('.h-gallery-wrap'), figs = $$('.h-item', gal);
  if (!wrap || figs.length < 2) return;
  const mk = (cls, label, pts) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.setAttribute('aria-label', label);
    b.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="${pts}"/></svg>`;
    wrap.appendChild(b); return b;
  };
  const dots = document.createElement('div'); dots.className = 'h-dots'; dots.setAttribute('aria-hidden', 'true');
  figs.forEach((_, i) => { const d = document.createElement('span'); d.className = 'h-dot' + (i ? '' : ' active'); dots.appendChild(d); });
  wrap.appendChild(dots);
  const prev = mk('h-prev', 'Previous painting', '15 18 9 12 15 6');
  const next = mk('h-next', 'Next painting', '9 18 15 12 9 6');
  let active = 0;
  const go = i => { const f = figs[i]; if (f) gal.scrollTo({ left: f.offsetLeft - (gal.offsetWidth - f.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' }); };
  const update = () => {
    prev.disabled = gal.scrollLeft <= 4;
    next.disabled = gal.scrollLeft + gal.offsetWidth >= gal.scrollWidth - 4;
    const c = gal.scrollLeft + gal.offsetWidth / 2; let min = Infinity;
    figs.forEach((f, i) => { const d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - c); if (d < min) { min = d; active = i; } });
    $$('.h-dot', dots).forEach((d, i) => d.classList.toggle('active', i === active));
  };
  prev.addEventListener('click', () => go(Math.max(0, active - 1)));
  next.addEventListener('click', () => go(Math.min(figs.length - 1, active + 1)));
  gal.addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
});

/* Series flow: one work at a time; #all = contact sheet, #work-<slug> = that work */
const series = $('main.series');
if (series) {
  const works = $$('.series-work', series), sheet = $('#all');
  const T = $('#s-title'), Y = $('#s-year'), M = $('#s-medium'), D = $('#s-dims'), C = $('#s-count'), P = $('#s-prev'), N = $('#s-next');
  let cur = 0;
  const show = (i, push) => {
    cur = Math.max(0, Math.min(works.length - 1, i));
    works.forEach((w, k) => w.classList.toggle('is-current', k === cur));
    const d = works[cur].dataset;
    T.textContent = d.title; Y.textContent = d.year || ''; M.textContent = d.medium || ''; D.textContent = d.dims || '';
    C.textContent = `${cur + 1} / ${works.length}`;
    P.disabled = cur === 0; N.disabled = cur === works.length - 1;
    const n = works[cur + 1]?.querySelector('img'); if (n) n.loading = 'eager';
    const B = $('.series-back', series); if (B) B.href = `#work-${d.slug}`;
    if (push) history.replaceState(null, '', cur === 0 ? location.pathname : `#work-${d.slug}`);
  };
  const route = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    const all = h === 'all';
    series.classList.toggle('show-all', all); series.classList.toggle('show-flow', !all);
    if (all) { scrollTo(0, 0); const t = $(`#all .archive-btn[href="#work-${works[cur].dataset.slug}"]`) || $('#all .archive-btn'); t?.focus({ preventScroll: true }); return; }
    const i = h.startsWith('work-') ? works.findIndex(w => w.dataset.slug === h.slice(5)) : -1;
    show(i >= 0 ? i : (h ? cur : 0));
    if (h.startsWith('work-')) { scrollTo(0, 0); $('.series-all-btn', series)?.focus({ preventScroll: true }); }
  };
  P.addEventListener('click', () => show(cur - 1, true));
  N.addEventListener('click', () => show(cur + 1, true));
  // Native hash navigation (no preventDefault): pushState would not update CSS :target, leaving #all's :target rule hiding the flow.
  $('.series-back', series)?.addEventListener('click', e => { e.currentTarget.href = `#work-${works[cur].dataset.slug}`; });
  document.addEventListener('keydown', e => {
    if (series.classList.contains('show-all') || e.target.closest('input,select,textarea') || $('#mobile-nav.open')) return;
    if (e.key === 'ArrowLeft') show(cur - 1, true); else if (e.key === 'ArrowRight') show(cur + 1, true);
  });
  addEventListener('hashchange', route);
  route();
}

/* Archive: filter + sort the static grid */
const grid = $('#archive-grid');
if (grid) {
  const row = $('.chip-row');
  if (row) {
    const fade = () => row.classList.toggle('has-more', row.scrollWidth - row.clientWidth - row.scrollLeft > 2);
    row.addEventListener('scroll', fade, { passive: true }); addEventListener('resize', fade); fade();
  }
  const chips = $$('.chip[data-filter]'), sel = $('#sort-select'), count = $('#archive-count');
  const all = $$('.archive-item', grid);
  let filter = 'all';
  const apply = () => {
    const dir = sel?.value === 'oldest' ? 1 : -1;
    const yr = f => parseInt(f.dataset.year, 10) || 0;
    all.slice().sort((a, b) => (yr(a) - yr(b)) * dir || a.dataset.order - b.dataset.order).forEach(f => grid.appendChild(f));
    let n = 0;
    all.forEach(f => { f.hidden = !(filter === 'all' || f.dataset.cat === filter); if (!f.hidden) n++; });
    if (count) count.textContent = `${n} work${n === 1 ? '' : 's'}`;
  };
  chips.forEach(c => c.addEventListener('click', () => {
    filter = c.dataset.filter;
    chips.forEach(x => { const on = x === c; x.classList.toggle('active', on); x.setAttribute('aria-pressed', String(on)); });
    apply();
  }));
  sel?.addEventListener('change', apply);
  apply();
}
})();
