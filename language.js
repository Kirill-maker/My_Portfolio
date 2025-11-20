// Language Switcher
const langToggle = document.getElementById('langToggle');
const langText = document.querySelector('.lang-text');

// Check for saved language preference or default to 'en'
let currentLang = localStorage.getItem('language') || 'en';

// Translations object
const translations = {
    en: {
        'years': 'years',
        'in design': 'in design'
    },
    ru: {
        'years': 'лет',
        'in design': 'в дизайне'
    }
};

// Apply saved language on page load
function setLanguage(lang) {
    currentLang = lang;
    
    // Update all elements with data-en and data-ru attributes
    document.querySelectorAll('[data-en][data-ru]').forEach(element => {
        const text = lang === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-ru');
        
        // For about text, preserve line breaks
        if (element.classList.contains('about-text')) {
            if (lang === 'ru') {
                element.innerHTML = text;
            } else {
                element.innerHTML = text.replace(/\n/g, '<br>');
            }
        } else {
            element.textContent = text;
        }
    });
    
    // Update button text
    langText.textContent = lang === 'en' ? 'RU' : 'EN';
    
    // Save preference
    localStorage.setItem('language', lang);
    
    // Log для отладки
    console.log(`✅ Язык "${lang === 'en' ? 'Английский' : 'Русский'}" ${lang === localStorage.getItem('language') ? 'загружен из памяти' : 'установлен'}`);
}

// Set initial language
setLanguage(currentLang);

// Toggle language
langToggle.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'ru' : 'en';
    setLanguage(newLang);
    console.log(`💾 Язык "${newLang === 'en' ? 'Английский' : 'Русский'}" сохранен`);
});

