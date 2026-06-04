const DEMO_DATA_VERSION = 'v17';
let users = JSON.parse(localStorage.getItem('motox_users')) || [];
let currentUser = localStorage.getItem('motox_user') || null;
let currentPage = 'home';
let currentSlide = 0;
let slideInterval;
let currentBikeTypeFilter = 'All';
let currentBrandFilter = 'All';
let editingId = null;

// ✅ NAVIGATION HISTORY STACK
let viewHistory = [];

const MOTORCYCLE_IMAGES = {
  'KTM': {'250SX': 'https://motohouse.bg/wp-content/uploads/2025/03/KTM_250_SX_2025_MOTOHOUSE2.jpg', '450SX-F': 'https://motohouse.bg/wp-content/uploads/2025/03/KTM_450_SX_F_2025_MOTOHOUSE.jpg', 'default': 'https://motohouse.bg/wp-content/uploads/2025/03/KTM_250_SX_2025_MOTOHOUSE2.jpg'},
  'Yamaha': {'YZ450F': 'https://cdn2.yamaha-motor.eu/prod/product-assets/2026/YZ450F/2026-Yamaha-YZ450F-EU-Icon_Blue-360-Degrees-001-03_Mobile.jpg', 'default': 'https://cdn2.yamaha-motor.eu/prod/product-assets/2026/YZ450F/2026-Yamaha-YZ450F-EU-Icon_Blue-360-Degrees-001-03_Mobile.jpg'},
  'Honda': {'CRF450R': 'https://motorcycles.honda.bg/wp-content/uploads/sites/4/2024/10/370040_the_crf450r_crf450r_50th_anniversary_and_crf450rx_headline_the_23ym_crf.jpg', 'default': 'https://motorcycles.honda.bg/wp-content/uploads/sites/4/2024/10/370040_the_crf450r_crf450r_50th_anniversary_and_crf450rx_headline_the_23ym_crf.jpg'},
  'Husqvarna': {'TE300': 'https://motohouse.bg/wp-content/uploads/2025/03/TE_300_HUSQVARNA_2025_MOTOHOUSE.jpg', 'default': 'https://motohouse.bg/wp-content/uploads/2025/03/TE_300_HUSQVARNA_2025_MOTOHOUSE.jpg'},
  'GasGas': {'EC250': 'https://motohouse.bg/wp-content/uploads/2025/03/gasgas_ec250_2024_motohouse.jpg', 'default': 'https://motohouse.bg/wp-content/uploads/2025/03/gasgas_ec250_2024_motohouse.jpg'},
  'Beta': {'300RR': 'https://overdrivemoto.bg/cdn/img/products/6120/beta-rr-300-2t-racing-my25-68e64d12b8750.png?width=800&height=800&v=1777470534', 'default': 'https://overdrivemoto.bg/cdn/img/products/6120/beta-rr-300-2t-racing-my25-68e64d12b8750.png?width=800&height=800&v=1777470534'},
  'Sherco': {'300 SEF': 'https://enduro21.com/images/2023/june-2023/jonte-reynders-edition-sherco-sef-300/2023-sherco-300sef-jr-a4de-1.jpg', 'default': 'https://enduro21.com/images/2023/june-2023/jonte-reynders-edition-sherco-sef-300/2023-sherco-300sef-jr-a4de-1.jpg'},
  'default': 'https://placehold.co/600x400/333333/ffffff?text=Motorbike&font=roboto'
};
const EQUIPMENT_IMAGES = {
  'Boots': 'https://motohouse.bg/wp-content/uploads/2025/03/TECH_10_BOOTS_BLACK_RED_ALPINESTAR_MOTOHOUSE.jpg',
  'Helmets': 'https://admsport.com/cdn/shop/files/rougeetnoirde3-4.jpg?v=1728475641',
  'Armor': 'https://www.ath-moto.bg/storage/backend/product/105978/main_images/w6s2OnliffLl8K7-chest-protector-55-pro-hd-black.webp',
  'Gloves': 'https://100percent.eu/cdn/shop/files/Z-10016-004_2-Brisker-palm.jpg?v=1772743032',
  'Knee Pads': 'https://motoboom.bg/userfiles/productimages/product_11938.jpg',
  'Armrests': 'https://www.bud-racing.com/media/catalog/product/cache/d680d4086419279eb4470e7ea90e1fbd/a/l/alpinestars-sequence-2019-elbow-guards-anthracite-fluo-yellow.jpg',
  'default': 'https://admsport.com/cdn/shop/files/rougeetnoirde3-4.jpg?v=1728475641'
};

