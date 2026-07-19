// ====================================
// MULTILINGUAL BREACH CHECKER
// ====================================

let currentInputType = 'email';
let currentLanguage = 'ta';

// Language object references
const languages = { en, ta, hi, ml, te, kn };

// ===== Get translation =====
function t(key) {
    return languages[currentLanguage][key] || languages['en'][key] || key;
}

// ===== Language Switching =====
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update title
    document.title = t('title');
    
    // Update all elements with data-key
    document.querySelectorAll('[data-key]').forEach(el => {
        el.textContent = t(el.getAttribute('data-key'));
    });
    
    // Update placeholder
    updatePlaceholder();
    
    // Update what-to-do steps
    renderSteps();
    
    // Save preference
    localStorage.setItem('breachcheck-lang', lang);
}

// ===== Placeholder Update =====
function updatePlaceholder() {
    const input = document.getElementById('searchInput');
    const key = currentInputType === 'phone' ? 'phonePlaceholder' : 'emailPlaceholder';
    input.placeholder = t(key);
}

// ===== Input Type Switching =====
function setInputType(type) {
    currentInputType = type;
    
    document.getElementById('btn-email').classList.toggle('active', type === 'email');
    document.getElementById('btn-phone').classList.toggle('active', type === 'phone');
    
    updatePlaceholder();
    document.getElementById('searchInput').value = '';
    hideResults();
}

// ===== Render Steps =====
function renderSteps() {
    const container = document.getElementById('stepsContainer');
    container.innerHTML = `
        <div class="step">
            <div class="step-number">1</div>
            <h4>${t('step1Title')}</h4>
            <p>${t('step1Desc')}</p>
        </div>
        <div class="step">
            <div class="step-number">2</div>
            <h4>${t('step2Title')}</h4>
            <p>${t('step2Desc')}</p>
        </div>
        <div class="step">
            <div class="step-number">3</div>
            <h4>${t('step3Title')}</h4>
            <p>${t('step3Desc')}</p>
        </div>
        <div class="step">
            <div class="step-number">4</div>
            <h4>${t('step4Title')}</h4>
            <p>${t('step4Desc')}</p>
        </div>
    `;
}

// ===== Validation =====
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    const cleaned = phone.replace(/[\s+\-]/g, '');
    return /^(\+91|0)?[6-9]\d{9}$/.test(cleaned);
}

function normalizeInput(input) {
    let cleaned = input.trim().toLowerCase();
    if (currentInputType === 'phone') {
        cleaned = cleaned.replace(/[\s+\-]/g, '');
        if (cleaned.startsWith('+91')) cleaned = cleaned.substring(3);
        if (cleaned.startsWith('91') && cleaned.length > 10) cleaned = cleaned.substring(2);
        if (cleaned.startsWith('0') && cleaned.length > 10) cleaned = cleaned.substring(1);
    }
    return cleaned;
}

function maskInput(input) {
    if (currentInputType === 'email') {
        const [name, domain] = input.split('@');
        if (!domain) return input;
        return name.substring(0, 2) + '***@' + domain;
    } else {
        return input.substring(0, 2) + '******' + input.slice(-2);
    }
}

// ===== Hide/Show Results =====
function hideResults() {
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('loadingSection').classList.add('hidden');
}

function showLoading() {
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('loadingSection').classList.remove('hidden');
    document.getElementById('loadingSection').scrollIntoView({ behavior: 'smooth' });
}

// ===== Main Check Function =====
async function checkBreach() {
    const input = document.getElementById('searchInput').value;
    
    // Validate
    if (!input.trim()) {
        alert(t('errorEmpty'));
        return;
    }
    
    if (currentInputType === 'email' && !isValidEmail(input)) {
        alert(t('errorInvalidEmail'));
        return;
    }
    
    if (currentInputType === 'phone' && !isValidPhone(input)) {
        alert(t('errorInvalidPhone'));
        return;
    }
    
    // Show loading
    showLoading();
    
    // Hash and check
    const normalizedInput = normalizeInput(input);
    const inputHash = await sha256(normalizedInput);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const matches = breachDatabase.filter(entry => entry.hash === inputHash);
    
    // Hide loading, show result
    document.getElementById('loadingSection').classList.add('hidden');
    
    if (matches.length === 0) {
        showSafeResult(input);
    } else {
        showBreachedResult(input, matches);
    }
    
    document.getElementById('resultSection').classList.remove('hidden');
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

// ===== Safe Result =====
function showSafeResult(input) {
    const resultBox = document.getElementById('resultBox');
    const maskedInput = maskInput(input);
    
    resultBox.className = 'result-box safe';
    resultBox.innerHTML = `
        <div class="result-icon">✅</div>
        <h3>${t('safeTitle')}</h3>
        <p class="result-subtitle">
            <strong>${maskedInput}</strong> ${t('safeMessage')}
        </p>
        <p style="text-align:center; color:#666; margin-top:10px;">
            ${t('safeNote')}
        </p>
    `;
}

// ===== Breached Result =====
function showBreachedResult(input, matches) {
    const resultBox = document.getElementById('resultBox');
    const maskedInput = maskInput(input);
    
    let breachHTML = matches.map(match => {
        const severityLabel = t('severity' + match.severity.charAt(0).toUpperCase() + match.severity.slice(1));
        return `
            <div class="breach-item">
                <div class="breach-info">
                    <div class="breach-name">${match.breach}</div>
                    <div class="breach-detail">
                        ${t('dataExposed')} ${t(match.dataExposedKey)}
                    </div>
                    <span class="severity-badge severity-${match.severity}">${severityLabel}</span>
                </div>
                <div class="breach-year">${match.year}</div>
            </div>
        `;
    }).join('');
    
    // Get unique recommendations
    let recommendations = [...new Set(matches.map(m => m.recommendationKey))];
    let recHTML = recommendations.map(key => `
        <p style="margin-bottom:8px;">⚠️ ${t(key)}</p>
    `).join('');
    
    resultBox.className = 'result-box breached';
    resultBox.innerHTML = `
        <div class="result-icon">🚨</div>
        <h3>${t('breachedTitle')}</h3>
        <p class="result-subtitle">
            <strong>${maskedInput}</strong> ${t('breachedSubtitle')}
        </p>
        <div class="breach-list">
            ${breachHTML}
        </div>
        <div class="recommendation-box">
            <strong>${t('recommendation')}</strong>
            ${recHTML}
        </div>
    `;
}

// ===== Initialize =====
function init() {
    // Load saved language
    const savedLang = localStorage.getItem('breachcheck-lang') || 'ta';
    document.getElementById('languageSelect').value = savedLang;
    switchLanguage(savedLang);
    
    // Set initial placeholder
    updatePlaceholder();
    
    // Enter key support
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkBreach();
    });
}

// Run on page load
window.addEventListener('DOMContentLoaded', init);
