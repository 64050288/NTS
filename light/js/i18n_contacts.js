document.addEventListener('DOMContentLoaded', () => {
  let translations = {};

  // โหลดไฟล์คำแปล
  const fetchTranslations = async () => {
    const response = await fetch('./locales/translations_contacts.json');
    if (!response.ok) {
      console.error('Failed to load translation file.');
      return;
    }
    translations = await response.json();
  };

  // ใช้คำแปลกับ element เดียว
  const applyTranslation = (elem, key, tr) => {
    // เคสพิเศษ: รายการฟีเจอร์ที่ต้องแตกเป็น <li>
    if (key === 'features_list') {
      const listItems = tr.split(',')
        .map(item => `<li class="ml-4">${item.trim()}</li>`).join('');
      elem.innerHTML = listItems;
      return;
    }

    // อนุญาตระบุปลายทางผ่าน data-i18n-attr (เช่น placeholder, title, html, value)
    const explicitAttr = elem.getAttribute('data-i18n-attr');
    if (explicitAttr) {
      if (explicitAttr.toLowerCase() === 'html') {
        elem.innerHTML = tr;
      } else {
        elem.setAttribute(explicitAttr, tr);
      }
      return;
    }

    // เดาฟิลด์ให้อัตโนมัติ
    const tag = elem.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      elem.setAttribute('placeholder', tr); // << สำคัญ: เปลี่ยน placeholder
      return;
    }
    if (tag === 'IMG') {
      elem.setAttribute('alt', tr);
      return;
    }
    if (tag === 'BUTTON') {
      // เก็บไอคอนเดิมไว้
      const icons = Array.from(elem.querySelectorAll('i,svg'));
      elem.textContent = tr;
      icons.forEach(ic => elem.appendChild(ic));
      return;
    }

    // อื่น ๆ ใช้เป็นข้อความปกติ
    elem.textContent = tr;
  };

  // ตั้งภาษาและอัปเดต UI
  const setLanguage = (lang) => {
    if (!translations[lang]) {
      console.error(`Language "${lang}" not found in translations.`);
      return;
    }

    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);

    // ใส่คำแปลให้ทุก element ที่มี data-i18n-key
    document.querySelectorAll('[data-i18n-key]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-key');
      const tr = translations[lang][key] ?? key;
      applyTranslation(elem, key, tr);
    });

    // title หน้า (ถ้าระบุคีย์ไว้ใน body)
    const pageKey = document.body.getAttribute('data-i18n-page-key');
    if (pageKey && translations[lang][pageKey]) {
      document.title = translations[lang][pageKey];
    }

    // ปุ่มสลับภาษา active
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // ลิงก์เมนู active ตามหน้า
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'contacts';
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === currentPage);
    });
  };

  // init
  const init = async () => {
    await fetchTranslations();
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);

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