function getMotorcycleImage(brand, title, sub) {
  const t = (title || '').toUpperCase();
  if (MOTORCYCLE_IMAGES[brand]) for (const [m, u] of Object.entries(MOTORCYCLE_IMAGES[brand])) if (m !== 'default' && t.includes(m.toUpperCase())) return u;
  return MOTORCYCLE_IMAGES[brand]?.default || MOTORCYCLE_IMAGES.default;
}
function getEquipmentImage(sub) { return EQUIPMENT_IMAGES[sub] || EQUIPMENT_IMAGES.default; }

const DEFAULT_MOTORBIKES = [
  { id: 101, title: 'KTM 250SX', desc: 'Race-ready 2-stroke. 3h since service. WP suspension, Dunlop tires.', price: 1800, category: 'motorbikes', brand: 'KTM', subcategory: 'Cross', engine: '2T', location: 'Sofia', owner: 'DemoSeller', phone: '+359 888 123456', email: 'ktm.seller@example.com', image: 'https://motohouse.bg/wp-content/uploads/2025/03/KTM_250_SX_2025_MOTOHOUSE2.jpg' },
  { id: 102, title: 'Yamaha YZ450F', desc: '2021 model, 85h, full service. KYB forks, Maxxis MX33 tires.', price: 2500, category: 'motorbikes', brand: 'Yamaha', subcategory: 'Cross', engine: '4T', location: 'Plovdiv', owner: 'DemoSeller', phone: '+359 888 234567', email: 'yamaha.seller@example.com', image: 'https://cdn2.yamaha-motor.eu/prod/product-assets/2026/YZ450F/2026-Yamaha-YZ450F-EU-Icon_Blue-360-Degrees-001-03_Mobile.jpg' },
  { id: 103, title: 'Honda CRF450R', desc: 'Stock condition, <60h. Honda parts serviced, new air filter.', price: 2200, category: 'motorbikes', brand: 'Honda', subcategory: 'Cross', engine: '4T', location: 'Varna', owner: 'DemoSeller', phone: '+359 888 345678', email: 'honda.seller@example.com', image: 'https://motorcycles.honda.bg/wp-content/uploads/sites/4/2024/10/370040_the_crf450r_crf450r_50th_anniversary_and_crf450rx_headline_the_23ym_crf.jpg' },
  { id: 104, title: 'Husqvarna TE300', desc: 'Factory edition, TPI injection. 45h, new K180 tires.', price: 2000, category: 'motorbikes', brand: 'Husqvarna', subcategory: 'Enduro', engine: '2T', location: 'Burgas', owner: 'DemoSeller', phone: '+359 888 456789', email: 'husq.seller@example.com', image: 'https://motohouse.bg/wp-content/uploads/2025/03/TE_300_HUSQVARNA_2025_MOTOHOUSE.jpg' },
  { id: 105, title: 'GasGas EC250', desc: 'Agile off-road, low hours, FMF exhaust.', price: 1850, category: 'motorbikes', brand: 'GasGas', subcategory: 'Enduro', engine: '2T', location: 'Ruse', owner: 'DemoSeller', phone: '+359 888 567890', email: 'gasgas.seller@example.com', image: 'https://motohouse.bg/wp-content/uploads/2025/03/gasgas_ec250_2024_motohouse.jpg' },
  { id: 106, title: 'Beta 300RR', desc: 'Italian race-spec, Sachs suspension, 30h.', price: 1950, category: 'motorbikes', brand: 'Beta', subcategory: 'Enduro', engine: '2T', location: 'Stara Zagora', owner: 'DemoSeller', phone: '+359 888 678901', email: 'beta.seller@example.com', image: 'https://overdrivemoto.bg/cdn/img/products/6120/beta-rr-300-2t-racing-my25-68e64d12b8750.png?width=800&height=800&v=1777470534' },
  { id: 107, title: 'Sherco 300 SEF', desc: 'French enduro, WP suspension, low torque.', price: 2100, category: 'motorbikes', brand: 'Sherco', subcategory: 'Enduro', engine: '4T', location: 'Blagoevgrad', owner: 'DemoSeller', phone: '+359 888 789012', email: 'sherco.seller@example.com', image: 'https://enduro21.com/images/2023/june-2023/jonte-reynders-edition-sherco-sef-300/2023-sherco-300sef-jr-a4de-1.jpg' },
  { id: 108, title: 'KTM 450SX-F', desc: 'Track-focused 4-stroke, 70h, dealer history.', price: 2700, category: 'motorbikes', brand: 'KTM', subcategory: 'Cross', engine: '4T', location: 'Veliko Tarnovo', owner: 'DemoSeller', phone: '+359 888 890123', email: 'ktm450.seller@example.com', image: 'https://motohouse.bg/wp-content/uploads/2025/03/KTM_450_SX_F_2025_MOTOHOUSE.jpg' }
];

