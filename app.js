
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
// ── FIREBASE CONFIG ────────────────────────────────────────────────────────
const firebaseConfig = {
    apiKey: "AIzaSyAy61XMvdMPYBLTj1BU9sqqwurFytrOJ8c",
    authDomain: "lamination-hub-22f6f.firebaseapp.com",
    databaseURL: "https://lamination-hub-22f6f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lamination-hub-22f6f",
    storageBucket: "lamination-hub-22f6f.firebasestorage.app",
    messagingSenderId: "81936926511",
    appId: "1:81936926511:web:373483564714ca13a483da"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

let currentUser = null;
let wishlist = [];

auth.onAuthStateChanged(user => {
    currentUser = user;
    const userNameMob = document.getElementById('user-name-mob');
    const userBtnDesk = document.getElementById('user-btn-desk');
    
    if (user) {
        if (userNameMob) userNameMob.textContent = user.displayName;
        if (userBtnDesk) userBtnDesk.innerHTML = <img src=" + user.photoURL + " class="w-6 h-6 rounded-full inline-block">;
        
        // Load Wishlist
        db.ref('users/' + user.uid + '/wishlist').on('value', snap => {
            wishlist = snap.val() || [];
            updateWishlistUI();
        });
    } else {
        if (userNameMob) userNameMob.textContent = 'Sign In';
        if (userBtnDesk) userBtnDesk.innerHTML = <i class="fas fa-user-circle"></i>;
        wishlist = safeJSONParse('lh_local_wishlist', []);
        updateWishlistUI();
    }
});

function handleUserClick() {
    if (currentUser) {
        document.getElementById('profile-modal').classList.remove('hidden');
        document.getElementById('overlay').classList.remove('hidden');
        document.getElementById('prof-img').src = currentUser.photoURL || 'https://via.placeholder.com/150';
        document.getElementById('prof-name').textContent = currentUser.displayName || 'Customer';
        document.getElementById('prof-email').textContent = currentUser.email || '';
        
        const list = document.getElementById('prof-orders-list');
        list.innerHTML = '<p class="text-gray-500">Loading orders...</p>';
        db.ref('orders').orderByChild('uid').equalTo(currentUser.uid).once('value', snap => {
            list.innerHTML = '';
            if (!snap.exists()) {
                list.innerHTML = '<p class="text-gray-500">You have no past orders.</p>';
                return;
            }
            const myOrders = [];
            snap.forEach(c => { myOrders.push(c.val()); });
            myOrders.reverse().forEach(o => {
                list.innerHTML += `
                    <div class="border rounded p-3 bg-gray-50 dark:bg-gray-700">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-xs text-gray-500">${o.date}</span>
                            <span class="text-xs font-bold ${o.status === 'Delivered' ? 'text-green-500' : 'text-blue-500'}">${o.status || 'Processing'}</span>
                        </div>
                        <p class="font-bold text-gray-800 dark:text-gray-200 text-sm">${o.product}</p>
                        <p class="text-primary font-bold">₹${o.price}</p>
                    </div>
                `;
            });
        });
    } else {
        auth.signInWithPopup(googleProvider).catch(err => {
            console.error(err);
            alert('Login failed: ' + err.message);
        });
    }
}

function signOutUser() {
    if (confirm('Sign out?')) {
        auth.signOut();
        document.getElementById('profile-modal').classList.add('hidden');
        document.getElementById('overlay').classList.add('hidden');
    }
}

function toggleWishlistProduct(productId) {
    const idx = wishlist.indexOf(productId);
    if (idx > -1) {
        wishlist.splice(idx, 1);
    } else {
        wishlist.push(productId);
    }
    
    if (currentUser) {
        db.ref('users/' + currentUser.uid + '/wishlist').set(wishlist);
    } else {
        localStorage.setItem('lh_local_wishlist', JSON.stringify(wishlist));
    }
    updateWishlistUI();
}

function updateWishlistUI() {
    document.getElementById('wishlist-count').textContent = wishlist.length;
    const mobCount = document.getElementById('wishlist-count-mob');
    if (mobCount) mobCount.textContent = wishlist.length;
    
    // Update product cards heart icons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (wishlist.includes(id)) {
            btn.innerHTML = '<i class="fas fa-heart text-red-500"></i>';
        } else {
            btn.innerHTML = '<i class="far fa-heart text-gray-400 hover:text-red-500"></i>';
        }
    });
}

// ── DEFAULT SEED DATA (used only if Firebase is empty on first run) ─────────
const DEFAULT_PRODUCTS = [
    { id: '1', name: 'Photo Frame 8x12', category: 'Frames', price: 300, salePrice: null, desc: 'Customizable Photo Frame 8x12', custom: true, img: '' },
    { id: '2', name: 'Magic Mug', category: 'Mugs', price: 399, salePrice: 299, desc: 'Reveals your photo when hot', custom: true, img: '' },
    { id: '3', name: 'Heart Pillow', category: 'Pillows', price: 450, salePrice: 350, desc: 'Soft and cozy heart-shaped pillow', custom: true, img: '' },
    { id: '4', name: 'Square Pillow', category: 'Pillows', price: 399, salePrice: 300, desc: 'Stylish square pillow for decor', custom: true, img: '' },
    { id: '5', name: 'Acrylic Jhula Frame', category: 'Frames', price: 550, salePrice: null, desc: 'Customizable Acrylic Jhula Frame', custom: true, img: '' },
    { id: '6', name: 'Steel Mug', category: 'Mugs', price: 450, salePrice: 350, desc: 'Steel version of our mug with custom finish', custom: true, img: '' }
];
const DEFAULT_CATEGORIES = ['Frames', 'Mugs', 'Pillows', 'Gifts'];
const DEFAULT_REVIEWS = [
    { name: 'Rahul Sharma', rating: 5, text: 'Amazing quality! The photo frame was a perfect gift.' },
    { name: 'Priya Patel', rating: 5, text: 'Loved the magic mug. The printing is very clear.' },
    { name: 'Ankit Kumar', rating: 4, text: 'Fast delivery and great customer service on WhatsApp.' }
];
const DEFAULT_BANNERS = ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop'];
const DEFAULT_BOTTOM_BANNERS = ['https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=2000&auto=format&fit=crop'];
const DEFAULT_SETTINGS = {
    wa: '919876543210',
    name: 'Lamination Hub',
    phone: '+91 98765 43210',
    adminPass: 'admin123',
    logo: 'logo.jpg'
};

// ── STATE VARIABLES ─────────────────────────────────────────────────────────
let products = [];
let categories = [];
let settings = {};
let cart = safeJSONParse('lh_cart', []);
let leads = [];
let reviews = [];
let banners = [];
let bottomBanners = [];
let activeProduct = null;
let currentSlide = 0;
let slideInterval;
let currentBottomSlide = 0;
let bottomSlideInterval;
let productQuantity = 1;
let selectedVariant = '';
let orders = [];
let recentlyViewed = safeJSONParse('lh_recently_viewed', []);
let appliedCoupon = null;
let darkMode = localStorage.getItem('lh_dark_mode') === 'true';

