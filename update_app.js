const fs = require('fs');

const importedProducts = fs.readFileSync('importedProducts.json', 'utf8');

let appJs = fs.readFileSync('app.js', 'utf8');

// We will inject the importedProducts variable and the migration logic.
const injection = `
const importedProducts = ${importedProducts};

// Migration to load new products once
if (!localStorage.getItem('lh_imported_v2')) {
    products = importedProducts;
    // ensure categories are correctly updated
    categories = [...new Set([...categories, "Gifts", "General", "SKIN"])];
    localStorage.setItem('lh_imported_v2', 'true');
    saveData();
}
`;

// Inject into init()
appJs = appJs.replace('function init() {', 'function init() {' + injection);

fs.writeFileSync('app.js', appJs);
console.log('app.js updated successfully!');