const DEFAULT_EQUIPMENT = [
  { id: 201, title: 'Alpinestars Tech 10 Boots', desc: 'Size 10, light wear.', price: 150, category: 'equipment', brand: 'Alpinestars', subcategory: 'Boots', location: 'Sofia', owner: 'DemoSeller', phone: '+359 888 111222', email: 'boots.seller@example.com', image: 'https://motohouse.bg/wp-content/uploads/2025/03/TECH_10_BOOTS_BLACK_RED_ALPINESTAR_MOTOHOUSE.jpg' },
  { id: 202, title: 'Fox Racing V1 Helmet', desc: 'M size, MIPS tech.', price: 95, category: 'equipment', brand: 'Fox Racing', subcategory: 'Helmets', location: 'Plovdiv', owner: 'DemoSeller', phone: '+359 888 222333', email: 'helmet.seller@example.com', image: 'https://admsport.com/cdn/shop/files/rougeetnoirde3-4.jpg?v=1728475641' },
  { id: 203, title: 'Leatt Chest Protector 5.5', desc: 'CE certified, 10h use.', price: 65, category: 'equipment', brand: 'Leatt', subcategory: 'Armor', location: 'Varna', owner: 'DemoSeller', phone: '+359 888 333444', email: 'armor.seller@example.com', image: 'https://www.ath-moto.bg/storage/backend/product/105978/main_images/w6s2OnliffLl8K7-chest-protector-55-pro-hd-black.webp' },
  { id: 204, title: '100% Brisker Gloves', desc: 'Large, black/red.', price: 18, category: 'equipment', brand: '100%', subcategory: 'Gloves', location: 'Burgas', owner: 'DemoSeller', phone: '+359 888 444555', email: 'gloves.seller@example.com', image: 'https://100percent.eu/cdn/shop/files/Z-10016-004_2-Brisker-palm.jpg?v=1772743032' },
  { id: 205, title: 'Thor Knee Guards', desc: 'Adjustable straps.', price: 28, category: 'equipment', brand: 'Thor', subcategory: 'Knee Pads', location: 'Ruse', owner: 'DemoSeller', phone: '+359 888 555666', email: 'knee.seller@example.com', image: 'https://motoboom.bg/userfiles/productimages/product_11938.jpg' },
  { id: 206, title: 'Alpinestars Sequence Elbow', desc: 'Medium size, barely used.', price: 23, category: 'equipment', brand: 'Alpinestars', subcategory: 'Armrests', location: 'Stara Zagora', owner: 'DemoSeller', phone: '+359 888 666777', email: 'elbow.seller@example.com', image: 'https://www.bud-racing.com/media/catalog/product/cache/d680d4086419279eb4470e7ea90e1fbd/a/l/alpinestars-sequence-2019-elbow-guards-anthracite-fluo-yellow.jpg' },
  { id: 207, title: 'Bell Moto-9 Flex Helmet', desc: 'Large, carbon fiber.', price: 215, category: 'equipment', brand: 'Bell', subcategory: 'Helmets', location: 'Blagoevgrad', owner: 'DemoSeller', phone: '+359 888 777888', email: 'bell.seller@example.com', image: 'https://motomax.bg/wp-content/uploads/2023/11/bell_moto_9_flex_seven_aqua.jpg' },
  { id: 208, title: 'Fox Racing Instinct Boots', desc: 'Size 9, Boa closure.', price: 125, category: 'equipment', brand: 'Fox Racing', subcategory: 'Boots', location: 'Veliko Tarnovo', owner: 'DemoSeller', phone: '+359 888 888999', email: 'foxboots.seller@example.com', image: 'https://performancemotoparts.com/cdn/shop/files/36361110_1.webp?v=1755629016&width=640' }
];

function loadDemoData(key, def) {
  const v = localStorage.getItem(key + '_ver');
  if (v !== DEMO_DATA_VERSION || !localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(def));
    localStorage.setItem(key + '_ver', DEMO_DATA_VERSION);
    return JSON.parse(JSON.stringify(def));
  }
  return JSON.parse(localStorage.getItem(key));
}

let motorbikeProducts = loadDemoData('motox_motorbikes', DEFAULT_MOTORBIKES);
let equipmentProducts = loadDemoData('motox_equipment', DEFAULT_EQUIPMENT);
let favorites = JSON.parse(localStorage.getItem('motox_favorites')) || [];

