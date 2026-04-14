function applyConfig() {
  try {
    if (typeof RESTAURANT === 'undefined') return;
    const r = RESTAURANT;

    if (r.seo && r.seo.description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = r.seo.description;
    }

    document.getElementById('page-title').textContent = r.name + ' — ' + r.city;
    document.getElementById('nav-brand').textContent = r.name;
    document.getElementById('nav-call').href = r.phoneLink;
    document.getElementById('hero-eyebrow').textContent = r.established + ' · ' + r.type + ' · ' + r.city;

    const words = r.name.split(' ');
    const first = words[0];
    const rest = words.slice(1).join(' ');
    document.getElementById('hero-title').innerHTML = rest
      ? first + '<br><em>' + rest + '</em>'
      : '<em>' + first + '</em>';

    document.getElementById('hero-desc').textContent = r.tagline + ', ' + r.floor.toLowerCase() + ' above the city.';
    document.getElementById('hero-hours').textContent = '🕗 ' + r.hours;
    document.getElementById('hero-city').textContent = '📍 ' + (r.area || r.city.split(',')[0]);
    document.getElementById('hero-btn').href = r.phoneLink;
    document.getElementById('special-dish').textContent = r.special.dish;
    document.getElementById('special-desc').textContent = r.special.desc;
    document.getElementById('special-price').textContent = r.special.price;
    document.getElementById('cta-btn').href = r.phoneLink;
    document.getElementById('cta-phone').textContent = r.phone;
    document.getElementById('info-address').innerHTML = r.address.replace(', ', ',<br>');
    document.getElementById('info-phone').textContent = r.phone;
    document.getElementById('info-phone').href = r.phoneLink;
    document.getElementById('info-hours').textContent = r.days + ' · ' + r.hours;
    document.getElementById('info-experience').textContent = r.experience;
    document.getElementById('map-iframe').src = 'https://maps.google.com/maps?q=' + r.lat + ',' + r.lng + '&z=' + r.mapZoom + '&output=embed';
    document.getElementById('directions-btn').href = 'https://maps.google.com/maps?q=' + r.lat + ',' + r.lng;
    document.getElementById('footer-name').textContent = r.name;
    document.getElementById('footer-address').textContent = r.address;
    document.getElementById('footer-phone').textContent = r.phone;
    document.getElementById('footer-phone').href = r.phoneLink;
    document.getElementById('footer-brand').textContent = r.name;

    if (r.social) {
      const links = [
        r.social.instagram ? '<a href="' + r.social.instagram + '" target="_blank" style="color:var(--gold);text-decoration:none;opacity:0.8;">📸 Instagram</a>' : '',
        r.social.facebook ? '<a href="' + r.social.facebook + '" target="_blank" style="color:var(--gold);text-decoration:none;opacity:0.8;">👍 Facebook</a>' : ''
      ].filter(Boolean).join(' &nbsp;·&nbsp; ');

      const socialEl = document.getElementById('footer-social');
      if (socialEl) {
        if (links) {
          socialEl.style.display = 'block';
          socialEl.style.marginTop = '6px';
          socialEl.innerHTML = links;
        } else {
          socialEl.style.display = 'none';
        }
      }
    }

  } catch (e) {
    console.warn('applyConfig error:', e);
  }
}

