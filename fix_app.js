const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

const safeParseCode = `
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
`;

appJs = safeParseCode + appJs;

// replace each specific line manually to be perfectly safe
appJs = appJs.replace(/let products = JSON\.parse\(localStorage\.getItem\('lh_products'\)\) \|\|/g, "let products = safeJSONParse('lh_products', null) ||");
appJs = appJs.replace(/let categories = JSON\.parse\(localStorage\.getItem\('lh_categories'\)\) \|\|/g, "let categories = safeJSONParse('lh_categories', null) ||");
appJs = appJs.replace(/let settings = JSON\.parse\(localStorage\.getItem\('lh_settings'\)\) \|\|/g, "let settings = safeJSONParse('lh_settings', null) ||");
appJs = appJs.replace(/let cart = JSON\.parse\(localStorage\.getItem\('lh_cart'\)\) \|\|/g, "let cart = safeJSONParse('lh_cart', null) ||");
appJs = appJs.replace(/let leads = JSON\.parse\(localStorage\.getItem\('lh_leads'\)\) \|\|/g, "let leads = safeJSONParse('lh_leads', null) ||");
appJs = appJs.replace(/let reviews = JSON\.parse\(localStorage\.getItem\('lh_reviews'\)\) \|\|/g, "let reviews = safeJSONParse('lh_reviews', null) ||");
appJs = appJs.replace(/let banners = JSON\.parse\(localStorage\.getItem\('lh_banners'\)\) \|\|/g, "let banners = safeJSONParse('lh_banners', null) ||");
appJs = appJs.replace(/let bottomBanners = JSON\.parse\(localStorage\.getItem\('lh_bottom_banners'\)\) \|\|/g, "let bottomBanners = safeJSONParse('lh_bottom_banners', null) ||");

fs.writeFileSync('app.js', appJs);
console.log('Replaced local storage logic safely.');