function initImages() {
  motorbikeProducts = motorbikeProducts.map(p => ({...p, image: p.image || getMotorcycleImage(p.brand, p.title, p.subcategory)}));
  equipmentProducts = equipmentProducts.map(p => ({...p, image: p.image || getEquipmentImage(p.subcategory)}));
  saveMotorbikes(); saveEquipment();
}

function saveMotorbikes() { try { localStorage.setItem('motox_motorbikes', JSON.stringify(motorbikeProducts)); } catch(e) { alert('⚠️ Storage full!'); } }
function saveEquipment() { try { localStorage.setItem('motox_equipment', JSON.stringify(equipmentProducts)); } catch(e) { alert('⚠️ Storage full!'); } }
function saveFavorites() { localStorage.setItem('motox_favorites', JSON.stringify(favorites)); }

function updateFavCount() {
  const el = document.getElementById('fav-count');
  if (el) el.textContent = favorites.length;
  saveFavorites();
}

function registerUser(u, p) {
  if (users.find(x => x.username === u)) return false;
  users.push({username: u, password: p});
  localStorage.setItem('motox_users', JSON.stringify(users));
  return true;
}
function loginUser(u, p) {
  const found = users.find(x => x.username === u && x.password === p);
  if (!found) return false;
  currentUser = u;
  localStorage.setItem('motox_user', u);
  return true;
}

function toggleHomeElements(show) {
  const slideshow = document.querySelector('#home-section .hero-slideshow');
  const cards = document.querySelector('#home-section .category-cards');
  const header = document.querySelector('.section-header');
  const title = document.getElementById('home-title');
  if (show) {
    if (slideshow) slideshow.style.display = '';
    if (cards) cards.style.display = '';
    if (header) header.style.display = 'flex';
    if (title) title.style.display = 'block';
  } else {
    if (slideshow) slideshow.style.display = 'none';
    if (cards) cards.style.display = 'none';
    if (header) header.style.display = 'none';
    if (title) title.style.display = 'none';
  }
}

function showPage(page, filter = {}) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(`${page}-section`);
  if (el) { 
    el.classList.add('active'); 
    currentPage = page; 
  }
  window.scrollTo(0,0);
  
  if (page === 'home') {
    toggleHomeElements(true);
    const titleEl = document.getElementById('home-title');
    if (!titleEl.textContent.includes('Search') && !titleEl.textContent.includes('Favorite')) {
      titleEl.innerHTML = '🔥 Featured Listings';
      renderProducts([...motorbikeProducts.slice(0,4), ...equipmentProducts.slice(0,4)], 'home-grid');
    }
  }
  else if (page === 'motorbikes') {
    if (filter.bikeType) currentBikeTypeFilter = filter.bikeType;
    if (filter.brand) currentBrandFilter = filter.brand;
    renderMotorbikeProducts();
    updateFilterUI();
  }
  else if (page === 'equipment') {
    renderEquipmentProducts(filter);
  }
}

function updateFilterUI() {
  document.querySelectorAll('.bike-type-filters .subfilter').forEach(b => b.classList.toggle('active', b.dataset.biketype === currentBikeTypeFilter));
  document.querySelectorAll('.brand-filters .subfilter').forEach(b => b.classList.toggle('active', b.dataset.brand === currentBrandFilter));
}

// ✅ PUSH TO HISTORY & BROWSER STATE
function pushNavigationState() {
  viewHistory.push({ page: currentPage, bikeType: currentBikeTypeFilter, brand: currentBrandFilter });
  history.pushState({ view: 'subpage' }, '', '');
}

// ✅ BROWSER BACK BUTTON HANDLER
window.addEventListener('popstate', () => {
  if (viewHistory.length > 0) {
    const prev = viewHistory.pop();
    showPage(prev.page, { bikeType: prev.bikeType, brand: prev.brand });
  } else {
    showPage('home');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.bike-type-filters .subfilter').forEach(b => b.addEventListener('click', e => {
    e.currentTarget.parentElement.querySelectorAll('.subfilter').forEach(x => x.classList.remove('active'));
    e.currentTarget.classList.add('active');
    currentBikeTypeFilter = e.currentTarget.dataset.biketype;
    renderMotorbikeProducts();
  }));
  
  document.querySelectorAll('.brand-filters .subfilter').forEach(b => b.addEventListener('click', e => {
    e.currentTarget.parentElement.querySelectorAll('.subfilter').forEach(x => x.classList.remove('active'));
    e.currentTarget.classList.add('active');
    currentBrandFilter = e.currentTarget.dataset.brand;
    renderMotorbikeProducts();
  }));

  document.querySelectorAll('#equipment-section .subcategory-filters .subfilter').forEach(btn => {
    btn.addEventListener('click', e => {
      e.currentTarget.parentElement.querySelectorAll('.subfilter').forEach(x => x.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const cat = e.currentTarget.dataset.cat;
      renderEquipmentProducts({ cat: cat === 'All' ? null : cat });
    });
  });
});