// ── SAVE DATA TO FIREBASE ───────────────────────────────────────────────────
function saveData() {
    // Cloud data → Firebase
    db.ref('/').update({
        products: products,
        categories: categories,
        settings: settings,
        banners: banners,
        bottomBanners: bottomBanners,
        leads: leads,
        reviews: reviews,
        orders: orders
    }).catch(err => console.error('Firebase save error:', err));
    // Cart stays local (each customer has own cart)
    localStorage.setItem('lh_cart', JSON.stringify(cart));
}

// ── INIT: LOAD FROM FIREBASE ────────────────────────────────────────────────
function init() {
    // Show loading indicator
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        productsContainer.innerHTML = '<div class="col-span-4 text-center py-16 text-gray-400"><i class="fas fa-spinner fa-spin text-4xl mb-4"></i><p class="font-semibold">Loading products...</p></div>';
    }

    // Load cart from localStorage (device-specific)
    cart = safeJSONParse('lh_cart', []);

    // Listen to Firebase for real-time updates
    db.ref('/').on('value', (snapshot) => {
        const data = snapshot.val();

        if (data && data.products) {
            // Firebase has data — use it
            products = Array.isArray(data.products) ? data.products : Object.values(data.products);
            categories = data.categories ? (Array.isArray(data.categories) ? data.categories : Object.values(data.categories)) : DEFAULT_CATEGORIES;
            settings = data.settings || {};
            banners = data.banners ? (Array.isArray(data.banners) ? data.banners : Object.values(data.banners)) : DEFAULT_BANNERS;
            bottomBanners = data.bottomBanners ? (Array.isArray(data.bottomBanners) ? data.bottomBanners : Object.values(data.bottomBanners)) : DEFAULT_BOTTOM_BANNERS;
            leads = data.leads ? (Array.isArray(data.leads) ? data.leads : Object.values(data.leads)) : [];
            reviews = data.reviews ? (Array.isArray(data.reviews) ? data.reviews : Object.values(data.reviews)) : DEFAULT_REVIEWS;
            orders = data.orders ? (Array.isArray(data.orders) ? data.orders : Object.values(data.orders)) : [];
        } else {
            // Firebase is empty (first run) — seed with defaults
            products = DEFAULT_PRODUCTS;
            categories = DEFAULT_CATEGORIES;
            settings = {};
            banners = DEFAULT_BANNERS;
            bottomBanners = DEFAULT_BOTTOM_BANNERS;
            leads = [];
            reviews = DEFAULT_REVIEWS;
            // Push defaults to Firebase
            saveData();
        }

        // Apply setting defaults for missing keys
        if (!settings.wa) settings.wa = DEFAULT_SETTINGS.wa;
        if (!settings.name) settings.name = DEFAULT_SETTINGS.name;
        if (!settings.phone) settings.phone = DEFAULT_SETTINGS.phone;
        if (!settings.adminPass) settings.adminPass = DEFAULT_SETTINGS.adminPass;
        if (!settings.logo) settings.logo = DEFAULT_SETTINGS.logo;

        // Render everything
        applySettings();
        applyTheme();
        applyDarkMode();
        renderCategories();
        renderProducts();
        renderRecentlyViewed();
        renderReviews();
        renderBanners();
        renderBottomBanners();
        updateCartCount();
        document.getElementById('current-year').textContent = new Date().getFullYear();
        checkVisitor();
    }, (error) => {
        console.error('Firebase connection error:', error);
        // Fallback to localStorage if Firebase fails
        products = safeJSONParse('lh_products', DEFAULT_PRODUCTS);
        categories = safeJSONParse('lh_categories', DEFAULT_CATEGORIES);
        settings = safeJSONParse('lh_settings', {});
        banners = safeJSONParse('lh_banners', DEFAULT_BANNERS);
        bottomBanners = safeJSONParse('lh_bottom_banners', DEFAULT_BOTTOM_BANNERS);
        leads = safeJSONParse('lh_leads', []);
        reviews = safeJSONParse('lh_reviews', DEFAULT_REVIEWS);
        if (!settings.wa) settings.wa = DEFAULT_SETTINGS.wa;
        if (!settings.adminPass) settings.adminPass = DEFAULT_SETTINGS.adminPass;
        if (!settings.logo) settings.logo = DEFAULT_SETTINGS.logo;
        applySettings();
        renderCategories();
        renderProducts();
        renderReviews();
        renderBanners();
        renderBottomBanners();
        updateCartCount();
        document.getElementById('current-year').textContent = new Date().getFullYear();
        checkVisitor();
    });
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
        container.innerHTML += `<img referrerpolicy="no-referrer" src="${b}" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}" id="slide-${i}">`;
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
        container.innerHTML += `<img referrerpolicy="no-referrer" src="${b}" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}" id="bottom-slide-${i}">`;
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
    if (footerContactLink) footerContactLink.href = waLink;

    const waFloatBtn = document.getElementById('wa-float-btn');
    if (waFloatBtn) waFloatBtn.href = waLink;

    if (document.getElementById('nav-logo')) document.getElementById('nav-logo').src = settings.logo;
    if (document.getElementById('footer-logo')) document.getElementById('footer-logo').src = settings.logo;
    if (document.getElementById('footer-fb-link')) document.getElementById('footer-fb-link').href = settings.fb || '#';
    if (document.getElementById('footer-insta-link')) document.getElementById('footer-insta-link').href = settings.insta || '#';
    if (document.getElementById('footer-twitter-link')) document.getElementById('footer-twitter-link').href = settings.twitter || '#';

        // Map Render
    const mapContainer = document.getElementById('store-location-container');
    const mapIframe = document.getElementById('store-map-iframe');
    if (mapContainer && mapIframe) {
        if (settings.mapUrl && settings.mapUrl.trim()) {
            mapIframe.src = settings.mapUrl;
            mapContainer.classList.remove('hidden');
        } else {
            mapContainer.classList.add('hidden');
        }
    }

    // Announcement banner
    const announcementBar = document.getElementById('announcement-bar');
    const announcementText = document.getElementById('announcement-text');
    if (announcementBar && announcementText) {
        if (settings.announcement && settings.announcement.trim()) {
            announcementText.textContent = settings.announcement;
            announcementBar.classList.remove('hidden');
        } else {
            announcementBar.classList.add('hidden');
        }
    }
    
    // Flash Sale Timer
    if (window.flashSaleInterval) clearInterval(window.flashSaleInterval);
    const flashBanner = document.getElementById('flash-sale-banner');
    if (flashBanner && settings.flashSaleEnd) {
        function updateFlash() {
            const now = new Date().getTime();
            const end = new Date(settings.flashSaleEnd).getTime();
            const distance = end - now;
            
            if (distance < 0) {
                flashBanner.classList.add('hidden');
                clearInterval(window.flashSaleInterval);
                return;
            }
            flashBanner.classList.remove('hidden');
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById('flash-sale-timer').textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        updateFlash();
        window.flashSaleInterval = setInterval(updateFlash, 1000);
    } else if (flashBanner) {
        flashBanner.classList.add('hidden');
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
        const fallbackImg = 'https://placehold.co/300x300/e44c89/white?text=No+Image';
        const imgSrc = p.img ? p.img : fallbackImg;
        const outOfStock = p.outOfStock === true;
        container.innerHTML += `
            <div class="bg-white rounded-xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col transition hover:-translate-y-1 hover:shadow-xl group">
                <div class="relative h-64 overflow-hidden">
                    <img referrerpolicy="no-referrer" src="${imgSrc}" onerror="this.onerror=null;this.src='${fallbackImg}';" class="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105 ${outOfStock ? 'opacity-50 grayscale' : ''}" alt="${p.name}">
                                        
                    <button class="wishlist-btn absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow hover:bg-white transition" data-id="" onclick="toggleWishlistProduct(''); event.stopPropagation();">
                        <i class="far fa-heart text-gray-400"></i>
                    </button>
                </div>
                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="text-primary font-bold text-lg mb-1">${p.name}</h3>
                    <div class="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                        <span class="text-primary font-bold text-lg">From \u20b9${p.salePrice || p.price}</span>
                        ${outOfStock
                            ? '<span class="text-red-400 font-semibold text-sm px-4 py-2 border border-red-200 rounded-md bg-red-50">Unavailable</span>'
                            : `<button class="bg-[#d14b8a] hover:bg-primary-dark text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors shadow-sm" onclick="openProductModal('${p.id}')">Add to Cart</button>`
                        }
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
    
    // Display up to 3 most recent approved reviews
    const displayReviews = reviews.filter(r => r.approved !== false).slice(0, 3);
    if (displayReviews.length === 0) {
        container.innerHTML = '<p class="text-gray-500 w-full text-center">No reviews yet.</p>';
        return;
    }
    displayReviews.forEach(r => {
        const stars = '⭐'.repeat(r.rating || 5);
        let iconHtml = '';
        if (r.source === 'Google') iconHtml = '<i class="fab fa-google text-blue-500 ml-auto" title="Google Review"></i>';
        else if (r.source === 'Facebook') iconHtml = '<i class="fab fa-facebook text-blue-600 ml-auto" title="Facebook Review"></i>';
        
        container.innerHTML += `
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-full bg-pink-100 text-primary flex items-center justify-center font-bold text-lg">${r.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <h4 class="font-bold text-gray-800">${r.name}</h4>
                        <div class="text-xs tracking-widest text-yellow-400">${stars}</div>
                    </div>
                    ${iconHtml}
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
    document.body.style.overflow = '';
}

function openProductModal(id) {
    activeProduct = products.find(p => p.id === id);
    if (!activeProduct) return;

    const fallbackImg = 'https://placehold.co/600x600/e44c89/white?text=No+Image';
    const mainImg = activeProduct.img ? activeProduct.img : fallbackImg;

    // Set main image
    const modalImg = document.getElementById('modal-img');
    modalImg.src = mainImg;
    modalImg.onerror = function() { this.onerror = null; this.src = fallbackImg; };
    document.getElementById('custom-photo').value = '';
    document.getElementById('preview-overlay').classList.add('hidden');
    document.getElementById('preview-overlay').src = '';
    document.getElementById('preview-text').classList.add('hidden');
    document.getElementById('preview-text').textContent = '';

    // Multi-image gallery
    const gallery = document.getElementById('modal-gallery');
    const allImages = activeProduct.images && activeProduct.images.length > 1 ? activeProduct.images : null;
    if (allImages) {
        gallery.classList.remove('hidden');
        gallery.innerHTML = allImages.map(imgUrl => `
            <img referrerpolicy="no-referrer" src="${imgUrl}" onclick="document.getElementById('modal-img').src=this.src"
                class="w-16 h-16 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-primary transition flex-shrink-0"
                onerror="this.onerror=null;this.src='${fallbackImg}';">
        `).join('');
    } else {
        gallery.classList.add('hidden');
        gallery.innerHTML = '';
    }

    // Title & price
    document.getElementById('modal-title').textContent = activeProduct.name;
    if (activeProduct.salePrice) {
        document.getElementById('modal-price').textContent = `₹${activeProduct.salePrice}`;
        document.getElementById('modal-original-price').textContent = `₹${activeProduct.price}`;
        document.getElementById('modal-original-price').classList.remove('hidden');
    } else {
        document.getElementById('modal-price').textContent = `₹${activeProduct.price}`;
        document.getElementById('modal-original-price').textContent = '';
        document.getElementById('modal-original-price').classList.add('hidden');
    }

    // Description
    document.getElementById('modal-desc').innerHTML = (activeProduct.desc || '').replace(/\n/g, '<br>');

    // Customization fields
    const customFields = document.getElementById('custom-fields');
    if (activeProduct.custom) {
        customFields.classList.remove('hidden');
        document.getElementById('custom-name').value = '';
        document.getElementById('custom-notes').value = '';
    } else {
        customFields.classList.add('hidden');
    }

    // Track recently viewed (device-local)
    trackRecentlyViewed(activeProduct);

    // Quantity reset
    productQuantity = 1;
    const qtyDisplay = document.getElementById('qty-display');
    if (qtyDisplay) qtyDisplay.textContent = '1';

    // Variants
    const variantSection = document.getElementById('modal-variants');
    if (activeProduct.variants && activeProduct.variants.trim()) {
        const opts = activeProduct.variants.split(',').map(v => v.trim()).filter(v => v);
        selectedVariant = opts[0];
        if (variantSection) {
            variantSection.classList.remove('hidden');
            variantSection.innerHTML = `<p class="text-sm font-semibold text-gray-700 mb-2">Choose Option:</p>
            <div class="flex flex-wrap gap-2">${opts.map(o => `<button onclick="selectVariant(this, '${o}')" class="variant-btn px-3 py-1.5 border-2 rounded-lg text-sm font-semibold transition ${o === opts[0] ? 'border-primary text-primary bg-pink-50' : 'border-gray-200 text-gray-600 hover:border-primary'}">${o}</button>`).join('')}</div>`;
        }
    } else {
        selectedVariant = '';
        if (variantSection) variantSection.classList.add('hidden');
    }

    // Related products
    const relSection = document.getElementById('modal-related');
    if (relSection) {
        const related = products.filter(p => p.category === activeProduct.category && p.id !== activeProduct.id && !p.outOfStock).slice(0, 4);
        if (related.length > 0) {
            relSection.classList.remove('hidden');
            const fb = 'https://placehold.co/80x80/e44c89/white?text=Gift';
            relSection.innerHTML = `<p class="text-sm font-bold text-gray-700 mb-2 mt-4">You may also like:</p>
            <div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar">${related.map(r => `<div onclick="openProductModal('${r.id}')" class="flex-shrink-0 w-20 cursor-pointer group">
                <img referrerpolicy="no-referrer" src="${r.img || fb}" onerror="this.src='${fb}'" class="w-20 h-20 object-cover rounded-lg border-2 border-transparent group-hover:border-primary transition">
                <p class="text-xs font-semibold text-center text-gray-700 mt-1 truncate">${r.name}</p>
            </div>`).join('')}</div>`;
        } else {
            relSection.classList.add('hidden');
        }
    }

    // Pincode reset
    const pinInput = document.getElementById('pincode-input');
    const pinResult = document.getElementById('pincode-result');
    if (pinInput) pinInput.value = '';
    if (pinResult) pinResult.innerHTML = '';

    document.getElementById('overlay').classList.remove('hidden');
    document.getElementById('product-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
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
    const customName = document.getElementById('custom-name') ? document.getElementById('custom-name').value : '';
    const customNotes = document.getElementById('custom-notes') ? document.getElementById('custom-notes').value : '';
    const customText = [customName, customNotes].filter(v => v.trim()).join(' | ') || 'None';
    const basePrice = activeProduct.salePrice || activeProduct.price;
    for (let i = 0; i < productQuantity; i++) {
        cart.push({
            id: Date.now().toString() + i,
            productId: activeProduct.id,
            name: activeProduct.name + (selectedVariant ? ` (${selectedVariant})` : ''),
            price: basePrice,
            img: activeProduct.img,
            custom: customText
        });
    }
    saveData();
    updateCartCount();
    closeAllModals();
    document.body.style.overflow = '';
    toggleCart();
}

function removeFromCart(cartId) {
    cart = cart.filter(c => c.id !== cartId);
    saveData();
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const dCount = document.getElementById('cart-count');
    const mCount = document.getElementById('cart-count-mobile');
    if (dCount) dCount.textContent = cart.length;
    if (mCount) mCount.textContent = cart.length;
}

function renderCart() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    let total = 0;
    const fallbackImg = 'https://placehold.co/80x80/e44c89/white?text=Gift';
    
    // Check volume discounts
    let volDiscountPct = 0;
    if (settings.volQty && cart.length >= settings.volQty) {
        volDiscountPct = settings.volPct || 0;
    }
    
    cart.forEach(c => {
        total += c.price;
        container.innerHTML += `
            <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <img referrerpolicy="no-referrer" src="${c.img || fallbackImg}" onerror="this.onerror=null;this.src='${fallbackImg}';" class="w-16 h-16 object-cover rounded-lg flex-shrink-0">
                <div class="flex-grow">
                    <h4 class="font-bold text-gray-800 text-sm">${c.name}</h4>
                    <p class="text-primary font-bold text-sm">₹${c.price}</p>
                    ${c.custom && c.custom !== 'None' ? `<small class="text-gray-500 text-xs block mt-1 truncate max-w-[180px]">${c.custom}</small>` : ''}
                    <button class="text-red-400 hover:text-red-600 text-xs font-semibold mt-2 flex items-center gap-1 transition" onclick="removeFromCart('${c.id}')"><i class="fas fa-trash text-xs"></i> Remove</button>
                </div>
            </div>
        `;
    });
    
    // Handle Gift Wrap
    const gwBox = document.getElementById('cart-gift-wrap');
    const gwContainer = document.getElementById('gift-msg-container');
    if (gwBox && gwContainer) {
        if (gwBox.checked) {
            gwContainer.classList.remove('hidden');
            total += 50;
        } else {
            gwContainer.classList.add('hidden');
        }
    }
    
    let baseTotal = total;
    let finalDiscount = 0;
    
    if (appliedCoupon && total > 0) {
        finalDiscount = Math.round(total * (appliedCoupon.pct / 100));
    } else if (volDiscountPct > 0 && total > 0) {
        finalDiscount = Math.round(total * (volDiscountPct / 100));
        document.getElementById('coupon-result').innerHTML = `<span class="text-green-600 text-sm font-bold"><i class="fas fa-tags"></i> Volume Discount (${volDiscountPct}%) Applied!</span>`;
    }
    
    total = total - finalDiscount;
    
    if (finalDiscount > 0) {
        document.getElementById('cart-total').innerHTML = `<span class="line-through text-gray-400 text-sm mr-2">₹${baseTotal}</span>₹${total}`;
    } else {
        document.getElementById('cart-total').textContent = total;
    }
}

let savedGiftMsg = "";
function saveGiftMessage() {
    savedGiftMsg = document.getElementById('cart-gift-msg').value.trim();
}

// WHATSAPP CHECKOUT
function formatWAOrder(items, total) {
    let msg = `Hello ${settings.name} 👋\nI want to place an order:\n\n`;
    items.forEach(i => {
        msg += `📦 *${i.name}*\nPrice: ₹${i.price}\nCustomization: ${i.custom || 'None'}\n\n`;
    });
    
    // Add Gift Wrap info if checked
    const gwBox = document.getElementById('cart-gift-wrap');
    if (gwBox && gwBox.checked) {
        msg += `🎁 *Premium Gift Wrap Included (+₹50)*\n`;
        if (savedGiftMsg) msg += `   💌 Message: "${savedGiftMsg}"\n\n`;
    }

    let volDiscountPct = 0;
    if (settings.volQty && items.length >= settings.volQty) volDiscountPct = settings.volPct || 0;

    if (appliedCoupon) {
        msg += `🏷️ *Coupon Applied:* ${appliedCoupon.code} (${appliedCoupon.pct}% off)\n\n`;
    } else if (volDiscountPct > 0 && items.length > 1) { // Cart multiple items
        msg += `🏷️ *Volume Discount:* ${volDiscountPct}% off\n\n`;
    }
    
    if (total) msg += `*Total: ₹${total}*\n\nPlease confirm my order.`;
    return encodeURIComponent(msg);
}

function orderSingleProductWA() {
    const customName = document.getElementById('custom-name') ? document.getElementById('custom-name').value : '';
    const customNotes = document.getElementById('custom-notes') ? document.getElementById('custom-notes').value : '';
    const customText = [customName, customNotes].filter(v => v.trim()).join(' | ') || 'None';
    let price = activeProduct.salePrice || activeProduct.price;
    const itemName = activeProduct.name + (selectedVariant ? ` (${selectedVariant})` : '') + (productQuantity > 1 ? ` x${productQuantity}` : '');
    let total = price * productQuantity;
    if (appliedCoupon) { total = Math.round(total * (1 - appliedCoupon.pct / 100)); }
    const item = { name: itemName, price: total, custom: customText + (appliedCoupon ? ` | Coupon: ${appliedCoupon.code} (${appliedCoupon.pct}% off)` : '') };
    // Log order to Firebase
    logOrder(item);
    window.open(`https://wa.me/${settings.wa}?text=${formatWAOrder([item], total)}`, '_blank');
}

function checkoutCartWA() {
    if (cart.length === 0) return alert('Cart is empty!');
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    let cartCustom = '';
    
    const gwBox = document.getElementById('cart-gift-wrap');
    if (gwBox && gwBox.checked) {
        total += 50;
        cartCustom += 'Gift Wrap: Yes. ';
        if (savedGiftMsg) cartCustom += `Msg: ${savedGiftMsg}. `;
    }

    let volDiscountPct = 0;
    if (settings.volQty && cart.length >= settings.volQty) {
        volDiscountPct = settings.volPct || 0;
    }

    if (appliedCoupon) {
        total = Math.round(total * (1 - appliedCoupon.pct / 100));
        cartCustom += `Coupon: ${appliedCoupon.code} (${appliedCoupon.pct}% off)`;
    } else if (volDiscountPct > 0) {
        total = Math.round(total * (1 - volDiscountPct / 100));
        cartCustom += `Volume Discount: ${volDiscountPct}% off`;
    }

    const itemStr = cart.map(c => c.name).join(', ');
    logOrder({ name: 'Cart Order: ' + itemStr.substring(0, 50) + (itemStr.length > 50 ? '...' : ''), price: total, custom: cartCustom.trim() });

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
    if(sectionId === 'reviews') renderAdminReviews();
    if(sectionId === 'settings') {
        document.getElementById('set-wa').value = settings.wa || '';
        document.getElementById('set-logo').value = settings.logo || 'logo.jpg';
        document.getElementById('set-pass').value = settings.adminPass || 'admin123';
        document.getElementById('set-fb').value = settings.fb || '#';
        document.getElementById('set-insta').value = settings.insta || '#';
        document.getElementById('set-twitter').value = settings.twitter || '#';
        document.getElementById('set-map').value = settings.mapUrl || '';
        document.getElementById('set-google-review').value = settings.googleReviewLink || '';
        document.getElementById('set-announcement').value = settings.announcement || '';
        document.getElementById('set-pincodes').value = settings.pincodes || '';
        document.getElementById('set-coupons').value = settings.coupons || '';
        document.getElementById('set-theme').value = settings.theme || 'pink';
        document.getElementById('set-flash').value = settings.flashSaleEnd || '';
        document.getElementById('set-vol-qty').value = settings.volQty || '';
        document.getElementById('set-vol-pct').value = settings.volPct || '';
    }
    if(sectionId === 'orders') renderAdminOrders();
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
    const statOrders = document.getElementById('stat-orders');
    if (statOrders) statOrders.textContent = orders.length;
    const statRevenue = document.getElementById('stat-revenue');
    if (statRevenue) {
        const total = orders.reduce((sum, o) => sum + (o.price || 0), 0);
        statRevenue.textContent = '₹' + total.toLocaleString('en-IN');
    }

    const bannerList = document.getElementById('admin-banners-list');
    if (bannerList) {
        bannerList.innerHTML = '';
        banners.forEach((b, i) => {
            bannerList.innerHTML += `
                <div class="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-video">
                    <img referrerpolicy="no-referrer" src="${b}" class="w-full h-full object-cover">
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
                    <img referrerpolicy="no-referrer" src="${b}" class="w-full h-full object-cover">
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
        url = `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
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
        url = `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
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
    products.forEach((p, idx) => {
        const oos = p.outOfStock === true;
        tbody.innerHTML += `
            <tr class="hover:bg-gray-50 transition border-b border-gray-100 ${oos ? 'opacity-60' : ''}">
                <td class="p-3 w-8"><input type="checkbox" class="product-checkbox w-4 h-4 accent-primary" value="${p.id}"></td>
                <td class="p-3"><img referrerpolicy="no-referrer" src="${p.img || 'https://via.placeholder.com/50'}" onerror="this.src='https://via.placeholder.com/50'" class="w-12 h-12 object-cover rounded-md border border-gray-200"></td>
                <td class="p-3 font-semibold text-gray-800">
                    ${p.name}
                    ${oos ? '<span class="ml-2 text-xs font-bold bg-red-100 text-red-500 px-2 py-0.5 rounded-full">OUT OF STOCK</span>' : ''}
                    ${p.variants ? '<span class="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Variants</span>' : ''}
                </td>
                <td class="p-3 text-gray-600">₹${p.price}</td>
                <td class="p-3 flex gap-1 flex-wrap">
                    <button class="text-gray-400 hover:text-primary text-lg px-1 transition" title="Move Up" onclick="reorderProduct(${idx}, -1)"><i class="fas fa-chevron-up"></i></button>
                    <button class="text-gray-400 hover:text-primary text-lg px-1 transition" title="Move Down" onclick="reorderProduct(${idx}, 1)"><i class="fas fa-chevron-down"></i></button>
                    <button class="text-blue-500 hover:text-blue-700 font-semibold text-sm transition px-2" onclick="openProductForm('${p.id}')">Edit</button>
                    <button class="text-red-500 hover:text-red-700 font-semibold text-sm transition px-2" onclick="deleteProduct('${p.id}')">Delete</button>
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
        document.getElementById('pf-stock').checked = p.outOfStock === true;
        document.getElementById('pf-image-url').value = p.images ? p.images.join('\n') : (p.img || '');
        document.getElementById('pf-variants').value = p.variants || '';
        document.getElementById('pf-title').textContent = 'Edit Product';
    } else {
        document.getElementById('pf-id').value = '';
        document.getElementById('pf-name').value = '';
        document.getElementById('pf-price').value = '';
        document.getElementById('pf-saleprice').value = '';
        document.getElementById('pf-desc').value = '';
        document.getElementById('pf-custom').checked = false;
        document.getElementById('pf-stock').checked = false;
        document.getElementById('pf-image-url').value = '';
        document.getElementById('pf-variants').value = '';
        document.getElementById('pf-title').textContent = 'Add Product';
    }
}

function closeProductForm() {
    document.getElementById('product-form-container').classList.add('hidden');
}

function saveProduct() {
    const id = document.getElementById('pf-id').value;
    const name = document.getElementById('pf-name').value.trim();
    const category = document.getElementById('pf-category').value;
    
    let rawUrls = document.getElementById('pf-image-url').value.split('\n').map(u => u.trim()).filter(u => u);
    let images = rawUrls.map(url => {
        const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
        if (driveMatch && driveMatch[1]) {
            return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
        }
        return url;
    });
    
    const img = images.length > 0 ? images[0] : '';
    const price = parseInt(document.getElementById('pf-price').value) || 0;
    const salePrice = parseInt(document.getElementById('pf-saleprice').value) || null;
    const desc = document.getElementById('pf-desc').value.trim();
    const custom = document.getElementById('pf-custom').checked;
    const outOfStock = document.getElementById('pf-stock').checked;
    const variants = document.getElementById('pf-variants').value.trim();

    if (!name || price <= 0) return alert('Name and Original Price are required');

    const product = { id: id || Date.now().toString(), name, category, img, images, price, salePrice, desc, custom, outOfStock, variants };

    if (!id) {
        products.push(product);
    } else {
        const index = products.findIndex(p => p.id === id);
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
        logoUrl = `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
    }
    settings.logo = logoUrl;

    settings.adminPass = document.getElementById('set-pass').value.trim();
    settings.fb = document.getElementById('set-fb').value.trim();
    settings.insta = document.getElementById('set-insta').value.trim();
    settings.twitter = document.getElementById('set-twitter').value.trim();
    settings.mapUrl = document.getElementById('set-map').value.trim();
    settings.googleReviewLink = document.getElementById('set-google-review').value.trim();
    settings.announcement = document.getElementById('set-announcement').value.trim();
    settings.pincodes = document.getElementById('set-pincodes').value.trim();
    settings.coupons = document.getElementById('set-coupons').value.trim();
    settings.theme = document.getElementById('set-theme').value;
    settings.flashSaleEnd = document.getElementById('set-flash').value;
    settings.volQty = parseInt(document.getElementById('set-vol-qty').value) || 0;
    settings.volPct = parseInt(document.getElementById('set-vol-pct').value) || 0;
    saveData();
    applySettings();
    applyTheme();
    alert('Settings Saved!');
}

// Start
init();

function generateDescriptionAI() {
    const name = document.getElementById('pf-name').value.trim();
    const category = document.getElementById('pf-category').value;
    const descField = document.getElementById('pf-desc');
    
    if (!name) return alert('Please enter a product name first!');
    
    descField.value = "✨ AI is writing...";
    
    // Simulate AI generation
    setTimeout(() => {
        const descriptions = [
            `Make a lasting impression with our beautifully crafted ${name}. Perfect for any occasion, this customized piece is designed to bring joy and preserve your most cherished memories.`,
            `The ${name} is more than just a gift—it's a personal statement. Crafted with premium materials and attention to detail, it stands out as a unique keepsake.`,
            `Surprise your loved ones with the elegant ${name}. Whether it's for a birthday, anniversary, or just because, this bespoke item adds a special touch to everyday life.`,
            `Elevate your gifting experience with our premium ${name}. Personalize it to match your style, making it a perfect memento or a thoughtful surprise for someone special.`
        ];
        
        let chosen = descriptions[Math.floor(Math.random() * descriptions.length)];
        
        if (category && category !== 'Select Category') {
            chosen += ` A beautiful addition to our ${category} collection.`;
        }
        
        descField.value = chosen;
    }, 1200);
}

function generateAiSuggestions() {
    const recipient = document.getElementById('ai-recipient').value.trim();
    const occasion = document.getElementById('ai-occasion').value.trim();
    const resultsContainer = document.getElementById('ai-results');
    const list = document.getElementById('ai-results-list');
    
    if(!recipient && !occasion) return alert('Please enter who it is for or the occasion!');
    
    resultsContainer.classList.remove('hidden');
    list.innerHTML = '<div class="text-center text-gray-500 py-4"><i class="fas fa-spinner fa-spin text-2xl mb-2"></i><p>AI is analyzing...</p></div>';
    
    // Simulate AI delay
    setTimeout(() => {
        // Pick 3 random products as suggestions
        let shuffled = [...products].sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, 3);
        
        if (selected.length === 0) {
            list.innerHTML = '<p class="text-gray-500">No products found to suggest.</p>';
            return;
        }
        
        list.innerHTML = selected.map(p => `
            <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100 cursor-pointer hover:bg-pink-50 transition" onclick="document.getElementById('ai-modal').classList.add('hidden'); openProductModal('${p.id}')">
                <img referrerpolicy="no-referrer" src="${p.img || 'https://placehold.co/150x150/e44c89/white?text=Gift'}" class="w-16 h-16 object-cover rounded-md" onerror="this.onerror=null;this.src='https://placehold.co/150x150/e44c89/white?text=Gift';">
                <div>
                    <h5 class="font-bold text-primary">${p.name}</h5>
                    <p class="text-sm text-gray-600 font-semibold">₹${p.salePrice || p.price}</p>
                </div>
                <i class="fas fa-arrow-right ml-auto text-gray-400"></i>
            </div>
        `).join('');
    }, 1500);
}


