
function safeJSONParse(key, fallback) {
    try {
        const val = localStorage.getItem(key);
        if (val === null || val === 'undefined') return fallback;
        const parsed = JSON.parse(val);
        return parsed !== null ? parsed : fallback;
    } catch (e) {
        console.error('Error parsing ' + key, e);
        return fallback;
    }
}

// Multi-click handler for admin login
let adminClickCount = 0;
let adminClickTimer = null;
function handleAdminClick() {
    adminClickCount++;
    if (adminClickCount >= 3) {
        showAdminLogin();
        adminClickCount = 0;
    }
    clearTimeout(adminClickTimer);
    adminClickTimer = setTimeout(() => {
        adminClickCount = 0;
    }, 1000);
}
// STATE MANAGEMENT & LOCAL STORAGE
let products = safeJSONParse('lh_products', null) || [
    { id: '1', name: 'Photo Frame', category: 'Frames', price: 399, salePrice: 300, desc: 'Elegant frame to showcase your memories', custom: true, img: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=500' },
    { id: '2', name: 'Magic Mug', category: 'Mugs', price: 399, salePrice: 299, desc: 'Reveals your photo when hot', custom: true, img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500' },
    { id: '3', name: 'Heart Pillow', category: 'Gifts', price: 450, salePrice: 350, desc: 'Soft and cozy heart-shaped pillow', custom: true, img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500' },
    { id: '4', name: 'Square Pillow', category: 'Gifts', price: 399, salePrice: 300, desc: 'Stylish square pillow for decor', custom: true, img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500' },
    { id: '5', name: 'Patch Mug', category: 'Mugs', price: 899, salePrice: 750, desc: 'Durable patch Mug for daily hydration', custom: true, img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500' },
    { id: '6', name: 'Steel Mug', category: 'Mugs', price: 450, salePrice: 350, desc: 'Steel version of our mug with custom finish', custom: true, img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500' }
];
let categories = safeJSONParse('lh_categories', null) || ['Frames', 'Mugs', 'Gifts'];
let settings = safeJSONParse('lh_settings', null) || {};
if (!settings.wa) settings.wa = '919876543210';
if (!settings.name) settings.name = 'Lamination Hub';
if (!settings.phone) settings.phone = '+91 98765 43210';
if (!settings.adminPass) settings.adminPass = 'admin123';
if (!settings.logo) settings.logo = 'logo.jpg';
let cart = safeJSONParse('lh_cart', null) || [];
let leads = safeJSONParse('lh_leads', null) || [];
let reviews = safeJSONParse('lh_reviews', null) || [
    { name: 'Rahul Sharma', rating: 5, text: 'Amazing quality! The photo frame was a perfect gift.' },
    { name: 'Priya Patel', rating: 5, text: 'Loved the magic mug. The printing is very clear.' },
    { name: 'Ankit Kumar', rating: 4, text: 'Fast delivery and great customer service on WhatsApp.' }
];
let banners = safeJSONParse('lh_banners', null) || [
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop'
];
let bottomBanners = safeJSONParse('lh_bottom_banners', null) || [
    'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=2000&auto=format&fit=crop'
];
let activeProduct = null;
let currentSlide = 0;
let slideInterval;
let currentBottomSlide = 0;
let bottomSlideInterval;

// INIT
function init() {
const importedProducts = [
    {
        "id": "1773404390562",
        "name": "Photo Frame 8x12",
        "category": "Gifts",
        "price": 300,
        "salePrice": null,
        "desc": "Customizable Photo Frame 8x12",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773404408332",
        "name": "Photo Frame 10x15",
        "category": "Gifts",
        "price": 450,
        "salePrice": null,
        "desc": "Customizable Photo Frame 10x15",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773404422965",
        "name": "Photo Frame 12x18",
        "category": "Gifts",
        "price": 550,
        "salePrice": null,
        "desc": "Customizable Photo Frame 12x18",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773404438703",
        "name": "Photo Frame 12x18 With Border",
        "category": "Gifts",
        "price": 750,
        "salePrice": null,
        "desc": "Customizable Photo Frame 12x18 With Border",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773404464330",
        "name": "Photo Frame 4x6",
        "category": "Gifts",
        "price": 150,
        "salePrice": null,
        "desc": "Customizable Photo Frame 4x6",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773404471378",
        "name": "Photo Frame 5x7",
        "category": "Gifts",
        "price": 200,
        "salePrice": null,
        "desc": "Customizable Photo Frame 5x7",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773404514446",
        "name": "Water Bottle 750ml",
        "category": "Gifts",
        "price": 350,
        "salePrice": null,
        "desc": "Customizable Water Bottle 750ml",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773404537113",
        "name": "Hot & Cold Water Bottle",
        "category": "Gifts",
        "price": 550,
        "salePrice": null,
        "desc": "Customizable Hot & Cold Water Bottle",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773404554514",
        "name": "Normal Coffee Mug",
        "category": "Gifts",
        "price": 150,
        "salePrice": null,
        "desc": "Customizable Normal Coffee Mug",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773404566044",
        "name": "Patch Coffee Mug",
        "category": "Gifts",
        "price": 200,
        "salePrice": null,
        "desc": "Customizable Patch Coffee Mug",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773404593510",
        "name": "Magic Coffee Mug",
        "category": "Gifts",
        "price": 250,
        "salePrice": null,
        "desc": "Customizable Magic Coffee Mug",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773404601487",
        "name": "Steel Coffee Mug",
        "category": "Gifts",
        "price": 300,
        "salePrice": null,
        "desc": "Customizable Steel Coffee Mug",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773411604479",
        "name": "Clock Photo Frame",
        "category": "Gifts",
        "price": 800,
        "salePrice": null,
        "desc": "Customizable Clock Photo Frame",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773411616232",
        "name": "MDF Photo Frame",
        "category": "Gifts",
        "price": 750,
        "salePrice": null,
        "desc": "Customizable MDF Photo Frame",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773411632881",
        "name": "LED Photo Frame 12x18",
        "category": "Gifts",
        "price": 1000,
        "salePrice": null,
        "desc": "Customizable LED Photo Frame 12x18",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773411668653",
        "name": "Birthday/Aniversery Frame",
        "category": "Gifts",
        "price": 800,
        "salePrice": null,
        "desc": "Customizable Birthday/Aniversery Frame",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773411731547",
        "name": "Money Bank 4x6",
        "category": "Gifts",
        "price": 300,
        "salePrice": null,
        "desc": "Customizable Money Bank 4x6",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773411746119",
        "name": "Money Bank 6x8",
        "category": "Gifts",
        "price": 350,
        "salePrice": null,
        "desc": "Customizable Money Bank 6x8",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773411760406",
        "name": "Money Bank 8x12",
        "category": "Gifts",
        "price": 400,
        "salePrice": null,
        "desc": "Customizable Money Bank 8x12",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773412029914",
        "name": "Acrylic KeyChain",
        "category": "Gifts",
        "price": 120,
        "salePrice": null,
        "desc": "Customizable Acrylic KeyChain",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773412041146",
        "name": "Plastic KeyChain",
        "category": "Gifts",
        "price": 100,
        "salePrice": null,
        "desc": "Customizable Plastic KeyChain",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773412061276",
        "name": "Id Card ",
        "category": "Gifts",
        "price": 50,
        "salePrice": null,
        "desc": "Customizable Id Card ",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773412077118",
        "name": "PVC Card Both Side",
        "category": "Gifts",
        "price": 80,
        "salePrice": null,
        "desc": "Customizable PVC Card Both Side",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773412139804",
        "name": "Sarina T-Shirt",
        "category": "Gifts",
        "price": 150,
        "salePrice": null,
        "desc": "Customizable Sarina T-Shirt",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773470112157",
        "name": "Tiles 8x12",
        "category": "Gifts",
        "price": 350,
        "salePrice": null,
        "desc": "Customizable Tiles 8x12",
        "custom": true,
        "img": ""
    },
    {
        "id": "1773929305301",
        "name": "Photo Frame 12x18 With Border Wooden",
        "category": "Gifts",
        "price": 800,
        "salePrice": null,
        "desc": "Customizable Photo Frame 12x18 With Border Wooden",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776750370405",
        "name": "Plastic Rotating Lamp 4x6 ",
        "category": "Gifts",
        "price": 800,
        "salePrice": null,
        "desc": "Customizable Plastic Rotating Lamp 4x6 ",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776750413333",
        "name": "Plastic Rotating Lamp 4x4 ",
        "category": "Gifts",
        "price": 650,
        "salePrice": null,
        "desc": "Customizable Plastic Rotating Lamp 4x4 ",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776750561261",
        "name": "Plug In Lamp Square",
        "category": "Gifts",
        "price": 200,
        "salePrice": null,
        "desc": "Customizable Plug In Lamp Square",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776750623851",
        "name": "Round Mirror",
        "category": "Gifts",
        "price": 400,
        "salePrice": null,
        "desc": "Customizable Round Mirror",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776754062511",
        "name": "MDF Tree Frame ",
        "category": "Gifts",
        "price": 550,
        "salePrice": null,
        "desc": "Customizable MDF Tree Frame ",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776754093470",
        "name": "Premium Keychain",
        "category": "Gifts",
        "price": 150,
        "salePrice": null,
        "desc": "Customizable Premium Keychain",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776754154507",
        "name": "Acrylic Jhula Frame",
        "category": "Gifts",
        "price": 300,
        "salePrice": null,
        "desc": "Customizable Acrylic Jhula Frame",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776754240544",
        "name": "Acrylic Magnetic Frame 4x6",
        "category": "Gifts",
        "price": 200,
        "salePrice": null,
        "desc": "Customizable Acrylic Magnetic Frame 4x6",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776754274884",
        "name": "Acrylic Magnetic Frame 6x8",
        "category": "Gifts",
        "price": 250,
        "salePrice": null,
        "desc": "Customizable Acrylic Magnetic Frame 6x8",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776754301918",
        "name": "Acrylic Magnetic Frame 3x4",
        "category": "Gifts",
        "price": 150,
        "salePrice": null,
        "desc": "Customizable Acrylic Magnetic Frame 3x4",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776754397713",
        "name": "Acrylic Flower Pot",
        "category": "Gifts",
        "price": 350,
        "salePrice": null,
        "desc": "Customizable Acrylic Flower Pot",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776754454511",
        "name": "Trolly Money Box",
        "category": "Gifts",
        "price": 450,
        "salePrice": null,
        "desc": "Customizable Trolly Money Box",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776754504648",
        "name": "MDF Frame 16x24",
        "category": "Gifts",
        "price": 999,
        "salePrice": null,
        "desc": "Customizable MDF Frame 16x24",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776754537891",
        "name": "Pendrive Box",
        "category": "Gifts",
        "price": 150,
        "salePrice": null,
        "desc": "Customizable Pendrive Box",
        "custom": true,
        "img": ""
    },
    {
        "id": "1776754885379",
        "name": "Photo Frame 8x12 With Border",
        "category": "Gifts",
        "price": 450,
        "salePrice": null,
        "desc": "Customizable Photo Frame 8x12 With Border",
        "custom": true,
        "img": ""
    },
    {
        "id": "1778573240846",
        "name": "Acrylic Magnetic Frame 8x12",
        "category": "Gifts",
        "price": 350,
        "salePrice": null,
        "desc": "Customizable Acrylic Magnetic Frame 8x12",
        "custom": true,
        "img": ""
    },
    {
        "id": "1778935181427",
        "name": "Photo 12x18",
        "category": "Gifts",
        "price": 150,
        "salePrice": null,
        "desc": "Customizable Photo 12x18",
        "custom": true,
        "img": ""
    },
    {
        "id": "1778935227552",
        "name": "Photo 10x15",
        "category": "Gifts",
        "price": 100,
        "salePrice": null,
        "desc": "Customizable Photo 10x15",
        "custom": true,
        "img": ""
    },
    {
        "id": "1778935250842",
        "name": "Photo 8x12",
        "category": "Gifts",
        "price": 90,
        "salePrice": null,
        "desc": "Customizable Photo 8x12",
        "custom": true,
        "img": ""
    },
    {
        "id": "1779074220824",
        "name": "Heart Pillow Multi Colour",
        "category": "General",
        "price": 300,
        "salePrice": null,
        "desc": "Customizable Heart Pillow Multi Colour",
        "custom": true,
        "img": ""
    },
    {
        "id": "1779074243890",
        "name": "Square Pillow ",
        "category": "Gifts",
        "price": 300,
        "salePrice": null,
        "desc": "Customizable Square Pillow ",
        "custom": true,
        "img": ""
    },
    {
        "id": "1779074365183",
        "name": "Crystle Frame (Hanging Heart)",
        "category": "Gifts",
        "price": 700,
        "salePrice": null,
        "desc": "Customizable Crystle Frame (Hanging Heart)",
        "custom": true,
        "img": ""
    },
    {
        "id": "1779074390313",
        "name": "Crystle Frame (Hanging Round)",
        "category": "Gifts",
        "price": 700,
        "salePrice": null,
        "desc": "Customizable Crystle Frame (Hanging Round)",
        "custom": true,
        "img": ""
    },
    {
        "id": "1779074493100",
        "name": "Heart Puzzle Frame",
        "category": "Gifts",
        "price": 350,
        "salePrice": null,
        "desc": "Customizable Heart Puzzle Frame",
        "custom": true,
        "img": ""
    },
    {
        "id": "1779074608688",
        "name": "Golden MDF Frame (Birthday/Aniversery/First year)",
        "category": "Gifts",
        "price": 700,
        "salePrice": null,
        "desc": "Customizable Golden MDF Frame (Birthday/Aniversery/First year)",
        "custom": true,
        "img": ""
    },
    {
        "id": "1779074682439",
        "name": "Rectangle Puzzle Frame ",
        "category": "Gifts",
        "price": 380,
        "salePrice": null,
        "desc": "Customizable Rectangle Puzzle Frame ",
        "custom": true,
        "img": ""
    },
    {
        "id": "1779074721876",
        "name": "Square Puzzle Frame",
        "category": "Gifts",
        "price": 360,
        "salePrice": null,
        "desc": "Customizable Square Puzzle Frame",
        "custom": true,
        "img": ""
    },
    {
        "id": "1779074828319",
        "name": "Rose Pillow (Heart/Square)",
        "category": "Gifts",
        "price": 350,
        "salePrice": null,
        "desc": "Customizable Rose Pillow (Heart/Square)",
        "custom": true,
        "img": ""
    },
    {
        "id": "1779074926465",
        "name": "Magic Pillow (Heart/Square)",
        "category": "Gifts",
        "price": 450,
        "salePrice": null,
        "desc": "Customizable Magic Pillow (Heart/Square)",
        "custom": true,
        "img": ""
    },
    {
        "id": "1781614453681",
        "name": "Photo Frame 12x18  Laminated",
        "category": "Gifts",
        "price": 750,
        "salePrice": null,
        "desc": "Customizable Photo Frame 12x18  Laminated",
        "custom": true,
        "img": ""
    },
    {
        "id": "1782037749808",
        "name": "Photo Frame 8x12 Laminated",
        "category": "Gifts",
        "price": 400,
        "salePrice": null,
        "desc": "Customizable Photo Frame 8x12 Laminated",
        "custom": true,
        "img": ""
    },
    {
        "id": "1783406454264",
        "name": "Photo Frame 10x15 Laminated",
        "category": "Gifts",
        "price": 550,
        "salePrice": null,
        "desc": "Customizable Photo Frame 10x15 Laminated",
        "custom": true,
        "img": ""
    },
    {
        "id": "1789054877917",
        "name": "Night Lamp",
        "category": "Gifts",
        "price": 200,
        "salePrice": null,
        "desc": "Customizable Night Lamp",
        "custom": true,
        "img": ""
    }
];

// Migration to load new products once
if (!localStorage.getItem('lh_imported_v2')) {
    products = importedProducts;
    // ensure categories are correctly updated
    categories = [...new Set([...categories, "Gifts", "General", "SKIN"])];
    localStorage.setItem('lh_imported_v2', 'true');
    saveData();
}

    // Migrate broken drive links
    products.forEach(p => {
        if (p.img) {
            const match = p.img.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || p.img.match(/id=([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                p.img = `https://drive.google.com/uc?export=view&id=${match[1]}`;
            }
        }
    });

    saveData();
    applySettings();
    renderCategories();
    renderProducts();
    renderReviews();
    renderBanners();
    renderBottomBanners();
    updateCartCount();
    document.getElementById('current-year').textContent = new Date().getFullYear();
    checkVisitor();
}

function checkVisitor() {
    const hasVisited = localStorage.getItem('lh_visitor_done');
    if (!hasVisited) {
        document.getElementById('visitor-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function submitVisitor() {
    const name = document.getElementById('vis-name').value.trim();
    const phone = document.getElementById('vis-phone').value.trim();
    if (!name || !phone) return alert("Please enter both Name and Phone number to continue.");
    
    leads.unshift({ name, phone, date: new Date().toLocaleDateString() });
    saveData();
    localStorage.setItem('lh_visitor_done', 'true');
    
    document.getElementById('visitor-modal').classList.add('hidden');
    document.body.style.overflow = 'auto'; // Restore scroll
    renderAdminLeads();
}

function saveData() {
    localStorage.setItem('lh_products', JSON.stringify(products));
    localStorage.setItem('lh_categories', JSON.stringify(categories));
    localStorage.setItem('lh_settings', JSON.stringify(settings));
    localStorage.setItem('lh_cart', JSON.stringify(cart));
    localStorage.setItem('lh_leads', JSON.stringify(leads));
    localStorage.setItem('lh_reviews', JSON.stringify(reviews));
    localStorage.setItem('lh_banners', JSON.stringify(banners));
    localStorage.setItem('lh_bottom_banners', JSON.stringify(bottomBanners));
}

// CUSTOMER VIEW RENDERING
function renderBanners() {
    const container = document.getElementById('carousel-slides');
    if (!container) return;
    container.innerHTML = '';
    
    if (banners.length === 0) {
        banners = ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop'];
    }
    
    banners.forEach((b, i) => {
        container.innerHTML += `<img src="${b}" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}" id="slide-${i}">`;
    });
    
    currentSlide = 0;
    clearInterval(slideInterval);
    if (banners.length > 1) {
        slideInterval = setInterval(nextSlide, 5000);
    }
}

function nextSlide() {
    if (banners.length <= 1) return;
    const oldSlide = document.getElementById(`slide-${currentSlide}`);
    oldSlide.classList.remove('opacity-100', 'z-10');
    oldSlide.classList.add('opacity-0', 'z-0');
    
    currentSlide = (currentSlide + 1) % banners.length;
    
    const newSlide = document.getElementById(`slide-${currentSlide}`);
    newSlide.classList.remove('opacity-0', 'z-0');
    newSlide.classList.add('opacity-100', 'z-10');
}

function prevSlide() {
    if (banners.length <= 1) return;
    const oldSlide = document.getElementById(`slide-${currentSlide}`);
    oldSlide.classList.remove('opacity-100', 'z-10');
    oldSlide.classList.add('opacity-0', 'z-0');
    
    currentSlide = (currentSlide - 1 + banners.length) % banners.length;
    
    const newSlide = document.getElementById(`slide-${currentSlide}`);
    newSlide.classList.remove('opacity-0', 'z-0');
    newSlide.classList.add('opacity-100', 'z-10');
}

function renderBottomBanners() {
    const container = document.getElementById('bottom-carousel-slides');
    if (!container) return;
    container.innerHTML = '';
    
    if (bottomBanners.length === 0) {
        bottomBanners = ['https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=2000&auto=format&fit=crop'];
    }
    
    bottomBanners.forEach((b, i) => {
        container.innerHTML += `<img src="${b}" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}" id="bottom-slide-${i}">`;
    });
    
    currentBottomSlide = 0;
    clearInterval(bottomSlideInterval);
    if (bottomBanners.length > 1) {
        bottomSlideInterval = setInterval(nextBottomSlide, 5000);
    }
}

function nextBottomSlide() {
    if (bottomBanners.length <= 1) return;
    const oldSlide = document.getElementById(`bottom-slide-${currentBottomSlide}`);
    if(oldSlide) {
        oldSlide.classList.remove('opacity-100', 'z-10');
        oldSlide.classList.add('opacity-0', 'z-0');
    }
    
    currentBottomSlide = (currentBottomSlide + 1) % bottomBanners.length;
    
    const newSlide = document.getElementById(`bottom-slide-${currentBottomSlide}`);
    if(newSlide) {
        newSlide.classList.remove('opacity-0', 'z-0');
        newSlide.classList.add('opacity-100', 'z-10');
    }
}

function prevBottomSlide() {
    if (bottomBanners.length <= 1) return;
    const oldSlide = document.getElementById(`bottom-slide-${currentBottomSlide}`);
    if(oldSlide) {
        oldSlide.classList.remove('opacity-100', 'z-10');
        oldSlide.classList.add('opacity-0', 'z-0');
    }
    
    currentBottomSlide = (currentBottomSlide - 1 + bottomBanners.length) % bottomBanners.length;
    
    const newSlide = document.getElementById(`bottom-slide-${currentBottomSlide}`);
    if(newSlide) {
        newSlide.classList.remove('opacity-0', 'z-0');
        newSlide.classList.add('opacity-100', 'z-10');
    }
}

function applySettings() {
    const waLink = `https://wa.me/${settings.wa}?text=Hello%20${encodeURIComponent(settings.name)}!`;
    
    const footerContactLink = document.getElementById('footer-contact-link');
    if (footerContactLink) {
        footerContactLink.href = waLink;
    }

    if (document.getElementById('nav-logo')) {
        document.getElementById('nav-logo').src = settings.logo;
    }
    if (document.getElementById('footer-logo')) {
        document.getElementById('footer-logo').src = settings.logo;
    }
    
    if (document.getElementById('footer-fb-link')) {
        document.getElementById('footer-fb-link').href = settings.fb || '#';
    }
    if (document.getElementById('footer-insta-link')) {
        document.getElementById('footer-insta-link').href = settings.insta || '#';
    }
    if (document.getElementById('footer-twitter-link')) {
        document.getElementById('footer-twitter-link').href = settings.twitter || '#';
    }
}

function renderCategories() {
    const filter = document.getElementById('category-filter');
    filter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
        filter.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

function renderProducts(filter = 'all', search = '') {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    let filtered = products;
    if (filter !== 'all') filtered = filtered.filter(p => p.category === filter);
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    filtered.forEach(p => {
        container.innerHTML += `
            <div class="bg-white rounded-xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col transition hover:-translate-y-1 hover:shadow-xl group">
                <div class="relative h-64 overflow-hidden">
                    <img src="${p.img || 'https://via.placeholder.com/300'}" class="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105" alt="${p.name}">
                </div>
                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="text-primary font-bold text-lg mb-1">${p.name}</h3>
                    <div class="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                        <span class="text-primary font-bold text-lg">From ₹${p.salePrice || p.price}</span>
                        <button class="bg-[#d14b8a] hover:bg-primary-dark text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm" onclick="openProductModal('${p.id}')">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function filterProducts() {
    renderProducts(document.getElementById('category-filter').value);
}
function filterByCategory(cat) {
    document.getElementById('category-filter').value = cat;
    document.getElementById('products').scrollIntoView();
    filterProducts();
}
function toggleSearch() { document.getElementById('search-bar').classList.toggle('hidden'); }
function handleSearch() { renderProducts('all', document.getElementById('search-input').value); }

// REVIEWS LOGIC
function renderReviews() {
    const container = document.getElementById('reviews-container');
    if (!container) return;
    container.innerHTML = '';
    
    // Display up to 3 most recent reviews
    const displayReviews = reviews.slice(0, 3);
    displayReviews.forEach(r => {
        const stars = '⭐'.repeat(r.rating);
        container.innerHTML += `
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-full bg-pink-100 text-primary flex items-center justify-center font-bold text-lg">${r.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <h4 class="font-bold text-gray-800">${r.name}</h4>
                        <div class="text-xs tracking-widest">${stars}</div>
                    </div>
                </div>
                <p class="text-gray-600 text-sm italic">"${r.text}"</p>
            </div>
        `;
    });
}

function openReviewModal() {
    document.getElementById('review-modal').classList.remove('hidden');
    // Pre-fill name if available from leads
    const storedName = localStorage.getItem('lh_visitor_done') ? (leads.length > 0 ? leads[0].name : '') : '';
    if (storedName) document.getElementById('rev-name').value = storedName;
}

function submitReview() {
    const name = document.getElementById('rev-name').value.trim();
    const rating = Number(document.getElementById('rev-rating').value);
    const text = document.getElementById('rev-text').value.trim();
    
    if (!name || !text) return alert("Please enter your name and review text.");
    
    reviews.unshift({ name, rating, text });
    saveData();
    renderReviews();
    
    document.getElementById('review-modal').classList.add('hidden');
    document.getElementById('rev-name').value = '';
    document.getElementById('rev-text').value = '';
    alert("Thank you for your review!");
}

// MODALS & INTERACTIONS
function closeAllModals() {
    document.getElementById('overlay').classList.add('hidden');
    document.getElementById('product-modal').classList.add('hidden');
    document.getElementById('admin-login-modal').classList.add('hidden');
    document.getElementById('cart-drawer').style.transform = 'translateX(100%)';
    setTimeout(() => document.getElementById('cart-drawer').classList.add('hidden'), 300);
}

function openProductModal(id) {
    activeProduct = products.find(p => p.id === id);
    if (!activeProduct) return;
    
    document.getElementById('pm-title').textContent = activeProduct.name;
    document.getElementById('pm-image').src = activeProduct.img || 'https://via.placeholder.com/500';
    document.getElementById('pm-desc').innerHTML = activeProduct.desc.replace(/\n/g, '<br>');
    
    if (activeProduct.salePrice) {
        document.getElementById('pm-sale-price').textContent = `₹${activeProduct.salePrice}`;
        document.getElementById('pm-price').textContent = `₹${activeProduct.price}`;
    } else {
        document.getElementById('pm-sale-price').textContent = `₹${activeProduct.price}`;
        document.getElementById('pm-price').textContent = '';
    }

    if (activeProduct.custom) {
        document.getElementById('pm-customization-area').classList.remove('hidden');
    } else {
        document.getElementById('pm-customization-area').classList.add('hidden');
    }

    document.getElementById('overlay').classList.remove('hidden');
    document.getElementById('product-modal').classList.remove('hidden');
}

// CART LOGIC
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer.classList.contains('hidden')) {
        renderCart();
        drawer.classList.remove('hidden');
        drawer.style.transform = 'translateX(0)';
    } else {
        drawer.style.transform = 'translateX(100%)';
        setTimeout(() => drawer.classList.add('hidden'), 300);
    }
}

function addToCart() {
    const customText = document.getElementById('pm-name').value + " | " + document.getElementById('pm-msg').value;
    cart.push({
        id: Date.now().toString(),
        productId: activeProduct.id,
        name: activeProduct.name,
        price: activeProduct.salePrice || activeProduct.price,
        img: activeProduct.img,
        custom: customText
    });
    saveData();
    updateCartCount();
    closeAllModals();
    toggleCart();
}

function removeFromCart(cartId) {
    cart = cart.filter(c => c.id !== cartId);
    saveData();
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

function renderCart() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    let total = 0;
    cart.forEach(c => {
        total += c.price;
        container.innerHTML += `
            <div class="cart-item">
                <img src="${c.img || 'https://via.placeholder.com/80'}">
                <div class="cart-item-details">
                    <h4>${c.name}</h4>
                    <p>₹${c.price}</p>
                    <small>${c.custom}</small>
                    <button class="remove-item" onclick="removeFromCart('${c.id}')"><i class="fas fa-trash"></i> Remove</button>
                </div>
            </div>
        `;
    });
    document.getElementById('cart-total').textContent = total;
}

// WHATSAPP CHECKOUT
function formatWAOrder(items, total) {
    let msg = `Hello ${settings.name} 👋\nI want to place an order:\n\n`;
    items.forEach(i => {
        msg += `📦 *${i.name}*\nPrice: ₹${i.price}\nCustomization: ${i.custom || 'None'}\n\n`;
    });
    if (total) msg += `*Total: ₹${total}*\n\nPlease confirm my order.`;
    return encodeURIComponent(msg);
}

function orderSingleProductWA() {
    const customText = document.getElementById('pm-name').value + " | " + document.getElementById('pm-msg').value;
    const price = activeProduct.salePrice || activeProduct.price;
    const item = { name: activeProduct.name, price: price, custom: customText };
    window.open(`https://wa.me/${settings.wa}?text=${formatWAOrder([item], price)}`, '_blank');
}

function checkoutCartWA() {
    if (cart.length === 0) return alert('Cart is empty!');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    window.open(`https://wa.me/${settings.wa}?text=${formatWAOrder(cart, total)}`, '_blank');
}

// ADMIN LOGIC
function showAdminLogin() {
    document.getElementById('overlay').classList.remove('hidden');
    document.getElementById('admin-login-modal').classList.remove('hidden');
}

function loginAdmin() {
    if (document.getElementById('admin-password').value === settings.adminPass) {
        closeAllModals();
        document.getElementById('admin-view').classList.remove('hidden');
        document.getElementById('customer-view').classList.add('hidden');
        renderAdminDashboard();
    } else {
        alert('Incorrect password');
    }
}

function logoutAdmin() {
    document.getElementById('admin-view').classList.add('hidden');
    document.getElementById('customer-view').classList.remove('hidden');
    document.getElementById('admin-password').value = '';
    init(); // reload customer view
}

function closeAdmin() {
    logoutAdmin();
}

function showAdminSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(`admin-${sectionId}`).classList.remove('hidden');
    document.getElementById('admin-section-title').textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    
    if(sectionId === 'dashboard') renderAdminDashboard();
    if(sectionId === 'products') renderAdminProducts();
    if(sectionId === 'categories') renderAdminCategories();
    if(sectionId === 'leads') renderAdminLeads();
    if(sectionId === 'settings') {
        document.getElementById('set-wa').value = settings.wa || '';
        document.getElementById('set-logo').value = settings.logo || 'logo.jpg';
        document.getElementById('set-pass').value = settings.adminPass || 'admin123';
        document.getElementById('set-fb').value = settings.fb || '#';
        document.getElementById('set-insta').value = settings.insta || '#';
        document.getElementById('set-twitter').value = settings.twitter || '#';
    }
}

function renderAdminLeads() {
    const tbody = document.getElementById('admin-leads-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    leads.forEach(l => {
        tbody.innerHTML += `<tr class="hover:bg-gray-50 transition border-b border-gray-100">
            <td class="p-4 text-gray-500 text-sm">${l.date}</td>
            <td class="p-4 font-semibold text-gray-800">${l.name}</td>
            <td class="p-4 font-semibold text-primary"><a href="https://wa.me/${l.phone.replace(/\D/g, '')}" target="_blank"><i class="fab fa-whatsapp mr-1"></i>${l.phone}</a></td>
        </tr>`;
    });
}

function renderAdminDashboard() {
    document.getElementById('stat-products').textContent = products.length;
    document.getElementById('stat-categories').textContent = categories.length;
    document.getElementById('stat-leads').textContent = leads.length;
    document.getElementById('stat-reviews').textContent = reviews.length;

    const bannerList = document.getElementById('admin-banners-list');
    if (bannerList) {
        bannerList.innerHTML = '';
        banners.forEach((b, i) => {
            bannerList.innerHTML += `
                <div class="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-video">
                    <img src="${b}" class="w-full h-full object-cover">
                    <button onclick="deleteBanner(${i})" class="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition opacity-0 group-hover:opacity-100"><i class="fas fa-trash"></i></button>
                </div>
            `;
        });
    }

    const bottomBannerList = document.getElementById('admin-bottom-banners-list');
    if (bottomBannerList) {
        bottomBannerList.innerHTML = '';
        bottomBanners.forEach((b, i) => {
            bottomBannerList.innerHTML += `
                <div class="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-video">
                    <img src="${b}" class="w-full h-full object-cover">
                    <button onclick="deleteBottomBanner(${i})" class="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition opacity-0 group-hover:opacity-100"><i class="fas fa-trash"></i></button>
                </div>
            `;
        });
    }
}

function addBanner() {
    let url = document.getElementById('new-banner-url').value.trim();
    if (!url) return alert('Please enter an image URL');
    
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
        url = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    }

    banners.push(url);
    saveData();
    document.getElementById('new-banner-url').value = '';
    renderAdminDashboard();
    renderBanners();
}

function addBottomBanner() {
    let url = document.getElementById('new-bottom-banner-url').value.trim();
    if (!url) return alert('Please enter an image URL');
    
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
        url = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    }

    bottomBanners.push(url);
    saveData();
    document.getElementById('new-bottom-banner-url').value = '';
    renderAdminDashboard();
    renderBottomBanners();
}

function deleteBanner(index) {
    if (confirm('Delete this banner from the slider?')) {
        banners.splice(index, 1);
        if (banners.length === 0) {
            banners = ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop'];
        }
        saveData();
        renderAdminDashboard();
        renderBanners();
    }
}

function deleteBottomBanner(index) {
    if (confirm('Delete this banner from the bottom slider?')) {
        bottomBanners.splice(index, 1);
        if (bottomBanners.length === 0) {
            bottomBanners = ['https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=2000&auto=format&fit=crop'];
        }
        saveData();
        renderAdminDashboard();
        renderBottomBanners();
    }
}

function renderAdminProducts() {
    const tbody = document.getElementById('admin-products-tbody');
    tbody.innerHTML = '';
    products.forEach(p => {
        tbody.innerHTML += `
            <tr class="hover:bg-gray-50 transition border-b border-gray-100">
                <td class="p-4"><img src="${p.img || 'https://via.placeholder.com/50'}" class="w-12 h-12 object-cover rounded-md border border-gray-200"></td>
                <td class="p-4 font-semibold text-gray-800">${p.name}</td>
                <td class="p-4 text-gray-600">₹${p.price}</td>
                <td class="p-4">
                    <button class="text-blue-500 hover:text-blue-700 mr-3 font-semibold text-sm transition" onclick="openProductForm('${p.id}')">Edit</button>
                    <button class="text-red-500 hover:text-red-700 font-semibold text-sm transition" onclick="deleteProduct('${p.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

function exportCatalogue() {
    const data = {
        products: products,
        categories: categories
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "lamination_hub_catalogue.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importCatalogue(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            let updated = false;
            
            if (data.products && Array.isArray(data.products)) {
                products = data.products;
                updated = true;
            }
            if (data.categories && Array.isArray(data.categories)) {
                categories = data.categories;
                updated = true;
            }
            
            if (updated) {
                saveData();
                renderAdminProducts();
                renderAdminCategories();
                renderProducts();
                renderCategories();
                alert('Catalogue imported successfully!');
            } else {
                alert('No valid products or categories found in the file.');
            }
        } catch (err) {
            alert('Invalid JSON file format. Please upload a valid catalogue export.');
        }
        document.getElementById('import-file').value = '';
    };
    reader.readAsText(file);
}

function openProductForm(id = null) {
    document.getElementById('product-form-container').classList.remove('hidden');
    const catSelect = document.getElementById('pf-category');
    catSelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
    
    if (id) {
        const p = products.find(x => x.id === id);
        document.getElementById('pf-id').value = p.id;
        document.getElementById('pf-name').value = p.name;
        document.getElementById('pf-category').value = p.category;
        document.getElementById('pf-price').value = p.price;
        document.getElementById('pf-saleprice').value = p.salePrice || '';
        document.getElementById('pf-desc').value = p.desc;
        document.getElementById('pf-custom').checked = p.custom;
        document.getElementById('pf-image-url').value = p.img || '';
        document.getElementById('pf-title').textContent = 'Edit Product';
    } else {
        document.getElementById('pf-id').value = '';
        document.getElementById('pf-name').value = '';
        document.getElementById('pf-price').value = '';
        document.getElementById('pf-saleprice').value = '';
        document.getElementById('pf-desc').value = '';
        document.getElementById('pf-custom').checked = false;
        document.getElementById('pf-image-url').value = '';
        document.getElementById('pf-title').textContent = 'Add Product';
    }
}

function closeProductForm() {
    document.getElementById('product-form-container').classList.add('hidden');
}

function saveProduct() {
    const id = document.getElementById('pf-id').value || Date.now().toString();
    const isNew = !document.getElementById('pf-id').value;
    
    let providedImg = document.getElementById('pf-image-url').value.trim();
    if (!providedImg) {
        providedImg = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500'; // Default placeholder
    } else {
        // Auto-convert Google Drive links
        const driveMatch = providedImg.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || providedImg.match(/id=([a-zA-Z0-9_-]+)/);
        if (driveMatch && driveMatch[1]) {
            providedImg = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
        }
    }
    
    const product = {
        id: id,
        name: document.getElementById('pf-name').value,
        category: document.getElementById('pf-category').value,
        price: Number(document.getElementById('pf-price').value),
        salePrice: Number(document.getElementById('pf-saleprice').value) || null,
        desc: document.getElementById('pf-desc').value,
        custom: document.getElementById('pf-custom').checked,
        img: providedImg
    };

    finishSaveProduct(product, isNew);
}

function finishSaveProduct(product, isNew) {
    if (isNew) {
        products.push(product);
    } else {
        const index = products.findIndex(x => x.id === product.id);
        products[index] = product;
    }
    saveData();
    closeProductForm();
    renderAdminProducts();
    renderProducts();
}

function deleteProduct(id) {
    if (confirm('Delete this product?')) {
        products = products.filter(x => x.id !== id);
        saveData();
        renderAdminProducts();
        renderProducts();
    }
}

function renderAdminCategories() {
    const tbody = document.getElementById('admin-categories-tbody');
    tbody.innerHTML = '';
    categories.forEach(c => {
        tbody.innerHTML += `<tr class="hover:bg-gray-50 transition border-b border-gray-100">
            <td class="p-4 font-semibold text-gray-800">${c}</td>
            <td class="p-4"><button class="text-red-500 hover:text-red-700 font-semibold text-sm transition" onclick="deleteCategory('${c}')">Delete</button></td>
        </tr>`;
    });
}

function addCategory() {
    const val = document.getElementById('new-cat-name').value.trim();
    if (val && !categories.includes(val)) {
        categories.push(val);
        saveData();
        document.getElementById('new-cat-name').value = '';
        renderAdminCategories();
        renderCategories(); // update dropdowns on customer side
    }
}

function deleteCategory(c) {
    if (confirm(`Delete category "${c}"?`)) {
        categories = categories.filter(x => x !== c);
        saveData();
        renderAdminCategories();
        renderCategories();
    }
}

function saveSettings() {
    settings.wa = document.getElementById('set-wa').value.trim();
    
    let logoUrl = document.getElementById('set-logo').value.trim() || 'logo.jpg';
    const driveMatch = logoUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || logoUrl.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
        logoUrl = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    }
    settings.logo = logoUrl;

    settings.adminPass = document.getElementById('set-pass').value.trim();
    settings.fb = document.getElementById('set-fb').value.trim();
    settings.insta = document.getElementById('set-insta').value.trim();
    settings.twitter = document.getElementById('set-twitter').value.trim();
    saveData();
    applySettings();
    alert('Settings Saved!');
}

// Start
init();