function renderMotorbikeProducts() {
  const grid = document.getElementById('motorbikes-grid');
  if(!grid) return; grid.innerHTML = '';
  let f = [...motorbikeProducts];
  if(currentBikeTypeFilter !== 'All') f = f.filter(p => p.subcategory === currentBikeTypeFilter);
  if(currentBrandFilter !== 'All') f = f.filter(p => p.brand === currentBrandFilter);
  f.forEach(p => grid.appendChild(createCard(p, 'motorbikes')));
}

function renderEquipmentProducts(f = {}) {
  const grid = document.getElementById('equipment-grid'); if(!grid) return; grid.innerHTML = '';
  let filtered = [...equipmentProducts];
  if(f.cat && f.cat !== 'All') filtered = filtered.filter(p => p.subcategory === f.cat);
  filtered.forEach(p => grid.appendChild(createCard(p, 'equipment')));
}

function createCard(p, cat) {
  const img = p.image || (cat==='motorbikes' ? getMotorcycleImage(p.brand, p.title, p.subcategory) : getEquipmentImage(p.subcategory));
  const card = document.createElement('div'); card.className = 'card';
  card.innerHTML = `
    <button class="fav-btn ${favorites.includes(p.id)?'active':''}" data-id="${p.id}">${favorites.includes(p.id)?'❤️':'🤍'}</button>
    <div class="card-image"><img src="${img}" alt="${p.title}" onerror="this.src='https://placehold.co/400x300/eee/666?text=No+Image'"></div>
    <div class="card-content">
      <h3>${p.title}</h3>
      <div class="card-meta"><span>${p.brand}</span><span>${p.subcategory}</span><span>📍 ${p.location}</span></div>
      <div class="price">${p.price} EUR</div>
      <div class="contact-buttons">
        <a href="tel:${p.phone}" class="contact-btn phone">📞 Call</a>
        <a href="mailto:${p.email}" class="contact-btn">✉️ Email</a>
      </div>
    </div>`;
  card.querySelector('.card-image').addEventListener('click', () => openDetail(p.id, cat));
  card.querySelector('.fav-btn').addEventListener('click', e => { e.stopPropagation(); toggleFav(p.id); });
  return card;
}

function renderProducts(list, gridId) {
  const g = document.getElementById(gridId); if(!g) return; g.innerHTML = '';
  if(list.length === 0) {
    g.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#666;background:white;border-radius:12px;">No items found.</p>';
    return;
  }
  list.forEach(p => g.appendChild(createCard(p, p.category)));
}

function openDetail(id, cat) {
  const p = (cat==='motorbikes'?motorbikeProducts:equipmentProducts).find(x=>x.id===id);
  if(!p) return;
  pushNavigationState(); // ✅ Saves state for browser back
  
  const img = p.image || (cat==='motorbikes' ? getMotorcycleImage(p.brand, p.title, p.subcategory) : getEquipmentImage(p.subcategory));
  document.getElementById('product-detail').innerHTML = `
    <img src="${img}" alt="${p.title}" onerror="this.src='https://placehold.co/800x400/eee/666?text=No+Image'">
    <h2>${p.title}</h2><div class="detail-meta"><span>🏷️ ${p.brand}</span><span>📦 ${p.subcategory}</span><span>📍 ${p.location}</span><span>👤 ${p.owner||'N/A'}</span></div>
    <div class="price">${p.price} EUR</div><h3 style="margin-top:25px;color:var(--dark-blue);">Description</h3><p>${p.desc}</p>
    <div class="detail-contact">
      <h3>📞 Contact Seller</h3>
      <div class="detail-contact-buttons">
        <a href="tel:${p.phone}" class="detail-contact-btn phone">📞 ${p.phone}</a>
        <a href="mailto:${p.email}" class="detail-contact-btn">✉️ ${p.email}</a>
      </div>
    </div>
    <button class="submit-btn" style="margin-top:20px;max-width:300px;">${favorites.includes(p.id)?'❤️ Remove':'🤍 Add'} to Favorites</button>`;
  document.querySelector('#product-detail .submit-btn').addEventListener('click', () => { toggleFav(p.id); openDetail(p.id, cat); });
  showPage('detail');
}

