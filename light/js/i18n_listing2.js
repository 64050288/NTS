document.addEventListener('DOMContentLoaded', () => {
  let translations = {};

  // โหลดไฟล์แปล
  const fetchTranslations = async () => {
    const response = await fetch('./locales/translations_listing2.json');
    if (!response.ok) {
      console.error('Failed to load translation file.');
      return;
    }
    translations = await response.json();
  };

  // รีเฟรช UI ของ select หลังอัปเดตข้อความใน <option>
  function refreshSelectUIs() {
    const sel = document.getElementById('sortSelect');
    if (!sel) return;

    const selectedText = sel.options[sel.selectedIndex]?.text || '';

    // --- Chosen ---
    if (window.jQuery && jQuery.fn.chosen) {
      const $sel = jQuery(sel);
      if ($sel.data('chosen')) {
        // อัปเดตข้อความใน dropdown ของ Chosen
        $sel.trigger('chosen:updated');
        const span = $sel.next('.chosen-container').find('.chosen-single span');
        if (span.length) span.text(selectedText);
      } else {
        // ยังไม่ถูก init ก็ init หลังตั้งภาษา
        $sel.chosen({ disable_search: true, width: '100%' });
      }
    }

    // --- Select2 (ถ้ามี) ---
    if (window.jQuery && jQuery.fn.select2 && jQuery(sel).hasClass('select2-hidden-accessible')) {
      jQuery(sel).select2('destroy').select2();
    }

    // --- Nice Select (ถ้ามี) ---
    if (window.jQuery && jQuery.fn.niceSelect && jQuery(sel).next('.nice-select').length) {
      jQuery(sel).niceSelect('update');
    }
  }

  // ตั้งภาษาและอัปเดต UI
  const setLanguage = (lang) => {
    if (!translations[lang]) {
      console.error(`Language "${lang}" not found in translations.`);
      return;
    }

    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);

    document.querySelectorAll('[data-i18n-key]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-key');
      const translation = translations[lang][key] || key;

      if (key === 'features_list') {
        const listItems = translation.split(',').map(item => `<li class="ml-4">${item.trim()}</li>`).join('');
        elem.innerHTML = listItems;
      } else {
        elem.textContent = translation; // ใช้ได้กับ <option> ด้วย
      }
    });

    const pageKey = document.body.getAttribute('data-i18n-page-key');
    if (pageKey && translations[lang][pageKey]) {
      document.title = translations[lang][pageKey];
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'listing2';
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === currentPage);
    });

    // สำคัญ: รีเฟรชปลั๊กอิน select ให้ดึงข้อความใหม่หลังแปล
    refreshSelectUIs();
  };

  // เริ่มต้น
  const init = async () => {
    await fetchTranslations();

    const savedLang = 'th';
    //const savedLang = localStorage.getItem('language') || 'th';
    setLanguage(savedLang);

    // เผื่อธีม/สคริปต์อื่นยังไม่ได้ init Chosen ให้เราจัดการหลังตั้งภาษา
    if (window.jQuery && jQuery.fn.chosen) {
      jQuery('.chosen-select').each(function () {
        const $el = jQuery(this);
        if (!$el.data('chosen')) $el.chosen({ disable_search: true, width: '100%' });
      });
    }

    // สลับภาษา
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
      langSwitcher.addEventListener('click', (e) => {
        const selectedLang = e.target.dataset.lang;
        if (selectedLang) setLanguage(selectedLang);
      });
    }
  };

  init();
});