// ══════════════════════════════════════════════════════════════
// PHASE 1: QUICK WINS
// ══════════════════════════════════════════════════════════════

// 1. Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('translate-x-full');
    menu.classList.toggle('translate-x-0');
    document.getElementById('mobile-overlay').classList.toggle('hidden');
}
function closeMobileMenu() {
    document.getElementById('mobile-menu').classList.add('translate-x-full');
    document.getElementById('mobile-menu').classList.remove('translate-x-0');
    document.getElementById('mobile-overlay').classList.add('hidden');
}

// 2. Dark Mode
function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('lh_dark_mode', darkMode);
    applyDarkMode();
}
function applyDarkMode() {
    const btn = document.getElementById('dark-mode-btn');
    const btnMobile = document.getElementById('dark-mode-btn-mobile');
    if (darkMode) {
        document.documentElement.classList.add('dark');
        if (btn) btn.innerHTML = '<i class="fas fa-sun text-yellow-400"></i>';
        if (btnMobile) btnMobile.innerHTML = '<i class="fas fa-sun text-yellow-400"></i>';
    } else {
        document.documentElement.classList.remove('dark');
        if (btn) btn.innerHTML = '<i class="fas fa-moon text-gray-600"></i>';
        if (btnMobile) btnMobile.innerHTML = '<i class="fas fa-moon text-gray-600"></i>';
    }
}