function toggleFav(id) {
  favorites.includes(id) ? favorites=favorites.filter(f=>f!==id) : favorites.push(id);
  updateFavCount();
  if(currentPage==='motorbikes') renderMotorbikeProducts();
  else if(currentPage==='equipment') renderEquipmentProducts();
  else if(currentPage==='home' && document.getElementById('home-title').textContent.includes('Favorite')) {
    showFavoritesOnly();
  }
}

function showFavoritesOnly() {
  const f = [...motorbikeProducts, ...equipmentProducts].filter(p => favorites.includes(p.id));
  toggleHomeElements(false);
  renderProducts(f, 'home-grid');
  currentPage = 'home';
  window.scrollTo(0,0);
}

document.getElementById('btn-favorites').addEventListener('click', showFavoritesOnly);

document.getElementById('search-btn').addEventListener('click', performSearch);
document.getElementById('search-input').addEventListener('keypress', e => { if(e.key==='Enter') performSearch(); });

function performSearch() {
  const q = document.getElementById('search-input').value.trim();
  if(!q) {
    toggleHomeElements(true);
    document.getElementById('home-title').innerHTML = '🔥 Featured Listings';
    renderProducts([...motorbikeProducts.slice(0,4), ...equipmentProducts.slice(0,4)], 'home-grid');
    showPage('home');
    return;
  }
  const query = q.toLowerCase();
  const results = [...motorbikeProducts, ...equipmentProducts].filter(p => {
    const searchText = `${p.title} ${p.brand} ${p.desc} ${p.subcategory} ${p.location}`.toLowerCase();
    return searchText.includes(query);
  });
  document.getElementById('home-title').innerHTML = `🔍 Search Results for "${q}" (${results.length} items)`;
  renderProducts(results, 'home-grid');
  showPage('home');
}

function openProfile() {
  if(!currentUser) return alert('⚠️ Please login first!');
  pushNavigationState(); // ✅ Saves state for browser back
  document.getElementById('profile-username').textContent = currentUser;
  renderMyListings();
  showPage('profile');
}

function renderMyListings() {
  const grid = document.getElementById('my-listings-grid'); 
  grid.innerHTML = '';
  const mine = [...motorbikeProducts, ...equipmentProducts].filter(p => p.owner === currentUser);
  if (mine.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#666;padding:30px;">No listings yet. <a href="#" onclick="openAddForm()">Create one!</a></p>';
    return;
  }
  mine.forEach(p => {
    const card = createCard(p, p.category);
    card.style.position = 'relative';
    const actions = document.createElement('div');
    actions.style.cssText = 'position:absolute;top:10px;right:10px;display:flex;gap:8px;z-index:20;';
    
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️ Edit';
    editBtn.style.cssText = 'background:#FFAA00;color:black;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;font-weight:bold;font-size:0.8rem;';
    editBtn.onclick = (e) => { e.stopPropagation(); openAddForm(p.category, p.id); };
    
    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️ Delete';
    delBtn.style.cssText = 'background:#ff1744;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;font-weight:bold;font-size:0.8rem;';
    delBtn.onclick = (e) => { e.stopPropagation(); deleteListing(p.id); };
    
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    card.appendChild(actions);
    grid.appendChild(card);
  });
}

window.deleteListing = (id) => {
  if(!confirm('Delete this listing?')) return;
  motorbikeProducts = motorbikeProducts.filter(p=>p.id!==id);
  equipmentProducts = equipmentProducts.filter(p=>p.id!==id);
  saveMotorbikes(); saveEquipment(); renderMyListings();
  updateFavCount();
};

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

document.getElementById('edit-profile-form').addEventListener('submit', e => {
  e.preventDefault();
  const newPass = document.getElementById('edit-password').value;
  const idx = users.findIndex(u=>u.username===currentUser);
  if(idx>-1) { users[idx].password = newPass; localStorage.setItem('motox_users', JSON.stringify(users)); alert('✅ Password updated!'); }
});

document.getElementById('btn-delete-account').addEventListener('click', () => {
  if(confirm('⚠️ This is permanent. Delete account & listings?')) {
    users = users.filter(u=>u.username!==currentUser);
    localStorage.setItem('motox_users', JSON.stringify(users));
    motorbikeProducts = motorbikeProducts.filter(p=>p.owner!==currentUser);
    equipmentProducts = equipmentProducts.filter(p=>p.owner!==currentUser);
    saveMotorbikes(); saveEquipment();
    localStorage.removeItem('motox_user'); currentUser = null;
    location.reload();
  }
});

