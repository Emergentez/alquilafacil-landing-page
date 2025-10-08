// i18n.js - Internationalization system for AlquilaFácil
class I18n {
  constructor() {
    this.currentLanguage = 'en'; // Default language
    this.translations = {};
    this.loadTranslations();
  }

  async loadTranslations() {
    try {
      // Load both languages
      const [enResponse, esResponse] = await Promise.all([
        fetch('./translations/en.json'),
        fetch('./translations/es.json')
      ]);

      this.translations.en = await enResponse.json();
      this.translations.es = await esResponse.json();

      // Set initial language from localStorage or default to English
      const savedLanguage = localStorage.getItem('language') || 'en';
      this.setLanguage(savedLanguage);
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    this.updatePageContent();
    this.updateLanguageButtons();
  }

  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return value || key;
  }

  updatePageContent() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      if (element.hasAttribute('data-i18n-html')) {
        element.innerHTML = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });

    // Update aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      element.setAttribute('aria-label', this.t(key));
    });
  }

  updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      if (lang === this.currentLanguage) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

// Initialize i18n when DOM is ready
let i18n;
document.addEventListener('DOMContentLoaded', () => {
  i18n = new I18n();
});
