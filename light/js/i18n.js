document.addEventListener('DOMContentLoaded', () => {
    let translations = {};

    // Function to fetch the translation file
    const fetchTranslations = async () => {
        // In a real project, this path might be absolute: '/locales/translations.json'
        const response = await fetch('./locales/translations.json');
        if (!response.ok) {
            console.error('Failed to load translation file.');
            return;
        }
        translations = await response.json();
    };

    // Function to set the language and update the UI
    const setLanguage = (lang) => {
        if (!translations[lang]) {
            console.error(`Language "${lang}" not found in translations.`);
            return;
        }
        
        // Update the lang attribute of the <html> tag
        document.documentElement.lang = lang;
        // Save the selected language to localStorage
        localStorage.setItem('language', lang);

        // Update all elements with the data-i18n-key attribute
        document.querySelectorAll('[data-i18n-key]').forEach(elem => {
            const key = elem.getAttribute('data-i18n-key');
            
            const translation = translations[lang][key] || key;
            
            // Special handling for the features list
            if (key === 'features_list') {
                const listItems = translation.split(',').map(item => `<li class="ml-4">${item.trim()}</li>`).join('');
                elem.innerHTML = listItems;
            } else {
                elem.textContent = translation;
            }
        });
        
        // Update the page title
        const pageKey = document.body.getAttribute('data-i18n-page-key');
        if (pageKey && translations[lang][pageKey]) {
             document.title = translations[lang][pageKey];
        }

        // Update the active state of language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update the active state of navigation links
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === currentPage);
        });
    };

    // Main initialization function
    const init = async () => {
        await fetchTranslations();
        
        // Get the saved language or default to 'en'
        const savedLang = 'th';
        //const savedLang = localStorage.getItem('language') || 'th';
        setLanguage(savedLang);

        // Add event listener to the language switcher
        const langSwitcher = document.getElementById('lang-switcher');
        if (langSwitcher) {
            langSwitcher.addEventListener('click', (e) => {
                const selectedLang = e.target.dataset.lang;
                if (selectedLang) {
                    setLanguage(selectedLang);
                }
            });
        }
    };

    init();
});
