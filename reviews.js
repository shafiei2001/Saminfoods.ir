// ===== REVIEWS LOADER =====
'use strict';

(async function initReviews() {
  try {
    const res = await fetch('/data/reviews.json');
    const data = await res.json();
    const reviews = data.reviews;
    const track = document.getElementById('reviews-track');
    if (!track) return;

    const stars = '⭐⭐⭐⭐⭐';
    const html = reviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div class="review-avatar">${r.avatar}</div>
          <div class="review-meta">
            <div class="review-name">${r.name}</div>
            <div class="review-date">${r.date}</div>
          </div>
        </div>
        <div class="review-stars">${stars.slice(0, r.rating * 2)}</div>
        <p class="review-text">${r.text}</p>
      </div>
    `).join('');

    // Duplicate for infinite loop
    track.innerHTML = html + html;
  } catch (e) {
    console.warn('Reviews load error:', e);
  }
})();
