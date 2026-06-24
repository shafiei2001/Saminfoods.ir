// ===== SAMIN APP.JS =====
'use strict';

// ===== HEADER SCROLL =====
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}, { passive: true });

// ===== MOBILE MENU =====
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a, .btn').forEach(el => {
  el.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== REVEAL ON SCROLL =====
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => revealObs.observe(el));

// ===== FAQ =====
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ===== ANIMATED COUNTERS =====
function animateCounter(el, target, suffix = '', duration = 2000) {
  const start = performance.now();
  const startVal = 0;
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(startVal + (target - startVal) * ease);
    el.textContent = current.toLocaleString('fa-IR') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsSection = document.getElementById('stats');
let countersStarted = false;
const statsObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
    });
  }
}, { threshold: 0.3 });
if (statsSection) statsObs.observe(statsSection);

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
document.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (item) {
    const img = item.querySelector('img');
    if (img) {
      lightboxImg.src = img.src.replace('w=600', 'w=1200');
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
});
document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
function closeLightbox() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// ===== TOAST =====
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== SMOOTH SCROLL FOR NAV =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// ===== PHONE BUTTONS =====
document.querySelectorAll('[data-phone]').forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = 'tel:09037161259';
  });
});

// ===== LOAD SETTINGS =====
fetch('/data/settings.json')
  .then(r => r.json())
  .then(d => {
    const s = d.restaurant;
    document.querySelectorAll('.phone-display').forEach(el => el.textContent = s.phoneDisplay);
  })
  .catch(() => {});

// ===== LOAD OFFER =====
fetch('/data/offers.json')
  .then(r => r.json())
  .then(d => {
    if (!d.active) return;
    const o = d.offer;
    const banner = document.getElementById('offer-banner');
    if (!banner) return;
    const titleEl = banner.querySelector('.offer-title');
    const descEl = banner.querySelector('.offer-desc');
    const condEl = banner.querySelector('.offer-condition');
    const badgeEl = banner.querySelector('.offer-badge span');
    if (titleEl) titleEl.textContent = o.title;
    if (descEl) descEl.textContent = o.description;
    if (condEl) condEl.textContent = o.condition + ' — ' + o.gift;
    if (badgeEl) badgeEl.textContent = o.badge;
  })
  .catch(() => {});

console.log('🍽️ سامین - بارگذاری شد');
