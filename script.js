const DEMO_DATA_VERSION = 'v7';

function loadDemoData(key, defaultData) {
  const stored = localStorage.getItem(key);
  const storedVer = localStorage.getItem(key + '_ver');
  if (storedVer !== DEMO_DATA_VERSION || !stored) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    localStorage.setItem(key + '_ver', DEMO_DATA_VERSION);
    return JSON.parse(JSON.stringify(defaultData));
  }
  return JSON.parse(stored);
}

// === GLOBAL FILTER STATE ===
let currentBikeTypeFilter = 'All';
let currentBrandFilter = 'All';

// === REAL MOTORCYCLE IMAGES ===
const MOTORCYCLE_IMAGES = {
  'KTM': {
    '250SX': 'https://motohouse.bg/wp-content/uploads/2025/03/KTM_250_SX_2025_MOTOHOUSE2.jpg',
    '450SX-F': 'https://motohouse.bg/wp-content/uploads/2025/03/KTM_450_SX_F_2025_MOTOHOUSE.jpg',
    'default': 'https://motohouse.bg/wp-content/uploads/2025/03/KTM_250_SX_2025_MOTOHOUSE2.jpg'
  },
  'Yamaha': {
    'YZ450F': 'https://cdn2.yamaha-motor.eu/prod/product-assets/2026/YZ450F/2026-Yamaha-YZ450F-EU-Icon_Blue-360-Degrees-001-03_Mobile.jpg',
    'default': 'https://cdn2.yamaha-motor.eu/prod/product-assets/2026/YZ450F/2026-Yamaha-YZ450F-EU-Icon_Blue-360-Degrees-001-03_Mobile.jpg'
  },
  'Honda': {
    'CRF450R': 'https://motorcycles.honda.bg/wp-content/uploads/sites/4/2024/10/370040_the_crf450r_crf450r_50th_anniversary_and_crf450rx_headline_the_23ym_crf.jpg',
    'default': 'https://motorcycles.honda.bg/wp-content/uploads/sites/4/2024/10/370040_the_crf450r_crf450r_50th_anniversary_and_crf450rx_headline_the_23ym_crf.jpg'
  },
  'Husqvarna': {
    'TE300': 'https://motohouse.bg/wp-content/uploads/2025/03/TE_300_HUSQVARNA_2025_MOTOHOUSE.jpg',
    'default': 'https://motohouse.bg/wp-content/uploads/2025/03/TE_300_HUSQVARNA_2025_MOTOHOUSE.jpg'
  },
  'GasGas': {
    'EC250': 'https://motohouse.bg/wp-content/uploads/2025/03/gasgas_ec250_2024_motohouse.jpg',
    'default': 'https://motohouse.bg/wp-content/uploads/2025/03/gasgas_ec250_2024_motohouse.jpg'
  },
  'Beta': {
    '300RR': 'https://overdrivemoto.bg/cdn/img/products/6120/beta-rr-300-2t-racing-my25-68e64d12b8750.png?width=800&height=800&v=1777470534',
    'default': 'https://overdrivemoto.bg/cdn/img/products/6120/beta-rr-300-2t-racing-my25-68e64d12b8750.png?width=800&height=800&v=1777470534'
  },
  'Sherco': {
    '300 SEF': 'https://enduro21.com/images/2023/june-2023/jonte-reynders-edition-sherco-sef-300/2023-sherco-300sef-jr-a4de-1.jpg',
    'default': 'https://enduro21.com/images/2023/june-2023/jonte-reynders-edition-sherco-sef-300/2023-sherco-300sef-jr-a4de-1.jpg'
  },
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

// === IMAGE HELPERS ===
function getMotorcycleImage(brand, title, subcategory) {
  const titleUpper = (title || '').toUpperCase();
  if (MOTORCYCLE_IMAGES[brand]) {
    for (const [model, imgUrl] of Object.entries(MOTORCYCLE_IMAGES[brand])) {
      if (model !== 'default' && titleUpper.includes(model.toUpperCase())) return imgUrl;
    }
    return MOTORCYCLE_IMAGES[brand].default;
  }
  return MOTORCYCLE_IMAGES.default;
}

function getEquipmentImage(subcategory) {
  return EQUIPMENT_IMAGES[subcategory] || EQUIPMENT_IMAGES.default;
}

function initializeProductImages() {
  motorbikeProducts = motorbikeProducts.map(p => ({
    ...p,
    image: p.image || getMotorcycleImage(p.brand, p.title, p.subcategory)
  }));
  equipmentProducts = equipmentProducts.map(p => ({
    ...p,
    image: p.image || getEquipmentImage(p.subcategory)
  }));
  saveMotorbikes();
  saveEquipment();
}

// === DEFAULT DATA ===
const DEFAULT_MOTORBIKES = [
  { id: 101, title: 'KTM 250SX', desc: 'Race-ready 2-stroke in excellent condition. Fresh top-end rebuild with only 3 hours since service. Includes WP suspension tuned for track use, new Dunlop Geomax tires, and stock exhaust. Perfect for intermediate to advanced riders looking for a reliable weekend racer.', price: 3500, category: 'motorbikes', brand: 'KTM', subcategory: 'Cross', engine: '2T', location: 'Germany', image: 'https://motohouse.bg/wp-content/uploads/2025/03/KTM_250_SX_2025_MOTOHOUSE2.jpg' },
  { id: 102, title: 'Yamaha YZ450F', desc: 'Well-maintained 2021 model with clean title and full service history. 85 hours on the engine, recent valve clearance check, and fresh oil change. Features KYB closed-cartridge forks, Renthal handlebars, and a fresh set of Maxxis MX33 tires. Runs strong, starts first kick.', price: 4800, category: 'motorbikes', brand: 'Yamaha', subcategory: 'Cross', engine: '4T', location: 'USA', image: 'https://cdn2.yamaha-motor.eu/prod/product-assets/2026/YZ450F/2026-Yamaha-YZ450F-EU-Icon_Blue-360-Degrees-001-03_Mobile.jpg' },
  { id: 103, title: 'Honda CRF450R', desc: 'Clean, stock-condition motocross bike with minimal track use. Under 60 hours, regularly serviced with genuine Honda parts. New air filter, fresh coolant, and recently replaced brake pads. Excellent compression, smooth power delivery, and ready for the track or trail.', price: 4200, category: 'motorbikes', brand: 'Honda', subcategory: 'Cross', engine: '4T', location: 'Spain', image: 'https://motorcycles.honda.bg/wp-content/uploads/sites/4/2024/10/370040_the_crf450r_crf450r_50th_anniversary_and_crf450rx_headline_the_23ym_crf.jpg' },
  { id: 104, title: 'Husqvarna TE300', desc: 'Factory edition enduro machine with premium components. 45 hours of hard riding but meticulously maintained. Features TPI fuel injection for consistent performance, new Dunlop K180 tires, and upgraded radiator braces. Comes with original manuals, spare parts kit, and tool bag.', price: 3900, category: 'motorbikes', brand: 'Husqvarna', subcategory: 'Enduro', engine: '2T', location: 'Sweden', image: 'https://motohouse.bg/wp-content/uploads/2025/03/TE_300_HUSQVARNA_2025_MOTOHOUSE.jpg' },
  { id: 105, title: 'GasGas EC250', desc: 'Light and agile off-road bike, ideal for tight trails and technical terrain. Low hours, fresh piston kit installed, and suspension recently serviced. Includes handguards, skid plate, and a full FMF exhaust system. Very reliable, starts easily in all conditions.', price: 3600, category: 'motorbikes', brand: 'GasGas', subcategory: 'Enduro', engine: '2T', location: 'France', image: 'https://motohouse.bg/wp-content/uploads/2025/03/gasgas_ec250_2024_motohouse.jpg' },
  { id: 106, title: 'Beta 300RR', desc: 'Italian craftsmanship meets off-road performance. Race-spec model with Sachs suspension, Brembo brakes, and a mapped ignition for smooth power delivery. 30 hours since last rebuild, new tires, and fully detailed. Perfect for enduro racing or weekend adventure riding.', price: 3800, category: 'motorbikes', brand: 'Beta', subcategory: 'Enduro', engine: '2T', location: 'Italy', image: 'https://overdrivemoto.bg/cdn/img/products/6120/beta-rr-300-2t-racing-my25-68e64d12b8750.png?width=800&height=800&v=1777470534' },
  { id: 107, title: 'Sherco 300 SEF', desc: 'French-built enduro powerhouse with electric and kick start. Recently serviced with new timing chain, valve shims, and fresh oil. Features WP XPLOR suspension, lightweight chassis, and excellent low-end torque. Well-kept, garage-stored, and ready for immediate riding.', price: 4100, category: 'motorbikes', brand: 'Sherco', subcategory: 'Enduro', engine: '4T', location: 'Portugal', image: 'https://enduro21.com/images/2023/june-2023/jonte-reynders-edition-sherco-sef-300/2023-sherco-300sef-jr-a4de-1.jpg' },
  { id: 108, title: 'KTM 450SX-F', desc: 'Track-focused 4-stroke with championship-winning pedigree. 70 hours, full dealer service history, and recent clutch plate replacement. Includes Pro Taper bars, new grip covers, and factory-spec suspension settings. Strong engine, excellent handling, and competition-ready.', price: 5200, category: 'motorbikes', brand: 'KTM', subcategory: 'Cross', engine: '4T', location: 'Austria', image: 'https://motohouse.bg/wp-content/uploads/2025/03/KTM_450_SX_F_2025_MOTOHOUSE.jpg' }
];

const DEFAULT_EQUIPMENT = [
  { id: 201, title: 'Alpinestars Tech 10 Boots', desc: 'Size 10, lightly used for one season. All buckles functional, minimal wear.', price: 299, category: 'equipment', brand: 'Alpinestars', subcategory: 'Boots', location: 'Germany', image: 'https://motohouse.bg/wp-content/uploads/2025/03/TECH_10_BOOTS_BLACK_RED_ALPINESTAR_MOTOHOUSE.jpg' },
  { id: 202, title: 'Fox Racing V1 Helmet', desc: 'M size, matte black. MIPS technology, excellent ventilation. No crashes.', price: 189, category: 'equipment', brand: 'Fox Racing', subcategory: 'Helmets', location: 'USA', image: 'https://admsport.com/cdn/shop/files/rougeetnoirde3-4.jpg?v=1728475641' },
  { id: 203, title: 'Leatt Chest Protector 5.5', desc: 'Adjustable fit, CE certified. Used 10 hours, like new condition.', price: 125, category: 'equipment', brand: 'Leatt', subcategory: 'Armor', location: 'UK', image: 'https://www.ath-moto.bg/storage/backend/product/105978/main_images/w6s2OnliffLl8K7-chest-protector-55-pro-hd-black.webp' },
  { id: 204, title: '100% Brisker Gloves', desc: 'Large, black/red. Excellent grip, breathable mesh. Washed after each ride.', price: 35, category: 'equipment', brand: '100%', subcategory: 'Gloves', location: 'Canada', image: 'https://100percent.eu/cdn/shop/files/Z-10016-004_2-Brisker-palm.jpg?v=1772743032' },
  { id: 205, title: 'Thor Knee Guards', desc: 'Adjustable straps, impact-absorbing foam. Used one season, no damage.', price: 55, category: 'equipment', brand: 'Thor', subcategory: 'Knee Pads', location: 'Australia', image: 'https://motoboom.bg/userfiles/productimages/product_11938.jpg' },
  { id: 206, title: 'Alpinestars Sequence Elbow Guards', desc: 'Lightweight, flexible protection. Medium size, barely used.', price: 45, category: 'equipment', brand: 'Alpinestars', subcategory: 'Armrests', location: 'Netherlands', image: 'https://www.bud-racing.com/media/catalog/product/cache/d680d4086419279eb4470e7ea90e1fbd/a/l/alpinestars-sequence-2019-elbow-guards-anthracite-fluo-yellow.jpg' },
  { id: 207, title: 'Bell Moto-9 Flex Helmet', desc: 'Large, carbon fiber. Premium safety, excellent condition. Includes bag.', price: 420, category: 'equipment', brand: 'Bell', subcategory: 'Helmets', location: 'Belgium', image: 'https://motomax.bg/wp-content/uploads/2023/11/bell_moto_9_flex_seven_aqua.jpg' },
  { id: 208, title: 'Fox Racing Instinct Boots', desc: 'Size 9, black. Boa closure system, minimal sole wear. Ready to ride.', price: 249, category: 'equipment', brand: 'Fox Racing', subcategory: 'Boots', location: 'Switzerland', image: 'https://performancemotoparts.com/cdn/shop/files/36361110_1.webp?v=1755629016&width=640' }
];

// Load data with version control
let motorbikeProducts = loadDemoData('motox_motorbikes', DEFAULT_MOTORBIKES);
let equipmentProducts = loadDemoData('motox_equipment', DEFAULT_EQUIPMENT);

initializeProductImages();

let favorites = JSON.parse(localStorage.getItem('motox_favorites')) || [];
let currentUser = localStorage.getItem('motox_user') || null;
let currentPage = 'home';
let currentSlide = 0;
let slideInterval;
const favCountEl = document.getElementById('fav-count');

// === CORE FUNCTIONS ===
function saveMotorbikes() { try { localStorage.setItem('motox_motorbikes', JSON.stringify(motorbikeProducts)); } catch(e) { alert('⚠️ Storage full!'); } }
function saveEquipment() { try { localStorage.setItem('motox_equipment', JSON.stringify(equipmentProducts)); } catch(e) { alert('⚠️ Storage full!'); } }
function saveFavorites() { localStorage.setItem('motox_favorites', JSON.stringify(favorites)); }
function updateFavCount() { if(favCountEl) favCountEl.textContent = favorites.length; }

// === PAGE NAVIGATION ===
function showPage(pageName, filter = {}) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const page = document.getElementById(`${pageName}-section`);
  if (page) {
    page.classList.add('active');
    currentPage = pageName;
    if (pageName === 'home') {
      const featured = [...motorbikeProducts.slice(0,4), ...equipmentProducts.slice(0,4)];
      renderProducts(featured, 'home-grid');
    } else if (pageName === 'motorbikes') {
      renderMotorbikeProducts(filter);
    } else if (pageName === 'equipment') {
      renderEquipmentProducts(filter);
    }
  }
  window.scrollTo(0, 0);
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  if (pageName === 'motorbikes' || pageName === 'equipment') {
    document.querySelector(`.nav-btn[data-page="${pageName}"]`)?.classList.add('active');
  }
}

