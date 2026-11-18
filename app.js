
// ═════════════════════════════════════════════════════════════════════════════
// ADMIN HAMPER PRODUCT SELECTOR & PLACEMENT LOGIC
// ═════════════════════════════════════════════════════════════════════════════
function renderHamperAdminProductPickers() {
    const baseContainer = document.getElementById('hamper-select-base');
    const addon1Container = document.getElementById('hamper-select-addon1');
    const addon2Container = document.getElementById('hamper-select-addon2');

    if (!baseContainer || !addon1Container || !addon2Container) return;

    const baseIds = settings.hamperBaseIds || [];
    const addon1Ids = settings.hamperAddon1Ids || [];
    const addon2Ids = settings.hamperAddon2Ids || [];

    const fallbackImg = 'https://placehold.co/100x100/e44c89/white?text=Gift';

    const renderList = (container, selectedIds, stepKey) => {
        if (products.length === 0) {
            container.innerHTML = '<p class="text-xs text-gray-400 p-2 col-span-2">No products loaded yet.</p>';
            return;
        }
        container.innerHTML = products.map(p => {
            const isChecked = selectedIds.includes(p.id);
            const price = p.salePrice || p.price;
            return `
                <label class="flex items-center gap-2 p-1.5 rounded-lg border ${isChecked ? 'border-primary bg-pink-50/50 dark:bg-pink-900/20' : 'border-gray-150 dark:border-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition">
                    <input type="checkbox" value="${p.id}" ${isChecked ? 'checked' : ''} onchange="toggleHamperAdminProduct('${stepKey}', '${p.id}', this.checked)" class="accent-primary w-3.5 h-3.5">
                    <img referrerpolicy="no-referrer" src="${p.img || fallbackImg}" class="w-8 h-8 rounded object-cover flex-shrink-0" onerror="this.src='${fallbackImg}'">
                    <div class="flex-1 min-w-0">
                        <p class="font-bold text-[11px] text-gray-800 dark:text-gray-200 truncate leading-tight">${p.name}</p>
                        <span class="text-[10px] text-primary font-bold">₹${price}</span>
                    </div>
                </label>
            `;
        }).join('');
    };

    renderList(baseContainer, baseIds, 'base');
    renderList(addon1Container, addon1Ids, 'addon1');
    renderList(addon2Container, addon2Ids, 'addon2');

    updateHamperAdminCounts();
}

function toggleHamperAdminProduct(stepKey, productId, isChecked) {
    if (stepKey === 'base') {
        settings.hamperBaseIds = settings.hamperBaseIds || [];
        if (isChecked) {
            if (!settings.hamperBaseIds.includes(productId)) settings.hamperBaseIds.push(productId);
        } else {
            settings.hamperBaseIds = settings.hamperBaseIds.filter(id => id !== productId);
        }
    } else if (stepKey === 'addon1') {
        settings.hamperAddon1Ids = settings.hamperAddon1Ids || [];
        if (isChecked) {
            if (!settings.hamperAddon1Ids.includes(productId)) settings.hamperAddon1Ids.push(productId);
        } else {
            settings.hamperAddon1Ids = settings.hamperAddon1Ids.filter(id => id !== productId);
        }
    } else if (stepKey === 'addon2') {
        settings.hamperAddon2Ids = settings.hamperAddon2Ids || [];
        if (isChecked) {
            if (!settings.hamperAddon2Ids.includes(productId)) settings.hamperAddon2Ids.push(productId);
        } else {
            settings.hamperAddon2Ids = settings.hamperAddon2Ids.filter(id => id !== productId);
        }
    }
    updateHamperAdminCounts();
}

function updateHamperAdminCounts() {
    const c1 = document.getElementById('hamper-base-count');
    const c2 = document.getElementById('hamper-addon1-count');
    const c3 = document.getElementById('hamper-addon2-count');
    if (c1) c1.textContent = (settings.hamperBaseIds || []).length + ' selected';
    if (c2) c2.textContent = (settings.hamperAddon1Ids || []).length + ' selected';
    if (c3) c3.textContent = (settings.hamperAddon2Ids || []).length + ' selected';
}


// ═════════════════════════════════════════════════════════════════════════════
// PRODUCT PREVIEW FIT TOGGLE & MAGIC MUG THERMAL SIMULATOR
// ═════════════════════════════════════════════════════════════════════════════
let isModalImgContain = true;
function toggleModalImgFit() {
    const img = document.getElementById('modal-img');
    const overlay = document.getElementById('preview-overlay');
    const fitText = document.getElementById('fit-text');
    const fitIcon = document.getElementById('fit-icon');
    if (!img) return;

    isModalImgContain = !isModalImgContain;
    if (isModalImgContain) {
        img.className = 'max-w-full max-h-full w-auto h-auto object-contain mx-auto transition duration-300';
        if (overlay) overlay.className = 'absolute inset-2 max-w-full max-h-full w-auto h-auto object-contain mx-auto opacity-85 mix-blend-multiply hidden pointer-events-none';
        if (fitText) fitText.textContent = 'Full Image';
        if (fitIcon) fitIcon.className = 'fas fa-expand-arrows-alt text-[10px]';
    } else {
        img.className = 'w-full h-full object-cover mx-auto transition duration-300';
        if (overlay) overlay.className = 'absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-multiply hidden pointer-events-none';
        if (fitText) fitText.textContent = 'Fill Frame';
        if (fitIcon) fitIcon.className = 'fas fa-compress-arrows-alt text-[10px]';
    }
}

let isMugHotState = true;
function initMagicMugSimulator() {
    const name = (activeProduct && activeProduct.name ? activeProduct.name : '').toLowerCase();
    const cat = (activeProduct && activeProduct.category ? activeProduct.category : '').toLowerCase();
    const isMug = name.includes('mug') || cat.includes('mug');

    const simBox = document.getElementById('magic-mug-sim-container');
    const mask = document.getElementById('magic-mug-mask');
    const tempSlider = document.getElementById('mug-temp-slider');
    const tempVal = document.getElementById('mug-temp-val');

    if (isMug) {
        if (simBox) simBox.classList.remove('hidden');
        if (mask) {
            mask.classList.remove('hidden');
            mask.style.opacity = '0';
        }
        if (tempSlider) tempSlider.value = '85';
        if (tempVal) tempVal.textContent = '85°C (Hot)';
        isMugHotState = true;
    } else {
        if (simBox) simBox.classList.add('hidden');
        if (mask) mask.classList.add('hidden');
    }
}

function pourHotWater() {
    const mask = document.getElementById('magic-mug-mask');
    const tempSlider = document.getElementById('mug-temp-slider');
    const tempVal = document.getElementById('mug-temp-val');
    const steam = document.getElementById('magic-steam-icon');

    if (mask) mask.style.opacity = '0';
    if (tempSlider) tempSlider.value = '85';
    if (tempVal) tempVal.textContent = '85°C (Hot)';
    if (steam) steam.className = 'fas fa-mug-hot text-amber-600 dark:text-amber-400 animate-bounce';
    isMugHotState = true;
}

function coolDownMug() {
    const mask = document.getElementById('magic-mug-mask');
    const tempSlider = document.getElementById('mug-temp-slider');
    const tempVal = document.getElementById('mug-temp-val');
    const steam = document.getElementById('magic-steam-icon');

    if (mask) {
        mask.classList.remove('hidden');
        mask.style.opacity = '0.96';
    }
    if (tempSlider) tempSlider.value = '20';
    if (tempVal) tempVal.textContent = '20°C (Cold)';
    if (steam) steam.className = 'fas fa-snowflake text-blue-500';
    isMugHotState = false;
}

function handleMugTempChange(val) {
    const mask = document.getElementById('magic-mug-mask');
    const tempVal = document.getElementById('mug-temp-val');
    const steam = document.getElementById('magic-steam-icon');
    const num = Number(val);

    if (tempVal) tempVal.textContent = `${num}°C (${num >= 50 ? 'Hot' : 'Cold'})`;
    if (steam) {
        steam.className = num >= 50 ? 'fas fa-mug-hot text-amber-600 dark:text-amber-400' : 'fas fa-snowflake text-blue-500';
    }
    if (mask) {
        mask.classList.remove('hidden');
        const opacity = Math.max(0, Math.min(0.96, (85 - num) / 65));
        mask.style.opacity = opacity.toFixed(2);
    }
    isMugHotState = num >= 50;
}

