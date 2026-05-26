/* ===== MD3 THEME TOGGLE ===== */
const THEME_KEY = 'md-theme';

// Apply saved preference immediately (before paint)
(function () {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

function isDark() {
  const t = document.documentElement.getAttribute('data-theme');
  if (t === 'dark')  return true;
  if (t === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function setTheme(dark) {
  const value = dark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', value);
  localStorage.setItem(THEME_KEY, value);
}

/* ===== MD3 RIPPLE ===== */
function attachRipple(el) {
  el.addEventListener('pointerdown', e => {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'md-ripple';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

/* ===== PAGE TRANSITIONS ===== */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
  if (a.target === '_blank' || a.origin !== location.origin) return;
  e.preventDefault();
  document.body.classList.add('page-exit');
  setTimeout(() => { location.href = a.href; }, 150);
});

/* ===== ACTIVE NAV LINK ===== */
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
  if (a.pathname === location.pathname) a.classList.add('active');
});

/* ===== MD3 HEADER ELEVATION (scroll) ===== */
const headerEl = document.querySelector('header');
if (headerEl) {
  window.addEventListener('scroll', () => {
    headerEl.classList.toggle('elevated', window.scrollY > 4);
  }, { passive: true });
}

/* ===== MD3 NAVIGATION DRAWER ===== */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

const scrim = document.createElement('div');
scrim.className = 'nav-drawer-scrim';
document.body.appendChild(scrim);

function openDrawer() {
  mobileNav.classList.add('open');
  scrim.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  mobileNav.classList.remove('open');
  scrim.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeDrawer() : openDrawer();
  });
}

scrim.addEventListener('click', closeDrawer);

if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeDrawer);
  });
}

/* ===== LIGHTBOX ===== */
let lbItems = [];
let lbIndex = 0;
const lb = document.getElementById('lightbox');

function openLightbox(items, idx) {
  if (!lb) return;
  lbItems = items;
  lbIndex = idx;
  renderLightbox();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderLightbox() {
  const item = lbItems[lbIndex];
  document.getElementById('lb-img').src = item.src;
  document.getElementById('lb-img').alt = item.title;
  document.getElementById('lb-title').textContent = item.title;
  const parts = [item.year, item.medium, item.dims].filter(Boolean);
  document.getElementById('lb-meta').textContent = parts.join('  ·  ');
  document.getElementById('lb-prev').style.visibility = lbIndex > 0 ? 'visible' : 'hidden';
  document.getElementById('lb-next').style.visibility = lbIndex < lbItems.length - 1 ? 'visible' : 'hidden';
}

function closeLightbox() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('lb-img').src = '';
}

window.closeLightbox = closeLightbox;

/* ===== DETAIL PANEL ===== */
const dp = document.getElementById('detail-panel');
let dpItems = [];
let dpIndex = 0;

function openDetailPanel(items, idx, sourceImg) {
  if (!dp) return;
  dpItems = items;
  dpIndex = idx;
  const dpImg = document.getElementById('dp-img');

  const doOpen = () => {
    renderDetailPanel();
    dp.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (dpImg) dpImg.style.viewTransitionName = 'painting';
  };

  if (document.startViewTransition && sourceImg) {
    sourceImg.style.viewTransitionName = 'painting';
    const t = document.startViewTransition(doOpen);
    t.finished.finally(() => { sourceImg.style.viewTransitionName = ''; });
  } else {
    doOpen();
  }
}

function renderDetailPanel() {
  const art = dpItems[dpIndex];
  document.getElementById('dp-img').src = art.src;
  document.getElementById('dp-img').alt = art.title;
  const yearStr = art.year ? `, ${art.year}` : '';
  document.getElementById('dp-title').textContent = art.title + yearStr;
  document.getElementById('dp-medium').textContent = art.medium || '';
  document.getElementById('dp-dims').textContent = art.dims || '';
  document.getElementById('dp-prev').disabled = dpIndex === 0;
  document.getElementById('dp-next').disabled = dpIndex === dpItems.length - 1;
}