function goBack() { showPage('home'); }

// === NAVIGATION & FILTERS ===
document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.page)));
document.querySelectorAll('.category-card').forEach(card => card.addEventListener('click', () => showPage(card.dataset.page)));


document.getElementById('btn-add-product').addEventListener('click', () => {
  openAddForm();
});

document.querySelectorAll('.dropdown-item').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.closest('.category-dropdown').id.replace('-dropdown', '');
    const filter = link.dataset.type ? { type: link.dataset.type } : { cat: link.dataset.cat };
    showPage(page, filter);
  });
});

document.querySelectorAll('.footer-section a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    const filter = link.dataset.type ? { type: link.dataset.type } : (link.dataset.cat ? { cat: link.dataset.cat } : {});
    if (page) showPage(page, filter);
  });
});

// === DUAL FILTER EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', () => {
  const bikeTypeFilters = document.querySelectorAll('.bike-type-filters .subfilter');
  const brandFilters = document.querySelectorAll('.brand-filters .subfilter');
  
  bikeTypeFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      bikeTypeFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBikeTypeFilter = btn.dataset.biketype;
      renderMotorbikeProducts();
    });
  });
  
  brandFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      brandFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBrandFilter = btn.dataset.brand;
      renderMotorbikeProducts();
    });
  });
});

