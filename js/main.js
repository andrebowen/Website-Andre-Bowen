/* ===== HAMBURGER MENU ===== */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    if (mobileNav) mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
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

function openDetailPanel(items, idx) {
  if (!dp) return;
  dpItems = items;
  dpIndex = idx;
  renderDetailPanel();
  dp.classList.add('open');
  document.body.style.overflow = 'hidden';
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
  dp.classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('dp-img').src = '';
}

window.closeDetailPanel = closeDetailPanel;

/* ===== H-GALLERY ARROWS ===== */
function initHGalleryArrows(galleryId) {
  const gallery = document.getElementById(galleryId);
  if (!gallery) return;
  const wrapper = gallery.closest('.h-gallery-wrap');
  if (!wrapper) return;
  const prev = wrapper.querySelector('.h-arrow-prev');
  const next = wrapper.querySelector('.h-arrow-next');
  if (!prev || !next) return;

  function getScrollAmount() {
    const item = gallery.querySelector('.h-item');
    return item ? item.offsetWidth + 8 : 400;
  }

  function updateArrows() {
    prev.disabled = gallery.scrollLeft <= 1;
    next.disabled = gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 1;
  }

  prev.addEventListener('click', () => gallery.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }));
  next.addEventListener('click', () => gallery.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }));
  gallery.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows();
}

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
      if (dp) openDetailPanel(artworks, i);
      else openLightbox(artworks, i);
    });
    container.appendChild(item);
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
  });
}

/* ===== EVENT LISTENERS ===== */
document.addEventListener('DOMContentLoaded', () => {
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

  // Detail panel
  document.getElementById('dp-prev')?.addEventListener('click', () => {
    if (dpIndex > 0) { dpIndex--; renderDetailPanel(); }
  });
  document.getElementById('dp-next')?.addEventListener('click', () => {
    if (dpIndex < dpItems.length - 1) { dpIndex++; renderDetailPanel(); }
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
      if (e.key === 'ArrowLeft' && dpIndex > 0) { dpIndex--; renderDetailPanel(); }
      if (e.key === 'ArrowRight' && dpIndex < dpItems.length - 1) { dpIndex++; renderDetailPanel(); }
    }
  });
});