// 3. Festive Themes
const THEMES = {
    pink:       { primary: '#e44c89', dark: '#c8346e', footer: '#fbdce6', footerText: '#d13b77' },
    diwali:     { primary: '#f59e0b', dark: '#d97706', footer: '#fef3c7', footerText: '#92400e' },
    christmas:  { primary: '#16a34a', dark: '#15803d', footer: '#dcfce7', footerText: '#166534' },
    valentine:  { primary: '#dc2626', dark: '#b91c1c', footer: '#fee2e2', footerText: '#991b1b' },
    royal:      { primary: '#7c3aed', dark: '#6d28d9', footer: '#ede9fe', footerText: '#4c1d95' }
};
function applyTheme() {
    const theme = THEMES[settings.theme] || THEMES.pink;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-dark', theme.dark);
}

// ══════════════════════════════════════════════════════════════
// PHASE 2: SHOPPING EXPERIENCE
// ══════════════════════════════════════════════════════════════

// 4. Quantity Selector
function changeQty(delta) {
    productQuantity = Math.max(1, productQuantity + delta);
    const d = document.getElementById('qty-display');
    if (d) d.textContent = productQuantity;
}

// 5. Variant Selector
function selectVariant(btn, variant) {
    selectedVariant = variant;
    document.querySelectorAll('.variant-btn').forEach(b => {
        b.classList.remove('border-primary', 'text-primary', 'bg-pink-50');
        b.classList.add('border-gray-200', 'text-gray-600');
    });
    btn.classList.add('border-primary', 'text-primary', 'bg-pink-50');
    btn.classList.remove('border-gray-200', 'text-gray-600');
}