function openAddForm(cat='', editId=null) {
  if(!currentUser) return alert('⚠️ Please login first!');
  editingId = editId;
  pushNavigationState(); // ✅ Saves state for browser back
  const form = document.getElementById('add-form');
  form.reset();
  document.getElementById('image-preview').innerHTML = '';
  document.getElementById('add-image-base64').value = '';
  
  const btn = form.querySelector('.submit-btn');
  
  if (editId) {
    const p = [...motorbikeProducts, ...equipmentProducts].find(x => x.id === editId);
    if (p) {
      document.getElementById('add-title').value = p.title;
      document.getElementById('add-price').value = p.price;
      document.getElementById('add-desc').value = p.desc;
      document.getElementById('add-main-category').value = p.category;
      updateSubcategories();
      setTimeout(() => {
        document.getElementById('add-subcategory').value = p.subcategory;
        document.getElementById('add-brand').value = p.brand;
        document.getElementById('add-location').value = p.location;
        document.getElementById('add-phone').value = p.phone || '';
        document.getElementById('add-email').value = p.email || '';
        document.getElementById('add-image-base64').value = p.image || '';
        if (p.image && p.image.startsWith('data:')) {
          document.getElementById('image-preview').innerHTML = `<img src="${p.image}">`;
        }
      }, 50);
      btn.textContent = '💾 Update Listing';
    }
  } else {
    btn.textContent = '🚀 Publish Listing';
    if (cat) {
      document.getElementById('add-main-category').value = cat;
      updateSubcategories();
    }
  }
  showPage('add');
}

function updateSubcategories() {
  const c = document.getElementById('add-main-category').value;
  const s = document.getElementById('add-subcategory'); s.innerHTML='<option value="">Select</option>'; s.disabled=!c;
  document.getElementById('motorbike-brands').style.display = c==='motorbikes'?'block':'none';
  document.getElementById('gear-brands').style.display = c==='equipment'?'block':'none';
  const opts = c==='motorbikes'?['Enduro','Cross','Track','Trail']:['Helmets','Boots','Gloves','Armor','Knee Pads','Armrests'];
  opts.forEach(o => s.appendChild(new Option(o, o)));
}

const imgInput = document.getElementById('add-image-file');
imgInput.addEventListener('change', e => {
  const f = e.target.files[0]; if(!f) return;
  if(f.size>2097152) { alert('⚠️ Max 2MB'); e.target.value=''; return; }
  const r = new FileReader(); r.onload = ev => { document.getElementById('add-image-base64').value = ev.target.result; document.getElementById('image-preview').innerHTML=`<img src="${ev.target.result}">`; };
  r.readAsDataURL(f);
});

document.getElementById('add-form').addEventListener('submit', e => {
  e.preventDefault();
  const c = document.getElementById('add-main-category').value;
  const newItem = {
    id: editingId || Date.now(), 
    title: document.getElementById('add-title').value, 
    desc: document.getElementById('add-desc').value,
    price: parseFloat(document.getElementById('add-price').value), 
    category: c,
    brand: document.getElementById('add-brand').value, 
    subcategory: document.getElementById('add-subcategory').value,
    location: document.getElementById('add-location').value, 
    owner: currentUser,
    phone: document.getElementById('add-phone').value,
    email: document.getElementById('add-email').value,
    image: document.getElementById('add-image-base64').value || (c==='motorbikes'?getMotorcycleImage(document.getElementById('add-brand').value, document.getElementById('add-title').value, document.getElementById('add-subcategory').value):getEquipmentImage(document.getElementById('add-subcategory').value))
  };

  if (editingId) {
    const arr = c === 'motorbikes' ? motorbikeProducts : equipmentProducts;
    const idx = arr.findIndex(x => x.id === editingId);
    if (idx > -1) arr[idx] = newItem;
  } else {
    if(c==='motorbikes') motorbikeProducts.unshift(newItem);
    else equipmentProducts.unshift(newItem);
  }

  if (c === 'motorbikes') saveMotorbikes();
  else saveEquipment();

  e.target.reset(); 
  document.getElementById('image-preview').innerHTML=''; 
  document.getElementById('add-image-base64').value='';
  editingId = null;
  document.getElementById('add-form').querySelector('.submit-btn').textContent = '🚀 Publish Listing';
  
  renderProducts([...motorbikeProducts.slice(0,4), ...equipmentProducts.slice(0,4)], 'home-grid');
  renderMotorbikeProducts(); renderEquipmentProducts(); initSlideshow(); showPage('home'); alert('✅ Listing saved!');
});

