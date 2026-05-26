/* ===== MD3 THEME TOGGLE ===== */
const THEME_KEY = 'md-theme';

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
      openDetailPanel(artworks, i, item.querySelector('img'));
    });
    container.appendChild(item);
    attachRipple(item);
  });

  const wrap = container.closest('.h-gallery-wrap');
  if (!wrap) return;

  // Dot indicators
  const dotsEl = document.createElement('div');
  dotsEl.className = 'h-dots';
  artworks.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'h-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to painting ${i + 1}`);
    dot.addEventListener('click', () => scrollToItem(i));
    dotsEl.appendChild(dot);
  });
  wrap.appendChild(dotsEl);

  // Arrow buttons
  const prevBtn = document.createElement('button');
  prevBtn.className = 'h-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'h-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

  wrap.appendChild(prevBtn);
  wrap.appendChild(nextBtn);
  attachRipple(prevBtn);
  attachRipple(nextBtn);

  let activeIndex = 0;

  function scrollToItem(idx) {
    const items = container.querySelectorAll('.h-item');
    const item = items[idx];
    if (!item) return;
    const scrollLeft = item.offsetLeft - (container.offsetWidth - item.offsetWidth) / 2;
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }

  function updateNav() {
    const atStart = container.scrollLeft <= 4;
    const atEnd = container.scrollLeft + container.offsetWidth >= container.scrollWidth - 4;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;

    const center = container.scrollLeft + container.offsetWidth / 2;
    let minDist = Infinity;
    container.querySelectorAll('.h-item').forEach((item, i) => {
      const dist = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center);
      if (dist < minDist) { minDist = dist; activeIndex = i; }
    });
    dotsEl.querySelectorAll('.h-dot').forEach((d, i) => d.classList.toggle('active', i === activeIndex));
  }

  prevBtn.addEventListener('click', () => scrollToItem(Math.max(0, activeIndex - 1)));
  nextBtn.addEventListener('click', () => scrollToItem(Math.min(artworks.length - 1, activeIndex + 1)));
  container.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

/* ===== EVENT LISTENERS ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Attach ripples to static interactive elements
  document.querySelectorAll(
    '.btn-submit, .dp-close, .dp-nav-btn, .hamburger, .theme-toggle'
  ).forEach(attachRipple);

  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => setTheme(!isDark()));
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
    if (dp?.classList.contains('open')) {
      if (e.key === 'Escape') closeDetailPanel();
      if (e.key === 'ArrowLeft' && dpIndex > 0) withTransition(() => { dpIndex--; renderDetailPanel(); });
      if (e.key === 'ArrowRight' && dpIndex < dpItems.length - 1) withTransition(() => { dpIndex++; renderDetailPanel(); });
    }
  });
});