// 6. Coupon Codes
function applyCoupon() {
    const input = document.getElementById('coupon-input');
    const result = document.getElementById('coupon-result');
    if (!input || !result) return;
    const code = input.value.trim().toUpperCase();
    if (!settings.coupons) { result.innerHTML = '<span class="text-red-500 text-sm">No coupons available.</span>'; return; }
    const pairs = settings.coupons.split(',').map(s => s.trim());
    let found = null;
    for (const pair of pairs) {
        const [c, pct] = pair.split(':');
        if (c && c.trim().toUpperCase() === code) { found = { code: c.trim().toUpperCase(), pct: parseInt(pct) || 0 }; break; }
    }
    if (found && found.pct > 0) {
        appliedCoupon = found;
        result.innerHTML = `<span class="text-green-600 text-sm font-bold"><i class="fas fa-check-circle mr-1"></i>${found.pct}% discount applied!</span>`;
    } else {
        appliedCoupon = null;
        result.innerHTML = '<span class="text-red-500 text-sm"><i class="fas fa-times-circle mr-1"></i>Invalid coupon code.</span>';
    }
    renderCart();
}

// 7. Pincode Check
function checkPincode() {
    const input = document.getElementById('pincode-input');
    const result = document.getElementById('pincode-result');
    if (!input || !result) return;
    const pin = input.value.trim();
    if (!pin || pin.length < 6) { result.innerHTML = '<span class="text-red-500 text-xs">Enter a valid 6-digit pincode.</span>'; return; }
    if (!settings.pincodes || !settings.pincodes.trim()) {
        result.innerHTML = '<span class="text-blue-500 text-xs"><i class="fas fa-info-circle mr-1"></i>Contact us to confirm delivery.</span>';
        return;
    }
    const codes = settings.pincodes.split(',').map(s => s.trim());
    if (codes.includes(pin)) {
        result.innerHTML = '<span class="text-green-600 text-xs font-bold"><i class="fas fa-check-circle mr-1"></i>Delivery available!</span>';
    } else {
        result.innerHTML = '<span class="text-red-500 text-xs"><i class="fas fa-times-circle mr-1"></i>Delivery not available. Contact us.</span>';
    }
}