function closeDetailPanel() {
  if (!dp) return;
  const dpImg = document.getElementById('dp-img');

  const doClose = () => {
    dp.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (document.startViewTransition) {
    const t = document.startViewTransition(doClose);
    t.finished.finally(() => {
      dpImg.src = '';
      dpImg.style.viewTransitionName = '';
    });
  } else {
    doClose();
    dpImg.src = '';
    dpImg.style.viewTransitionName = '';
  }
}

window.closeDetailPanel = closeDetailPanel;

/* ===== HORIZONTAL SCROLL GALLERY RENDERER ===== */
function renderHGallery(containerId, artworks) {
  const container = document.getElementById(containerId);
  if (!container) return;

  artworks.forEach((art, i) => {
    const item = document.createElement('div');
    item.className = 'h-item';

    const yearStr = art.year ? `, ${art.year}` : '';

    item.innerHTML = `
      <div class="h-item-bg">
        <img src="${art.src}" alt="${art.title}" loading="lazy">
      </div>
      <div class="h-caption">
        <div class="h-title">${art.title}${yearStr}</div>
        ${art.medium ? `<div class="h-medium">${art.medium}</div>` : ''}
        ${art.dims ? `<div class="h-dims">${art.dims}</div>` : ''}
      </div>`;

    item.addEventListener('click', () => {
      const sourceImg = item.querySelector('img');
      if (dp) openDetailPanel(artworks, i, sourceImg);
      else openLightbox(artworks, i);
    });
    container.appendChild(item);
    attachRipple(item);
  });
}

/* ===== GALLERY RENDERER ===== */
function renderGallery(containerId, artworks) {
  const container = document.getElementById(containerId);
  if (!container) return;

  artworks.forEach((art, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const metaParts = [art.year, art.medium, art.dims].filter(Boolean);
    item.innerHTML = `
      <div class="artwork-img">
        <img src="${art.src}" alt="${art.title}" loading="lazy">
      </div>
      <div class="gallery-caption">
        <div class="caption-title">${art.title}</div>
        ${metaParts.length ? `<div class="caption-meta">${metaParts.join(', ')}</div>` : ''}
      </div>`;

    item.addEventListener('click', () => openLightbox(artworks, i));
    container.appendChild(item);
    attachRipple(item);
  });
}

/* ===== EVENT LISTENERS ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Attach ripples to static interactive elements
  document.querySelectorAll(
    '.btn-submit, .dp-close, .dp-nav-btn, .lb-close, .lb-prev, .lb-next, .hamburger, .theme-toggle'
  ).forEach(attachRipple);

  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => setTheme(!isDark()));
  }

  // Lightbox
  if (lb) {
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    document.getElementById('lb-prev')?.addEventListener('click', () => {
      if (lbIndex > 0) { lbIndex--; renderLightbox(); }
    });
    document.getElementById('lb-next')?.addEventListener('click', () => {
      if (lbIndex < lbItems.length - 1) { lbIndex++; renderLightbox(); }
    });
  }

  // Detail panel — tap image area to close on mobile
  document.querySelector('.dp-right')?.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 600px)').matches) closeDetailPanel();
  });

  const withTransition = fn => {
    if (document.startViewTransition) document.startViewTransition(fn);
    else fn();
  };

  document.getElementById('dp-prev')?.addEventListener('click', () => {
    if (dpIndex > 0) withTransition(() => { dpIndex--; renderDetailPanel(); });
  });
  document.getElementById('dp-next')?.addEventListener('click', () => {
    if (dpIndex < dpItems.length - 1) withTransition(() => { dpIndex++; renderDetailPanel(); });
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (lb?.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && lbIndex > 0) { lbIndex--; renderLightbox(); }
      if (e.key === 'ArrowRight' && lbIndex < lbItems.length - 1) { lbIndex++; renderLightbox(); }
    }
    if (dp?.classList.contains('open')) {
      if (e.key === 'Escape') closeDetailPanel();
      if (e.key === 'ArrowLeft' && dpIndex > 0) withTransition(() => { dpIndex--; renderDetailPanel(); });
      if (e.key === 'ArrowRight' && dpIndex < dpItems.length - 1) withTransition(() => { dpIndex++; renderDetailPanel(); });
    }
  });
});