const menu = [
  { id: 1, cat: 'Coffee', name: 'Sky Espresso', desc: 'Double shot, rich crema', price: 280, img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=400', emoji: '☕', tags: ['veg'] },
  { id: 2, cat: 'Coffee', name: 'Cold Brew', desc: '12-hr steeped, served over ice', price: 350, img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400', emoji: '🥤', tags: ['veg'] },
  { id: 3, cat: 'Coffee', name: 'Flat White', desc: 'Silky microfoam, single origin', price: 320, img: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=400', emoji: '☕', tags: ['veg'] },
  { id: 4, cat: 'Coffee', name: 'Signature Latte', desc: 'Vanilla, oat milk, caramel drizzle', price: 380, img: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=400', emoji: '🍶', tags: ['veg'] },
  { id: 5, cat: 'Starters', name: 'Truffle Fries', desc: 'Shaved truffle, parmesan, aioli', price: 420, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400', emoji: '🍟', tags: ['veg'] },
  { id: 6, cat: 'Starters', name: 'Crispy Calamari', desc: 'Lemon zest, chilli mayo', price: 480, img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400', emoji: '🦑', tags: ['non'] },
  { id: 7, cat: 'Starters', name: 'Burrata Bruschetta', desc: 'Heirloom tomato, fresh basil', price: 520, img: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=400', emoji: '🧀', tags: ['veg'] },
  { id: 8, cat: 'Starters', name: 'Chicken Wings', desc: 'Smoked BBQ glaze, blue cheese dip', price: 540, img: 'https://images.unsplash.com/photo-1567621113695-bb750b38b657?auto=format&fit=crop&w=400', emoji: '🍗', tags: ['non'] },
  { id: 9, cat: 'Mains', name: 'Grilled Salmon', desc: 'Herb butter, asparagus, lemon', price: 890, img: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=400', emoji: '🐟', tags: ['non'] },
  { id: 10, cat: 'Mains', name: 'Sky Burger', desc: 'Wagyu patty, aged cheddar, brioche', price: 750, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400', emoji: '🍔', tags: ['non'] },
  { id: 11, cat: 'Mains', name: 'Pasta Arrabbiata', desc: 'San Marzano tomato, fresh chilli', price: 620, img: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=400', emoji: '🍝', tags: ['veg'] },
  { id: 12, cat: 'Mains', name: 'Paneer Tikka Bowl', desc: 'Tandoor paneer, saffron rice', price: 580, img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400', emoji: '🍛', tags: ['veg'] },
  { id: 13, cat: 'Desserts', name: 'Dark Choc Lava', desc: 'Molten centre, vanilla bean ice cream', price: 420, img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=400', emoji: '🍫', tags: ['veg'] },
  { id: 14, cat: 'Desserts', name: 'Mango Panna Cotta', desc: 'Alphonso mango, coconut cream', price: 360, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400', emoji: '🥭', tags: ['veg'] },
  { id: 15, cat: 'Desserts', name: 'Tiramisu', desc: 'Mascarpone, espresso, ladyfinger', price: 390, img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400', emoji: '🍰', tags: ['veg'] },
  { id: 16, cat: 'Drinks', name: 'Watermelon Cooler', desc: 'Fresh pressed, mint, sea salt', price: 280, img: 'https://images.unsplash.com/photo-1563229871-1414f99a536c?auto=format&fit=crop&w=400', emoji: '🍉', tags: ['veg'] },
  { id: 17, cat: 'Drinks', name: 'Mango Lassi', desc: 'Thick, sweet, cardamom finish', price: 260, img: 'https://images.unsplash.com/photo-1591244304245-6677fcc06941?auto=format&fit=crop&w=400', emoji: '🥛', tags: ['veg'] },
  { id: 18, cat: 'Drinks', name: 'Virgin Mojito', desc: 'Lime, mint, soda, crushed ice', price: 300, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400', emoji: '🍹', tags: ['veg'] }
];

const catMap = {
  'Coffee': 'Drinks',
  'Drinks': 'Drinks',
  'Starters': 'Food',
  'Mains': 'Food',
  'Desserts': 'Food'
};
const cats = ['All', 'Food', 'Drinks'];
let activecat = 'All';

function renderCats() {
  document.getElementById('cats').innerHTML = cats.map(c =>
    '<button class="cat-btn' + (c === activecat ? ' active' : '') + '" onclick="filterCat(\'' + c + '\')">' + c + '</button>'
  ).join('');
}

function filterCat(c) { activecat = c; renderCats(); renderMenu(); }

function renderMenu() {
  const items = activecat === 'All'
    ? menu
    : menu.filter(function (i) { return catMap[i.cat] === activecat; });

  const noResults = document.getElementById('no-results');
  const grid = document.getElementById('menu-grid');

  if (items.length === 0) {
    noResults.style.display = 'block';
    grid.innerHTML = '';
    return;
  }
  noResults.style.display = 'none';

  const currency = (typeof RESTAURANT !== 'undefined' && RESTAURANT.currency)
    ? RESTAURANT.currency : '₹';

  grid.innerHTML = items.map(function (item) {
    const isVeg = item.tags && item.tags.includes('veg');
    const vegDot = '<div class="item-veg-dot ' + (isVeg ? 'veg' : 'non') + '"></div>';

    const imgContent = item.img
      ? '<img src="' + item.img + '" alt="' + item.name + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;" />'
      : '<span style="font-size:clamp(28px,5vw,42px);">' + item.emoji + '</span>';

    return '<div class="item-card">'
      + '<div class="item-img-wrap">' + imgContent + vegDot + '</div>'
      + '<div class="item-body">'
      + '<p class="item-name">' + item.name + '</p>'
      + '<p class="item-desc">' + item.desc + '</p>'
      + '<div class="item-footer">'
      + '<span class="item-price">' + currency + item.price + '</span>'
      + '<span class="item-cat-tag">' + item.cat + '</span>'
      + '</div></div></div>';
  }).join('');
}

applyConfig();
renderCats();
renderMenu();


// Social links — SVG logos with auto open
(function() {
  try {
    if (typeof RESTAURANT === 'undefined') return;
    var s = RESTAURANT.social;
    if (!s) return;

    var instaSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;margin-right:5px;"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';

    var fbSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;margin-right:5px;"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';

    var links = [];

    if (s.instagram && s.instagram.trim() !== '') {
      // Auto complete instagram URL
      var instaUrl = s.instagram.trim();
      if (!instaUrl.startsWith('http')) {
        instaUrl = 'https://instagram.com/' + instaUrl.replace('@','');
      }
      links.push(
        '<a href="' + instaUrl + '" target="_blank" rel="noopener" style="'
        + 'display:inline-flex;align-items:center;'
        + 'color:#b8952a;text-decoration:none;font-size:12px;font-weight:500;'
        + 'background:rgba(184,149,42,0.1);border:1px solid rgba(184,149,42,0.25);'
        + 'padding:6px 14px;border-radius:20px;gap:4px;'
        + 'transition:all 0.2s;"'
        + ' onmouseover="this.style.background=\'rgba(184,149,42,0.2)\'"'
        + ' onmouseout="this.style.background=\'rgba(184,149,42,0.1)\'">'
        + instaSVG + 'Instagram</a>'
      );
    }

    if (s.facebook && s.facebook.trim() !== '') {
      // Auto complete facebook URL
      var fbUrl = s.facebook.trim();
      if (!fbUrl.startsWith('http')) {
        fbUrl = 'https://facebook.com/' + fbUrl.replace('@','');
      }
      links.push(
        '<a href="' + fbUrl + '" target="_blank" rel="noopener" style="'
        + 'display:inline-flex;align-items:center;'
        + 'color:#b8952a;text-decoration:none;font-size:12px;font-weight:500;'
        + 'background:rgba(184,149,42,0.1);border:1px solid rgba(184,149,42,0.25);'
        + 'padding:6px 14px;border-radius:20px;gap:4px;'
        + 'transition:all 0.2s;"'
        + ' onmouseover="this.style.background=\'rgba(184,149,42,0.2)\'"'
        + ' onmouseout="this.style.background=\'rgba(184,149,42,0.1)\'">'
        + fbSVG + 'Facebook</a>'
      );
    }

    if (links.length === 0) return;

    var el = document.getElementById('footer-social');
    if (el) {
      el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:10px;">' + links.join('') + '</div>';
      el.style.display = 'block';
    }

  } catch(e) {
    console.warn('Social inject error:', e);
  }
})();