// 8. Recently Viewed
function trackRecentlyViewed(product) {
    recentlyViewed = recentlyViewed.filter(p => p.id !== product.id);
    recentlyViewed.unshift({ id: product.id, name: product.name, img: product.img, price: product.salePrice || product.price });
    if (recentlyViewed.length > 8) recentlyViewed = recentlyViewed.slice(0, 8);
    localStorage.setItem('lh_recently_viewed', JSON.stringify(recentlyViewed));
    renderRecentlyViewed();
}
function renderRecentlyViewed() {
    const section = document.getElementById('recently-viewed-section');
    const container = document.getElementById('recently-viewed-list');
    if (!section || !container) return;
    if (recentlyViewed.length === 0) { section.classList.add('hidden'); return; }
    section.classList.remove('hidden');
    const fb = 'https://placehold.co/100x100/e44c89/white?text=Gift';
    container.innerHTML = recentlyViewed.map(p => `
        <div onclick="openProductModal('${p.id}')" class="flex-shrink-0 w-28 cursor-pointer group">
            <div class="w-28 h-28 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-primary transition shadow-sm">
                <img referrerpolicy="no-referrer" src="${p.img || fb}" onerror="this.src='${fb}'" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
            </div>
            <p class="text-xs font-semibold text-gray-700 text-center mt-2 truncate">${p.name}</p>
            <p class="text-xs text-primary font-bold text-center">₹${p.price}</p>
        </div>
    `).join('');
}