// === UPDATED MOTORBIKE RENDERING WITH DUAL FILTERS ===
function renderMotorbikeProducts(filter = {}) {
  const grid = document.getElementById('motorbikes-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  let filtered = [...motorbikeProducts];
  if (currentBikeTypeFilter && currentBikeTypeFilter !== 'All') {
    filtered = filtered.filter(p => p.subcategory === currentBikeTypeFilter);
  }
  if (currentBrandFilter && currentBrandFilter !== 'All') {
    filtered = filtered.filter(p => p.brand === currentBrandFilter);
  }
  
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666; background: white; border-radius: 12px;">No products found. <a href="#" onclick="openAddForm(\'motorbikes\')">Be the first to list one!</a></p>';
    return;
  }
  filtered.forEach(p => grid.appendChild(createProductCard(p, 'motorbikes')));
}

function renderEquipmentProducts(filter = {}) {
  const grid = document.getElementById('equipment-grid');
  if (!grid) return;
  grid.innerHTML = '';
  let filtered = [...equipmentProducts];
  if (filter.cat && filter.cat !== 'All') filtered = filtered.filter(p => p.subcategory === filter.cat);
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666; background: white; border-radius: 12px;">No gear found. <a href="#" onclick="openAddForm(\'equipment\')">List your first item!</a></p>';
    return;
  }
  filtered.forEach(p => grid.appendChild(createProductCard(p, 'equipment')));
}