// ═════════════════════════════════════════════════════════════════════════════
// SALES ANALYTICS DASHBOARD & 1-CLICK WHATSAPP EXPORT
// ═════════════════════════════════════════════════════════════════════════════
function updateAdminAnalytics() {
    const totalOrders = orders.length;
    let totalRevenue = 0;
    let deliveredCount = 0;
    let processingCount = 0;
    const productCounts = {};

    orders.forEach(o => {
        const amt = Number(o.price) || 0;
        totalRevenue += amt;
        if (o.status === 'Delivered') deliveredCount++;
        if (o.status === 'Processing') processingCount++;

        const prodName = o.product || 'Custom Gift';
        productCounts[prodName] = (productCounts[prodName] || 0) + 1;
    });

    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const contactMap = new Map();
    leads.forEach(l => {
        const clean = (l.phone || '').replace(/\D/g, '');
        if (clean.length >= 10) {
            contactMap.set(clean, { name: l.name || 'Visitor', phone: clean, source: 'Visitor / Welcome Popup', date: l.date || '' });
        }
    });
    orders.forEach(o => {
        if (o.customer && o.customer.phone) {
            const clean = o.customer.phone.replace(/\D/g, '');
            if (clean.length >= 10) {
                contactMap.set(clean, { name: o.customer.name || 'Customer', phone: clean, source: 'Order #' + o.id, date: o.date || '' });
            }
        }
    });

    const uniqueContacts = Array.from(contactMap.values());

    const elAov = document.getElementById('stat-aov');
    const elDelivered = document.getElementById('stat-delivered');
    const elProcessing = document.getElementById('stat-processing');
    const elContacts = document.getElementById('stat-unique-contacts');
    const elTopProducts = document.getElementById('admin-top-products');

    if (elAov) elAov.textContent = `₹${aov}`;
    if (elDelivered) elDelivered.textContent = deliveredCount;
    if (elProcessing) elProcessing.textContent = processingCount;
    if (elContacts) elContacts.textContent = uniqueContacts.length;

    if (elTopProducts) {
        const sortedProds = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        if (sortedProds.length === 0) {
            elTopProducts.innerHTML = '<p class="text-xs text-gray-400 italic">No sales recorded yet. Leaderboard updates with each order.</p>';
        } else {
            elTopProducts.innerHTML = sortedProds.map(([pName, count], idx) => {
                const pct = Math.round((count / totalOrders) * 100);
                return `
                    <div class="flex items-center justify-between text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                        <div class="flex items-center gap-2">
                            <span class="w-5 h-5 rounded-full ${idx === 0 ? 'bg-amber-400 text-amber-950 font-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} flex items-center justify-center text-[10px]">${idx + 1}</span>
                            <span class="font-bold text-gray-800 dark:text-gray-200">${pName}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-20 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden hidden sm:block">
                                <div class="bg-primary h-full rounded-full" style="width: ${pct}%"></div>
                            </div>
                            <span class="font-black text-primary">${count} sold</span>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

function exportContactsCSV() {
    const contactMap = new Map();
    leads.forEach(l => {
        const clean = (l.phone || '').replace(/\D/g, '');
        if (clean.length >= 10) {
            contactMap.set(clean, { name: l.name || 'Visitor', phone: clean, source: 'Visitor Popup', date: l.date || '' });
        }
    });
    orders.forEach(o => {
        if (o.customer && o.customer.phone) {
            const clean = o.customer.phone.replace(/\D/g, '');
            if (clean.length >= 10) {
                contactMap.set(clean, { name: o.customer.name || 'Customer', phone: clean, source: 'Order #' + o.id, date: o.date || '' });
            }
        }
    });

    const contacts = Array.from(contactMap.values());
    if (contacts.length === 0) {
        return alert('No contacts found yet to export.');
    }

    let csvContent = 'Name,Phone,Source,Date\n';
    contacts.forEach(c => {
        const cleanName = (c.name || '').replace(/,/g, ' ');
        csvContent += `"${cleanName}","${c.phone}","${c.source}","${c.date}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Lamination_Hub_WhatsApp_Contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Exported ${contacts.length} unique customer & visitor numbers to CSV!`);
}

function copyAllWhatsAppNumbers() {
    const cleanNumbers = new Set();
    leads.forEach(l => {
        const clean = (l.phone || '').replace(/\D/g, '');
        if (clean.length >= 10) cleanNumbers.add(clean.slice(-10));
    });
    orders.forEach(o => {
        if (o.customer && o.customer.phone) {
            const clean = o.customer.phone.replace(/\D/g, '');
            if (clean.length >= 10) cleanNumbers.add(clean.slice(-10));
        }
    });

    const list = Array.from(cleanNumbers);
    if (list.length === 0) {
        return alert('No phone numbers recorded yet.');
    }

    const textToCopy = list.join(', ');
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert(`Copied ${list.length} WhatsApp numbers to clipboard ready for broadcast!`);
        }).catch(() => {
            prompt('Copy numbers:', textToCopy);
        });
    } else {
        prompt('Copy numbers:', textToCopy);
    }
}


// ═════════════════════════════════════════════════════════════════════════════
// VISITOR LEAD CAPTURE POPUP
// ═════════════════════════════════════════════════════════════════════════════
function checkVisitorModal() {
    const saved = safeJSONParse('lh_visitor', null);
    if (!saved || !saved.phone) {
        setTimeout(() => {
            const modal = document.getElementById('visitor-modal');
            if (modal) modal.classList.remove('hidden');
        }, 1200);
    }
}

function closeVisitorModal() {
    const modal = document.getElementById('visitor-modal');
    if (modal) modal.classList.add('hidden');
}

function submitVisitor() {
    const nameInput = document.getElementById('vis-name');
    const phoneInput = document.getElementById('vis-phone');
    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (!name || name.length < 2) {
        alert('Please enter your full name.');
        if (nameInput) nameInput.focus();
        return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
        alert('Please enter a valid 10-digit WhatsApp/phone number.');
        if (phoneInput) phoneInput.focus();
        return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const visitorObj = {
        id: 'VIS-' + Date.now().toString().slice(-6),
        name: name,
        phone: phone,
        date: dateStr,
        timestamp: Date.now()
    };

    localStorage.setItem('lh_visitor', JSON.stringify(visitorObj));

    // Save to leads array & Firebase
    leads.unshift(visitorObj);
    saveData();
    renderAdminLeads();

    closeVisitorModal();
    alert('Welcome ' + name + '! Enjoy exploring our personalized gifts.');
}

function deleteAdminLead(idx) {
    if (!confirm('Are you sure you want to delete this visitor record?')) return;
    leads.splice(idx, 1);
    saveData();
    renderAdminLeads();
}


// ═════════════════════════════════════════════════════════════════════════════
// CHANGEABLE WEBSITE BACKGROUND SYSTEM
// ═════════════════════════════════════════════════════════════════════════════
const BG_PRESETS = {
    'none': '',
    'diwali_gold': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2000&auto=format&fit=crop',
    'hearts_love': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2000&auto=format&fit=crop',
    'gifting_confetti': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop',
    'luxury_floral': 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?q=80&w=2000&auto=format&fit=crop',
    'wooden_studio': 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=2000&auto=format&fit=crop',
    'starry_night': 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2000&auto=format&fit=crop'
};

function applySiteBackground() {
    const bgEl = document.getElementById('site-background');
    const overlayEl = document.getElementById('site-bg-overlay');
    if (!bgEl) return;

    let bgUrl = '';
    const preset = settings.bgPreset || 'none';

    if (preset === 'custom' && settings.bgCustomUrl) {
        let customUrl = settings.bgCustomUrl.trim();
        const driveMatch = customUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || customUrl.match(/id=([a-zA-Z0-9_-]+)/);
        if (driveMatch && driveMatch[1]) {
            customUrl = `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
        }
        bgUrl = customUrl;
    } else if (BG_PRESETS[preset]) {
        bgUrl = BG_PRESETS[preset];
    }

    if (bgUrl) {
        bgEl.style.backgroundImage = `url('${bgUrl}')`;
        const opacity = (Number(settings.bgOpacity) || 20) / 100;
        bgEl.style.opacity = opacity;
        bgEl.classList.remove('hidden');
        if (overlayEl) overlayEl.classList.remove('hidden');
    } else {
        bgEl.style.backgroundImage = 'none';
        bgEl.style.opacity = '0';
        if (overlayEl) overlayEl.classList.add('hidden');
    }
}

function toggleBgQuickPicker() {
    const picker = document.getElementById('bg-quick-picker');
    if (picker) picker.classList.toggle('hidden');
}

function selectQuickBackground(preset) {
    settings.bgPreset = preset;
    applySiteBackground();
    
    // Hamper banner visibility
    const hamperBanner = document.getElementById('hamper-home-banner');
    if (hamperBanner) {
        if (settings.hamperEnabled === false) {
            hamperBanner.classList.add('hidden');
        } else {
            hamperBanner.classList.remove('hidden');
        }
    }
    toggleBgQuickPicker();
}


// ═════════════════════════════════════════════════════════════════════════════
// 1-CLICK PHOTO FILTERS & CROPPER
// ═════════════════════════════════════════════════════════════════════════════
let activeCustomFilter = 'Original';
let activePhotoRotation = 0;
let activePhotoFit = 'cover';

function applyPhotoFilter(filterCss, filterName) {
    activeCustomFilter = filterName;
    const overlay = document.getElementById('preview-overlay');
    if (overlay) {
        overlay.style.filter = filterCss;
    }
    const label = document.getElementById('active-filter-label');
    if (label) label.textContent = filterName;

    document.querySelectorAll('.filter-pill-btn').forEach(btn => {
        if (btn.textContent.includes(filterName) || (filterName === 'Original' && btn.textContent.trim() === 'Original')) {
            btn.className = 'filter-pill-btn active whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow-xs';
        } else {
            btn.className = 'filter-pill-btn whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-primary';
        }
    });
}

function setPhotoFit(fit) {
    activePhotoFit = fit;
    const overlay = document.getElementById('preview-overlay');
    if (overlay) {
        overlay.style.objectFit = fit;
    }
    const btnCover = document.getElementById('fit-cover-btn');
    const btnContain = document.getElementById('fit-contain-btn');
    if (btnCover && btnContain) {
        if (fit === 'cover') {
            btnCover.className = 'fit-btn active px-2.5 py-0.5 rounded text-[11px] font-bold bg-primary text-white';
            btnContain.className = 'fit-btn px-2.5 py-0.5 rounded text-[11px] font-bold bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600';
        } else {
            btnContain.className = 'fit-btn active px-2.5 py-0.5 rounded text-[11px] font-bold bg-primary text-white';
            btnCover.className = 'fit-btn px-2.5 py-0.5 rounded text-[11px] font-bold bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600';
        }
    }
}

function rotatePreviewPhoto() {
    activePhotoRotation = (activePhotoRotation + 90) % 360;
    const overlay = document.getElementById('preview-overlay');
    if (overlay) {
        overlay.style.transform = `rotate(${activePhotoRotation}deg)`;
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// SMART WHATSAPP FLOATING HELP BUBBLE
// ═════════════════════════════════════════════════════════════════════════════
function toggleWAHelpBubble() {
    const bubble = document.getElementById('wa-help-bubble');
    if (bubble) bubble.classList.toggle('hidden');
}

function triggerWAPrompt(type) {
    const wa = settings.wa || '918726195000';
    let text = '';
    if (type === 'photos') {
        text = `Hello ${settings.name || 'Lamination Hub'}, I want to order a custom photo frame/gift and would like to share my photos with you.`;
    } else if (type === 'delivery') {
        text = `Hello ${settings.name || 'Lamination Hub'}, can you please tell me how many days delivery takes for my pincode/city?`;
    } else if (type === 'budget') {
        text = `Hello ${settings.name || 'Lamination Hub'}, I am looking for a beautiful personalized gift under ₹500. Can you please recommend your best options?`;
    } else {
        text = `Hello ${settings.name || 'Lamination Hub'}, I have an inquiry about your customized gifts.`;
    }
    const bubble = document.getElementById('wa-help-bubble');
    if (bubble) bubble.classList.add('hidden');
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`, '_blank');
}

// ═════════════════════════════════════════════════════════════════════════════
// CREATE YOUR OWN GIFT HAMPER (COMBO BUILDER)
// ═════════════════════════════════════════════════════════════════════════════
let hamperSelection = {
    base: null,
    addon1: null,
    addon2: null
};

function openHamperBuilder() {
    const modal = document.getElementById('hamper-modal');
    if (!modal) return;

    // Priority 1: Use exact products selected by Admin in Admin Panel
    let baseItems = (settings.hamperBaseIds && settings.hamperBaseIds.length) 
        ? products.filter(p => settings.hamperBaseIds.includes(p.id)) 
        : [];
    let addon1Items = (settings.hamperAddon1Ids && settings.hamperAddon1Ids.length) 
        ? products.filter(p => settings.hamperAddon1Ids.includes(p.id)) 
        : [];
    let addon2Items = (settings.hamperAddon2Ids && settings.hamperAddon2Ids.length) 
        ? products.filter(p => settings.hamperAddon2Ids.includes(p.id)) 
        : [];

    // Fallback: If no products explicitly selected, use keywords
    const matchKeys = (p, keys) => {
        const txt = `${p.name || ''} ${p.category || ''} ${p.desc || ''}`.toLowerCase();
        return keys.some(k => txt.includes(k));
    };

    if (baseItems.length === 0) {
        const baseKeys = (settings.hamperBase || 'frame, plaque, canvas').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        baseItems = products.filter(p => matchKeys(p, baseKeys)).slice(0, 8);
    }
    if (addon1Items.length === 0) {
        const addon1Keys = (settings.hamperAddon1 || 'mug, cushion, pillow, bottle, lamp').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        addon1Items = products.filter(p => matchKeys(p, addon1Keys)).slice(0, 8);
    }
    if (addon2Items.length === 0) {
        const addon2Keys = (settings.hamperAddon2 || 'keychain, clock, bank, wallet, puzzle, card').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        addon2Items = products.filter(p => matchKeys(p, addon2Keys)).slice(0, 8);
    }

    const fallbackBase = baseItems.length ? baseItems : products.slice(0, 4);
    const fallbackAddon1 = addon1Items.length ? addon1Items : products.slice(4, 8);
    const fallbackAddon2 = addon2Items.length ? addon2Items : products.slice(8, 12);

    renderHamperStepGrid('hamper-base-grid', fallbackBase, 'base');
    renderHamperStepGrid('hamper-addon1-grid', fallbackAddon1, 'addon1');
    renderHamperStepGrid('hamper-addon2-grid', fallbackAddon2, 'addon2');

    if (!hamperSelection.base && fallbackBase[0]) selectHamperItem('base', fallbackBase[0].id);
    if (!hamperSelection.addon1 && fallbackAddon1[0]) selectHamperItem('addon1', fallbackAddon1[0].id);
    if (!hamperSelection.addon2 && fallbackAddon2[0]) selectHamperItem('addon2', fallbackAddon2[0].id);

    // Show or hide Step 4: Complimentary Packaging & Note based on Admin Setting
    const step4 = document.getElementById('hamper-step-4-container');
    if (step4) {
        if (settings.hamperPackagingEnabled === false) {
            step4.classList.add('hidden');
        } else {
            step4.classList.remove('hidden');
        }
    }

    updateHamperSummary();
    modal.classList.remove('hidden');
}

function closeHamperBuilder() {
    const modal = document.getElementById('hamper-modal');
    if (modal) modal.classList.add('hidden');
}

function renderHamperStepGrid(containerId, items, stepType) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const fallbackImg = 'https://placehold.co/300x300/e44c89/white?text=Gift';

    container.innerHTML = items.map(p => {
        const price = p.salePrice || p.price || 299;
        const isSelected = hamperSelection[stepType] && hamperSelection[stepType].id === p.id;
        return `
            <div onclick="selectHamperItem('${stepType}', '${p.id}')" class="hamper-card cursor-pointer p-2 rounded-xl border-2 transition ${isSelected ? 'border-primary bg-pink-50/50 dark:bg-pink-900/20 shadow-sm' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-pink-300'} flex flex-col items-center text-center">
                <img referrerpolicy="no-referrer" src="${p.img || fallbackImg}" class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mb-1.5" onerror="this.src='${fallbackImg}'">
                <p class="font-bold text-[11px] sm:text-xs text-gray-800 dark:text-gray-200 line-clamp-1">${p.name}</p>
                <span class="text-xs font-black text-primary mt-0.5">₹${price}</span>
            </div>
        `;
    }).join('');
}

function selectHamperItem(stepType, productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;
    hamperSelection[stepType] = p;

    const statusEl = document.getElementById(`hamper-${stepType}-status`);
    if (statusEl) statusEl.textContent = `✓ ${p.name.substring(0, 16)}...`;

    const gridId = stepType === 'base' ? 'hamper-base-grid' : (stepType === 'addon1' ? 'hamper-addon1-grid' : 'hamper-addon2-grid');
    const container = document.getElementById(gridId);
    if (container) {
        container.querySelectorAll('.hamper-card').forEach(card => {
            const isMatch = card.innerHTML.includes(p.name);
            if (isMatch) {
                card.className = 'hamper-card cursor-pointer p-2 rounded-xl border-2 transition border-primary bg-pink-50/50 dark:bg-pink-900/20 shadow-sm flex flex-col items-center text-center';
            } else {
                card.className = 'hamper-card cursor-pointer p-2 rounded-xl border-2 transition border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-pink-300 flex flex-col items-center text-center';
            }
        });
    }

    updateHamperSummary();
}

function updateHamperSummary() {
    const b = hamperSelection.base;
    const a1 = hamperSelection.addon1;
    const a2 = hamperSelection.addon2;

    const p1 = b ? Number(b.salePrice || b.price || 0) : 0;
    const p2 = a1 ? Number(a1.salePrice || a1.price || 0) : 0;
    const p3 = a2 ? Number(a2.salePrice || a2.price || 0) : 0;

    const regular = p1 + p2 + p3;
    const discountPct = (Number(settings.hamperDiscount) >= 0 && settings.hamperDiscount !== '') ? Number(settings.hamperDiscount) : 15;
    const discount = Math.round(regular * (discountPct / 100));
    const combo = Math.max(1, regular - discount);

    const badgeEl = document.getElementById('hamper-savings-badge');
    if (badgeEl) badgeEl.textContent = `SAVE ${discountPct}%`;

    const regEl = document.getElementById('hamper-regular-price');
    const comboEl = document.getElementById('hamper-combo-price');
    const savingsEl = document.getElementById('hamper-savings-text');

    if (regEl) regEl.textContent = `₹${regular}`;
    if (comboEl) comboEl.textContent = `₹${combo}`;
    if (savingsEl) savingsEl.textContent = `You save ₹${discount} (15% OFF) + Free Ribbon Box & Card!`;
}

function orderHamperWA() {
    const b = hamperSelection.base;
    const a1 = hamperSelection.addon1;
    const a2 = hamperSelection.addon2;

    if (!b || !a1 || !a2) {
        return alert('Please select all 3 gifts to complete your hamper!');
    }

    const p1 = Number(b.salePrice || b.price || 0);
    const p2 = Number(a1.salePrice || a1.price || 0);
    const p3 = Number(a2.salePrice || a2.price || 0);
    const regular = p1 + p2 + p3;
    const discountPct = (Number(settings.hamperDiscount) >= 0 && settings.hamperDiscount !== '') ? Number(settings.hamperDiscount) : 15;
    const discount = Math.round(regular * (discountPct / 100));
    const comboTotal = regular - discount;

    const hasPackaging = settings.hamperPackagingEnabled !== false;
    const ribbon = (hasPackaging && document.getElementById('hamper-ribbon')) ? document.getElementById('hamper-ribbon').value : '';
    const greeting = (hasPackaging && document.getElementById('hamper-greeting')) ? document.getElementById('hamper-greeting').value.trim() : '';

    const hamperItem = {
        name: `🎁 Custom Gift Hamper (${b.name} + ${a1.name} + ${a2.name})`,
        price: comboTotal,
        custom: hasPackaging 
            ? `Packaging: ${ribbon} | Note: "${greeting || 'Best Wishes'}" | ${discountPct}% Combo Discount Applied`
            : `${discountPct}% Combo Discount Applied`
    };

    closeHamperBuilder();
    const orderId = logOrder(hamperItem);
    const waUrl = `https://wa.me/${settings.wa}?text=${formatWAOrder([hamperItem], comboTotal, orderId)}`;
    openUPIPaymentModal(orderId, comboTotal, [hamperItem], waUrl);
}

// ═════════════════════════════════════════════════════════════════════════════
// QUICK OCCASION GIFT FINDER WIZARD
// ═════════════════════════════════════════════════════════════════════════════
let wizardState = {
    recipient: null,
    occasion: null,
    budget: null
};

function openGiftFinder() {
    wizardState = { recipient: null, occasion: null, budget: null };
    document.getElementById('wizard-step-1').classList.remove('hidden');
    document.getElementById('wizard-step-2').classList.add('hidden');
    document.getElementById('wizard-step-3').classList.add('hidden');
    document.getElementById('wizard-results').classList.add('hidden');

    const modal = document.getElementById('gift-finder-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeGiftFinder() {
    const modal = document.getElementById('gift-finder-modal');
    if (modal) modal.classList.add('hidden');
}

function restartWizard() {
    openGiftFinder();
}

function selectWizardChoice(field, value, btnEl) {
    wizardState[field] = value;

    if (field === 'recipient') {
        document.getElementById('wizard-step-1').classList.add('hidden');
        document.getElementById('wizard-step-2').classList.remove('hidden');
    } else if (field === 'occasion') {
        document.getElementById('wizard-step-2').classList.add('hidden');
        document.getElementById('wizard-step-3').classList.remove('hidden');
    } else if (field === 'budget') {
        document.getElementById('wizard-step-3').classList.add('hidden');
        findGiftsByWizard();
    }
}

function findGiftsByWizard() {
    const { recipient, occasion, budget } = wizardState;
    let scored = products.map(p => {
        let score = 0;
        const name = (p.name || '').toLowerCase();
        const price = Number(p.salePrice || p.price || 0);

        if (budget === 'under300' && price > 300) return null;
        if (budget === '300to700' && (price < 280 || price > 750)) return null;
        if (budget === 'above700' && price < 600) return null;

        if (recipient === 'him' && (name.includes('frame') || name.includes('bottle') || name.includes('wallet') || name.includes('mug'))) score += 3;
        if (recipient === 'her' && (name.includes('cushion') || name.includes('pillow') || name.includes('lamp') || name.includes('frame') || name.includes('mug'))) score += 3;
        if (recipient === 'parents' && (name.includes('frame') || name.includes('clock') || name.includes('plaque'))) score += 3;
        if (recipient === 'friend' && (name.includes('mug') || name.includes('keychain') || name.includes('puzzle') || name.includes('frame'))) score += 3;
        if (recipient === 'kids' && (name.includes('bank') || name.includes('puzzle') || name.includes('bottle') || name.includes('cushion'))) score += 4;

        if (occasion === 'birthday' && (name.includes('frame') || name.includes('mug') || name.includes('cushion'))) score += 2;
        if (occasion === 'anniversary' && (name.includes('frame') || name.includes('lamp') || name.includes('plaque'))) score += 3;
        if (occasion === 'love' && (name.includes('cushion') || name.includes('lamp') || name.includes('mug') || name.includes('keychain'))) score += 3;
        if (occasion === 'festive' && (name.includes('frame') || name.includes('clock') || name.includes('lamp'))) score += 2;

        if (p.custom) score += 2;
        return { product: p, score: score + Math.random() };
    }).filter(Boolean);

    scored.sort((a, b) => b.score - a.score);
    const topMatches = scored.slice(0, 4).map(s => s.product);
    const fallbackList = topMatches.length ? topMatches : products.slice(0, 4);

    const resultsContainer = document.getElementById('wizard-results-list');
    const fallbackImg = 'https://placehold.co/300x300/e44c89/white?text=Gift';

    if (resultsContainer) {
        resultsContainer.innerHTML = fallbackList.map(p => {
            const price = p.salePrice || p.price;
            return `
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl border border-gray-200 dark:border-gray-600 flex items-center gap-3">
                    <img referrerpolicy="no-referrer" src="${p.img || fallbackImg}" class="w-16 h-16 rounded-xl object-cover" onerror="this.src='${fallbackImg}'">
                    <div class="flex-1 min-w-0">
                        <span class="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded uppercase">Recommended</span>
                        <h4 class="font-bold text-xs text-gray-800 dark:text-gray-200 truncate mt-1">${p.name}</h4>
                        <p class="text-xs font-black text-primary mt-0.5">₹${price}</p>
                    </div>
                    <button onclick="closeGiftFinder(); openProductModal('${p.id}');" class="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer">
                        View & Customize
                    </button>
                </div>
            `;
        }).join('');
    }

    document.getElementById('wizard-results').classList.remove('hidden');
}


// ── UPI MODAL & RECEIPT HELPERS ─────────────────────────────────────────────
let pendingWAUrl = '';
let currentCheckoutOrderId = '';
let currentCheckoutTotal = 0;

function openUPIPaymentModal(orderId, total, items, waUrl) {
    pendingWAUrl = waUrl;
    currentCheckoutOrderId = orderId;
    currentCheckoutTotal = total;

    const upiId = (settings.upiId || '8726195000@okbizaxis').trim();
    const payeeName = settings.name || 'Lamination Hub';
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${total}&cu=INR&tn=${encodeURIComponent('Order ' + orderId)}`;

    const elId = document.getElementById('upi-order-id');
    const elTotal = document.getElementById('upi-order-total');
    const elVpa = document.getElementById('upi-vpa-display');
    const elQr = document.getElementById('upi-qr-image');
    const elLink = document.getElementById('upi-app-link');

    if (elId) elId.textContent = orderId;
    if (elTotal) elTotal.textContent = `₹${total}`;
    if (elVpa) elVpa.textContent = upiId;
    if (elQr) elQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}`;
    if (elLink) elLink.href = upiUrl;

    const modal = document.getElementById('upi-payment-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeUPIModal() {
    const modal = document.getElementById('upi-payment-modal');
    if (modal) modal.classList.add('hidden');
}

function copyUPIId() {
    const upiId = (settings.upiId || '8726195000@okbizaxis').trim();
    if (navigator.clipboard) {
        navigator.clipboard.writeText(upiId).then(() => {
            alert('UPI ID Copied: ' + upiId);
        }).catch(() => {
            prompt('Copy UPI ID:', upiId);
        });
    } else {
        prompt('Copy UPI ID:', upiId);
    }
}

function autoViewCustomerBill() {
    closeUPIModal();
    if (currentCheckoutOrderId) {
        openCustomerBill(currentCheckoutOrderId);
    }
}

function confirmUPIOrderWA() {
    const orderId = currentCheckoutOrderId;
    closeUPIModal();
    if (pendingWAUrl) {
        window.open(pendingWAUrl, '_blank');
    }
    // Auto-generate bill for customer immediately
    if (orderId) {
        setTimeout(() => {
            printOrderReceipt(orderId);
        }, 400);
    }
}

function skipUPIToWA() {
    const orderId = currentCheckoutOrderId;
    closeUPIModal();
    if (pendingWAUrl) {
        window.open(pendingWAUrl, '_blank');
    }
    // Auto-generate bill for customer immediately
    if (orderId) {
        setTimeout(() => {
            printOrderReceipt(orderId);
        }, 400);
    }
}

// ── 1-CLICK BILL IMAGE DOWNLOAD ──
function downloadBillImage() {
    const layout = getActiveBillLayout();
    const activeUrl = (settings && settings.billTemplateUrl) || layout.templateUrl || 'bill-template.jpg';

    const canvas = document.createElement('canvas');
    canvas.width = 658;
    canvas.height = 876;
    const ctx = canvas.getContext('2d');

    const templateImg = new Image();
    templateImg.crossOrigin = 'anonymous';
    templateImg.src = activeUrl;
    templateImg.onerror = () => {
        templateImg.src = 'bill-template.jpg';
    };
    templateImg.onload = () => {
        ctx.drawImage(templateImg, 0, 0, 658, 876);

        ctx.fillStyle = '#111827';
        ctx.font = 'bold 13px Arial, sans-serif';

        const name = (document.getElementById('bill-cust-name').innerText || '').trim();
        const phone = (document.getElementById('bill-cust-phone').innerText || '').trim();
        const address = (document.getElementById('bill-cust-address').innerText || '').trim();
        const billNo = (document.getElementById('bill-no').innerText || '').trim();
        const date = (document.getElementById('bill-date').innerText || '').trim();

        const nL = layout.name.left, nT = layout.name.top + 14;
        const pL = layout.phone.left, pT = layout.phone.top + 14;
        const aL = layout.address.left, aT = layout.address.top + 13;
        const bL = layout.billNo.left, bT = layout.billNo.top + 14;
        const dL = layout.date.left, dT = layout.date.top + 14;

        ctx.fillText(name.toUpperCase(), nL, nT);
        ctx.fillText(phone, pL, pT);
        ctx.font = '500 11.5px Arial, sans-serif';
        ctx.fillStyle = '#374151';
        ctx.fillText(address, aL, aT);

        // Bill No in Red
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(billNo, bL, bT);

        // Date
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 12.5px Arial, sans-serif';
        ctx.fillText(date, dL, dT);

        // Products & Prices
        const itemsContainer = document.getElementById('bill-items-container');
        if (itemsContainer) {
            const divs = itemsContainer.querySelectorAll('div');
            for (let i = 0; i < divs.length; i += 4) {
                const item = divs[i] ? divs[i].innerText : '';
                const qty = divs[i+1] ? divs[i+1].innerText : '';
                const rate = divs[i+2] ? divs[i+2].innerText : '';
                const amt = divs[i+3] ? divs[i+3].innerText : '';

                const rowTop = (layout.itemsStartY || 468) + 12 + (i / 4) * (layout.itemsRowHeight || 23);

                ctx.font = 'bold 12px Arial, sans-serif';
                ctx.fillStyle = '#111827';
                ctx.textAlign = 'left';
                ctx.fillText(item.length > 36 ? item.substring(0, 33) + '...' : item, 88, rowTop);

                ctx.font = 'bold 12px Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(qty, 414, rowTop);

                ctx.font = '600 12px Arial, sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText(rate, 513, rowTop);

                ctx.font = 'bold 12px Arial, sans-serif';
                ctx.fillText(amt, 618, rowTop);
            }
        }

        const subtotal = (document.getElementById('bill-subtotal').innerText || '').trim();
        const discount = (document.getElementById('bill-discount').innerText || '').trim();
        const due = (document.getElementById('bill-due').innerText || '').trim();
        const grandTotal = (document.getElementById('bill-grand-total').innerText || '').trim();

        ctx.textAlign = 'right';
        ctx.font = 'bold 12.5px Arial, sans-serif';
        ctx.fillStyle = '#111827';
        ctx.fillText(subtotal, layout.subtotal.left + 72, layout.subtotal.top + 14);

        ctx.fillStyle = '#15803d';
        ctx.fillText(discount || '0.00', layout.discount.left + 72, layout.discount.top + 14);

        ctx.fillStyle = '#dc2626';
        ctx.fillText(due || '0.00', layout.due.left + 72, layout.due.top + 14);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Arial, sans-serif';
        ctx.fillText(grandTotal, layout.grandTotal.left + 72, layout.grandTotal.top + 14);

        // QR Code drawing on canvas
        const qrImg = document.getElementById('bill-qr-code');
        const qrLeft = layout.qr.left || 288;
        const qrTop = layout.qr.top || 616;
        const qrSize = layout.qr.size || 88;

        const downloadFn = () => {
            try {
                const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                const a = document.createElement('a');
                a.download = `Lamination_Hub_Bill_${billNo.replace(/[^a-zA-Z0-9]/g, '') || 'Receipt'}.jpg`;
                a.href = dataUrl;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch(e) {
                window.print();
            }
        };

        if (qrImg && qrImg.src && qrImg.complete && qrImg.naturalWidth > 0) {
            try {
                const qrCanvasImg = new Image();
                qrCanvasImg.crossOrigin = 'anonymous';
                qrCanvasImg.src = qrImg.src;
                qrCanvasImg.onload = () => {
                    ctx.drawImage(qrCanvasImg, qrLeft, qrTop, qrSize, qrSize);
                    downloadFn();
                };
                qrCanvasImg.onerror = () => {
                    downloadFn();
                };
            } catch(e) {
                downloadFn();
            }
        } else {
            downloadFn();
        }
    };
    templateImg.onerror = () => {
        window.print();
    };
}


// ═════════════════════════════════════════════════════════════════════════════
// VISUAL DISCOUNT COUPON & DEAL MANAGER
// ═════════════════════════════════════════════════════════════════════════════
function renderAdminCoupons() {
    const grid = document.getElementById('admin-coupons-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!settings.couponList || !Array.isArray(settings.couponList)) {
        settings.couponList = [
            { code: 'SAVE10', type: 'pct', val: 10, minOrder: 0, active: true },
            { code: 'FESTIVE20', type: 'pct', val: 20, minOrder: 499, active: true },
            { code: 'HUB100', type: 'flat', val: 100, minOrder: 999, active: true }
        ];
        syncCouponsToSettings();
    }

    if (settings.couponList.length === 0) {
        grid.innerHTML = '<div class="col-span-3 p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-dashed border-gray-300">No coupons created yet. Click "+ Create New Coupon" above to add your first deal!</div>';
        return;
    }

    grid.innerHTML = settings.couponList.map((c, idx) => {
        const discountLabel = c.type === 'flat' ? `₹${c.val} FLAT OFF` : `${c.val}% OFF`;
        const minLabel = c.minOrder > 0 ? `Min. Order ₹${c.minOrder}` : 'No Minimum Order';
        return `
            <div class="relative bg-white dark:bg-gray-700/60 rounded-2xl p-5 border ${c.active ? 'border-pink-200 dark:border-pink-900/50 shadow-sm' : 'border-gray-200 opacity-60'} flex flex-col justify-between transition hover:shadow-md">
                <div>
                    <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="font-mono font-black text-base text-primary bg-pink-50 dark:bg-pink-900/30 px-2.5 py-1 rounded-lg border border-pink-200 dark:border-pink-800 tracking-wider flex items-center gap-1.5 cursor-pointer" onclick="navigator.clipboard.writeText('${c.code}'); alert('Copied coupon: ${c.code}')" title="Click to copy">
                            ${c.code} <i class="fas fa-copy text-[10px] text-gray-400"></i>
                        </span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}">
                            ${c.active ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <div class="my-2">
                        <span class="text-xl font-black text-gray-900 dark:text-gray-100">${discountLabel}</span>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${minLabel}</p>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-3 mt-2 border-t border-gray-100 dark:border-gray-600 text-xs">
                    <button type="button" onclick="toggleCouponActive(${idx})" class="font-bold ${c.active ? 'text-amber-600 hover:text-amber-700' : 'text-green-600 hover:text-green-700'} flex items-center gap-1 cursor-pointer">
                        <i class="fas ${c.active ? 'fa-pause-circle' : 'fa-play-circle'}"></i> ${c.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <div class="flex items-center gap-2">
                        <button type="button" onclick="editAdminCoupon(${idx})" class="text-blue-600 hover:text-blue-800 font-bold p-1 cursor-pointer" title="Edit Coupon"><i class="fas fa-edit"></i></button>
                        <button type="button" onclick="deleteAdminCoupon(${idx})" class="text-red-500 hover:text-red-700 font-bold p-1 cursor-pointer" title="Delete Coupon"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openCouponModal(editIdx = -1) {
    const modal = document.getElementById('coupon-modal');
    const title = document.getElementById('coupon-modal-title');
    const idxInput = document.getElementById('coupon-edit-idx');
    const codeInput = document.getElementById('coupon-code-input');
    const typeInput = document.getElementById('coupon-type-input');
    const valInput = document.getElementById('coupon-val-input');
    const minInput = document.getElementById('coupon-min-input');
    const activeInput = document.getElementById('coupon-active-input');

    if (!modal) return;
    idxInput.value = editIdx;

    if (editIdx >= 0 && settings.couponList[editIdx]) {
        const c = settings.couponList[editIdx];
        if (title) title.textContent = 'Edit Coupon';
        codeInput.value = c.code;
        typeInput.value = c.type || 'pct';
        valInput.value = c.val;
        minInput.value = c.minOrder || 0;
        activeInput.checked = c.active !== false;
    } else {
        if (title) title.textContent = 'Create New Coupon';
        codeInput.value = '';
        typeInput.value = 'pct';
        valInput.value = '';
        minInput.value = '';
        activeInput.checked = true;
    }

    modal.classList.remove('hidden');
}

function closeCouponModal() {
    const modal = document.getElementById('coupon-modal');
    if (modal) modal.classList.add('hidden');
}

function saveAdminCoupon() {
    const idx = parseInt(document.getElementById('coupon-edit-idx').value);
    const code = document.getElementById('coupon-code-input').value.trim().toUpperCase();
    const type = document.getElementById('coupon-type-input').value;
    const val = Number(document.getElementById('coupon-val-input').value);
    const minOrder = Number(document.getElementById('coupon-min-input').value) || 0;
    const active = document.getElementById('coupon-active-input').checked;

    if (!code || isNaN(val) || val <= 0) return alert('Please enter a valid coupon code and discount value.');

    settings.couponList = settings.couponList || [];

    const couponObj = { code, type, val, minOrder, active };

    if (idx >= 0 && idx < settings.couponList.length) {
        settings.couponList[idx] = couponObj;
    } else {
        settings.couponList.push(couponObj);
    }

    syncCouponsToSettings();
    saveData();
    closeCouponModal();
    renderAdminCoupons();
    alert(`Coupon "${code}" saved successfully!`);
}

function toggleCouponActive(idx) {
    if (settings.couponList && settings.couponList[idx]) {
        settings.couponList[idx].active = !settings.couponList[idx].active;
        syncCouponsToSettings();
        saveData();
        renderAdminCoupons();
    }
}

function deleteAdminCoupon(idx) {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    settings.couponList.splice(idx, 1);
    syncCouponsToSettings();
    saveData();
    renderAdminCoupons();
}

function editAdminCoupon(idx) {
    openCouponModal(idx);
}

function syncCouponsToSettings() {
    if (settings.couponList) {
        settings.coupons = settings.couponList
            .filter(c => c.active)
            .map(c => `${c.code}:${c.val}`)
            .join(', ');
        const setCouponsInput = document.getElementById('set-coupons');
        if (setCouponsInput) setCouponsInput.value = settings.coupons;
    }
}


// ═════════════════════════════════════════════════════════════════════════════
// CUSTOMER NAME & NUMBER PROMPT BEFORE OFFICIAL BILL GENERATION
// ═════════════════════════════════════════════════════════════════════════════
let pendingBillOrderId = null;

function openCustomerBill(orderId) {
    pendingBillOrderId = orderId;
    let order = orders.find(o => o.id === orderId);
    if (!order) {
        const stored = safeJSONParse('lh_customer_orders_' + (currentUser ? currentUser.uid : 'anon'), []);
        order = stored.find(o => o.id === orderId);
    }
    if (!order) {
        order = orders.find(o => o.id === orderId);
    }

    const modal = document.getElementById('bill-customer-prompt-modal');
    const nameInput = document.getElementById('bill-prompt-name');
    const phoneInput = document.getElementById('bill-prompt-phone');
    const addrInput = document.getElementById('bill-prompt-address');

    if (modal && nameInput && phoneInput) {
        const visitor = safeJSONParse('lh_visitor', {}) || {};
        const savedPhone = localStorage.getItem('lh_customer_phone') || '';
        const defaultAddr = getSavedAddresses().find(a => a.isDefault) || getSavedAddresses()[0];
        nameInput.value = (order && order.customer && order.customer.name) || (currentUser && currentUser.displayName) || visitor.name || '';
        phoneInput.value = (order && order.customer && order.customer.phone) || savedPhone || visitor.phone || '';
        if (addrInput) addrInput.value = (order && order.customer && order.customer.address) || (defaultAddr && defaultAddr.fullAddress) || visitor.address || '';

        modal.classList.remove('hidden');
    } else {
        printOrderReceipt(orderId);
    }
}

function closeCustomerBillPrompt() {
    const modal = document.getElementById('bill-customer-prompt-modal');
    if (modal) modal.classList.add('hidden');
}

function submitCustomerBillPrompt() {
    const nameInput = document.getElementById('bill-prompt-name');
    const phoneInput = document.getElementById('bill-prompt-phone');
    const addrInput = document.getElementById('bill-prompt-address');

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addrInput ? addrInput.value.trim() : '';

    if (!name || !phone) return alert('Please enter both your name and mobile number.');

    // Save to visitor lead
    const visitorObj = { name, phone, address, date: new Date().toLocaleDateString('en-GB') };
    localStorage.setItem('lh_visitor', JSON.stringify(visitorObj));

    // Save to order if exists
    if (pendingBillOrderId) {
        let order = orders.find(o => o.id === pendingBillOrderId);
        if (order) {
            order.customer = { name, phone, address };
            saveData();
            if (typeof database !== 'undefined' && database) {
                database.ref('orders/' + pendingBillOrderId + '/customer').set({ name, phone, address }).catch(() => {});
            }
        }
    }

    closeCustomerBillPrompt();
    printOrderReceipt(pendingBillOrderId);
}

let currentReceiptOrderId = null;
function printOrderReceipt(orderId) {
    currentReceiptOrderId = orderId;
    let order = orders.find(o => o.id === orderId);
    if (!order) {
        const stored = safeJSONParse('lh_customer_orders_' + (currentUser ? currentUser.uid : 'anon'), []);
        order = stored.find(o => o.id === orderId);
    }
    if (!order) {
        const myOrders = safeJSONParse('lh_my_orders', []);
        order = myOrders.find(o => o.id === orderId);
    }
    if (!order && typeof database !== 'undefined' && database) {
        database.ref('orders/' + orderId).once('value').then(snap => {
            const val = snap.val();
            if (val) {
                orders.unshift(val);
                printOrderReceipt(orderId);
            } else {
                alert('Order details not found for ID: ' + orderId);
            }
        }).catch(() => alert('Order details not found.'));
        return;
    }
    if (!order) {
        return alert('Order details not found for ID: ' + orderId);
    }

    renderPrintableBillWithOrder(order);
}

// Progressive Web App (PWA) Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW registration error:', err));
    });
}


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

// Secret keyboard shortcut for Admin Access: Ctrl+Shift+A or Alt+A
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        showAdminLogin();
    }
});
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
        if (userBtnDesk) userBtnDesk.innerHTML = `<img src="${user.photoURL}" class="w-6 h-6 rounded-full inline-block">`;
        
        // Load Wishlist
        db.ref('users/' + user.uid + '/wishlist').on('value', snap => {
            wishlist = snap.val() || [];
            updateWishlistUI();
        });
    } else {
        if (userNameMob) userNameMob.textContent = 'Sign In';
        if (userBtnDesk) userBtnDesk.innerHTML = '<i class="fas fa-user-circle"></i>';
        wishlist = safeJSONParse('lh_local_wishlist', []);
        updateWishlistUI();
    }
});

function handleUserClick() {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;
    document.getElementById('overlay').classList.remove('hidden');
    modal.classList.remove('hidden');
    renderCustomerProfile();
}

function getOrderStatusCardHtml(o) {
    const status = o.status || 'New';
    let step = 1;
    let badgeClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
    let badgeText = 'Order Received';
    let badgeIcon = 'fa-clock';

    if (status === 'Processing') {
        step = 2;
        badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
        badgeText = 'Customizing & Packing';
        badgeIcon = 'fa-cog fa-spin';
    } else if (status === 'Delivered') {
        step = 3;
        badgeClass = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
        badgeText = 'Delivered';
        badgeIcon = 'fa-check-circle';
    }

    const s1 = step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 dark:bg-gray-600';
    const s2 = step >= 2 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400 dark:bg-gray-600';
    const s3 = step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 dark:bg-gray-600';

    const bar1 = step >= 2 ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-600';
    const bar2 = step >= 3 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600';

    const waMsg = encodeURIComponent(`Hello ${settings.name}, I have a query about my order (${o.id} - ${o.product}). Current status is: ${status}.`);
    const waLink = `https://wa.me/${settings.wa}?text=${waMsg}`;

    return `
        <div class="border border-gray-150 dark:border-gray-700 rounded-xl p-4 bg-gray-50/70 dark:bg-gray-700/40 shadow-sm transition hover:shadow-md">
            <div class="flex flex-wrap justify-between items-center gap-2 mb-3 pb-2 border-b border-gray-200/60 dark:border-gray-700">
                <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">${o.id}</span>
                    <button onclick="navigator.clipboard.writeText('${o.id}'); alert('Copied Order ID: ${o.id}')" title="Copy ID" class="text-xs text-gray-400 hover:text-primary transition"><i class="fas fa-copy"></i></button>
                    <span class="text-xs text-gray-400">• ${o.date || ''}</span>
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${badgeClass}">
                    <i class="fas ${badgeIcon}"></i> ${badgeText}
                </span>
            </div>

            <div class="flex justify-between items-start gap-4 mb-3">
                <div>
                    <h4 class="font-bold text-gray-800 dark:text-gray-100 text-sm md:text-base">${o.product}</h4>
                    ${o.custom && o.custom !== 'None' ? `<p class="text-xs text-gray-500 dark:text-gray-400 mt-1"><i class="fas fa-pencil-alt text-[10px] mr-1"></i>${o.custom}</p>` : ''}
                </div>
                <div class="text-right flex-shrink-0">
                    <span class="text-primary font-bold text-base md:text-lg">₹${o.price}</span>
                </div>
            </div>

            <div class="py-2 mb-3">
                <div class="flex items-center justify-between relative max-w-sm mx-auto">
                    <div class="flex flex-col items-center z-10">
                        <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${s1}">1</div>
                        <span class="text-[11px] font-semibold mt-1 text-gray-600 dark:text-gray-300">Placed</span>
                    </div>
                    <div class="flex-grow h-1 mx-2 -mt-4 ${bar1}"></div>
                    <div class="flex flex-col items-center z-10">
                        <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${s2}">2</div>
                        <span class="text-[11px] font-semibold mt-1 text-gray-600 dark:text-gray-300">Processing</span>
                    </div>
                    <div class="flex-grow h-1 mx-2 -mt-4 ${bar2}"></div>
                    <div class="flex flex-col items-center z-10">
                        <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${s3}">3</div>
                        <span class="text-[11px] font-semibold mt-1 text-gray-600 dark:text-gray-300">Delivered</span>
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-gray-200/40 dark:border-gray-700">
                <div class="flex flex-wrap items-center gap-2">
                    ${settings.featBillDownload !== false ? `
                        <button onclick="openCustomerBill('${o.id}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15803d] hover:bg-green-700 text-white font-bold text-xs shadow-xs transition cursor-pointer">
                            <i class="fas fa-file-invoice"></i> View / Download Bill
                        </button>
                    ` : ''}
                    ${settings.featReorder !== false ? `
                        <button onclick="reorderProduct('${o.id}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-primary border border-pink-200 dark:bg-gray-800 dark:border-gray-600 font-bold text-xs shadow-xs transition cursor-pointer">
                            <i class="fas fa-redo-alt"></i> Buy Again
                        </button>
                    ` : ''}
                </div>
                <a href="${waLink}" target="_blank" class="inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold hover:underline">
                    <i class="fab fa-whatsapp text-sm"></i> Order Help on WhatsApp
                </a>
            </div>
        </div>
    `;
}

function reorderProduct(orderId) {
    let o = orders.find(x => x.id === orderId);
    if (!o) {
        const localOrders = safeJSONParse('lh_customer_orders_' + (currentUser ? currentUser.uid : 'anon'), []);
        o = localOrders.find(x => x.id === orderId);
    }
    if (!o) return alert('Order details not found.');

    const prod = products.find(p => (p.name || '').toLowerCase() === (o.product || '').toLowerCase()) || {
        id: 'reorder_' + Date.now(),
        name: o.product,
        price: o.price,
        salePrice: o.price,
        img: 'https://placehold.co/100x100/e44c89/white?text=Gift'
    };

    cart.push({
        ...prod,
        customNote: o.custom && o.custom !== 'None' ? o.custom : ''
    });
    saveData();
    updateCartCount();
    closeProfileModal();
    openCart();
    alert(`"${o.product}" added back to your cart!`);
}

function switchProfileTab(tabName) {
    document.querySelectorAll('.profile-tab-btn').forEach(btn => {
        btn.classList.remove('border-primary', 'text-primary');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    const activeBtn = document.getElementById(`ptab-btn-${tabName}`);
    if (activeBtn) {
        activeBtn.classList.remove('border-transparent', 'text-gray-500');
        activeBtn.classList.add('border-primary', 'text-primary');
    }
    document.querySelectorAll('.profile-tab-content').forEach(el => el.classList.add('hidden'));
    const content = document.getElementById(`ptab-content-${tabName}`);
    if (content) content.classList.remove('hidden');

    if (tabName === 'addresses') renderSavedAddresses();
    if (tabName === 'reminders') renderReminders();
    if (tabName === 'wishlist') renderCustomerWishlist();
    if (tabName === 'coupons') renderCustomerCoupons();
}

function toggleQuickPhoneLoginBox(show) {
    const box = document.getElementById('quick-phone-login-box');
    if (!box) return;
    if (show !== undefined) {
        if (show) box.classList.remove('hidden');
        else box.classList.add('hidden');
    } else {
        box.classList.toggle('hidden');
    }
}

function loginWithPhoneFromUI() {
    const name = document.getElementById('ql-name').value.trim();
    const phone = document.getElementById('ql-phone').value.trim();
    if (!name) return alert('Please enter your name.');
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) return alert('Please enter a valid 10-digit mobile number.');

    const userObj = {
        name,
        phone: cleanPhone.slice(-10),
        loggedIn: true,
        type: 'phone'
    };
    localStorage.setItem('lh_customer_user', JSON.stringify(userObj));
    localStorage.setItem('lh_customer_phone', cleanPhone.slice(-10));

    const visitor = safeJSONParse('lh_visitor', {}) || {};
    visitor.name = name;
    visitor.phone = cleanPhone.slice(-10);
    localStorage.setItem('lh_visitor', JSON.stringify(visitor));

    if (!leads.some(l => l.phone === cleanPhone.slice(-10))) {
        leads.push({
            name,
            phone: cleanPhone.slice(-10),
            date: new Date().toLocaleDateString('en-GB')
        });
        saveData();
    }

    toggleQuickPhoneLoginBox(false);
    renderCustomerProfile();
    alert(`Welcome, ${name}! You are now signed in.`);
}

function editCustomerPhone() {
    const current = localStorage.getItem('lh_customer_phone') || '';
    const val = prompt('Enter your WhatsApp Mobile Number for instant updates & auto-fill:', current);
    if (val !== null) {
        const clean = val.replace(/[^0-9]/g, '');
        if (clean.length < 10) return alert('Please enter a valid 10-digit mobile number.');
        localStorage.setItem('lh_customer_phone', clean.slice(-10));
        const visitor = safeJSONParse('lh_visitor', {}) || {};
        visitor.phone = clean.slice(-10);
        localStorage.setItem('lh_visitor', JSON.stringify(visitor));
        renderCustomerProfile();
        alert('WhatsApp Number saved successfully!');
    }
}

function renderCustomerProfile() {
    const profImg = document.getElementById('prof-img');
    const profName = document.getElementById('prof-name');
    const profEmail = document.getElementById('prof-email');
    const authBtn = document.getElementById('prof-auth-btn');
    const adminBtn = document.getElementById('prof-admin-btn');
    const phoneLoginBtn = document.getElementById('prof-phone-login-btn');
    const phoneContainer = document.getElementById('prof-phone-container');
    const phoneVal = document.getElementById('prof-phone-val');
    const ordersList = document.getElementById('prof-orders-list');
    const countBadge = document.getElementById('prof-order-count');

    const phoneUser = safeJSONParse('lh_customer_user', null);
    const savedPhone = localStorage.getItem('lh_customer_phone') || (phoneUser && phoneUser.phone) || '';

    // Feature toggles for tabs
    const btnAddr = document.getElementById('ptab-btn-addresses');
    const btnOcc = document.getElementById('ptab-btn-reminders');
    const btnWish = document.getElementById('ptab-btn-wishlist');
    const btnCoup = document.getElementById('ptab-btn-coupons');

    if (btnAddr) btnAddr.classList.toggle('hidden', settings.featAddressBook === false);
    if (btnOcc) btnOcc.classList.toggle('hidden', settings.featOccasions === false);
    if (btnWish) btnWish.classList.toggle('hidden', settings.featWishlistTab === false);
    if (btnCoup) btnCoup.classList.toggle('hidden', settings.featCouponsWallet === false);

    if (phoneContainer) {
        if (settings.featSavedPhone === false) {
            phoneContainer.classList.add('hidden');
        } else {
            phoneContainer.classList.remove('hidden');
            if (phoneVal) phoneVal.textContent = savedPhone ? `+91 ${savedPhone}` : 'No phone saved';
        }
    }

    if (currentUser) {
        if (profImg) profImg.src = currentUser.photoURL || 'https://placehold.co/100x100/e44c89/white?text=User';
        if (profName) profName.textContent = currentUser.displayName || 'Customer';
        if (profEmail) profEmail.textContent = currentUser.email || '';
        if (authBtn) {
            authBtn.innerHTML = '<i class="fas fa-sign-out-alt mr-1"></i> Sign Out';
            authBtn.className = 'text-xs font-bold px-3 py-2 rounded-lg transition border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20';
        }
        if (phoneLoginBtn) phoneLoginBtn.classList.add('hidden');
        if (adminBtn) {
            const allowed = (settings.adminEmails || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
            if (currentUser.email && allowed.includes(currentUser.email.toLowerCase())) {
                adminBtn.classList.remove('hidden');
            } else {
                adminBtn.classList.add('hidden');
            }
        }
    } else if (phoneUser && phoneUser.loggedIn) {
        if (profImg) profImg.src = 'https://placehold.co/100x100/10b981/white?text=' + encodeURIComponent((phoneUser.name || 'U').charAt(0));
        if (profName) profName.textContent = phoneUser.name || 'Customer';
        if (profEmail) profEmail.textContent = `📱 Mobile: +91 ${phoneUser.phone}`;
        if (authBtn) {
            authBtn.innerHTML = '<i class="fas fa-sign-out-alt mr-1"></i> Sign Out';
            authBtn.className = 'text-xs font-bold px-3 py-2 rounded-lg transition border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20';
        }
        if (phoneLoginBtn) phoneLoginBtn.classList.add('hidden');
        if (adminBtn) adminBtn.classList.add('hidden');
    } else {
        if (profImg) profImg.src = 'https://placehold.co/100x100/e44c89/white?text=Guest';
        if (profName) profName.textContent = 'Guest Shopper';
        if (profEmail) profEmail.textContent = 'Orders tracked on this device';
        if (authBtn) {
            authBtn.innerHTML = '<i class="fab fa-google text-red-500 mr-1.5"></i> Google Sign In';
            authBtn.className = 'text-xs font-bold px-3.5 py-2 rounded-lg transition shadow-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50';
        }
        if (phoneLoginBtn) {
            phoneLoginBtn.classList.toggle('hidden', settings.featMobileLogin === false);
        }
        if (adminBtn) adminBtn.classList.add('hidden');
    }

    const localOrderIds = safeJSONParse('lh_my_orders', []);
    const userPhoneClean = (savedPhone || '').slice(-10);
    const matchingOrders = orders.filter(o => {
        if (currentUser && o.uid && o.uid === currentUser.uid) return true;
        if (localOrderIds.includes(o.id)) return true;
        if (userPhoneClean && o.customer && o.customer.phone && o.customer.phone.includes(userPhoneClean)) return true;
        return false;
    });

    if (countBadge) countBadge.textContent = `${matchingOrders.length} Order${matchingOrders.length === 1 ? '' : 's'}`;

    if (ordersList) {
        if (matchingOrders.length === 0) {
            ordersList.innerHTML = `
                <div class="text-center py-6 text-gray-400">
                    <i class="fas fa-shopping-bag text-2xl mb-1 text-gray-300 dark:text-gray-600"></i>
                    <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">No orders found yet</p>
                    <p class="text-[11px] mt-0.5">When you place an order, your tracking status will automatically appear here!</p>
                </div>
            `;
        } else {
            ordersList.innerHTML = matchingOrders.map(o => getOrderStatusCardHtml(o)).join('');
        }
    }

    renderSavedAddresses();
    renderReminders();
    renderCustomerWishlist();
    renderCustomerCoupons();
}

// ── SAVED ADDRESS BOOK LOGIC ──
function getSavedAddresses() {
    return safeJSONParse('lh_addresses', []);
}

function renderSavedAddresses() {
    const listContainer = document.getElementById('saved-addresses-list');
    if (!listContainer) return;
    const list = getSavedAddresses();
    if (list.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-6 text-gray-400">
                <i class="fas fa-map-marker-alt text-2xl mb-1 text-gray-300 dark:text-gray-600"></i>
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">No saved addresses yet</p>
                <p class="text-[11px] mt-0.5">Add your Home, Office or Gift Recipient address for instant checkout.</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = list.map(a => `
        <div class="border ${a.isDefault ? 'border-primary bg-pink-50/30 dark:bg-pink-900/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'} rounded-xl p-3 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-black text-gray-800 dark:text-gray-100">${a.tag || 'Home 🏠'}</span>
                    ${a.isDefault ? '<span class="bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded">DEFAULT</span>' : ''}
                    <span class="text-xs font-bold text-gray-600 dark:text-gray-300">• ${a.name} (${a.phone})</span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-300 leading-tight">${a.fullAddress}</p>
                <p class="text-[10px] text-gray-400 font-semibold mt-0.5">PIN: ${a.pincode}</p>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
                ${!a.isDefault ? `<button onclick="setDefaultAddress('${a.id}')" class="text-[11px] font-bold text-primary hover:underline px-2 py-1 cursor-pointer">Set Default</button>` : ''}
                <button onclick="editAddress('${a.id}')" class="text-gray-400 hover:text-primary text-xs p-1 cursor-pointer"><i class="fas fa-pencil-alt"></i></button>
                <button onclick="deleteAddress('${a.id}')" class="text-gray-400 hover:text-red-500 text-xs p-1 cursor-pointer"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    `).join('');
}

function openNewAddressForm(id) {
    const box = document.getElementById('new-address-form-box');
    if (!box) return;
    box.classList.remove('hidden');
    const formId = document.getElementById('addr-form-id');
    const title = document.getElementById('addr-form-title');
    const tag = document.getElementById('addr-tag');
    const name = document.getElementById('addr-name');
    const phone = document.getElementById('addr-phone');
    const pin = document.getElementById('addr-pincode');
    const full = document.getElementById('addr-full');
    const isDef = document.getElementById('addr-is-default');

    if (id) {
        const addr = getSavedAddresses().find(a => a.id === id);
        if (addr) {
            formId.value = addr.id;
            title.textContent = 'Edit Address';
            tag.value = addr.tag || 'Home 🏠';
            name.value = addr.name || '';
            phone.value = addr.phone || '';
            pin.value = addr.pincode || '';
            full.value = addr.fullAddress || '';
            isDef.checked = !!addr.isDefault;
            return;
        }
    }
    formId.value = '';
    title.textContent = 'Add New Address';
    tag.value = 'Home 🏠';
    const userPhone = localStorage.getItem('lh_customer_phone') || '';
    const visitor = safeJSONParse('lh_visitor', {}) || {};
    name.value = (currentUser && currentUser.displayName) || visitor.name || '';
    phone.value = userPhone || visitor.phone || '';
    pin.value = '';
    full.value = '';
    isDef.checked = getSavedAddresses().length === 0;
}

function closeNewAddressForm() {
    const box = document.getElementById('new-address-form-box');
    if (box) box.classList.add('hidden');
}

function saveAddressFromUI() {
    const formId = document.getElementById('addr-form-id').value;
    const tag = document.getElementById('addr-tag').value;
    const name = document.getElementById('addr-name').value.trim();
    const phone = document.getElementById('addr-phone').value.trim();
    const pin = document.getElementById('addr-pincode').value.trim();
    const full = document.getElementById('addr-full').value.trim();
    const isDefault = document.getElementById('addr-is-default').checked;

    if (!name || !phone || !full) {
        return alert('Please fill recipient name, mobile number, and address.');
    }

    let list = getSavedAddresses();
    if (isDefault) {
        list.forEach(a => a.isDefault = false);
    }

    const addrObj = {
        id: formId || 'addr_' + Date.now(),
        tag,
        name,
        phone,
        pincode: pin,
        fullAddress: full,
        isDefault: isDefault || list.length === 0
    };

    if (formId) {
        const idx = list.findIndex(a => a.id === formId);
        if (idx !== -1) list[idx] = addrObj;
        else list.push(addrObj);
    } else {
        list.push(addrObj);
    }

    localStorage.setItem('lh_addresses', JSON.stringify(list));
    closeNewAddressForm();
    renderSavedAddresses();
}

function editAddress(id) {
    openNewAddressForm(id);
}

function deleteAddress(id) {
    if (!confirm('Delete this saved address?')) return;
    let list = getSavedAddresses().filter(a => a.id !== id);
    if (list.length > 0 && !list.some(a => a.isDefault)) list[0].isDefault = true;
    localStorage.setItem('lh_addresses', JSON.stringify(list));
    renderSavedAddresses();
}

function setDefaultAddress(id) {
    let list = getSavedAddresses();
    list.forEach(a => a.isDefault = (a.id === id));
    localStorage.setItem('lh_addresses', JSON.stringify(list));
    renderSavedAddresses();
}

// ── OCCASIONS & REMINDERS LOGIC ──
function getReminders() {
    return safeJSONParse('lh_reminders', []);
}

function getDaysUntilDate(dateStr) {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0,0,0,0);
    const parts = dateStr.split('-');
    if (parts.length < 3) return null;
    let target = new Date(today.getFullYear(), parseInt(parts[1]) - 1, parseInt(parts[2]));
    target.setHours(0,0,0,0);
    if (target < today) {
        target.setFullYear(today.getFullYear() + 1);
    }
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
}

function renderReminders() {
    const container = document.getElementById('reminders-list');
    const banner = document.getElementById('reminder-highlight-banner');
    if (!container) return;
    const list = getReminders();

    if (list.length === 0) {
        if (banner) banner.classList.add('hidden');
        container.innerHTML = `
            <div class="text-center py-6 text-gray-400">
                <i class="fas fa-calendar-alt text-2xl mb-1 text-gray-300 dark:text-gray-600"></i>
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">No occasion reminders added yet</p>
                <p class="text-[11px] mt-0.5">Add Birthdays & Anniversaries of parents, spouse or friends to get timely gift ideas!</p>
            </div>
        `;
        return;
    }

    list.sort((a, b) => {
        const dA = getDaysUntilDate(a.date) ?? 999;
        const dB = getDaysUntilDate(b.date) ?? 999;
        return dA - dB;
    });

    const closest = list[0];
    const days = getDaysUntilDate(closest.date);
    if (banner && days !== null && days <= 30) {
        banner.classList.remove('hidden');
        const titleEl = document.getElementById('reminder-highlight-title');
        const countdownEl = document.getElementById('reminder-highlight-countdown');
        if (titleEl) titleEl.textContent = `${closest.name}'s ${closest.occasion}`;
        if (countdownEl) countdownEl.textContent = days === 0 ? 'is TODAY! 🎉' : (days === 1 ? 'is TOMORROW!' : `is in ${days} days!`);
    } else if (banner) {
        banner.classList.add('hidden');
    }

    container.innerHTML = list.map(r => {
        const d = getDaysUntilDate(r.date);
        let timeText = d === 0 ? '🎉 Today!' : (d === 1 ? 'Tomorrow!' : `in ${d} days`);
        return `
            <div class="border border-rose-150 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-xs flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center text-sm font-black flex-shrink-0">
                        <i class="fas ${(r.occasion || '').includes('Anniversary') ? 'fa-ring' : 'fa-birthday-cake'}"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-1.5">
                            <span class="text-xs font-black text-gray-800 dark:text-gray-100">${r.name}</span>
                            <span class="text-[10px] text-gray-500 font-bold">(${r.occasion})</span>
                        </div>
                        <p class="text-[11px] text-gray-400">${r.date}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                    <span class="text-xs font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-900/40 px-2 py-0.5 rounded-full">${timeText}</span>
                    <button onclick="browseGiftsForOccasion('${r.occasion}')" title="Gift ideas" class="text-xs bg-pink-50 hover:bg-pink-100 text-primary px-2 py-1 rounded font-bold cursor-pointer">🎁 Gifts</button>
                    <button onclick="deleteReminder('${r.id}')" title="Delete" class="text-gray-400 hover:text-red-500 text-xs p-1 cursor-pointer"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

function openNewReminderForm() {
    const box = document.getElementById('new-reminder-form-box');
    if (box) box.classList.remove('hidden');
}

function closeNewReminderForm() {
    const box = document.getElementById('new-reminder-form-box');
    if (box) box.classList.add('hidden');
}

function saveReminderFromUI() {
    const name = document.getElementById('rem-name').value.trim();
    const occasion = document.getElementById('rem-occasion').value;
    const date = document.getElementById('rem-date').value;

    if (!name || !date) {
        return alert('Please enter person name and occasion date.');
    }

    let list = getReminders();
    list.push({
        id: 'rem_' + Date.now(),
        name,
        occasion,
        date
    });
    localStorage.setItem('lh_reminders', JSON.stringify(list));
    document.getElementById('rem-name').value = '';
    document.getElementById('rem-date').value = '';
    closeNewReminderForm();
    renderReminders();
}

function deleteReminder(id) {
    if (!confirm('Delete this occasion reminder?')) return;
    let list = getReminders().filter(r => r.id !== id);
    localStorage.setItem('lh_reminders', JSON.stringify(list));
    renderReminders();
}

function browseGiftsForOccasion(tag) {
    closeProfileModal();
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = (tag || '').toLowerCase().includes('anniversary') ? 'frame' : 'hamper';
        searchProducts();
    }
}

// ── CUSTOMER WISHLIST & COUPONS LOGIC ──
function renderCustomerWishlist() {
    const container = document.getElementById('ptab-wishlist-list');
    const countBadge = document.getElementById('ptab-wishlist-count');
    if (!container) return;
    const wishItems = products.filter(p => wishlist.includes(p.id));
    if (countBadge) countBadge.textContent = `${wishItems.length} item${wishItems.length === 1 ? '' : 's'}`;

    if (wishItems.length === 0) {
        container.innerHTML = `
            <div class="text-center py-6 text-gray-400">
                <i class="fas fa-heart text-2xl mb-1 text-pink-300 dark:text-gray-600"></i>
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">Your wishlist is empty</p>
                <p class="text-[11px] mt-0.5">Click the ❤️ on any product to save it here for later.</p>
            </div>
        `;
        return;
    }

    const fallbackImg = 'https://placehold.co/100x100/e44c89/white?text=Gift';
    container.innerHTML = wishItems.map(p => {
        const price = p.salePrice || p.price;
        return `
            <div class="border border-gray-150 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800 flex items-center justify-between gap-3 shadow-xs">
                <div class="flex items-center gap-3 min-w-0">
                    <img referrerpolicy="no-referrer" src="${p.img || fallbackImg}" class="w-11 h-11 rounded-lg object-cover flex-shrink-0" onerror="this.src='${fallbackImg}'">
                    <div class="min-w-0">
                        <p class="font-bold text-xs text-gray-800 dark:text-gray-100 truncate">${p.name}</p>
                        <p class="text-xs font-bold text-primary mt-0.5">₹${price}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                    <button onclick="addToCart('${p.id}'); closeProfileModal();" class="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                    <button onclick="toggleWishlistProduct('${p.id}'); renderCustomerWishlist();" title="Remove" class="text-gray-400 hover:text-red-500 p-1 rounded-lg text-xs transition cursor-pointer">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderCustomerCoupons() {
    const container = document.getElementById('ptab-coupons-list');
    if (!container) return;
    let list = [];
    if (settings.coupons) {
        settings.coupons.split(',').forEach(c => {
            const [code, pct] = c.split(':').map(s => s && s.trim());
            if (code) list.push({ code, discount: `${pct}% OFF`, min: 0 });
        });
    }
    if (Array.isArray(coupons) && coupons.length > 0) {
        coupons.forEach(c => {
            if (c.active !== false && !list.some(x => x.code.toLowerCase() === c.code.toLowerCase())) {
                const discount = c.type === 'flat' ? `₹${c.value} FLAT OFF` : `${c.value}% OFF`;
                list.push({ code: c.code, discount, min: c.minOrder || 0 });
            }
        });
    }
    if (list.length === 0) {
        list = [
            { code: 'SAVE10', discount: '10% OFF', min: 0 },
            { code: 'HAMPER15', discount: '15% OFF (Gift Hampers)', min: 0 }
        ];
    }
    container.innerHTML = list.map(c => `
        <div class="border border-pink-200 dark:border-gray-700 bg-pink-50/50 dark:bg-gray-800 p-3 rounded-xl flex items-center justify-between gap-3 shadow-xs">
            <div>
                <span class="font-mono font-black text-xs text-primary tracking-wider bg-white dark:bg-gray-900 px-2 py-0.5 rounded border border-pink-300 dark:border-gray-600">${c.code}</span>
                <p class="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1">${c.discount}</p>
                ${c.min ? `<p class="text-[10px] text-gray-500">Min Order: ₹${c.min}</p>` : ''}
            </div>
            <button onclick="applyCouponFromWallet('${c.code}')" class="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer">
                <i class="fas fa-check"></i> Apply
            </button>
        </div>
    `).join('');
}

function applyCouponFromWallet(code) {
    closeProfileModal();
    openCart();
    const input = document.getElementById('coupon-input');
    if (input) {
        input.value = code;
        applyCoupon();
    }
}

function trackOrderById() {
    const input = document.getElementById('track-order-input');
    const resultBox = document.getElementById('track-result-box');
    if (!input || !resultBox) return;

    const query = input.value.trim().toUpperCase();
    if (!query) {
        alert('Please enter an Order ID (e.g. ORD-1728...)');
        return;
    }

    resultBox.classList.remove('hidden');
    const found = orders.find(o => o.id && o.id.trim().toUpperCase() === query);

    if (found) {
        try {
            const localOrders = safeJSONParse('lh_my_orders', []);
            if (!localOrders.includes(found.id)) {
                localOrders.unshift(found.id);
                localStorage.setItem('lh_my_orders', JSON.stringify(localOrders.slice(0, 50)));
            }
        } catch(e) {}

        resultBox.innerHTML = `
            <div class="mb-2 flex items-center justify-between text-xs text-green-600 dark:text-green-400 font-bold">
                <span><i class="fas fa-check-circle mr-1"></i> Order Found!</span>
                <span class="text-gray-400 font-normal">Saved to your device history</span>
            </div>
            ${getOrderStatusCardHtml(found)}
        `;
        renderCustomerProfile();
    } else {
        resultBox.innerHTML = `
            <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-center text-xs">
                <i class="fas fa-exclamation-circle text-red-500 text-lg mb-1"></i>
                <p class="font-bold text-red-700 dark:text-red-300">No order found with ID: ${query}</p>
                <p class="text-gray-500 dark:text-gray-400 mt-1">Please verify the Order ID from your WhatsApp confirmation, or contact us on WhatsApp for assistance.</p>
            </div>
        `;
    }
}

function toggleProfileAuth() {
    if (currentUser) {
        signOutUser();
    } else {
        loginWithGoogle();
    }
}

function loginWithGoogle() {
    if (window.location.protocol === 'file:') {
        alert('Google Sign-In is only supported over http:// or https:// (not from local file:// files).\n\nTo test Google Sign-In locally, double-click start_server.bat in your folder to open http://localhost:3000!');
        return;
    }
    auth.signInWithPopup(googleProvider).then(() => {
        renderCustomerProfile();
    }).catch(err => {
        if (err.code === 'auth/unauthorized-domain') {
            alert(`Domain Not Authorized in Firebase!\n\nThe domain "${window.location.hostname}" is not added to Firebase Authorized Domains yet.\n\nTo fix this:\n1. Go to Firebase Console > Authentication > Settings\n2. Scroll to "Authorized domains"\n3. Click "Add domain" and enter: ${window.location.hostname}`);
        } else if (err.code === 'auth/operation-not-allowed') {
            alert('Google Sign-in is not enabled in your Firebase Console.\n\nPlease enable Google in Firebase Console > Authentication > Sign-in method.');
        } else if (err.code !== 'auth/popup-closed-by-user') {
            alert('Login failed: ' + err.message);
        }
    });
}

function signOutUser() {
    if (confirm('Sign out?')) {
        localStorage.removeItem('lh_customer_user');
        if (currentUser) {
            auth.signOut().then(() => {
                renderCustomerProfile();
            });
        } else {
            renderCustomerProfile();
        }
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
    logo: 'logo.jpg',
    hamperPackagingEnabled: true,
    featBillDownload: true,
    featReorder: true,
    featAddressBook: true,
    featSavedPhone: true,
    featMobileLogin: true,
    featOccasions: true,
    featWishlistTab: true,
    featCouponsWallet: true
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
    checkVisitorModal();
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
        renderNewLaunchSpotlight();
        renderComboDeals();
        checkAndShowPromoPopup();
        renderReviews();
        renderBanners();
        renderBottomBanners();
        updateCartCount();
        document.getElementById('current-year').textContent = new Date().getFullYear();
        checkVisitor();
        const profModal = document.getElementById('profile-modal');
        if (profModal && !profModal.classList.contains('hidden')) renderCustomerProfile();
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
        renderNewLaunchSpotlight();
        renderComboDeals();
        checkAndShowPromoPopup();
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
    applySiteBackground();
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

    // Google Review Button Link
    const grBtn = document.getElementById('google-review-btn');
    if (grBtn) {
        if (settings.googleReviewLink && settings.googleReviewLink.trim()) {
            grBtn.href = settings.googleReviewLink;
        } else {
            grBtn.href = 'https://www.google.com/search?q=' + encodeURIComponent('Lamination Hub Gita Mandir Chowk Kurebhar Sultanpur');
        }
        grBtn.classList.remove('hidden');
        grBtn.classList.add('inline-flex');
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

const categoryIconMap = {
    'all': '✨',
    'photo frame': '🖼️',
    'frame': '🖼️',
    'mug': '☕',
    'pillow': '🛋️',
    'cushion': '🛋️',
    'keychain': '🔑',
    'bottle': '💧',
    'water bottle': '💧',
    'acrylic': '💎',
    'crystal': '🔮',
    'clock': '⏰',
    'wall clock': '⏰',
    't-shirt': '👕',
    'shirt': '👕',
    'badge': '🪪',
    'wallet': '👛',
    'pen': '🖊️'
};

function getCategoryIcon(cat) {
    const lower = (cat || '').toLowerCase();
    for (const [key, icon] of Object.entries(categoryIconMap)) {
        if (lower.includes(key)) return icon;
    }
    return '🎁';
}

function renderCategories() {
    const filter = document.getElementById('category-filter');
    const pillsContainer = document.getElementById('category-pills');
    const currentVal = filter ? filter.value : 'all';

    if (filter) {
        filter.innerHTML = '<option value="all">✨ All Categories</option>';
        categories.forEach(cat => {
            const icon = getCategoryIcon(cat);
            filter.innerHTML += `<option value="${cat}">${icon} ${cat}</option>`;
        });
        filter.value = currentVal;
    }

    if (pillsContainer) {
        let html = `
            <button onclick="selectCategoryPill('all')" class="cat-pill whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${currentVal === 'all' ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-primary'}">
                <span>✨</span> All
            </button>
        `;
        categories.forEach(cat => {
            const icon = getCategoryIcon(cat);
            const isActive = currentVal === cat;
            html += `
                <button onclick="selectCategoryPill('${cat}')" class="cat-pill whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${isActive ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-primary'}">
                    <span>${icon}</span> ${cat}
                </button>
            `;
        });
        pillsContainer.innerHTML = html;
    }
}

function selectCategoryPill(cat) {
    const filter = document.getElementById('category-filter');
    if (filter) filter.value = cat;
    renderCategories();
    renderProducts(cat, document.getElementById('search-input') ? document.getElementById('search-input').value : '');
}

function renderProducts(filter = 'all', search = '') {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    let filtered = products.filter(p => !p.hidden);
    if (filter !== 'all') filtered = filtered.filter(p => p.category === filter);
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    filtered.forEach(p => {
        const fallbackImg = 'https://placehold.co/300x300/e44c89/white?text=No+Image';
        const imgSrc = p.img ? p.img : fallbackImg;
        const outOfStock = p.outOfStock === true;
        const origPrice = Number(p.price) || 0;
        const salePrice = p.salePrice ? Number(p.salePrice) : 0;
        const hasDiscount = salePrice > 0 && origPrice > salePrice;
        const savings = hasDiscount ? (origPrice - salePrice) : 0;
        const discountPct = hasDiscount ? Math.round((savings / origPrice) * 100) : 0;
        const finalPrice = salePrice > 0 ? salePrice : origPrice;

        container.innerHTML += `
            <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 flex flex-col transition hover:-translate-y-1 hover:shadow-xl group relative">
                <div class="relative h-64 overflow-hidden">
                    <img referrerpolicy="no-referrer" src="${imgSrc}" onerror="this.onerror=null;this.src='${fallbackImg}';" class="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105 ${outOfStock ? 'opacity-50 grayscale' : ''}" alt="${p.name}">
                    
                    ${hasDiscount ? `
                        <span class="absolute top-3 left-3 bg-red-600 text-white text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1 z-10">
                            <i class="fas fa-tag text-[9px]"></i> SAVE ₹${savings} (${discountPct}% OFF)
                        </span>
                    ` : ''}

                    ${p.custom ? `
                        <span class="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-sm text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 z-10">
                            <i class="fas fa-magic"></i> Customizable
                        </span>
                    ` : ''}
                                        
                    <button class="wishlist-btn absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow hover:bg-white transition z-10" data-id="${p.id}" onclick="toggleWishlistProduct('${p.id}'); event.stopPropagation();">
                        <i class="far fa-heart text-gray-400"></i>
                    </button>
                </div>
                <div class="p-5 flex flex-col flex-grow">
                    <span class="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-1">${p.category || 'Gift'}</span>
                    <h3 class="text-gray-900 dark:text-gray-100 font-bold text-base mb-2 group-hover:text-primary transition line-clamp-2">${p.name}</h3>
                    <div class="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div class="flex flex-col">
                            <div class="flex items-baseline gap-2">
                                <span class="text-primary font-black text-xl">₹${finalPrice}</span>
                                ${hasDiscount ? `<span class="text-xs text-gray-400 line-through">₹${origPrice}</span>` : ''}
                            </div>
                            ${hasDiscount ? `<span class="text-[10px] text-green-600 dark:text-green-400 font-bold">Save ₹${savings}</span>` : ''}
                        </div>
                        ${outOfStock
                            ? '<span class="text-red-400 font-semibold text-xs px-3 py-2 border border-red-200 rounded-md bg-red-50">Unavailable</span>'
                            : `<button class="bg-[#d14b8a] hover:bg-primary-dark text-white px-4 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-colors shadow-sm flex items-center gap-1.5" onclick="openProductModal('${p.id}')"><i class="fas fa-shopping-bag"></i> Add to Cart</button>`
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
function closeProfileModal() {
    const prof = document.getElementById('profile-modal');
    if (prof) prof.classList.add('hidden');
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.add('hidden');
    document.body.style.overflow = '';
}

function closeAllModals() {
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.add('hidden');

    const modalIds = [
        'profile-modal',
        'product-modal',
        'admin-login-modal',
        'review-modal',
        'ai-modal',
        'bulk-edit-modal'
    ];
    modalIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    document.body.classList.remove('overflow-hidden');

    const cartDrawer = document.getElementById('cart-drawer');
    if (cartDrawer) {
        cartDrawer.style.transform = 'translateX(100%)';
        setTimeout(() => cartDrawer.classList.add('hidden'), 300);
    }

    const wishlistDrawer = document.getElementById('wishlist-drawer');
    if (wishlistDrawer) {
        wishlistDrawer.classList.add('translate-x-full');
        setTimeout(() => wishlistDrawer.classList.add('hidden'), 300);
    }

    document.body.style.overflow = '';
}

// Global escape key to close any open modal
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
});

function openProductModal(id) {
    activeProduct = products.find(p => p.id === id);
    if (!activeProduct) return;
    initMagicMugSimulator();
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
    
    // Reset photo filter controls
    const photoControls = document.getElementById('photo-edit-controls');
    if (photoControls) photoControls.classList.add('hidden');
    const overlay = document.getElementById('preview-overlay');
    if (overlay) {
        overlay.style.filter = 'none';
        overlay.style.objectFit = 'cover';
        overlay.style.transform = 'none';
    }
    activeCustomFilter = 'Original';
    activePhotoRotation = 0;
    activePhotoFit = 'cover';

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
        if (appliedCoupon.type === 'flat') {
            finalDiscount = Math.min(total, appliedCoupon.flat || 0);
        } else {
            finalDiscount = Math.round(total * ((appliedCoupon.pct || 0) / 100));
        }
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
function formatWAOrder(items, total, orderId = null) {
    let msg = `Hello ${settings.name} 👋\nI want to place an order:\n\n`;
    if (orderId) {
        msg += `🧾 *Order ID:* ${orderId}\n\n`;
    }
    items.forEach(i => {
        if (i.isCombo && i.comboDetails && i.comboDetails.items) {
            msg += `🎁 *COMBO OFFER: ${i.name}*\n`;
            msg += `💰 *Combo Price:* ₹${i.price} (Saved ₹${i.comboDetails.discount || 0})\n`;
            if (i.custom && i.custom !== 'None') {
                msg += `📝 *Notes:* ${i.custom}\n`;
            }
            msg += `📦 *Included Items:*\n`;
            i.comboDetails.items.forEach(it => {
                msg += `   • ${it.name} (Qty ${it.qty})${it.note ? ` - Note: "${it.note}"` : ''}\n`;
            });
            msg += `\n`;
        } else {
            msg += `📦 *${i.name}*\nPrice: ₹${i.price}\nCustomization: ${i.custom || 'None'}\n\n`;
        }
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
        const discLabel = appliedCoupon.type === 'flat' ? `₹${appliedCoupon.flat} off` : `${appliedCoupon.pct}% off`;
        msg += `🏷️ *Coupon Applied:* ${appliedCoupon.code} (${discLabel})\n\n`;
    } else if (volDiscountPct > 0 && items.length > 1) { // Cart multiple items
        msg += `🏷️ *Volume Discount:* ${volDiscountPct}% off\n\n`;
    }
    
    if (total) msg += `*Total: ₹${total}*\n\n`;
    if (orderId) {
        const billUrl = `${window.location.origin}/?bill=${orderId}`;
        msg += `🧾 *Your Official Bill Link:* ${billUrl}\n`;
        msg += `🔍 Track status anytime on our site with Order ID: *${orderId}*\n\n`;
    }
    msg += `Please confirm my order.`;
    return encodeURIComponent(msg);
}

function orderSingleProductWA() {
    const customName = document.getElementById('custom-name') ? document.getElementById('custom-name').value : '';
    const customNotes = document.getElementById('custom-notes') ? document.getElementById('custom-notes').value : '';
    const customText = [customName, customNotes].filter(v => v.trim()).join(' | ') || 'None';
    if (activeCustomFilter && activeCustomFilter !== 'Original') {
        customNotes += (customNotes ? ' | ' : '') + 'Photo Filter: ' + activeCustomFilter;
    }
    let price = activeProduct.salePrice || activeProduct.price;
    const itemName = activeProduct.name + (selectedVariant ? ` (${selectedVariant})` : '') + (productQuantity > 1 ? ` x${productQuantity}` : '');
    let total = price * productQuantity;
    let couponLabel = '';
    if (appliedCoupon) {
        const disc = appliedCoupon.type === 'flat' ? Math.min(total, appliedCoupon.flat || 0) : Math.round(total * ((appliedCoupon.pct || 0) / 100));
        total = Math.max(0, total - disc);
        couponLabel = appliedCoupon.type === 'flat' ? `₹${appliedCoupon.flat} off` : `${appliedCoupon.pct}% off`;
    }
    const item = { name: itemName, price: total, custom: customText + (appliedCoupon ? ` | Coupon: ${appliedCoupon.code} (${couponLabel})` : '') };
    // Log order to Firebase and get Order ID
    const orderId = logOrder(item);
    const waUrl = `https://wa.me/${settings.wa}?text=${formatWAOrder([item], total, orderId)}`;
    openUPIPaymentModal(orderId, total, [item], waUrl);
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
        const disc = appliedCoupon.type === 'flat' ? Math.min(total, appliedCoupon.flat || 0) : Math.round(total * ((appliedCoupon.pct || 0) / 100));
        total = Math.max(0, total - disc);
        const discLabel = appliedCoupon.type === 'flat' ? `₹${appliedCoupon.flat} off` : `${appliedCoupon.pct}% off`;
        cartCustom += `Coupon: ${appliedCoupon.code} (${discLabel})`;
    } else if (volDiscountPct > 0) {
        total = Math.round(total * (1 - volDiscountPct / 100));
        cartCustom += `Volume Discount: ${volDiscountPct}% off`;
    }

    const itemStr = cart.map(c => c.name).join(', ');
    const orderItemsCopy = [...cart];
    const orderId = logOrder({ name: 'Cart Order: ' + itemStr.substring(0, 50) + (itemStr.length > 50 ? '...' : ''), price: total, custom: cartCustom.trim(), items: orderItemsCopy });
    const waUrl = `https://wa.me/${settings.wa}?text=${formatWAOrder(orderItemsCopy, total, orderId)}`;

    // ── CLEAR CART IMMEDIATELY AFTER ORDER PLACEMENT ──
    cart = [];
    localStorage.removeItem('lh_cart');
    renderCart();
    const cartDrawer = document.getElementById('cart-drawer');
    if (cartDrawer) cartDrawer.classList.add('translate-x-full');
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.add('hidden');

    openUPIPaymentModal(orderId, total, orderItemsCopy, waUrl);
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
        showAdminSection('dashboard');
    } else {
        alert('Incorrect password');
    }
}

function loginAdminWithGoogle() {
    if (window.location.protocol === 'file:') {
        alert('Google Sign-In requires a web server (http:// or https://).\n\nPlease log in using your Admin Password below, or launch start_server.bat in your project folder.');
        return;
    }
    auth.signInWithPopup(googleProvider).then(result => {
        const user = result.user;
        const email = user && user.email ? user.email.toLowerCase().trim() : '';
        const allowed = (settings.adminEmails || '')
            .split(',')
            .map(e => e.trim().toLowerCase())
            .filter(Boolean);

        // If no admin emails registered yet in settings:
        if (allowed.length === 0) {
            const pass = prompt(`Welcome ${user.displayName || email}!\n\nNo Admin Gmail has been linked yet.\nEnter your current Admin Password to link "${email}" as your Admin Gmail:`);
            if (pass === settings.adminPass) {
                settings.adminEmails = email;
                saveData();
                closeAllModals();
                document.getElementById('admin-view').classList.remove('hidden');
                document.getElementById('customer-view').classList.add('hidden');
                showAdminSection('dashboard');
                alert(`Success! "${email}" is now saved as your Admin Gmail. In the future, you can log in with one click!`);
            } else if (pass !== null) {
                alert('Incorrect password. Could not authorize this Gmail.');
            }
            return;
        }

        // If registered:
        if (allowed.includes(email)) {
            closeAllModals();
            document.getElementById('admin-view').classList.remove('hidden');
            document.getElementById('customer-view').classList.add('hidden');
            showAdminSection('dashboard');
        } else {
            alert(`Access Denied: "${email}" is not listed as an authorized Admin Gmail.\n\nTo authorize this email, log in with password first and add it in Admin Settings > Security.`);
        }
    }).catch(err => {
        if (err.code === 'auth/unauthorized-domain') {
            alert(`Domain Not Authorized in Firebase!\n\nThe domain "${window.location.hostname}" is not added to Firebase Authorized Domains yet.\n\nTo fix this:\n1. Go to Firebase Console > Authentication > Settings\n2. Scroll to "Authorized domains"\n3. Click "Add domain" and enter: ${window.location.hostname}\n\nTip: You can still log in using your Admin Password below!`);
        } else if (err.code === 'auth/operation-not-allowed') {
            alert('Google Sign-In is not enabled yet in your Firebase Console.\n\nPlease enable Google in Firebase Console > Authentication > Sign-in method.');
        } else if (err.code !== 'auth/popup-closed-by-user') {
            alert('Admin Google Login failed: ' + err.message);
        }
    });
}

function openAdminFromProfile() {
    closeAllModals();
    document.getElementById('admin-view').classList.remove('hidden');
    document.getElementById('customer-view').classList.add('hidden');
    showAdminSection('dashboard');
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


// ═════════════════════════════════════════════════════════════════════════════
// ── BILL TEMPLATE & VISUAL LAYOUT DESIGNER ──────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

const DEFAULT_BILL_LAYOUT = {
    templateUrl: 'bill-template.jpg',
    name: { top: 308, left: 154, size: 13 },
    phone: { top: 334, left: 154, size: 13 },
    address: { top: 362, left: 142, size: 11.5 },
    billNo: { top: 333, left: 495, size: 13 },
    date: { top: 359, left: 495, size: 12.5 },
    itemsStartY: 468,
    itemsRowHeight: 23,
    qr: { top: 616, left: 288, size: 88 },
    subtotal: { top: 602, left: 548, size: 12.5 },
    discount: { top: 632, left: 548, size: 12.5 },
    due: { top: 663, left: 548, size: 12.5 },
    grandTotal: { top: 692, left: 548, size: 13 }
};

let currentBillLayout = null;
let currentDesignerZoom = 0.85;
let designerDraggingElement = null;
let designerDragStartX = 0;
let designerDragStartY = 0;
let designerElemStartLeft = 0;
let designerElemStartTop = 0;

function getActiveBillLayout() {
    let layout = {};
    if (settings && settings.billLayout && typeof settings.billLayout === 'object') {
        layout = JSON.parse(JSON.stringify(settings.billLayout));
    }
    for (const key in DEFAULT_BILL_LAYOUT) {
        if (layout[key] === undefined || layout[key] === null) {
            layout[key] = JSON.parse(JSON.stringify(DEFAULT_BILL_LAYOUT[key]));
        } else if (typeof DEFAULT_BILL_LAYOUT[key] === 'object' && !Array.isArray(DEFAULT_BILL_LAYOUT[key])) {
            for (const subKey in DEFAULT_BILL_LAYOUT[key]) {
                if (layout[key][subKey] === undefined) {
                    layout[key][subKey] = DEFAULT_BILL_LAYOUT[key][subKey];
                }
            }
        }
    }
    if (!layout.templateUrl) {
        layout.templateUrl = (settings && settings.billTemplateUrl) || 'bill-template.jpg';
    }
    return layout;
}

function initBillDesigner() {
    currentBillLayout = getActiveBillLayout();
    const activeUrl = currentBillLayout.templateUrl || (settings && settings.billTemplateUrl) || 'bill-template.jpg';

    const badge = document.getElementById('template-status-badge');
    const bgImg = document.getElementById('designer-bg-img');
    const urlInput = document.getElementById('designer-template-url');

    if (bgImg) bgImg.src = activeUrl;
    if (urlInput) urlInput.value = (activeUrl && activeUrl !== 'bill-template.jpg' && !activeUrl.startsWith('data:')) ? activeUrl : '';
    
    if (badge) {
        if (activeUrl && activeUrl !== 'bill-template.jpg') {
            badge.textContent = activeUrl.startsWith('data:') ? 'Custom Uploaded Template' : 'Custom Template Active';
            badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
        } else {
            badge.textContent = 'Default Template';
            badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
        }
    }

    renderDesignerState();
    setupDesignerDragAndDrop();
}

function renderDesignerState() {
    if (!currentBillLayout) currentBillLayout = getActiveBillLayout();
    const L = currentBillLayout;

    const setChipAndInput = (fieldKey, chipId, inputLeftId, inputTopId) => {
        const item = L[fieldKey];
        if (!item) return;
        const chip = document.getElementById(chipId);
        const inpL = document.getElementById(inputLeftId);
        const inpT = document.getElementById(inputTopId);
        if (inpL) inpL.value = Math.round(item.left);
        if (inpT) inpT.value = Math.round(item.top);
        if (chip) {
            chip.style.left = item.left + 'px';
            chip.style.top = item.top + 'px';
        }
    };

    setChipAndInput('name', 'df-name', 'inp-name-left', 'inp-name-top');
    setChipAndInput('phone', 'df-phone', 'inp-phone-left', 'inp-phone-top');
    setChipAndInput('address', 'df-address', 'inp-address-left', 'inp-address-top');
    setChipAndInput('billNo', 'df-billno', 'inp-billNo-left', 'inp-billNo-top');
    setChipAndInput('date', 'df-date', 'inp-date-left', 'inp-date-top');
    setChipAndInput('subtotal', 'df-subtotal', 'inp-subtotal-left', 'inp-subtotal-top');
    setChipAndInput('discount', 'df-discount', 'inp-discount-left', 'inp-discount-top');
    setChipAndInput('due', 'df-due', 'inp-due-left', 'inp-due-top');
    setChipAndInput('grandTotal', 'df-grandtotal', 'inp-grandTotal-left', 'inp-grandTotal-top');

    // QR Code
    const chipQr = document.getElementById('df-qr');
    const inpQrL = document.getElementById('inp-qr-left');
    const inpQrT = document.getElementById('inp-qr-top');
    const inpQrS = document.getElementById('inp-qr-size');
    if (inpQrL) inpQrL.value = Math.round(L.qr.left);
    if (inpQrT) inpQrT.value = Math.round(L.qr.top);
    if (inpQrS) inpQrS.value = Math.round(L.qr.size || 88);
    if (chipQr) {
        chipQr.style.left = L.qr.left + 'px';
        chipQr.style.top = L.qr.top + 'px';
        chipQr.style.width = (L.qr.size || 88) + 'px';
        chipQr.style.height = (L.qr.size || 88) + 'px';
    }

    // Products Table start Y & row height
    const chipItems = document.getElementById('df-items');
    const inpTableY = document.getElementById('inp-table-starty');
    const inpTableH = document.getElementById('inp-table-rowh');
    if (inpTableY) inpTableY.value = Math.round(L.itemsStartY);
    if (inpTableH) inpTableH.value = Math.round(L.itemsRowHeight);
    if (chipItems) {
        chipItems.style.top = L.itemsStartY + 'px';
    }
}

function setupDesignerDragAndDrop() {
    const canvas = document.getElementById('designer-canvas');
    if (!canvas || canvas.dataset.dragInitialized === 'true') return;
    canvas.dataset.dragInitialized = 'true';

    // File Drag & Drop on Canvas to upload new template graphic
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        canvas.classList.add('ring-4', 'ring-emerald-500');
    });
    canvas.addEventListener('dragleave', (e) => {
        e.preventDefault();
        canvas.classList.remove('ring-4', 'ring-emerald-500');
    });
    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        canvas.classList.remove('ring-4', 'ring-emerald-500');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadBillTemplateFile({ target: { files: e.dataTransfer.files } });
        }
    });

    const draggables = canvas.querySelectorAll('.designer-draggable');

    draggables.forEach(elem => {
        elem.addEventListener('mousedown', startDrag);
        elem.addEventListener('touchstart', startDrag, { passive: false });
    });

    function startDrag(e) {
        e.preventDefault();
        designerDraggingElement = this;
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        designerDragStartX = clientX;
        designerDragStartY = clientY;
        designerElemStartLeft = parseFloat(this.style.left) || 0;
        designerElemStartTop = parseFloat(this.style.top) || 0;

        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('touchend', endDrag);
        this.classList.add('opacity-90', 'scale-[1.02]', 'cursor-grabbing');
    }

    function onDragMove(e) {
        if (!designerDraggingElement) return;
        e.preventDefault();
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const deltaX = (clientX - designerDragStartX) / currentDesignerZoom;
        const deltaY = (clientY - designerDragStartY) / currentDesignerZoom;

        const elemWidth = designerDraggingElement.offsetWidth || 50;
        const elemHeight = designerDraggingElement.offsetHeight || 20;

        let newLeft = Math.round(Math.max(0, Math.min(658 - elemWidth, designerElemStartLeft + deltaX)));
        let newTop = Math.round(Math.max(0, Math.min(876 - elemHeight, designerElemStartTop + deltaY)));

        if (designerDraggingElement.id === 'df-items') {
            newLeft = 88;
        }

        designerDraggingElement.style.left = newLeft + 'px';
        designerDraggingElement.style.top = newTop + 'px';

        const fieldKeyMap = {
            'df-name': 'name',
            'df-phone': 'phone',
            'df-address': 'address',
            'df-billno': 'billNo',
            'df-date': 'date',
            'df-items': 'items',
            'df-qr': 'qr',
            'df-subtotal': 'subtotal',
            'df-discount': 'discount',
            'df-due': 'due',
            'df-grandtotal': 'grandTotal'
        };

        const fieldKey = fieldKeyMap[designerDraggingElement.id];
        if (fieldKey && currentBillLayout) {
            if (fieldKey === 'items') {
                currentBillLayout.itemsStartY = newTop;
                const inpTableY = document.getElementById('inp-table-starty');
                if (inpTableY) inpTableY.value = newTop;
            } else if (currentBillLayout[fieldKey]) {
                currentBillLayout[fieldKey].left = newLeft;
                currentBillLayout[fieldKey].top = newTop;
                const inpL = document.getElementById('inp-' + fieldKey + '-left');
                const inpT = document.getElementById('inp-' + fieldKey + '-top');
                if (inpL) inpL.value = newLeft;
                if (inpT) inpT.value = newTop;
            }
        }
    }

    function endDrag() {
        if (designerDraggingElement) {
            designerDraggingElement.classList.remove('opacity-90', 'scale-[1.02]', 'cursor-grabbing');
            designerDraggingElement = null;
        }
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', onDragMove);
        document.removeEventListener('touchend', endDrag);
    }
}

function syncFieldFromInput(field, prop) {
    if (!currentBillLayout) currentBillLayout = getActiveBillLayout();
    const inp = document.getElementById('inp-' + field + '-' + prop);
    if (!inp) return;
    const val = parseInt(inp.value, 10) || 0;
    if (currentBillLayout[field]) {
        currentBillLayout[field][prop] = val;
    }
    const chipMap = {
        name: 'df-name', phone: 'df-phone', address: 'df-address',
        billNo: 'df-billno', date: 'df-date', subtotal: 'df-subtotal',
        discount: 'df-discount', due: 'df-due', grandTotal: 'df-grandtotal',
        qr: 'df-qr'
    };
    const chip = document.getElementById(chipMap[field]);
    if (chip) {
        chip.style[prop] = val + 'px';
    }
}

function nudgeField(field, prop, delta) {
    const inp = document.getElementById('inp-' + field + '-' + prop);
    if (!inp) return;
    const val = (parseInt(inp.value, 10) || 0) + delta;
    inp.value = val;
    syncFieldFromInput(field, prop);
}

function syncQrSizeFromInput() {
    if (!currentBillLayout) currentBillLayout = getActiveBillLayout();
    const inp = document.getElementById('inp-qr-size');
    if (!inp) return;
    const val = parseInt(inp.value, 10) || 88;
    currentBillLayout.qr.size = val;
    const chip = document.getElementById('df-qr');
    if (chip) {
        chip.style.width = val + 'px';
        chip.style.height = val + 'px';
    }
}

function syncTableRowsFromInput() {
    if (!currentBillLayout) currentBillLayout = getActiveBillLayout();
    const inpY = document.getElementById('inp-table-starty');
    const inpH = document.getElementById('inp-table-rowh');
    if (inpY) {
        const y = parseInt(inpY.value, 10) || 468;
        currentBillLayout.itemsStartY = y;
        const chip = document.getElementById('df-items');
        if (chip) chip.style.top = y + 'px';
    }
    if (inpH) {
        currentBillLayout.itemsRowHeight = parseInt(inpH.value, 10) || 23;
    }
}

function setDesignerZoom(scale) {
    currentDesignerZoom = scale;
    const wrapper = document.getElementById('designer-canvas-wrapper');
    if (wrapper) {
        wrapper.style.transform = 'scale(' + scale + ')';
    }
}


function convertDriveLink(url) {
    if (!url || typeof url !== 'string') return '';
    url = url.trim();
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                       url.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                       url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
        const fileId = driveMatch[1];
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
    }
    return url;
}

function uploadBillTemplateFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, WebP).');
        if (e.target) e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const rawDataUrl = event.target.result;
        
        // Optimize and resize image using an off-screen canvas to high-res template size (1316x1752, 2x of 658x876)
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = 1316;
            canvas.height = 1752;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

            // Update state
            if (!currentBillLayout) currentBillLayout = getActiveBillLayout();
            currentBillLayout.templateUrl = optimizedDataUrl;

            // Update UI elements
            const bgImg = document.getElementById('designer-bg-img');
            if (bgImg) bgImg.src = optimizedDataUrl;

            const printableBg = document.getElementById('printable-bill-bg');
            if (printableBg) printableBg.src = optimizedDataUrl;

            const badge = document.getElementById('template-status-badge');
            if (badge) {
                badge.textContent = 'Custom Template Active (Saved)';
                badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
            }

            // Auto-save to settings & localStorage & Firebase
            settings.billTemplateUrl = optimizedDataUrl;
            if (!settings.billLayout) settings.billLayout = JSON.parse(JSON.stringify(currentBillLayout));
            settings.billLayout.templateUrl = optimizedDataUrl;
            localStorage.setItem('lh_settings', JSON.stringify(settings));
            saveData();

            // Also persist to local server disk if server is running
            fetch('/api/save-bill-template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64: optimizedDataUrl })
            }).then(r => r.json()).then(data => {
                if (data && data.url) {
                    console.log('Template saved to server disk:', data.url);
                }
            }).catch(() => {});

            alert('✅ Bill template uploaded and saved successfully! You can now adjust text positions on the canvas if needed, and click "Save Bill Layout".');
        };
        img.onerror = function() {
            alert('Failed to process image file. Please choose another image file.');
        };
        img.src = rawDataUrl;

        if (e.target) e.target.value = '';
    };
    reader.readAsDataURL(file);
}

function applyBillTemplateUrlFromUI() {
    const inp = document.getElementById('designer-template-url');
    if (!inp) return;
    const rawUrl = inp.value.trim();
    if (!rawUrl) {
        alert('Please enter or paste an image URL or Google Drive link.');
        return;
    }

    const convertedUrl = convertDriveLink(rawUrl);
    const applyBtn = document.querySelector('button[onclick*="applyBillTemplateUrlFromUI"]');
    const originalBtnText = applyBtn ? applyBtn.innerHTML : 'Apply URL';
    if (applyBtn) {
        applyBtn.disabled = true;
        applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    }

    const testImg = new Image();
    testImg.crossOrigin = 'anonymous';

    testImg.onload = function() {
        if (applyBtn) {
            applyBtn.disabled = false;
            applyBtn.innerHTML = originalBtnText;
        }

        let finalUrl = convertedUrl;
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1316;
            canvas.height = 1752;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(testImg, 0, 0, canvas.width, canvas.height);
            finalUrl = canvas.toDataURL('image/jpeg', 0.88);

            // Also save to server disk
            fetch('/api/save-bill-template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64: finalUrl })
            }).catch(() => {});
        } catch (corsErr) {
            finalUrl = convertedUrl;
        }

        if (!currentBillLayout) currentBillLayout = getActiveBillLayout();
        currentBillLayout.templateUrl = finalUrl;

        const bgImg = document.getElementById('designer-bg-img');
        if (bgImg) bgImg.src = finalUrl;

        const printableBg = document.getElementById('printable-bill-bg');
        if (printableBg) printableBg.src = finalUrl;

        const badge = document.getElementById('template-status-badge');
        if (badge) {
            badge.textContent = 'Custom Template Active (Saved)';
            badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
        }

        // Auto-save to settings
        settings.billTemplateUrl = finalUrl;
        if (!settings.billLayout) settings.billLayout = JSON.parse(JSON.stringify(currentBillLayout));
        settings.billLayout.templateUrl = finalUrl;
        localStorage.setItem('lh_settings', JSON.stringify(settings));
        saveData();

        alert('✅ Template image applied and saved successfully! Text positions can now be adjusted on the canvas.');
    };

    testImg.onerror = function() {
        if (applyBtn) {
            applyBtn.disabled = false;
            applyBtn.innerHTML = originalBtnText;
        }

        const driveMatch = rawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (driveMatch) {
            alert('⚠️ Could not load image from this Google Drive link.\n\nReason: In Google Drive, file sharing must be set to "Anyone with the link can view" (Public).\n\n💡 Quick Fix: Simply click "Upload From Device" and select your template image file directly from your computer or phone!');
        } else {
            alert('⚠️ Failed to load image from the provided URL. Please verify the URL or click "Upload From Device" to upload your file directly.');
        }
    };

    testImg.src = convertedUrl;
}

function useDefaultBillTemplate() {
    if (!currentBillLayout) currentBillLayout = getActiveBillLayout();
    currentBillLayout.templateUrl = 'bill-template.jpg';
    
    const bgImg = document.getElementById('designer-bg-img');
    if (bgImg) bgImg.src = 'bill-template.jpg?v=' + Date.now();

    const printableBg = document.getElementById('printable-bill-bg');
    if (printableBg) printableBg.src = 'bill-template.jpg?v=' + Date.now();

    const urlInput = document.getElementById('designer-template-url');
    if (urlInput) urlInput.value = '';

    const badge = document.getElementById('template-status-badge');
    if (badge) {
        badge.textContent = 'Default Template';
        badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
    }

    settings.billTemplateUrl = 'bill-template.jpg';
    if (settings.billLayout) settings.billLayout.templateUrl = 'bill-template.jpg';
    localStorage.setItem('lh_settings', JSON.stringify(settings));
    saveData();

    fetch('/api/reset-bill-template', { method: 'POST' }).catch(() => {});

    alert('Default bill template restored.');
}
function saveBillDesignerLayout() {
    if (!currentBillLayout) currentBillLayout = getActiveBillLayout();
    settings.billLayout = JSON.parse(JSON.stringify(currentBillLayout));
    settings.billTemplateUrl = currentBillLayout.templateUrl || 'bill-template.jpg';
    
    localStorage.setItem('lh_settings', JSON.stringify(settings));
    saveData();
    applyBillLayoutToPrintableBill();

    alert('✅ Bill Template & Field Layout saved successfully! All generated bills will now use your custom layout and template.');
}

function resetBillDesignerLayout() {
    if (!confirm('Are you sure you want to reset the bill template and all field coordinates back to default?')) return;
    currentBillLayout = JSON.parse(JSON.stringify(DEFAULT_BILL_LAYOUT));
    currentBillLayout.templateUrl = 'bill-template.jpg';
    settings.billLayout = JSON.parse(JSON.stringify(DEFAULT_BILL_LAYOUT));
    settings.billTemplateUrl = 'bill-template.jpg';
    localStorage.setItem('lh_settings', JSON.stringify(settings));
    saveData();
    initBillDesigner();
    alert('Bill layout reset to default.');
}

function testPreviewBillDesigner() {
    if (!currentBillLayout) currentBillLayout = getActiveBillLayout();
    const sampleOrder = {
        id: '#043786',
        date: new Date().toLocaleDateString('en-GB'),
        customer: {
            name: 'ATUL',
            phone: '9935680308',
            address: 'Sultanpur, Sultanpur, Uttar Pradesh - 228151'
        },
        items: [
            { name: 'Photo Frame 8x12', qty: 4, price: 1200 },
            { name: 'Customized Ceramic Mug', qty: 1, price: 300 }
        ],
        price: 1300,
        total: 1300
    };
    renderPrintableBillWithOrder(sampleOrder);
}

function applyBillLayoutToPrintableBill() {
    const layout = getActiveBillLayout();
    const activeUrl = (settings && settings.billTemplateUrl) || layout.templateUrl || 'bill-template.jpg';

    const bgImg = document.getElementById('printable-bill-bg');
    if (bgImg) {
        bgImg.src = activeUrl;
    }

    const applyPos = (elemId, coord) => {
        const el = document.getElementById(elemId);
        if (el && coord) {
            el.style.left = coord.left + 'px';
            el.style.top = coord.top + 'px';
            if (coord.size) el.style.fontSize = coord.size + 'px';
        }
    };

    applyPos('bill-cust-name', layout.name);
    applyPos('bill-cust-phone', layout.phone);
    applyPos('bill-cust-address', layout.address);
    applyPos('bill-no', layout.billNo);
    applyPos('bill-date', layout.date);
    applyPos('bill-subtotal', layout.subtotal);
    applyPos('bill-discount', layout.discount);
    applyPos('bill-due', layout.due);
    applyPos('bill-grand-total', layout.grandTotal);

    const qrWrapper = document.getElementById('bill-qr-wrapper');
    if (qrWrapper && layout.qr) {
        qrWrapper.style.left = layout.qr.left + 'px';
        qrWrapper.style.top = layout.qr.top + 'px';
        const sz = layout.qr.size || 88;
        qrWrapper.style.width = sz + 'px';
        qrWrapper.style.height = sz + 'px';
    }
}

function renderPrintableBillWithOrder(order) {
    if (!order) return;
    const layout = getActiveBillLayout();
    applyBillLayoutToPrintableBill();

    const billNo = document.getElementById('bill-no');
    const billDate = document.getElementById('bill-date');
    const billCustName = document.getElementById('bill-cust-name');
    const billCustPhone = document.getElementById('bill-cust-phone');
    const billCustAddr = document.getElementById('bill-cust-address');
    const itemsContainer = document.getElementById('bill-items-container');
    const billSubtotal = document.getElementById('bill-subtotal');
    const billDiscount = document.getElementById('bill-discount');
    const billDue = document.getElementById('bill-due');
    const billGrand = document.getElementById('bill-grand-total');
    const billQr = document.getElementById('bill-qr-code');

    // 1. Bill No & Date
    const formattedId = order.id ? ('#' + order.id.replace(/^LH-|^ORD-|^#/, '')) : '#043786';
    if (billNo) billNo.textContent = formattedId;

    let dateStr = '';
    if (order.date) {
        dateStr = order.date.includes(',') ? order.date.split(',')[0].trim() : order.date;
    } else {
        dateStr = new Date().toLocaleDateString('en-GB');
    }
    if (billDate) billDate.textContent = dateStr;

    // 2. Customer Name, Mobile & Address
    const visitor = safeJSONParse('lh_visitor', {}) || {};
    const custName = (order.customer && order.customer.name) || (currentUser && currentUser.displayName) || visitor.name || 'CUSTOMER';
    const custPhone = (order.customer && order.customer.phone) || visitor.phone || '9935680308';
    const custAddress = (order.customer && order.customer.address) || visitor.address || 'Sultanpur, Uttar Pradesh';

    if (billCustName) billCustName.textContent = custName.toUpperCase();
    if (billCustPhone) billCustPhone.textContent = custPhone;
    if (billCustAddr) billCustAddr.textContent = custAddress;

    // 3. Products & Prices (Rows 1 to 5)
    const items = order.items && order.items.length ? order.items : [{
        name: order.product || 'Personalized Gift Item',
        price: order.price || order.total || 0,
        qty: order.qty || 1
    }];

    const startY = layout.itemsStartY || 468;
    const rowH = layout.itemsRowHeight || 23;
    let subtotal = 0;

    if (itemsContainer) {
        itemsContainer.innerHTML = '';
        items.slice(0, 5).forEach((it, index) => {
            const qty = Number(it.quantity || it.qty || 1);
            const totalItemPrice = Number(it.price) || 0;
            const unitRate = Math.round(totalItemPrice / qty);
            subtotal += totalItemPrice;
            const rowTop = startY + index * rowH;

            itemsContainer.innerHTML += `
                <div class="absolute text-[#111827] text-[12px] font-extrabold truncate" style="top: ${rowTop}px; left: 88px; width: 295px;">${it.name}</div>
                <div class="absolute text-center text-gray-900 text-[12px] font-bold" style="top: ${rowTop}px; left: 392px; width: 45px;">${qty}</div>
                <div class="absolute text-right text-gray-800 text-[12px] font-semibold" style="top: ${rowTop}px; left: 445px; width: 68px;">${unitRate.toFixed(2)}</div>
                <div class="absolute text-right text-[#111827] text-[12px] font-black" style="top: ${rowTop}px; left: 525px; width: 93px;">${totalItemPrice.toFixed(2)}</div>
            `;
        });
    }

    // 4. Sub Total, Discount & Grand Total
    const finalTotal = Number(order.price || order.total || subtotal);
    const discount = subtotal > finalTotal ? (subtotal - finalTotal) : 0;

    if (billSubtotal) billSubtotal.textContent = subtotal.toFixed(2);
    if (billDiscount) billDiscount.textContent = discount > 0 ? discount.toFixed(2) : '0.00';
    if (billDue) billDue.textContent = '0.00';
    if (billGrand) billGrand.textContent = finalTotal.toFixed(2);

    // 5. Payment UPI QR Code
    if (billQr) {
        const upiId = (settings.upiId || '8726195000@okbizaxis').trim();
        const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=Lamination%20Hub&am=${finalTotal}&cu=INR&tn=${encodeURIComponent('Bill ' + formattedId)}`;
        billQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;
    }

    const modal = document.getElementById('receipt-modal');
    if (modal) modal.classList.remove('hidden');
}



// ═════════════════════════════════════════════════════════════════════════════
// ── ✦ NEW LAUNCH SPOTLIGHT ROW & PRODUCT VISIBILITY ──────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

let currentSpotlightIndex = 0;
let adminProductVisibilityFilter = 'all';

function getNewLaunchProducts() {
    const active = products.filter(p => p.newLaunch && !p.hidden);
    if (active.length > 0) return active;
    const visible = products.filter(p => !p.hidden);
    return visible.length > 0 ? [visible[visible.length - 1]] : [];
}

function renderNewLaunchSpotlight() {
    const section = document.getElementById('new-launch-spotlight');
    if (!section) return;

    const launches = getNewLaunchProducts();
    if (launches.length === 0) {
        section.classList.add('hidden');
        return;
    }
    section.classList.remove('hidden');

    if (currentSpotlightIndex >= launches.length) currentSpotlightIndex = 0;
    if (currentSpotlightIndex < 0) currentSpotlightIndex = launches.length - 1;

    const p = launches[currentSpotlightIndex];
    if (!p) return;

    const imgEl = document.getElementById('spotlight-img');
    const titleEl = document.getElementById('spotlight-title');
    const priceEl = document.getElementById('spotlight-price');
    const origPriceEl = document.getElementById('spotlight-orig-price');
    const discountEl = document.getElementById('spotlight-discount');
    const badgeEl = document.getElementById('spotlight-badge');
    const counterEl = document.getElementById('spotlight-counter');

    const origPrice = Number(p.price) || 0;
    const salePrice = p.salePrice ? Number(p.salePrice) : 0;
    const hasDiscount = salePrice > 0 && origPrice > salePrice;
    const savings = hasDiscount ? (origPrice - salePrice) : 0;
    const discountPct = hasDiscount ? Math.round((savings / origPrice) * 100) : 0;
    const finalPrice = salePrice > 0 ? salePrice : origPrice;

    if (imgEl) {
        imgEl.src = p.img || 'https://placehold.co/300x300/e44c89/white?text=New+Launch';
        imgEl.alt = p.name;
    }
    if (titleEl) titleEl.textContent = p.name;
    if (priceEl) priceEl.textContent = `₹${finalPrice}`;
    if (origPriceEl) {
        if (hasDiscount) {
            origPriceEl.textContent = `₹${origPrice}`;
            origPriceEl.classList.remove('hidden');
        } else {
            origPriceEl.classList.add('hidden');
        }
    }
    if (discountEl) {
        if (hasDiscount) {
            discountEl.textContent = `(${discountPct}% OFF)`;
            discountEl.classList.remove('hidden');
        } else {
            discountEl.classList.add('hidden');
        }
    }
    if (badgeEl) {
        badgeEl.textContent = p.category ? `NEW ${p.category.toUpperCase()} RELEASE` : 'RELEASE NOW';
    }
    if (counterEl) {
        counterEl.textContent = `${currentSpotlightIndex + 1} / ${launches.length}`;
    }
}

function nextSpotlightItem() {
    const launches = getNewLaunchProducts();
    if (launches.length <= 1) return;
    currentSpotlightIndex = (currentSpotlightIndex + 1) % launches.length;
    renderNewLaunchSpotlight();
}

function prevSpotlightItem() {
    const launches = getNewLaunchProducts();
    if (launches.length <= 1) return;
    currentSpotlightIndex = (currentSpotlightIndex - 1 + launches.length) % launches.length;
    renderNewLaunchSpotlight();
}

function onSpotlightShopClick() {
    const launches = getNewLaunchProducts();
    const p = launches[currentSpotlightIndex];
    if (p) {
        openProductModal(p.id);
    } else {
        const el = document.getElementById('products-container') || document.getElementById('products');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleProductVisibility(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    p.hidden = !p.hidden;
    saveData();
    renderAdminProducts();
    renderProducts();
    renderNewLaunchSpotlight();
}

function toggleProductNewLaunch(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    p.newLaunch = !p.newLaunch;
    saveData();
    renderAdminProducts();
    renderNewLaunchSpotlight();
}

function filterAdminProductsByVisibility() {
    const sel = document.getElementById('admin-product-filter-vis');
    if (sel) adminProductVisibilityFilter = sel.value;
    renderAdminProducts();
}


// ═════════════════════════════════════════════════════════════════════════════
// ── 📢 PROMOTIONAL POPUP BANNER & LAUNCH OFFER MANAGER ──────────────────────
// ═════════════════════════════════════════════════════════════════════════════

const DEFAULT_PROMO_POPUP = {
    enabled: true,
    badge: "✦ SPECIAL LAUNCH OFFER ✦",
    title: "🔥 Special Launch Offer: Flat 15% OFF!",
    subtitle: "Explore our brand new personalized gift collection with fast Sultanpur delivery and complimentary greeting notes!",
    bannerUrl: "",
    productId: "",
    couponCode: "LAUNCH15",
    btnText: "Claim Offer & Shop Now",
    frequency: "session"
};

function getActivePromoPopup() {
    if (settings && settings.promoPopup && typeof settings.promoPopup === 'object') {
        return Object.assign({}, DEFAULT_PROMO_POPUP, settings.promoPopup);
    }
    return Object.assign({}, DEFAULT_PROMO_POPUP);
}

function loadPromoPopupAdminInputs() {
    const cfg = getActivePromoPopup();
    
    const enEl = document.getElementById('set-promo-enabled');
    const badgeEl = document.getElementById('set-promo-badge');
    const titleEl = document.getElementById('set-promo-title');
    const subEl = document.getElementById('set-promo-subtitle');
    const imgEl = document.getElementById('set-promo-img');
    const prodSelect = document.getElementById('set-promo-product');
    const coupEl = document.getElementById('set-promo-coupon');
    const btnEl = document.getElementById('set-promo-btntext');
    const freqEl = document.getElementById('set-promo-freq');

    if (enEl) enEl.checked = cfg.enabled === true;
    if (badgeEl) badgeEl.value = cfg.badge || '';
    if (titleEl) titleEl.value = cfg.title || '';
    if (subEl) subEl.value = cfg.subtitle || '';
    if (imgEl) imgEl.value = cfg.bannerUrl || '';
    if (coupEl) coupEl.value = cfg.couponCode || '';
    if (btnEl) btnEl.value = cfg.btnText || '';
    if (freqEl) freqEl.value = cfg.frequency || 'session';

    // Populate Products Dropdown
    if (prodSelect) {
        prodSelect.innerHTML = '<option value="">-- No specific product (General Store Offer) --</option>';
        products.forEach(p => {
            const isSel = (p.id === cfg.productId) ? 'selected' : '';
            prodSelect.innerHTML += `<option value="${p.id}" ${isSel}>${p.name} (₹${p.salePrice || p.price})${p.hidden ? ' [Hidden]' : ''}</option>`;
        });
    }

    updatePromoAdminImgPreview();
}

function updatePromoAdminImgPreview() {
    const imgInp = document.getElementById('set-promo-img');
    const previewImg = document.getElementById('promo-admin-preview-img');
    const noImgText = document.getElementById('promo-no-img-text');
    if (!imgInp || !previewImg || !noImgText) return;

    const url = imgInp.value.trim();
    if (url) {
        previewImg.src = url;
        previewImg.classList.remove('hidden');
        noImgText.classList.add('hidden');
    } else {
        previewImg.classList.add('hidden');
        noImgText.classList.remove('hidden');
    }
}

function uploadPromoBannerFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, WebP).');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const rawDataUrl = event.target.result;
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 450;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 800, 450);
            const optimized = canvas.toDataURL('image/jpeg', 0.85);

            document.getElementById('set-promo-img').value = optimized;
            updatePromoAdminImgPreview();
            alert('Banner graphic loaded and optimized! Remember to click "Save Popup Settings".');
        };
        img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
}

function savePromoPopupSettings() {
    const rawImg = document.getElementById('set-promo-img').value.trim();
    const convertedImg = typeof convertDriveLink === 'function' ? convertDriveLink(rawImg) : rawImg;

    settings.promoPopup = {
        enabled: document.getElementById('set-promo-enabled').checked,
        badge: document.getElementById('set-promo-badge').value.trim() || '✦ SPECIAL LAUNCH OFFER ✦',
        title: document.getElementById('set-promo-title').value.trim() || 'New Launch Special Offer!',
        subtitle: document.getElementById('set-promo-subtitle').value.trim(),
        bannerUrl: convertedImg,
        productId: document.getElementById('set-promo-product').value,
        couponCode: document.getElementById('set-promo-coupon').value.trim(),
        btnText: document.getElementById('set-promo-btntext').value.trim() || 'Claim Offer & Shop Now',
        frequency: document.getElementById('set-promo-freq').value || 'session'
    };

    localStorage.setItem('lh_settings', JSON.stringify(settings));
    saveData();
    alert('✅ Promotional Popup Banner settings saved successfully!');
}

function previewPromoPopupAdmin() {
    const tempCfg = {
        enabled: true,
        badge: document.getElementById('set-promo-badge').value.trim() || '✦ SPECIAL LAUNCH OFFER ✦',
        title: document.getElementById('set-promo-title').value.trim() || 'New Launch Special Offer!',
        subtitle: document.getElementById('set-promo-subtitle').value.trim() || 'Explore our exclusive new release with special discounts!',
        bannerUrl: document.getElementById('set-promo-img').value.trim(),
        productId: document.getElementById('set-promo-product').value,
        couponCode: document.getElementById('set-promo-coupon').value.trim(),
        btnText: document.getElementById('set-promo-btntext').value.trim() || 'Claim Offer & Shop Now',
        frequency: 'always'
    };
    showPromoPopupModal(true, tempCfg);
}

function checkAndShowPromoPopup() {
    const cfg = getActivePromoPopup();
    if (!cfg.enabled) return;

    if (cfg.frequency === 'session' && sessionStorage.getItem('lh_promo_closed') === 'true') {
        return;
    }
    if (localStorage.getItem('lh_promo_dont_show_today') === new Date().toDateString()) {
        return;
    }

    setTimeout(() => {
        const visModal = document.getElementById('visitor-modal');
        if (visModal && !visModal.classList.contains('hidden')) {
            setTimeout(checkAndShowPromoPopup, 3000);
            return;
        }
        showPromoPopupModal(false);
    }, 2200);
}

function showPromoPopupModal(forcePreview = false, customCfg = null) {
    const cfg = customCfg || getActivePromoPopup();
    const modal = document.getElementById('promo-banner-modal');
    if (!modal) return;

    const badgeEl = document.getElementById('promo-badge-text');
    const titleEl = document.getElementById('promo-title-text');
    const subEl = document.getElementById('promo-subtitle-text');
    const btnLabelEl = document.getElementById('promo-btn-label');

    if (badgeEl) badgeEl.textContent = cfg.badge || '✦ SPECIAL OFFER ✦';
    if (titleEl) titleEl.textContent = cfg.title || 'Special Offer!';
    if (subEl) subEl.textContent = cfg.subtitle || '';
    if (btnLabelEl) btnLabelEl.textContent = cfg.btnText || 'Claim Offer & Shop Now';

    const imgBox = document.getElementById('promo-banner-img-box');
    const imgEl = document.getElementById('promo-banner-img');
    if (cfg.bannerUrl && imgBox && imgEl) {
        imgEl.src = cfg.bannerUrl;
        imgBox.classList.remove('hidden');
    } else if (imgBox) {
        imgBox.classList.add('hidden');
    }

    const prodBox = document.getElementById('promo-product-box');
    if (cfg.productId) {
        const p = products.find(x => x.id === cfg.productId);
        if (p && prodBox) {
            document.getElementById('promo-prod-img').src = p.img || 'https://placehold.co/100x100/e44c89/white?text=Gift';
            document.getElementById('promo-prod-name').textContent = p.name;
            const finalP = p.salePrice || p.price;
            document.getElementById('promo-prod-price').textContent = `₹${finalP}`;
            const origP = document.getElementById('promo-prod-orig');
            if (p.salePrice && p.price > p.salePrice) {
                origP.textContent = `₹${p.price}`;
                origP.classList.remove('hidden');
            } else {
                origP.classList.add('hidden');
            }
            prodBox.classList.remove('hidden');
        } else if (prodBox) {
            prodBox.classList.add('hidden');
        }
    } else if (prodBox) {
        prodBox.classList.add('hidden');
    }

    const couponBox = document.getElementById('promo-coupon-box');
    const couponCodeEl = document.getElementById('promo-coupon-code');
    if (cfg.couponCode && couponBox && couponCodeEl) {
        couponCodeEl.textContent = cfg.couponCode;
        couponBox.classList.remove('hidden');
    } else if (couponBox) {
        couponBox.classList.add('hidden');
    }

    modal.classList.remove('hidden');
}

function closePromoPopupModal(dontShowAgain = false) {
    const modal = document.getElementById('promo-banner-modal');
    if (modal) modal.classList.add('hidden');
    sessionStorage.setItem('lh_promo_closed', 'true');
    if (dontShowAgain) {
        localStorage.setItem('lh_promo_dont_show_today', new Date().toDateString());
    }
}

function onPromoPopupActionClick() {
    const cfg = getActivePromoPopup();
    closePromoPopupModal();

    if (cfg.couponCode) {
        try {
            navigator.clipboard.writeText(cfg.couponCode);
        } catch(e) {}
    }

    if (cfg.productId) {
        const p = products.find(x => x.id === cfg.productId);
        if (p) {
            openProductModal(p.id);
            return;
        }
    }

    const el = document.getElementById('products-container') || document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function copyPromoCouponCode() {
    const cfg = getActivePromoPopup();
    if (cfg.couponCode) {
        navigator.clipboard.writeText(cfg.couponCode);
        alert(`Coupon code "${cfg.couponCode}" copied to clipboard! Paste it at checkout for discount.`);
    }
}



// ── ✦ READY-TO-SHIP COMBO DEALS & STARTUP PACKAGES ─────────────────────────
const DEFAULT_COMBOS = [
    {
        id: 'combo-mug-startup',
        name: 'MUG PRINTING STARTUP COMBO',
        tagline: '32 pieces in this full set',
        img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
        summary: 'Mug Machine + Epson L130 Sublimation Printer + Marvel Sublimation Paper (A4) + Heat Tape (Green) + White Mug AAA ×12 + Magic Mug ×6 + Patch Mug Imported ×6 + Sublimation Ink 100ml ×4',
        clothingNote: false,
        active: true,
        separatePrice: 16661,
        comboPrice: 14899,
        items: [
            {
                name: 'Mug Machine (Single Station Heavy Duty)',
                code: 'SM10',
                qty: 1,
                price: 3899,
                img: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Epson L130 Sublimation Printer (Modified)',
                code: 'EP01',
                qty: 1,
                price: 9800,
                img: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Sublimation Ink 100ml (Set of 4 Colors CMYK)',
                code: 'INK04',
                qty: 4,
                price: 225,
                img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Marvel Sublimation Transfer Paper (A4 100 Sheets)',
                code: 'PAP01',
                qty: 1,
                price: 350,
                img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Heat Resistant Tape (Green Roll)',
                code: 'TP01',
                qty: 2,
                price: 80,
                img: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'White Ceramic Sublimation Mug (AAA Grade)',
                code: 'MUG01',
                qty: 12,
                price: 90,
                img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Color Changing Magic Mug',
                code: 'MUG02',
                qty: 6,
                price: 78.67,
                img: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Patch Ceramic Mug (Imported)',
                code: 'MUG03',
                qty: 6,
                price: 85,
                img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=200&auto=format&fit=crop&q=80'
            }
        ]
    },
    {
        id: 'combo-sublimation-complete',
        name: 'SUBLIMATION COMPLETE STARTUP COMBO',
        tagline: '68 pieces in this full master bundle',
        img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80',
        summary: '5 in 1 Combo Heat Press + Sublimation Ink 100ml ×4 + Marvel Sublimation Paper (A4) + Heat Tape (Golden) + White Mug AAA ×12 + Sublimation Cap ×5 + Heart Fur Cushion ×5 + Sarina T-Shirt (130gsm) ×5 + White Mug Box ×18 + Acrylic Magnet Jhula Frame ×4',
        clothingNote: true,
        active: true,
        separatePrice: 25799,
        comboPrice: 22799,
        items: [
            {
                name: '5 in 1 Combo Multi-Function Heat Press Machine',
                code: 'HP05',
                qty: 1,
                price: 14500,
                img: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Sublimation Ink 100ml (Set of 4 Colors CMYK)',
                code: 'INK04',
                qty: 4,
                price: 225,
                img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Marvel Sublimation Transfer Paper (A4 Pack of 100)',
                code: 'PAP01',
                qty: 2,
                price: 350,
                img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Heat Resistant Tape (High-Temp Golden)',
                code: 'TP02',
                qty: 2,
                price: 90,
                img: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'White Ceramic Sublimation Mug AAA Grade',
                code: 'MUG01',
                qty: 12,
                price: 90,
                img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Sublimation Ready Caps (Assorted Colors)',
                code: 'CAP01',
                qty: 5,
                price: 110,
                img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Heart Shape Magic Fur Cushion with Filler',
                code: 'CSH01',
                qty: 5,
                price: 250,
                img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Sarina Sublimation Polyester T-Shirts (130 GSM)',
                code: 'TSH01',
                qty: 5,
                price: 190,
                img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Safe White Mug Protective Boxes',
                code: 'BOX01',
                qty: 18,
                price: 15,
                img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=200&auto=format&fit=crop&q=80'
            },
            {
                name: 'Acrylic Magnet Jhula / Rotating Photo Frame',
                code: 'FRM01',
                qty: 4,
                price: 854.75,
                img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&auto=format&fit=crop&q=80'
            }
        ]
    }
];

let activeComboId = null;

function getStoreCombos() {
    return safeJSONParse('lh_combos', DEFAULT_COMBOS);
}

function saveStoreCombos(list) {
    localStorage.setItem('lh_combos', JSON.stringify(list));
    if (typeof db !== 'undefined' && db && db.ref) {
        try {
            db.ref('combos').set(list);
        } catch (e) {
            console.warn('Could not sync combos to Firebase:', e);
        }
    }
}

function renderComboDeals() {
    const section = document.getElementById('combo-deals-section');
    const grid = document.getElementById('combo-deals-grid');
    if (!section || !grid) return;

    const combos = getStoreCombos();
    const activeCombos = combos.filter(c => c.active !== false);

    if (activeCombos.length === 0) {
        section.classList.add('hidden');
        return;
    }
    section.classList.remove('hidden');
    grid.innerHTML = '';

    const fallbackImg = 'https://placehold.co/240x240/1e293b/white?text=Combo+Pack';

    activeCombos.forEach(combo => {
        const separateTotal = combo.separatePrice || (combo.items ? combo.items.reduce((s, it) => s + (it.qty * it.price), 0) : combo.comboPrice);
        const comboTotal = combo.comboPrice || separateTotal;
        const discountAmount = Math.max(0, separateTotal - comboTotal);
        const summaryText = combo.summary || (combo.items ? combo.items.map(it => `${it.name}${it.qty > 1 ? ' ×' + it.qty : ''}`).join(' + ') : '');

        const card = document.createElement('div');
        card.className = 'bg-[#161311] dark:bg-[#161311] rounded-2xl border border-amber-900/35 hover:border-amber-500/50 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between group';
        card.innerHTML = `
            <div class="p-5 sm:p-6 flex items-start gap-4 sm:gap-5">
                <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                    <img referrerpolicy="no-referrer" src="${combo.img || fallbackImg}" onerror="this.onerror=null;this.src='${fallbackImg}';" alt="${combo.name}" class="w-full h-full object-contain">
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="text-white dark:text-white font-extrabold text-base sm:text-lg tracking-wide uppercase group-hover:text-amber-300 transition-colors leading-snug">
                        ${combo.name}
                    </h3>
                    <p class="text-xs text-amber-200/70 dark:text-amber-200/70 mt-1.5 leading-relaxed line-clamp-3 font-normal">
                        ${summaryText}
                    </p>
                    <div class="mt-3 flex items-baseline gap-2.5 flex-wrap">
                        <span class="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">₹${comboTotal.toLocaleString('en-IN')}</span>
                        ${discountAmount > 0 ? `<span class="text-xs text-gray-400 line-through font-mono">₹${separateTotal.toLocaleString('en-IN')}</span>` : ''}
                        ${discountAmount > 0 ? `<span class="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">SAVE ₹${discountAmount.toLocaleString('en-IN')}</span>` : ''}
                    </div>
                </div>
            </div>
            <button onclick="openComboModal('${combo.id}')" class="w-full bg-[#201a16] hover:bg-[#2b211a] text-amber-300 hover:text-amber-200 font-extrabold text-xs sm:text-sm tracking-widest uppercase py-3.5 px-4 border-t border-amber-900/40 flex items-center justify-center gap-2 transition duration-200 cursor-pointer">
                VIEW COMBO <i class="fas fa-arrow-up-right-from-square text-xs ml-1"></i>
            </button>
        `;
        grid.appendChild(card);
    });
}

function openComboModal(comboId) {
    const combos = getStoreCombos();
    const combo = combos.find(c => c.id === comboId);
    if (!combo) return;

    activeComboId = comboId;
    const modal = document.getElementById('combo-detail-modal');
    if (!modal) return;

    const titleEl = document.getElementById('combo-modal-title');
    const taglineEl = document.getElementById('combo-modal-tagline');
    const itemsContainer = document.getElementById('combo-modal-items');
    const sepPriceEl = document.getElementById('combo-modal-separate-price');
    const discEl = document.getElementById('combo-modal-discount');
    const totalEl = document.getElementById('combo-modal-total');
    const clothingNoteEl = document.getElementById('combo-modal-clothing-note');

    const totalPieces = combo.items ? combo.items.reduce((s, it) => s + (Number(it.qty) || 1), 0) : 0;
    const taglineText = combo.tagline || (totalPieces > 0 ? `${totalPieces} pieces in this full set` : 'Complete Startup Set');

    if (titleEl) titleEl.textContent = combo.name;
    if (taglineEl) taglineEl.textContent = taglineText;

    const separateTotal = combo.separatePrice || (combo.items ? combo.items.reduce((s, it) => s + (it.qty * it.price), 0) : combo.comboPrice);
    const comboTotal = combo.comboPrice || separateTotal;
    const discount = Math.max(0, separateTotal - comboTotal);

    if (sepPriceEl) sepPriceEl.textContent = `₹${separateTotal.toLocaleString('en-IN')}`;
    if (discEl) discEl.textContent = discount > 0 ? `-₹${discount.toLocaleString('en-IN')}` : '₹0';
    if (totalEl) totalEl.textContent = `₹${comboTotal.toLocaleString('en-IN')}`;

    if (clothingNoteEl) {
        if (combo.clothingNote) {
            clothingNoteEl.textContent = 'Choose the required size quantities for each clothing product or specify custom details above.';
            clothingNoteEl.classList.remove('hidden');
        } else {
            clothingNoteEl.textContent = 'Specify custom colour preferences or printing instructions above.';
            clothingNoteEl.classList.remove('hidden');
        }
    }

    if (itemsContainer) {
        itemsContainer.innerHTML = '';
        const fallbackImg = 'https://placehold.co/120x120/ffffff/1e293b?text=Item';

        (combo.items || []).forEach(item => {
            const lineTotal = Math.round((Number(item.qty) || 1) * (Number(item.price) || 0));
            const itemBlock = document.createElement('div');
            itemBlock.className = 'pt-5 first:pt-0 space-y-3';
            itemBlock.innerHTML = `
                <div class="flex items-start gap-4">
                    <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                        <img referrerpolicy="no-referrer" src="${item.img || fallbackImg}" onerror="this.onerror=null;this.src='${fallbackImg}';" alt="${item.name}" class="w-full h-full object-contain">
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-extrabold text-white text-sm sm:text-base leading-snug">${item.name}</h4>
                        <p class="text-xs font-mono text-cyan-400 mt-0.5">Code ${item.code || 'PRD'}</p>
                        <p class="text-xs sm:text-sm text-gray-300 mt-1">Qty ${item.qty} × ₹${Number(item.price).toLocaleString('en-IN')}</p>
                    </div>
                    <div class="text-right shrink-0">
                        <span class="font-black text-white text-base sm:text-lg">₹${lineTotal.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div class="space-y-1">
                    <label class="block text-xs text-gray-400 font-medium">
                        Additional details for this product (optional)
                    </label>
                    <textarea 
                        id="combo-note-${item.code || item.name.replace(/\s+/g, '_')}" 
                        maxlength="1000" 
                        oninput="updateComboCharCount('${item.code || item.name.replace(/\s+/g, '_')}')"
                        placeholder="Colour preference, printing instructions or other requirements..."
                        class="w-full bg-[#1b1816] border border-gray-700/70 rounded-xl p-3 text-xs text-gray-200 placeholder-gray-500 focus:border-amber-400 outline-none resize-none h-16 transition"
                    ></textarea>
                    <div class="text-[10px] text-gray-500 text-right font-mono" id="combo-counter-${item.code || item.name.replace(/\s+/g, '_')}">0/1000</div>
                </div>
            `;
            itemsContainer.appendChild(itemBlock);
        });
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function updateComboCharCount(code) {
    const ta = document.getElementById(`combo-note-${code}`);
    const ctr = document.getElementById(`combo-counter-${code}`);
    if (ta && ctr) {
        ctr.textContent = `${ta.value.length}/1000`;
    }
}

function closeComboModal() {
    const modal = document.getElementById('combo-detail-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function addActiveComboToOrder() {
    if (!activeComboId) return;
    const combos = getStoreCombos();
    const combo = combos.find(c => c.id === activeComboId);
    if (!combo) return;

    // Collect notes
    const itemNotes = [];
    (combo.items || []).forEach(it => {
        const key = it.code || it.name.replace(/\s+/g, '_');
        const ta = document.getElementById(`combo-note-${key}`);
        const val = ta ? ta.value.trim() : '';
        if (val) {
            itemNotes.push(`${it.name} [${it.code}]: ${val}`);
        }
    });

    const separateTotal = combo.separatePrice || (combo.items ? combo.items.reduce((s, it) => s + (it.qty * it.price), 0) : combo.comboPrice);
    const comboTotal = combo.comboPrice || separateTotal;
    const discount = Math.max(0, separateTotal - comboTotal);

    const customText = itemNotes.length > 0 ? itemNotes.join(' | ') : (combo.tagline || 'Complete Combo Pack');

    cart.push({
        id: 'combo-' + Date.now(),
        productId: combo.id,
        name: combo.name + ' [Combo Pack]',
        price: comboTotal,
        img: combo.img,
        custom: customText,
        isCombo: true,
        comboDetails: {
            id: combo.id,
            name: combo.name,
            separatePrice: separateTotal,
            comboPrice: comboTotal,
            discount: discount,
            items: (combo.items || []).map(it => {
                const key = it.code || it.name.replace(/\s+/g, '_');
                const ta = document.getElementById(`combo-note-${key}`);
                return {
                    name: it.name,
                    code: it.code || '',
                    qty: it.qty,
                    price: it.price,
                    note: ta ? ta.value.trim() : ''
                };
            })
        }
    });

    saveData();
    updateCartCount();
    closeComboModal();
    toggleCart();

    const toastMsg = discount > 0 
        ? `🎉 ${combo.name} added to cart! Saved ₹${discount.toLocaleString('en-IN')}!`
        : `🎉 ${combo.name} added to cart!`;
    if (typeof showToast === 'function') {
        showToast(toastMsg);
    } else {
        alert(toastMsg);
    }
}

// ── ADMIN COMBO MANAGEMENT ───────────────────────────────────────────────────
function renderAdminCombos() {
    const container = document.getElementById('admin-combos-list');
    if (!container) return;

    const combos = getStoreCombos();
    container.innerHTML = '';

    const fallbackImg = 'https://placehold.co/120x120/1e293b/white?text=Combo';

    combos.forEach(combo => {
        const separateTotal = combo.separatePrice || (combo.items ? combo.items.reduce((s, it) => s + (it.qty * it.price), 0) : combo.comboPrice);
        const comboTotal = combo.comboPrice || separateTotal;
        const discount = Math.max(0, separateTotal - comboTotal);

        const card = document.createElement('div');
        card.className = 'p-4 bg-gray-50 dark:bg-gray-750 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between space-y-3';
        card.innerHTML = `
            <div class="flex items-start gap-3">
                <img referrerpolicy="no-referrer" src="${combo.img || fallbackImg}" onerror="this.onerror=null;this.src='${fallbackImg}';" class="w-16 h-16 object-contain bg-white rounded-xl border border-gray-200 p-1 shrink-0">
                <div class="flex-grow min-w-0">
                    <div class="flex items-center justify-between gap-2">
                        <h5 class="font-black text-sm text-gray-900 dark:text-white truncate">${combo.name}</h5>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${combo.active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}">
                            ${combo.active !== false ? 'Visible' : 'Hidden'}
                        </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-0.5">${combo.tagline || (combo.items ? combo.items.length + ' products' : '')}</p>
                    <div class="flex items-baseline gap-2 mt-1.5 font-mono">
                        <span class="text-sm font-black text-amber-600">₹${comboTotal.toLocaleString('en-IN')}</span>
                        <span class="text-xs text-gray-400 line-through">₹${separateTotal.toLocaleString('en-IN')}</span>
                        ${discount > 0 ? `<span class="text-[10px] font-bold text-emerald-600">Save ₹${discount.toLocaleString('en-IN')}</span>` : ''}
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs">
                <label class="flex items-center gap-2 cursor-pointer font-bold text-gray-700 dark:text-gray-300 text-xs">
                    <input type="checkbox" ${combo.active !== false ? 'checked' : ''} onchange="toggleAdminComboActive('${combo.id}')" class="w-4 h-4 text-amber-500 rounded">
                    Active
                </label>
                <div class="flex items-center gap-1.5">
                    <button onclick="openComboModal('${combo.id}')" class="px-2.5 py-1.5 rounded-lg bg-gray-150 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs transition cursor-pointer">
                        <i class="fas fa-eye text-xs"></i> Preview
                    </button>
                    <button onclick="openAdminComboModal('${combo.id}')" class="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-xs transition cursor-pointer">
                        <i class="fas fa-edit text-xs"></i> Edit
                    </button>
                    <button onclick="deleteAdminCombo('${combo.id}')" class="px-2.5 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs transition cursor-pointer">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleAdminComboActive(comboId) {
    const combos = getStoreCombos();
    const c = combos.find(x => x.id === comboId);
    if (c) {
        c.active = c.active === false ? true : false;
        saveStoreCombos(combos);
        renderAdminCombos();
        renderComboDeals();
    }
}

function deleteAdminCombo(comboId) {
    if (!confirm('Are you sure you want to delete this combo deal?')) return;
    let combos = getStoreCombos();
    combos = combos.filter(c => c.id !== comboId);
    saveStoreCombos(combos);
    renderAdminCombos();
    renderComboDeals();
}

function openAdminComboModal(comboId = null) {
    const modal = document.getElementById('admin-combo-modal');
    if (!modal) return;

    const combos = getStoreCombos();
    const combo = comboId ? combos.find(c => c.id === comboId) : null;

    document.getElementById('admin-combo-modal-title').textContent = combo ? 'Edit Combo Deal' : 'Create New Combo Deal';
    document.getElementById('edit-combo-id').value = combo ? combo.id : '';
    document.getElementById('edit-combo-name').value = combo ? combo.name : '';
    document.getElementById('edit-combo-tagline').value = combo ? (combo.tagline || '') : '';
    document.getElementById('edit-combo-img').value = combo ? (combo.img || '') : '';
    document.getElementById('edit-combo-price').value = combo ? (combo.comboPrice || '') : '';
    document.getElementById('edit-combo-active').checked = combo ? (combo.active !== false) : true;
    document.getElementById('edit-combo-clothing').checked = combo ? !!combo.clothingNote : false;

    const itemsContainer = document.getElementById('admin-combo-items-rows');
    itemsContainer.innerHTML = '';

    if (combo && combo.items && combo.items.length > 0) {
        combo.items.forEach(it => addAdminComboItemRow(it));
    } else {
        // Add 2 default empty rows
        addAdminComboItemRow({ name: '', code: '', qty: 1, price: 0 });
        addAdminComboItemRow({ name: '', code: '', qty: 1, price: 0 });
    }

    calculateAdminComboTotals();
    modal.classList.remove('hidden');
}

function closeAdminComboModal() {
    const modal = document.getElementById('admin-combo-modal');
    if (modal) modal.classList.add('hidden');
}

function addAdminComboItemRow(item = null) {
    const container = document.getElementById('admin-combo-items-rows');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'combo-item-row grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-200 dark:border-gray-600';
    row.innerHTML = `
        <div class="col-span-4">
            <input type="text" placeholder="Product Name" value="${item ? (item.name || '') : ''}" class="row-item-name w-full p-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs outline-none bg-white dark:bg-gray-900 font-medium">
        </div>
        <div class="col-span-2">
            <input type="text" placeholder="Code" value="${item ? (item.code || '') : ''}" class="row-item-code w-full p-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs outline-none bg-white dark:bg-gray-900 font-mono text-cyan-600">
        </div>
        <div class="col-span-2">
            <input type="number" min="1" placeholder="Qty" value="${item ? (item.qty || 1) : 1}" oninput="calculateAdminComboTotals()" class="row-item-qty w-full p-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs outline-none bg-white dark:bg-gray-900 font-bold">
        </div>
        <div class="col-span-3">
            <input type="number" min="0" placeholder="Rate ₹" value="${item ? (item.price || 0) : 0}" oninput="calculateAdminComboTotals()" class="row-item-price w-full p-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs outline-none bg-white dark:bg-gray-900 font-bold text-amber-600">
        </div>
        <div class="col-span-1 text-center">
            <button onclick="this.closest('.combo-item-row').remove(); calculateAdminComboTotals();" class="text-red-500 hover:text-red-700 text-xs cursor-pointer">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    container.appendChild(row);
    calculateAdminComboTotals();
}

function calculateAdminComboTotals() {
    let separateTotal = 0;
    document.querySelectorAll('.combo-item-row').forEach(row => {
        const qty = Number(row.querySelector('.row-item-qty')?.value) || 0;
        const price = Number(row.querySelector('.row-item-price')?.value) || 0;
        separateTotal += (qty * price);
    });

    const comboPrice = Number(document.getElementById('edit-combo-price')?.value) || 0;
    const discount = Math.max(0, separateTotal - comboPrice);

    const sepEl = document.getElementById('admin-combo-calc-separate');
    const discEl = document.getElementById('admin-combo-calc-discount');
    if (sepEl) sepEl.textContent = `₹${separateTotal.toLocaleString('en-IN')}`;
    if (discEl) discEl.textContent = `₹${discount.toLocaleString('en-IN')}`;
}

function saveAdminCombo() {
    const id = document.getElementById('edit-combo-id').value.trim() || ('combo-' + Date.now());
    const name = document.getElementById('edit-combo-name').value.trim();
    if (!name) {
        alert('Please enter a Combo Offer Title');
        return;
    }
    const tagline = document.getElementById('edit-combo-tagline').value.trim();
    const img = document.getElementById('edit-combo-img').value.trim();
    const comboPrice = Number(document.getElementById('edit-combo-price').value) || 0;
    const active = document.getElementById('edit-combo-active').checked;
    const clothingNote = document.getElementById('edit-combo-clothing').checked;

    const items = [];
    document.querySelectorAll('.combo-item-row').forEach(row => {
        const itemName = row.querySelector('.row-item-name')?.value.trim();
        if (itemName) {
            items.push({
                name: itemName,
                code: (row.querySelector('.row-item-code')?.value.trim()) || 'PRD',
                qty: Number(row.querySelector('.row-item-qty')?.value) || 1,
                price: Number(row.querySelector('.row-item-price')?.value) || 0,
                img: ''
            });
        }
    });

    const separatePrice = items.reduce((s, it) => s + (it.qty * it.price), 0);
    const summary = items.map(it => `${it.name}${it.qty > 1 ? ' ×' + it.qty : ''}`).join(' + ');

    const newCombo = {
        id,
        name,
        tagline: tagline || `${items.reduce((s, it) => s + it.qty, 0)} pieces in this full set`,
        img: img || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
        summary,
        clothingNote,
        active,
        separatePrice: separatePrice || comboPrice,
        comboPrice: comboPrice || separatePrice,
        items
    };

    let combos = getStoreCombos();
    const existingIdx = combos.findIndex(c => c.id === id);
    if (existingIdx >= 0) {
        combos[existingIdx] = newCombo;
    } else {
        combos.push(newCombo);
    }

    saveStoreCombos(combos);
    closeAdminComboModal();
    renderAdminCombos();
    renderComboDeals();
    alert('Combo Deal saved successfully! 🎉');
}

function showAdminSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(`admin-${sectionId}`).classList.remove('hidden');
    document.getElementById('admin-section-title').textContent = sectionId === 'bill-designer' ? 'Bill Template & Invoice Designer' : (sectionId.charAt(0).toUpperCase() + sectionId.slice(1));
    
    if(sectionId === 'dashboard') renderAdminDashboard();
    if(sectionId === 'products') renderAdminProducts();
    if(sectionId === 'categories') renderAdminCategories();
    if(sectionId === 'leads') renderAdminLeads();
    if(sectionId === 'coupons') {
        renderAdminCoupons();
        loadHamperAdminInputs();
        renderAdminCombos();
    }
    if(sectionId === 'bill-designer') initBillDesigner();
    if(sectionId === 'promo-popup') {
        document.getElementById('admin-section-title').textContent = 'Promotional Popup Banner Manager';
        loadPromoPopupAdminInputs();
    }
    if(sectionId === 'reviews') renderAdminReviews();
    if(sectionId === 'settings') {
        document.getElementById('set-wa').value = settings.wa || '';
        document.getElementById('set-logo').value = settings.logo || 'logo.jpg';
        const bgPresetEl = document.getElementById('set-bg-preset');
        const bgCustomEl = document.getElementById('set-bg-custom');
        const bgOpacityEl = document.getElementById('set-bg-opacity');
        const bgOpacityValEl = document.getElementById('set-bg-opacity-val');
        if (bgPresetEl) bgPresetEl.value = settings.bgPreset || 'none';
        if (bgCustomEl) bgCustomEl.value = settings.bgCustomUrl || '';
        if (bgOpacityEl) {
            bgOpacityEl.value = settings.bgOpacity || 20;
            if (bgOpacityValEl) bgOpacityValEl.textContent = (settings.bgOpacity || 20) + '%';
        }
        document.getElementById('set-pass').value = settings.adminPass || 'admin123';
        const adminEmailsInput = document.getElementById('set-admin-emails');
        if (adminEmailsInput) adminEmailsInput.value = settings.adminEmails || '';
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

        const upiInput = document.getElementById('set-upi');
        if (upiInput) upiInput.value = settings.upiId || '8726195000@okbizaxis';

        // Load Customer Feature Checkboxes
        const fBill = document.getElementById('feat-bill-download');
        const fReorder = document.getElementById('feat-reorder');
        const fAddr = document.getElementById('feat-address-book');
        const fPhone = document.getElementById('feat-saved-phone');
        const fMob = document.getElementById('feat-mobile-login');
        const fOcc = document.getElementById('feat-occasions');
        const fWish = document.getElementById('feat-wishlist-tab');
        const fCoup = document.getElementById('feat-coupons-wallet');
        const fPack = document.getElementById('feat-hamper-packaging');

        if (fBill) fBill.checked = settings.featBillDownload !== false;
        if (fReorder) fReorder.checked = settings.featReorder !== false;
        if (fAddr) fAddr.checked = settings.featAddressBook !== false;
        if (fPhone) fPhone.checked = settings.featSavedPhone !== false;
        if (fMob) fMob.checked = settings.featMobileLogin !== false;
        if (fOcc) fOcc.checked = settings.featOccasions !== false;
        if (fWish) fWish.checked = settings.featWishlistTab !== false;
        if (fCoup) fCoup.checked = settings.featCouponsWallet !== false;
        if (fPack) fPack.checked = settings.hamperPackagingEnabled !== false;
    }
    if(sectionId === 'orders') renderAdminOrders();
}

function loadHamperAdminInputs() {
    const hDiscount = document.getElementById('set-hamper-discount');
    const hBase = document.getElementById('set-hamper-base');
    const hAddon1 = document.getElementById('set-hamper-addon1');
    const hAddon2 = document.getElementById('set-hamper-addon2');
    const hEnable = document.getElementById('set-hamper-enable');
    const hPackaging = document.getElementById('set-hamper-packaging');
    if (hDiscount) hDiscount.value = settings.hamperDiscount !== undefined ? settings.hamperDiscount : 15;
    if (hBase) hBase.value = settings.hamperBase || 'frame, plaque, canvas';
    if (hAddon1) hAddon1.value = settings.hamperAddon1 || 'mug, cushion, pillow, bottle, lamp';
    if (hAddon2) hAddon2.value = settings.hamperAddon2 || 'keychain, clock, bank, wallet, puzzle, card';
    if (hEnable) hEnable.checked = settings.hamperEnabled !== false;
    if (hPackaging) hPackaging.checked = settings.hamperPackagingEnabled !== false;
    renderHamperAdminProductPickers();
}

function saveHamperSettings() {
    const hDiscount = document.getElementById('set-hamper-discount');
    const hBase = document.getElementById('set-hamper-base');
    const hAddon1 = document.getElementById('set-hamper-addon1');
    const hAddon2 = document.getElementById('set-hamper-addon2');
    const hEnable = document.getElementById('set-hamper-enable');
    const hPackaging = document.getElementById('set-hamper-packaging');
    if (hDiscount) settings.hamperDiscount = parseInt(hDiscount.value) >= 0 ? parseInt(hDiscount.value) : 15;
    if (hBase) settings.hamperBase = hBase.value.trim();
    if (hAddon1) settings.hamperAddon1 = hAddon1.value.trim();
    if (hAddon2) settings.hamperAddon2 = hAddon2.value.trim();
    if (hEnable) settings.hamperEnabled = hEnable.checked;
    if (hPackaging) settings.hamperPackagingEnabled = hPackaging.checked;
    saveData();
    applySettings();
    alert('Gift Hamper & Deal Settings Saved Successfully!');
}


// ═════════════════════════════════════════════════════════════════════════════
// FESTIVE & PROMO WHATSAPP BROADCAST & MARKETING TEMPLATES
// ═════════════════════════════════════════════════════════════════════════════
const promoTemplates = {
    festive: "Namaste {name}! 🪔 Special Festival Offer from Lamination Hub: Get 20% OFF on all Custom Photo Frames, Magic Mugs & Gift Hampers! Reply to order or customize today.",
    hamper: "Hello {name}! 🎁 Create your own personalized gift hamper at Lamination Hub Sultanpur with custom frames, magic mugs & keychains + extra 15% discount!",
    skin: "Hey {name}! 🔥 Premium 3M Matte, Glossy & Carbon Fiber Skins for all iPhone, Samsung, OnePlus & Vivo models now available at Lamination Hub Sultanpur with free installation!",
    welcome: "Hi {name}! Thanks for visiting Lamination Hub. Here is an exclusive 10% OFF discount coupon: WELCOME10. Use it on your first order!"
};

function selectPromoTemplate(key) {
    document.querySelectorAll('.promo-pill-btn').forEach(b => {
        b.classList.remove('bg-primary', 'text-white');
        b.classList.add('bg-white', 'text-gray-700', 'border');
    });
    if (typeof event !== 'undefined' && event && event.currentTarget) {
        event.currentTarget.classList.remove('bg-white', 'text-gray-700', 'border');
        event.currentTarget.classList.add('bg-primary', 'text-white');
    }
    const txtArea = document.getElementById('lead-promo-msg-preview');
    if (txtArea) txtArea.value = promoTemplates[key] || promoTemplates.festive;
}

function sendLeadPromoWA(phone, name) {
    const previewEl = document.getElementById('lead-promo-msg-preview');
    const rawMsg = (previewEl && previewEl.value.trim()) || promoTemplates.festive;
    const personalized = rawMsg.replace(/\{name\}/gi, name || 'Friend');
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const fullPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(personalized)}`;
    window.open(url, '_blank');
}

function exportLeadsCSV() {
    if (leads.length === 0) return alert('No visitors to export.');
    let csv = 'Name,Phone,Date\n';
    leads.forEach(l => {
        csv += `"${(l.name || '').replace(/"/g, '""')}","${(l.phone || '').replace(/"/g, '""')}","${(l.date || '').replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lamination_Hub_Visitors_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

function copyBroadcastNumbers() {
    if (leads.length === 0) return alert('No lead numbers available.');
    const numbers = [...new Set(leads.map(l => (l.phone || '').replace(/\D/g, '')).filter(p => p.length >= 10))];
    const text = numbers.join(', ');
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert(`Copied ${numbers.length} unique phone numbers for WhatsApp Broadcast!`);
        });
    } else {
        prompt('Copy WhatsApp Numbers:', text);
    }
}

function renderAdminLeads() {
    const tbody = document.getElementById('admin-leads-tbody');
    const badge = document.getElementById('lead-count-badge');
    const filterEl = document.getElementById('lead-filter-select');
    const filter = filterEl ? filterEl.value : 'all';

    if (!tbody) return;
    tbody.innerHTML = '';

    const previewArea = document.getElementById('lead-promo-msg-preview');
    if (previewArea && !previewArea.value) {
        previewArea.value = promoTemplates.festive;
    }

    let filtered = [...leads];
    const now = Date.now();

    if (filter === 'today') {
        const todayStr = new Date().toLocaleDateString('en-GB');
        filtered = filtered.filter(l => (l.date || '').includes(todayStr) || (l.date || '').includes(new Date().toLocaleDateString()));
    } else if (filter === 'week') {
        filtered = filtered.filter(l => {
            const d = new Date(l.date || 0).getTime();
            return !isNaN(d) ? (now - d) <= 7 * 86400000 : true;
        });
    } else if (filter === 'orders') {
        const orderPhones = orders.map(o => (o.customer && o.customer.phone || '').replace(/\D/g, ''));
        filtered = filtered.filter(l => orderPhones.includes((l.phone || '').replace(/\D/g, '')));
    }

    if (badge) badge.textContent = `${filtered.length} Visitors`;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-gray-400">No visitors found matching filter "${filter}".</td></tr>`;
        return;
    }

    filtered.forEach((l, idx) => {
        const cleanPhone = (l.phone || '').replace(/\D/g, '');
        const hasOrder = orders.some(o => (o.customer && (o.customer.phone || '').replace(/\D/g, '') === cleanPhone));

        tbody.innerHTML += `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-b border-gray-100 dark:border-gray-700">
                <td class="p-3 text-gray-500 dark:text-gray-400 font-mono text-[11px]">${l.date || '-'}</td>
                <td class="p-3 font-bold text-gray-800 dark:text-gray-100">${l.name || 'Visitor'}</td>
                <td class="p-3 font-bold text-gray-900 dark:text-gray-200 font-mono">${l.phone || '-'}</td>
                <td class="p-3">
                    ${hasOrder 
                        ? '<span class="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold"><i class="fas fa-shopping-bag mr-1"></i>Ordered</span>' 
                        : '<span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold">Browsed Store</span>'}
                </td>
                <td class="p-3 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                        <button onclick="sendLeadPromoWA('${l.phone}', '${l.name}')" title="Send 1-Click WhatsApp Promo" class="bg-[#25D366] hover:bg-[#20ba59] text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition cursor-pointer">
                            <i class="fab fa-whatsapp"></i> Send Promo
                        </button>
                        <button onclick="deleteAdminLead(${idx})" title="Delete Lead" class="text-red-400 hover:text-red-600 p-1.5 rounded transition cursor-pointer">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function renderAdminDashboard() {
    updateAdminAnalytics();
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
    if (!tbody) return;
    tbody.innerHTML = '';

    let displayProducts = products;
    if (adminProductVisibilityFilter === 'live') {
        displayProducts = products.filter(p => !p.hidden);
    } else if (adminProductVisibilityFilter === 'hidden') {
        displayProducts = products.filter(p => p.hidden);
    } else if (adminProductVisibilityFilter === 'newlaunch') {
        displayProducts = products.filter(p => p.newLaunch);
    }

    displayProducts.forEach((p, idx) => {
        const oos = p.outOfStock === true;
        const isHidden = p.hidden === true;
        const isLaunch = p.newLaunch === true;

        tbody.innerHTML += `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-b border-gray-100 dark:border-gray-700 ${oos ? 'opacity-60' : ''} ${isHidden ? 'bg-gray-50/50 dark:bg-gray-800/40' : ''}">
                <td class="p-3 w-8"><input type="checkbox" class="product-checkbox w-4 h-4 accent-primary" value="${p.id}"></td>
                <td class="p-3"><img referrerpolicy="no-referrer" src="${p.img || 'https://via.placeholder.com/50'}" onerror="this.src='https://via.placeholder.com/50'" class="w-12 h-12 object-cover rounded-md border border-gray-200"></td>
                <td class="p-3 font-semibold text-gray-800 dark:text-gray-100">
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <span>${p.name}</span>
                        ${isHidden 
                            ? '<span class="text-[10px] font-black bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full"><i class="fas fa-eye-slash"></i> Hidden</span>' 
                            : '<span class="text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full"><i class="fas fa-check-circle"></i> Live</span>'
                        }
                        ${isLaunch 
                            ? '<span class="text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-full shadow-xs">✦ NEW LAUNCH</span>' 
                            : ''
                        }
                        ${oos ? '<span class="text-xs font-bold bg-red-100 text-red-500 px-2 py-0.5 rounded-full">OUT OF STOCK</span>' : ''}
                        ${p.variants ? '<span class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Variants</span>' : ''}
                    </div>
                </td>
                <td class="p-3 text-gray-600 dark:text-gray-300 font-bold">₹${p.salePrice || p.price}</td>
                <td class="p-3">
                    <div class="flex gap-1.5 flex-wrap items-center">
                        <button onclick="toggleProductVisibility('${p.id}')" class="text-xs font-bold px-2 py-1 rounded transition cursor-pointer ${isHidden ? 'text-gray-500 bg-gray-200 hover:text-green-600' : 'text-emerald-700 bg-emerald-100 hover:text-red-600'}" title="${isHidden ? 'Click to show on store' : 'Click to hide from store'}">
                            ${isHidden ? '<i class="fas fa-eye-slash"></i> Hidden' : '<i class="fas fa-eye"></i> Live'}
                        </button>
                        <button onclick="toggleProductNewLaunch('${p.id}')" class="text-xs font-bold px-2 py-1 rounded transition cursor-pointer ${isLaunch ? 'text-amber-900 bg-amber-200 dark:bg-amber-900/60' : 'text-gray-400 bg-gray-100 hover:text-amber-600'}" title="Toggle New Launch Showcase">
                            ✦ ${isLaunch ? 'Featured' : 'Launch'}
                        </button>
                        <button class="text-blue-500 hover:text-blue-700 font-semibold text-xs transition px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 cursor-pointer" onclick="openProductForm('${p.id}')">Edit</button>
                        <button class="text-red-500 hover:text-red-700 font-semibold text-xs transition px-2 py-1 rounded bg-red-50 dark:bg-red-900/20 cursor-pointer" onclick="deleteProduct('${p.id}')">Delete</button>
                    </div>
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
        document.getElementById('pf-hidden').checked = p.hidden === true;
        document.getElementById('pf-newlaunch').checked = p.newLaunch === true;
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
        document.getElementById('pf-hidden').checked = false;
        document.getElementById('pf-newlaunch').checked = false;
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

    const hidden = document.getElementById('pf-hidden').checked;
    const newLaunch = document.getElementById('pf-newlaunch').checked;
    const product = { id: id || Date.now().toString(), name, category, img, images, price, salePrice, desc, custom, outOfStock, variants, hidden, newLaunch };

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
    renderNewLaunchSpotlight();
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

    // Background settings
    const bgPresetEl = document.getElementById('set-bg-preset');
    const bgCustomEl = document.getElementById('set-bg-custom');
    const bgOpacityEl = document.getElementById('set-bg-opacity');
    if (bgPresetEl) settings.bgPreset = bgPresetEl.value;
    if (bgCustomEl) {
        let customBg = bgCustomEl.value.trim();
        const driveMatchBg = customBg.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || customBg.match(/id=([a-zA-Z0-9_-]+)/);
        if (driveMatchBg && driveMatchBg[1]) {
            customBg = `https://lh3.googleusercontent.com/d/${driveMatchBg[1]}`;
        }
        settings.bgCustomUrl = customBg;
    }
    if (bgOpacityEl) settings.bgOpacity = bgOpacityEl.value;

    settings.adminPass = document.getElementById('set-pass').value.trim();
    const adminEmailsInput = document.getElementById('set-admin-emails');
    if (adminEmailsInput) settings.adminEmails = adminEmailsInput.value.trim();
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

    // Customer Profile & Store Feature Controls
    const fBill = document.getElementById('feat-bill-download');
    const fReorder = document.getElementById('feat-reorder');
    const fAddr = document.getElementById('feat-address-book');
    const fPhone = document.getElementById('feat-saved-phone');
    const fMob = document.getElementById('feat-mobile-login');
    const fOcc = document.getElementById('feat-occasions');
    const fWish = document.getElementById('feat-wishlist-tab');
    const fCoup = document.getElementById('feat-coupons-wallet');
    const fPack = document.getElementById('feat-hamper-packaging');

    if (fBill) settings.featBillDownload = fBill.checked;
    if (fReorder) settings.featReorder = fReorder.checked;
    if (fAddr) settings.featAddressBook = fAddr.checked;
    if (fPhone) settings.featSavedPhone = fPhone.checked;
    if (fMob) settings.featMobileLogin = fMob.checked;
    if (fOcc) settings.featOccasions = fOcc.checked;
    if (fWish) settings.featWishlistTab = fWish.checked;
    if (fCoup) settings.featCouponsWallet = fCoup.checked;
    if (fPack) settings.hamperPackagingEnabled = fPack.checked;

    // Gift Hamper settings
    const hDiscount = document.getElementById('set-hamper-discount');
    const hBase = document.getElementById('set-hamper-base');
    const hAddon1 = document.getElementById('set-hamper-addon1');
    const hAddon2 = document.getElementById('set-hamper-addon2');
    const hEnable = document.getElementById('set-hamper-enable');
    const hPackaging = document.getElementById('set-hamper-packaging');
    if (hDiscount) settings.hamperDiscount = parseInt(hDiscount.value) >= 0 ? parseInt(hDiscount.value) : 15;
    if (hBase) settings.hamperBase = hBase.value.trim();
    if (hAddon1) settings.hamperAddon1 = hAddon1.value.trim();
    if (hAddon2) settings.hamperAddon2 = hAddon2.value.trim();
    if (hEnable) settings.hamperEnabled = hEnable.checked;
    if (hPackaging) settings.hamperPackagingEnabled = hPackaging.checked;
    const upiInput = document.getElementById('set-upi');
    if (upiInput) settings.upiId = upiInput.value.trim();
    saveData();
    applySettings();
    applyTheme();
    alert('Settings Saved Successfully!');
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

    let found = null;
    if (settings.couponList && settings.couponList.length > 0) {
        found = settings.couponList.find(c => c.code.toUpperCase() === code && c.active);
    }

    if (!found && settings.coupons) {
        const pairs = settings.coupons.split(',').map(s => s.trim());
        for (const pair of pairs) {
            const [c, val] = pair.split(':');
            if (c && c.trim().toUpperCase() === code) {
                found = { code: c.trim().toUpperCase(), type: 'pct', val: parseInt(val) || 0, minOrder: 0 };
                break;
            }
        }
    }

    if (found && found.val > 0) {
        appliedCoupon = {
            code: found.code,
            pct: found.type === 'pct' ? found.val : 0,
            flat: found.type === 'flat' ? found.val : 0,
            type: found.type || 'pct',
            minOrder: found.minOrder || 0
        };
        const label = found.type === 'flat' ? `₹${found.val} Flat Discount` : `${found.val}% OFF`;
        result.innerHTML = `<span class="text-green-600 text-sm font-bold"><i class="fas fa-check-circle mr-1"></i>${label} applied!</span>`;
    } else {
        appliedCoupon = null;
        result.innerHTML = '<span class="text-red-500 text-sm"><i class="fas fa-times-circle mr-1"></i>Invalid or expired coupon.</span>';
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
        renderNewLaunchSpotlight();
        renderComboDeals();
        checkAndShowPromoPopup();
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

function logOrder(item) {
    const orderId = 'ORD-' + Date.now();
    const visitor = safeJSONParse('lh_visitor', {}) || {};
    const orderObj = {
        id: orderId,
        date: new Date().toLocaleDateString('en-IN'),
        product: item.name,
        price: item.price,
        custom: item.custom,
        items: item.items || null,
        customer: {
            name: (currentUser && currentUser.displayName) || visitor.name || '',
            phone: visitor.phone || '',
            address: visitor.address || ''
        },
        status: 'New',
        uid: currentUser ? currentUser.uid : null
    };
    orders.unshift(orderObj);
    saveData();

    try {
        const localOrders = safeJSONParse('lh_my_orders', []);
        if (!localOrders.includes(orderId)) {
            localOrders.unshift(orderId);
            localStorage.setItem('lh_my_orders', JSON.stringify(localOrders.slice(0, 50)));
        }
    } catch(e) {}

    return orderId;
}

// 10. Render Orders in Admin
function renderAdminOrders() {
    const tbody = document.getElementById('admin-orders-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-gray-400 dark:text-gray-400">No orders yet. Orders will appear here when customers order via WhatsApp.</td></tr>';
        return;
    }
    orders.forEach(o => {
        tbody.innerHTML += `<tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-b border-gray-100 dark:border-gray-700">
            <td class="p-3 text-gray-500 dark:text-gray-400 font-mono text-xs">${o.id}</td>
            <td class="p-3 text-gray-500 dark:text-gray-400 text-xs">${o.date}</td>
            <td class="p-3 font-semibold text-gray-800 dark:text-gray-100 text-sm">${o.product}</td>
            <td class="p-3 font-black text-primary">₹${o.price}</td>
            <td class="p-3 text-gray-500 dark:text-gray-400 text-xs max-w-[150px] truncate">${o.custom || '-'}</td>
            <td class="p-3">
                <div class="flex items-center gap-2">
                    <select onchange="updateOrderStatus('${o.id}', this.value)" class="text-xs border border-gray-200 dark:border-gray-600 rounded px-2 py-1 outline-none ${o.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300' : o.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'}">
                        <option ${o.status === 'New' ? 'selected' : ''}>New</option>
                        <option ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                    <button onclick="printOrderReceipt('${o.id}')" title="Print Official Bill / Invoice" class="text-indigo-600 hover:text-indigo-800 p-1 rounded transition cursor-pointer"><i class="fas fa-print text-base"></i></button>
                    <button onclick="notifyCustomerWA('${o.id}')" title="Send WhatsApp Update" class="text-green-500 hover:text-green-600 transition"><i class="fab fa-whatsapp text-lg"></i></button>
                    <button onclick="deleteAdminOrder('${o.id}')" title="Delete Order" class="text-red-500 hover:text-red-700 p-1 rounded transition ml-1 cursor-pointer"><i class="fas fa-trash-alt text-base"></i></button>
                </div>
            </td>
        </tr>`;
    });
}

function deleteAdminOrder(orderId) {
    if (!confirm(`Are you sure you want to permanently delete Order #${orderId}?`)) return;
    orders = orders.filter(o => o.id !== orderId);
    saveData();
    renderAdminOrders();
    alert(`Order #${orderId} deleted successfully.`);
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

function compressImage(file, maxDimension = 1200, quality = 0.8) {
    return new Promise((resolve) => {
        if (!file || !file.type.startsWith('image/')) return resolve(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    } else {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = () => resolve(e.target.result);
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
    });
}

async function handleLivePreview(event) {
    const file = event.target.files[0];
    const overlay = document.getElementById('preview-overlay');
    if (file) {
        const compressed = await compressImage(file);
        if (compressed) {
            overlay.src = compressed;
            overlay.classList.remove('hidden');
            const photoControls = document.getElementById('photo-edit-controls');
            if (photoControls) photoControls.classList.remove('hidden');
            applyPhotoFilter('none', 'Original');
            setPhotoFit('cover');
        }
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
        container.innerHTML += `
            <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 cursor-pointer hover:shadow" onclick="openProductModal('${c.id}'); toggleWishlist();">
                <img src="${c.img || fallbackImg}" class="w-16 h-16 object-cover rounded-lg flex-shrink-0">
                <div class="flex-grow">
                    <h4 class="font-bold text-gray-800 dark:text-gray-200 text-sm">${c.name}</h4>
                    <p class="text-primary font-bold text-sm">₹${c.salePrice || c.price}</p>
                </div>
                <button class="text-red-400 hover:text-red-600" onclick="event.stopPropagation(); toggleWishlistProduct('${c.id}'); renderWishlistItems();"><i class="fas fa-trash"></i></button>
            </div>
        `;
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



// ── AUTO-GENERATE & OPEN BILL VIA URL PARAM (?bill=ORDER_ID) ──
window.addEventListener('DOMContentLoaded', () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const billId = params.get('bill');
        if (billId) {
            setTimeout(() => {
                openCustomerBill(billId);
            }, 600);
        }
    } catch(e) {}
});