// ══════════════════════════════════════════════════════════════
// PHASE 3: ADMIN POWER TOOLS
// ══════════════════════════════════════════════════════════════

// 9. Order Logging
function logOrder(item) {
    orders.unshift({
        id: 'ORD-' + Date.now(),
        date: new Date().toLocaleString('en-IN'),
        product: item.name,
        price: item.price,
        custom: item.custom,
        status: 'New',
        uid: currentUser ? currentUser.uid : null
    });
    saveData();
}

// 10. Render Orders in Admin
function renderAdminOrders() {
    const tbody = document.getElementById('admin-orders-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-gray-400">No orders yet. Orders will appear here when customers order via WhatsApp.</td></tr>';
        return;
    }
    orders.forEach(o => {
        tbody.innerHTML += `<tr class="hover:bg-gray-50 transition border-b border-gray-100">
            <td class="p-3 text-gray-500 text-xs">${o.id}</td>
            <td class="p-3 text-gray-500 text-xs">${o.date}</td>
            <td class="p-3 font-semibold text-gray-800 text-sm">${o.product}</td>
            <td class="p-3 font-bold text-primary">₹${o.price}</td>
            <td class="p-3 text-gray-500 text-xs max-w-[150px] truncate">${o.custom || '-'}</td>
            <td class="p-3">
                <div class="flex items-center gap-2">
                    <select onchange="updateOrderStatus('${o.id}', this.value)" class="text-xs border rounded px-2 py-1 outline-none ${o.status === 'Delivered' ? 'bg-green-100 text-green-700' : o.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}">
                        <option ${o.status === 'New' ? 'selected' : ''}>New</option>
                        <option ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                    <button onclick="notifyCustomerWA('${o.id}')" title="Send WhatsApp Update" class="text-green-500 hover:text-green-600 transition"><i class="fab fa-whatsapp text-lg"></i></button>
                </div>
            </td>
        </tr>`;
    });
}
function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);
    if (order) { order.status = status; saveData(); renderAdminOrders(); }
}