let isLogin = true;
const modal = document.getElementById('auth-modal');
window.openAuthModal = () => { if(currentUser) { if(confirm('Logout?')) { localStorage.removeItem('motox_user'); currentUser=null; location.reload(); } return; } modal.style.display='flex'; };
document.querySelector('.close-modal').addEventListener('click', () => modal.style.display='none');
window.onclick = e => { if(e.target===modal) modal.style.display='none'; };
document.getElementById('toggle-auth').addEventListener('click', e => {
  e.preventDefault(); isLogin=!isLogin;
  document.getElementById('auth-title').textContent = isLogin?'Login':'Register';
  document.getElementById('auth-form').querySelector('button').textContent = isLogin?'Login':'Register';
  document.getElementById('toggle-auth').innerHTML = isLogin?'Don\'t have an account? <a href="#">Register here</a>':'Already registered? <a href="#">Login here</a>';
});
document.getElementById('auth-form').addEventListener('submit', e => {
  e.preventDefault();
  const u = document.getElementById('auth-username').value.trim();
  const p = document.getElementById('auth-password').value;
  if(isLogin) {
    if(!loginUser(u,p)) return alert('❌ Wrong credentials or account doesn\'t exist. Please register first.');
  } else {
    if(!registerUser(u,p)) return alert('⚠️ Username taken.');
    currentUser = u; localStorage.setItem('motox_user', u);
  }
  modal.style.display='none'; location.reload();
});

function initSlideshow() {
  const t = document.getElementById('slideshow-track'); const d = document.getElementById('slide-dots'); if(!t||!d) return;
  t.innerHTML=''; d.innerHTML='';
  const items = [...motorbikeProducts.sort(()=>0.5-Math.random()).slice(0,2), ...equipmentProducts.sort(()=>0.5-Math.random()).slice(0,2)];
  items.forEach((p,i)=>{
    const s = document.createElement('div'); s.className = `slide ${i===0?'active':''}`;
    const img = p.image || (p.category==='motorbikes'?getMotorcycleImage(p.brand,p.title,p.subcategory):getEquipmentImage(p.subcategory));
    s.innerHTML = `<img src="${img}" onerror="this.src='https://placehold.co/400x400/333/fff?text=Error'"><div class="slide-content"><h3>${p.title}</h3><p>${p.brand} • ${p.location}</p><div class="price">${p.price} EUR</div></div>`;
    s.addEventListener('click', ()=>openDetail(p.id, p.category)); t.appendChild(s);
    const dot = document.createElement('span'); dot.className=`dot ${i===0?'active':''}`; dot.onclick=()=>goSlide(i); d.appendChild(dot);
  });
  currentSlide=0; clearInterval(slideInterval); slideInterval=setInterval(()=>changeSlide(1),5000);
}
window.changeSlide = dir => {
  const s = document.querySelectorAll('.slide'), dots = document.querySelectorAll('.dot');
  if(!s.length) return; s[currentSlide].classList.remove('active'); dots[currentSlide].classList.remove('active');
  currentSlide=(currentSlide+dir+s.length)%s.length;
  s[currentSlide].classList.add('active'); dots[currentSlide].classList.add('active'); clearInterval(slideInterval); slideInterval=setInterval(()=>changeSlide(1),5000);
};
window.goSlide = i => {
  const s = document.querySelectorAll('.slide'), dots = document.querySelectorAll('.dot');
  s[currentSlide].classList.remove('active'); dots[currentSlide].classList.remove('active');
  currentSlide=i; s[i].classList.add('active'); dots[i].classList.add('active'); clearInterval(slideInterval); slideInterval=setInterval(()=>changeSlide(1),5000);
};

document.getElementById('site-logo').addEventListener('click', () => showPage('home'));
document.querySelectorAll('.nav-btn').forEach(b => b.addEventListener('click', () => showPage(b.dataset.page)));
document.querySelectorAll('.category-card').forEach(c => c.addEventListener('click', () => showPage(c.dataset.page)));
document.querySelectorAll('.dropdown-item, .footer-section a').forEach(l => {
  l.addEventListener('click', e => {
    e.preventDefault();
    const p = l.closest('.category-dropdown')?.id.replace('-dropdown','') || l.dataset.page;
    const f = l.dataset.type ? {type:l.dataset.type} : {cat:l.dataset.cat};
    showPage(p, f);
  });
});

updateFavCount(); initImages(); renderProducts([...motorbikeProducts.slice(0,4), ...equipmentProducts.slice(0,4)], 'home-grid');
renderMotorbikeProducts(); renderEquipmentProducts(); initSlideshow();
if(currentUser) document.getElementById('btn-login').textContent = '👤 Logout';