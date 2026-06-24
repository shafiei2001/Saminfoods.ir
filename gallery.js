// ===== GALLERY LOADER =====
'use strict';

(async function initGallery() {
  try {
    const res = await fetch('/data/gallery.json');
    const data = await res.json();
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    grid.innerHTML = data.images.map(img => `
      <div class="gallery-item ${img.span === 'large' ? 'large' : ''}">
        <img src="${img.src}" alt="${img.alt}" loading="lazy" width="600" height="400">
      </div>
    `).join('');
  } catch (e) {
    console.warn('Gallery load error:', e);
  }
})();