function createProductCard(p, category) {
  const isFav = favorites.includes(p.id);
  const imgUrl = p.image || (p.category === 'motorbikes' ? getMotorcycleImage(p.brand, p.title, p.subcategory) : getEquipmentImage(p.subcategory));
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${p.id}">${isFav ? '❤️' : '🤍'}</button>
    ${p.price < 1000 ? '<span class="card-badge">Under $1K</span>' : ''}
    <div class="card-image">
      <img src="${imgUrl}" alt="${p.title}" onerror="this.src='https://placehold.co/400x300/e0e0e0/666?text=No+Image'">
    </div>
    <div class="card-content">
      <h3>${p.title}</h3>
      <div class="card-meta">
        <span>${p.brand}</span>
        <span>${p.subcategory}</span>
        <span>📍 ${p.location}</span>
      </div>
      <div class="price">$${p.price.toLocaleString()}</div>
    </div>
  `;
  card.querySelector('.card-image').addEventListener('click', () => openDetail(p.id, category));
  card.querySelector('.fav-btn').addEventListener('click', (e) => { e.stopPropagation(); toggleFavorite(p.id); });
  return card;
}

function renderProducts(productList, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  if (productList.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666; background: white; border-radius: 12px;">No products found.</p>';
    return;
  }
  productList.forEach(p => grid.appendChild(createProductCard(p, p.category)));
}

// === PRODUCT DETAIL ===
function openDetail(id, category) {
  const p = category === 'motorbikes' ? motorbikeProducts.find(x => x.id === id) : equipmentProducts.find(x => x.id === id);
  if (!p) return;
  const isFav = favorites.includes(p.id);
  const imgUrl = p.image || (p.category === 'motorbikes' ? getMotorcycleImage(p.brand, p.title, p.subcategory) : getEquipmentImage(p.subcategory));
  
  document.getElementById('product-detail').innerHTML = `
    <img src="${imgUrl}" alt="${p.title}" onerror="this.src='https://placehold.co/800x400/333/fff?text=No+Image'">
    <h2>${p.title}</h2>
    <div class="detail-meta">
      <span>🏷️ ${p.brand}</span>
      <span>📦 ${p.subcategory}</span>
      <span>📍 ${p.location}</span>
      <span>🆔 #${p.id.toString().slice(-4)}</span>
    </div>
    <div class="price">$${p.price.toLocaleString()}</div>
    <h3 style="margin-top: 25px; color: var(--dark-blue);">Description</h3>
    <p>${p.desc}</p>
    <button class="submit-btn" style="margin-top: 20px; max-width: 300px;">
      ${isFav ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
    </button>
  `;
  document.querySelector('#product-detail .submit-btn').addEventListener('click', () => { toggleFavorite(p.id); openDetail(p.id, category); });
  showPage('detail');
}

// === FAVORITES ===
function toggleFavorite(id) {
  if (favorites.includes(id)) favorites = favorites.filter(f => f !== id);
  else favorites.push(id);
  saveFavorites(); updateFavCount();
  if (currentPage === 'home') { const featured = [...motorbikeProducts.slice(0,4), ...equipmentProducts.slice(0,4)]; renderProducts(featured, 'home-grid'); }
  else if (currentPage === 'motorbikes') renderMotorbikeProducts();
  else if (currentPage === 'equipment') renderEquipmentProducts();
}

// === SEARCH ===
document.getElementById('search-btn').addEventListener('click', performSearch);
document.getElementById('search-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });

function performSearch() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  if (!query) return;
  const results = [
    ...motorbikeProducts.filter(p => p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)),
    ...equipmentProducts.filter(p => p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query))
  ];
  renderProducts(results, 'home-grid');
  showPage('home');
  document.querySelector('.section-header h2').textContent = `🔍 Search Results for "${query}"`;
}

// === ADD PRODUCT FORM ===
function openAddForm(preCategory = '') {
  const form = document.getElementById('add-form'); form.reset();
  document.getElementById('image-preview').innerHTML = ''; document.getElementById('add-image-base64').value = '';
  if (preCategory) {
    document.getElementById('add-main-category').value = preCategory; updateSubcategories();
    setTimeout(() => { const sub = document.getElementById('add-subcategory'); if (sub.options.length > 1) sub.value = sub.options[1].value; }, 100);
  }
  showPage('add');
}

function updateSubcategories() {
  const mainCat = document.getElementById('add-main-category').value;
  const subCat = document.getElementById('add-subcategory');
  const motorbikeBrands = document.getElementById('motorbike-brands');
  const gearBrands = document.getElementById('gear-brands');
  subCat.innerHTML = '<option value="">Select Subcategory</option>'; subCat.disabled = !mainCat;
  motorbikeBrands.style.display = mainCat === 'motorbikes' ? 'block' : 'none';
  gearBrands.style.display = mainCat === 'equipment' ? 'block' : 'none';
  if (!mainCat) return;
  const opts = mainCat === 'motorbikes' ? ['Enduro', 'Cross', 'Track', 'Trail', 'Supermoto'] : ['Helmets', 'Boots', 'Gloves', 'Armor', 'Knee Pads', 'Armrests'];
  opts.forEach(opt => { const el = document.createElement('option'); el.value = opt; el.textContent = opt; subCat.appendChild(el); });
}

const imageFileInput = document.getElementById('add-image-file');
const imagePreview = document.getElementById('image-preview');
const imageBase64Input = document.getElementById('add-image-base64');

imageFileInput.addEventListener('change', function(e) {
  const file = e.target.files[0]; if (!file) return;
  if (file.size > 2 * 1024 * 1024) { alert('⚠️ Image too large!'); this.value = ''; return; }
  const reader = new FileReader();
  reader.onload = function(ev) { imageBase64Input.value = ev.target.result; imagePreview.innerHTML = `<img src="${ev.target.result}" alt="Preview">`; };
  reader.readAsDataURL(file);
});

document.getElementById('add-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const mainCat = document.getElementById('add-main-category').value;
  const brand = document.getElementById('add-brand').value;
  const title = document.getElementById('add-title').value;
  const subcategory = document.getElementById('add-subcategory').value;
  
  let imageValue = document.getElementById('add-image-base64').value;
  if (!imageValue) imageValue = mainCat === 'motorbikes' ? getMotorcycleImage(brand, title, subcategory) : getEquipmentImage(subcategory);
  
  const newItem = {
    id: Date.now(), title, desc: document.getElementById('add-desc').value,
    price: parseFloat(document.getElementById('add-price').value), category: mainCat,
    brand, subcategory, location: document.getElementById('add-location').value, image: imageValue
  };

  if (mainCat === 'motorbikes') { motorbikeProducts.unshift(newItem); saveMotorbikes(); }
  else if (mainCat === 'equipment') { equipmentProducts.unshift(newItem); saveEquipment(); }

  e.target.reset(); imagePreview.innerHTML = ''; imageBase64Input.value = '';
  renderProducts([...motorbikeProducts.slice(0,4), ...equipmentProducts.slice(0,4)], 'home-grid');
  renderMotorbikeProducts(); renderEquipmentProducts(); initSlideshow();
  showPage('home'); alert('🚀 Listing published! Your item is now live.');
});

// === FAVORITES BUTTON ===
document.getElementById('btn-favorites').addEventListener('click', () => {
  const favItems = [...motorbikeProducts, ...equipmentProducts].filter(p => favorites.includes(p.id));
  renderProducts(favItems, 'home-grid'); showPage('home');
  document.querySelector('.section-header h2').textContent = '❤️ Your Favorite Items';
});

// === LOGIN MODAL ===
const modal = document.getElementById('auth-modal');
const authTitle = document.getElementById('auth-title');
const authForm = document.getElementById('auth-form');
const toggleAuth = document.getElementById('toggle-auth');
let isLogin = true;

document.getElementById('btn-login').addEventListener('click', () => {
  if (currentUser) { if (confirm(`Logged in as ${currentUser}. Logout?`)) { currentUser = null; localStorage.removeItem('motox_user'); document.getElementById('btn-login').textContent = '👤'; } return; }
  modal.style.display = 'flex';
});
document.querySelector('.close-modal').addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
toggleAuth.addEventListener('click', (e) => {
  e.preventDefault(); isLogin = !isLogin;
  authTitle.textContent = isLogin ? 'Welcome' : 'Join MotoX';
  authForm.querySelector('button').textContent = isLogin ? 'Login' : 'Register';
  toggleAuth.innerHTML = isLogin ? `New here? <a href="#">Create account</a>` : `Already have an account? <a href="#">Login</a>`;
});
authForm.addEventListener('submit', (e) => {
  e.preventDefault(); currentUser = document.getElementById('auth-username').value;
  localStorage.setItem('motox_user', currentUser);
  document.getElementById('btn-login').textContent = `👤 ${currentUser}`;
  modal.style.display = 'none'; authForm.reset();
});

// === SLIDESHOW ===
function initSlideshow() {
  const track = document.getElementById('slideshow-track');
  const dotsContainer = document.getElementById('slide-dots');
  if (!track || !dotsContainer) return;

  const shuffledMoto = [...motorbikeProducts].sort(() => 0.5 - Math.random()).slice(0,2);
  const shuffledEquip = [...equipmentProducts].sort(() => 0.5 - Math.random()).slice(0,2);
  const slideProducts = [...shuffledMoto, ...shuffledEquip].sort(() => 0.5 - Math.random());

  track.innerHTML = '';
  dotsContainer.innerHTML = '';

  slideProducts.forEach((p, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    const imgUrl = p.image || (p.category === 'motorbikes' ? getMotorcycleImage(p.brand, p.title, p.subcategory) : getEquipmentImage(p.subcategory));
    slide.innerHTML = `
      <img src="${imgUrl}" alt="${p.title}" onerror="this.src='https://placehold.co/400x400/333/fff?text=Error'">
      <div class="slide-content">
        <h3>${p.title}</h3>
        <p>${p.brand} • ${p.subcategory} • ${p.location}</p>
        <div class="price">$${p.price.toLocaleString()}</div>
      </div>
    `;
    slide.addEventListener('click', () => openDetail(p.id, p.category));
    track.appendChild(slide);

    const dot = document.createElement('span');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dot.onclick = () => goToSlide(index);
    dotsContainer.appendChild(dot);
  });

  const slides = track.querySelectorAll('.slide');
  slides.forEach((slide, i) => slide.style.display = i === 0 ? 'flex' : 'none');
  startSlideTimer();
}

function startSlideTimer() { clearInterval(slideInterval); slideInterval = setInterval(() => changeSlide(1), 5000); }
function changeSlide(dir) {
  const slides = document.querySelectorAll('#slideshow-track .slide');
  const dots = document.querySelectorAll('#slide-dots .dot');
  if (slides.length === 0) return;
  slides[currentSlide].style.display = 'none'; dots[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + dir + slides.length) % slides.length;
  slides[currentSlide].style.display = 'flex'; dots[currentSlide].classList.add('active');
  startSlideTimer();
}
function goToSlide(index) {
  const slides = document.querySelectorAll('#slideshow-track .slide');
  const dots = document.querySelectorAll('#slide-dots .dot');
  slides[currentSlide].style.display = 'none'; dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].style.display = 'flex'; dots[currentSlide].classList.add('active');
  startSlideTimer();
}

// === INIT ===
updateFavCount();
renderProducts([...motorbikeProducts.slice(0,4), ...equipmentProducts.slice(0,4)], 'home-grid');
renderMotorbikeProducts(); renderEquipmentProducts(); initSlideshow();
if (currentUser) document.getElementById('btn-login').textContent = `👤 ${currentUser}`;