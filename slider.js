// ===== HERO SLIDER =====
'use strict';

(async function initSlider() {
  let slides = [];
  let current = 0;
  let timer = null;

  try {
    const res = await fetch('/data/hero.json');
    const data = await res.json();
    slides = data.slides;
    renderSlides();
    startSlider();
  } catch (e) {
    console.warn('Hero data load error:', e);
    // Fallback built-in slides
    slides = [
      { title: 'چلوکباب درباری', subtitle: 'طعم اصیل ایرانی', description: 'کباب برگ و کوبیده با برنج زعفرانی', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1920&q=80', badge: 'پرفروش‌ترین', price: '۱۲۵,۰۰۰' },
      { title: 'زرشک پلو با مرغ', subtitle: 'غذای سنتی اصیل', description: 'مرغ طلایی با برنج زرشک زعفرانی', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1920&q=80', badge: 'محبوب', price: '۱۱۰,۰۰۰' },
      { title: 'چلوکباب کوبیده', subtitle: 'کباب دست‌پخت روزانه', description: 'کوبیده اصیل تهرانی با گوشت تازه', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=1920&q=80', badge: 'تازه', price: '۹۵,۰۰۰' }
    ];
    renderSlides();
    startSlider();
  }

  function renderSlides() {
    const track = document.getElementById('hero-track');
    const dots = document.getElementById('hero-dots');
    if (!track || !dots) return;

    track.innerHTML = slides.map((s, i) => `
      <div class="hero-slide ${i === 0 ? 'active' : ''}" aria-hidden="${i !== 0}">
        <div class="hero-bg" style="background-image:url('${s.image}')" loading="lazy"></div>
        <div class="hero-overlay"></div>
        <div class="container">
          <div class="hero-content">
            <div class="hero-badge">✨ ${s.badge}</div>
            <h1 class="hero-title">${s.title}<span>${s.subtitle}</span></h1>
            <p class="hero-desc">${s.description}</p>
            <div class="hero-price-tag">💰 از ${s.price} تومان</div>
            <div class="hero-actions">
              <a href="tel:09037161259" class="btn btn-gold btn-icon">📞 ثبت سفارش سریع</a>
              <a href="#menu" class="btn btn-outline">🍽️ مشاهده منو</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    dots.innerHTML = slides.map((_, i) => `
      <button class="hero-dot ${i === 0 ? 'active' : ''}" aria-label="اسلاید ${i+1}" data-index="${i}"></button>
    `).join('');

    dots.querySelectorAll('.hero-dot').forEach(dot => {
      dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index)));
    });
  }

  function goTo(n) {
    const slideEls = document.querySelectorAll('.hero-slide');
    const dotEls = document.querySelectorAll('.hero-dot');
    slideEls[current].classList.remove('active');
    slideEls[current].setAttribute('aria-hidden', 'true');
    dotEls[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slideEls[current].classList.add('active');
    slideEls[current].setAttribute('aria-hidden', 'false');
    dotEls[current].classList.add('active');
  }

  function startSlider() {
    timer = setInterval(() => goTo(current + 1), 20000);
  }

  // Prev / Next buttons
  document.getElementById('hero-prev')?.addEventListener('click', () => {
    clearInterval(timer);
    goTo(current - 1);
    startSlider();
  });
  document.getElementById('hero-next')?.addEventListener('click', () => {
    clearInterval(timer);
    goTo(current + 1);
    startSlider();
  });

  // Touch swipe
  let touchStartX = 0;
  const heroEl = document.getElementById('hero');
  heroEl?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  heroEl?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      clearInterval(timer);
      goTo(dx > 0 ? current - 1 : current + 1);
      startSlider();
    }
  }, { passive: true });
})();
