// ===== MENU LOADER =====
'use strict';

(async function initMenu() {
  let menuData = null;
  let priceData = null;

  try {
    const [menuRes, priceRes] = await Promise.all([
      fetch('/data/menu.json'),
      fetch('/data/prices.json')
    ]);
    menuData = await menuRes.json();
    priceData = await priceRes.json();
  } catch (e) {
    console.warn('Menu data load error:', e);
    return;
  }

  const prices = priceData.prices;
  const currency = priceData.currency;

  // ---- Build Menu Tabs ----
  const tabsEl = document.getElementById('menu-tabs');
  const panelsEl = document.getElementById('menu-panels');
  if (!tabsEl || !panelsEl) return;

  tabsEl.innerHTML = menuData.categories.map((cat, i) => `
    <button class="menu-tab ${i === 0 ? 'active' : ''}" data-cat="${cat.id}" aria-selected="${i === 0}">
      ${cat.icon} ${cat.name}
    </button>
  `).join('');

  panelsEl.innerHTML = menuData.categories.map((cat, i) => `
    <div class="menu-panel ${i === 0 ? 'active' : ''}" id="panel-${cat.id}" role="tabpanel">
      <div class="menu-grid">
        ${cat.items.map(item => buildFoodCard(item, prices, currency)).join('')}
      </div>
    </div>
  `).join('');

  // Tab switching
  tabsEl.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabsEl.querySelectorAll('.menu-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panelsEl.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('panel-' + tab.dataset.cat);
      if (panel) { panel.classList.add('active'); }
    });
  });

  // ---- Build Bestsellers ----
  const bestsellersEl = document.getElementById('bestsellers-grid');
  if (bestsellersEl) {
    const allItems = menuData.categories.flatMap(c => c.items.filter(i => i.bestseller));
    bestsellersEl.innerHTML = allItems.map(item => buildFoodCard(item, prices, currency)).join('');
  }

  function buildFoodCard(item, prices, currency) {
    const price = prices[item.priceKey] || '—';
    return `
      <div class="food-card reveal">
        <div class="food-card-img">
          <img src="${item.image}" alt="${item.name}" loading="lazy" width="400" height="200">
          ${item.bestseller ? '<span class="food-card-badge">⭐ پرفروش</span>' : ''}
        </div>
        <div class="food-card-body">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="food-card-footer">
            <div class="food-price">
              <span class="amount">${price}</span>
              <span class="unit">${currency}</span>
            </div>
            <span class="food-weight">⚖️ ${item.weight}</span>
          </div>
        </div>
        <div style="padding: 0 20px 20px;">
          <a href="tel:09037161259" class="btn btn-gold btn-sm" style="width:100%;justify-content:center;">
            📞 ثبت سفارش سریع
          </a>
        </div>
      </div>
    `;
  }

  // Re-trigger reveal observer for new elements
  document.querySelectorAll('.food-card.reveal').forEach(el => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
})();