function notifyCustomerWA(orderId) {
    const o = orders.find(x => x.id === orderId);
    if (!o) return;
    let text = `Hello! 👋\nHere is an update on your recent order from *${settings.name}*:\n\n🛍️ *Item:* ${o.product}\n🧾 *Order ID:* ${o.id}\n🔄 *Current Status:* ${o.status}\n\nThank you for shopping with us!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// 11. Bulk Delete Products
function bulkDeleteProducts() {
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
    if (checkboxes.length === 0) return alert('Select at least one product to delete.');
    if (!confirm(`Delete ${checkboxes.length} selected product(s)?`)) return;
    const ids = Array.from(checkboxes).map(cb => cb.value);
    products = products.filter(p => !ids.includes(p.id));
    saveData();
    renderAdminProducts();
    renderProducts();
}
function selectAllProducts(cb) {
    document.querySelectorAll('.product-checkbox').forEach(c => c.checked = cb.checked);
}

// 12. Product Reordering
function reorderProduct(idx, dir) {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= products.length) return;
    [products[idx], products[newIdx]] = [products[newIdx], products[idx]];
    saveData();
    renderAdminProducts();
    renderProducts();
}

// 13. Bulk Edit Products
function openBulkEdit() {
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
    if (checkboxes.length === 0) return alert('Select at least one product to edit.');
    
    const ids = Array.from(checkboxes).map(cb => cb.value);
    const toEdit = products.filter(p => ids.includes(p.id));
    
    const tbody = document.getElementById('bulk-edit-tbody');
    tbody.innerHTML = '';
    
    toEdit.forEach(p => {
        const catOptions = categories.map(c => `<option value="${c}" ${c === p.category ? 'selected' : ''}>${c}</option>`).join('');
        const safeName = (p.name || '').replace(/"/g, '&quot;');
        tbody.innerHTML += `
            <tr class="hover:bg-gray-50 transition" data-id="${p.id}">
                <td class="p-2"><img src="${p.img || 'https://via.placeholder.com/50'}" class="w-10 h-10 object-cover rounded border"></td>
                <td class="p-2"><input type="text" class="be-name w-full border rounded px-2 py-1.5 text-sm outline-none focus:border-primary" value="${safeName}"></td>
                <td class="p-2"><select class="be-cat w-full border rounded px-2 py-1.5 text-sm outline-none focus:border-primary bg-white">${catOptions}</select></td>
                <td class="p-2"><input type="number" class="be-price w-full border rounded px-2 py-1.5 text-sm outline-none focus:border-primary" value="${p.price}"></td>
                <td class="p-2"><input type="number" class="be-sale w-full border rounded px-2 py-1.5 text-sm outline-none focus:border-primary" value="${p.salePrice || ''}"></td>
                <td class="p-2 text-center"><input type="checkbox" class="be-oos w-5 h-5 accent-red-500" ${p.outOfStock ? 'checked' : ''}></td>
            </tr>
        `;
    });
    
    document.getElementById('bulk-edit-modal').classList.remove('hidden');
}

function closeBulkEdit() {
    document.getElementById('bulk-edit-modal').classList.add('hidden');
}

function saveBulkEdit() {
    const rows = document.querySelectorAll('#bulk-edit-tbody tr');
    rows.forEach(row => {
        const id = row.getAttribute('data-id');
        const pIndex = products.findIndex(p => p.id === id);
        if (pIndex > -1) {
            products[pIndex].name = row.querySelector('.be-name').value.trim();
            products[pIndex].category = row.querySelector('.be-cat').value;
            products[pIndex].price = parseInt(row.querySelector('.be-price').value) || 0;
            products[pIndex].salePrice = parseInt(row.querySelector('.be-sale').value) || null;
            products[pIndex].outOfStock = row.querySelector('.be-oos').checked;
        }
    });
    
    saveData();
    closeBulkEdit();
    renderAdminProducts();
    renderProducts();
    alert('Bulk edit saved successfully!');
}



// ADMIN REVIEWS LOGIC
function renderAdminReviews() {
    const list = document.getElementById('admin-reviews-list');
    if (!list) return;
    list.innerHTML = '';
    if (reviews.length === 0) {
        list.innerHTML = '<p class="text-gray-500">No reviews submitted.</p>';
        return;
    }
    reviews.forEach((r, idx) => {
        const approved = r.approved !== false;
        list.innerHTML += `
            <div class="border rounded-lg p-4 ${approved ? 'bg-gray-50 dark:bg-gray-700' : 'bg-red-50 dark:bg-red-900/20'}">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-bold text-gray-800 dark:text-gray-200">${r.name}</h4>
                        <div class="text-xs text-yellow-500">${'⭐'.repeat(r.rating || 5)}</div>
                        <span class="text-xs text-gray-400">${r.date || ''}</span>
                    </div>
                    <div>
                        ${approved ? 
                            `<button onclick="toggleReviewApproval(${idx}, false)" class="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition">Hide</button>` : 
                            `<button onclick="toggleReviewApproval(${idx}, true)" class="text-xs bg-green-100 text-green-600 px-3 py-1 rounded hover:bg-green-200 transition">Approve</button>`
                        }
                        <button onclick="deleteReview(${idx})" class="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded ml-2 hover:bg-gray-300 transition">Delete</button>
                    </div>
                </div>
                <p class="text-sm italic text-gray-700 dark:text-gray-300">${r.text}</p>
                ${!approved ? '<p class="text-xs text-red-500 mt-2 font-bold">Pending Approval - Not visible to customers</p>' : ''}
            </div>
        `;
    });
}

function toggleReviewApproval(idx, isApproved) {
    reviews[idx].approved = isApproved;
    saveData();
    renderAdminReviews();
    renderReviews();
}

function deleteReview(idx) {
    if(confirm('Delete this review?')) {
        reviews.splice(idx, 1);
        saveData();
        renderAdminReviews();
        renderReviews();
    }
}

function handleLivePreview(event) {
    const file = event.target.files[0];
    const overlay = document.getElementById('preview-overlay');
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            overlay.src = e.target.result;
            overlay.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    } else {
        overlay.classList.add('hidden');
        overlay.src = '';
    }
}
function handleLiveTextPreview(val) {
    const textLayer = document.getElementById('preview-text');
    if (val.trim()) {
        textLayer.textContent = val;
        textLayer.classList.remove('hidden');
    } else {
        textLayer.classList.add('hidden');
    }
}




function toggleWishlist() {
    const drawer = document.getElementById('wishlist-drawer');
    const overlay = document.getElementById('overlay');
    if (drawer.classList.contains('hidden')) {
        drawer.classList.remove('hidden');
        overlay.classList.remove('hidden');
        setTimeout(() => drawer.classList.remove('translate-x-full'), 10);
        renderWishlistItems();
    } else {
        drawer.classList.add('translate-x-full');
        setTimeout(() => {
            drawer.classList.add('hidden');
            if (document.getElementById('cart-drawer').classList.contains('hidden')) overlay.classList.add('hidden');
        }, 300);
    }
}
function renderWishlistItems() {
    const container = document.getElementById('wishlist-items');
    container.innerHTML = '';
    const items = products.filter(p => wishlist.includes(p.id));
    if (items.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center">Your wishlist is empty.</p>';
        return;
    }
    items.forEach(c => {
        const fallbackImg = 'https://placehold.co/80x80/e44c89/white?text=Wish';
        container.innerHTML += \
            <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 cursor-pointer hover:shadow" onclick="openProductModal('\'); toggleWishlist();">
                <img src="\" class="w-16 h-16 object-cover rounded-lg flex-shrink-0">
                <div class="flex-grow">
                    <h4 class="font-bold text-gray-800 dark:text-gray-200 text-sm">\</h4>
                    <p class="text-primary font-bold text-sm">?\</p>
                </div>
                <button class="text-red-400 hover:text-red-600" onclick="event.stopPropagation(); toggleWishlistProduct('\'); renderWishlistItems();"><i class="fas fa-trash"></i></button>
            </div>
        \;
    });
}





function addExternalReview() {
    const name = document.getElementById('ext-rev-name').value.trim();
    const rating = parseInt(document.getElementById('ext-rev-rating').value);
    const source = document.getElementById('ext-rev-source').value;
    const text = document.getElementById('ext-rev-text').value.trim();
    
    if (!name || !text) return alert('Enter name and text');
    
    reviews.unshift({ name, text, rating, source, date: new Date().toLocaleDateString(), approved: true });
    saveData();
    
    document.getElementById('ext-rev-name').value = '';
    document.getElementById('ext-rev-text').value = '';
    
    renderAdminReviews();
    renderReviews();
}

