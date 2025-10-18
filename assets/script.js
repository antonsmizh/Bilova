/* === Billova JS ===
   Инструкция:
   1) Создай Google Sheet с колонками:
      name | class | subject | tg | photo | achievements
   2) Файл → Опубликовать в интернете → Опубликовать весь лист
   3) Сделай доступ "Anyone with the link - Viewer"
   4) Вставь только ID таблицы (между /d/ и /edit)
      Пример: https://docs.google.com/spreadsheets/d/XXXX/edit
      → const SHEET_ID = 'XXXX';
*/

const SHEET_ID = '109pwbDP_90BGJTjSY4is4cLsR_uHRywmGvNvqz-gl6o'; // <--- твой ID
const SHEET_NAME = 'Лист1'; // или 'mentors', если так называется вкладка

/* === Переводы === */
const TRANSLATIONS = {
  ru: {
    "menu.about":"О нас","menu.team":"Менторы","menu.apply":"Стать ментором",
    "hero.title":"Billova — менторская платформа студентов",
    "hero.lead":"Мы связываем студентов и менторов: портфолио и быстрый контакт.",
    "about.title":"О проекте","about.text":"Billova — простая и удобная площадка, где студенты могут найти ментора по предмету.",
    "team.title":"Наши менторы","team.lead":"Выбери ментора и свяжись с ним напрямую через Telegram.",
    "apply.title":"Стать ментором","apply.lead":"Заполни короткую форму — имя, класс, предмет, фото и достижения.",
    "apply.btn":"Перейти к форме",
    "contact.title":"Контакты","footer":"© Billova — peer-to-peer mentoring"
  },
  kz: {
    "menu.about":"Біз туралы","menu.team":"Менторлар","menu.apply":"Ментор болу",
    "hero.title":"Billova — студенттерге арналған менторинг платформасы",
    "hero.lead":"Студенттер мен менторларды байланыстырамыз: портфолио және тез байланыс.",
    "about.title":"Жоба туралы","about.text":"Billova — студенттерге пән бойынша ментор табуға арналған қарапайым платформа.",
    "team.title":"Менторларымыз","team.lead":"Менторды таңдап, Telegram арқылы байланыс.",
    "apply.title":"Ментор болу","apply.lead":"Қысқа форманы толтыр — аты, сынып, пән, фото және жетістіктер.",
    "apply.btn":"Форманы толтыру",
    "contact.title":"Байланыс","footer":"© Billova — peer-to-peer mentoring"
  },
  en: {
    "menu.about":"About","menu.team":"Mentors","menu.apply":"Become a mentor",
    "hero.title":"Billova — peer-to-peer mentoring platform",
    "hero.lead":"We connect students and mentors: portfolios and quick contact.",
    "about.title":"About","about.text":"Billova is a simple platform for students to find mentors by subject.",
    "team.title":"Our mentors","team.lead":"Choose a mentor and contact them via Telegram.",
    "apply.title":"Become a mentor","apply.lead":"Fill a short form — name, class, subject, photo and achievements.",
    "apply.btn":"Open the form",
    "contact.title":"Contact","footer":"© Billova — peer-to-peer mentoring"
  }
};

/* === Шапка и подвал === */
function renderHeaderFooter() {
  const headerHtml = `
    <div class="nav">
      <div class="logo"><span class="logo-box">B</span><span class="site-title">Billova</span></div>
      <nav>
        <a href="index.html" data-i18n="menu.about">О нас</a>
        <a href="mentors.html" data-i18n="menu.team">Менторы</a>
        <a href="apply.html" data-i18n="menu.apply">Стать ментором</a>
      </nav>
      <div class="controls">
        <div class="lang-switch" id="langSwitch">
          <a href="#" data-lang="ru">RU</a> |
          <a href="#" data-lang="kz">KZ</a> |
          <a href="#" data-lang="en">EN</a>
        </div>
      </div>
    </div>
  `;

  const footerHtml = `
    <div class="container">
      <div class="footer-row">
        <div class="left" data-i18n="footer">© Billova — peer-to-peer mentoring</div>
        <div class="right">
          Email: hello@billova.example · Telegram: 
          <a href="https://t.me/example_project" target="_blank" rel="noopener">@example_project</a>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.site-header[data-include]').forEach(h => h.innerHTML = headerHtml);
  document.querySelectorAll('.site-footer[data-include]').forEach(f => f.innerHTML = footerHtml);
}

/* === Перевод === */
function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.textContent = TRANSLATIONS[lang][key];
    }
  });
  localStorage.setItem('b_lang', lang);
  document.querySelectorAll('#langSwitch a[data-lang]').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-lang') === lang);
  });
}

function initLanguageSwitcher() {
  const switcher = document.getElementById('langSwitch');
  if (!switcher) return;
  const saved = localStorage.getItem('b_lang') || 'ru';
  applyTranslations(saved);
  switcher.addEventListener('click', e => {
    const a = e.target.closest('a[data-lang]');
    if (!a) return;
    e.preventDefault();
    applyTranslations(a.dataset.lang);
  });
}

/* === Подгрузка менторов из таблицы === */
function loadMentorsFromSheet() {
  const container = document.getElementById('mentorsList');
  if (!container) return;

  if (!SHEET_ID) {
    container.innerHTML = '<div class="loader">Ошибка: SHEET_ID не указан.</div>';
    return;
  }

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
  container.innerHTML = '<div class="loader">Загрузка менторов...</div>';
  console.log('[Billova] Загружаем данные из:', url);

  fetch(url)
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(text => {
      const json = JSON.parse(text.replace(/^[^\(]+\(|\);?$/g, ''));
      if (!json.table || !json.table.rows.length) {
        container.innerHTML = '<div class="loader">Нет данных в таблице.</div>';
        return;
      }

      const cols = json.table.cols.map(c => (c.label || '').toLowerCase());
      const mentors = json.table.rows.map(r => {
        const obj = {};
        cols.forEach((col, i) => (obj[col] = r.c[i] ? r.c[i].v : ''));
        return obj;
      });
      renderMentors(mentors, container);
    })
    .catch(err => {
      console.error('[Billova] Ошибка загрузки:', err);
      container.innerHTML = '<div class="loader">Ошибка загрузки. Проверь права доступа и ID таблицы.</div>';
    });
}

/* === Отрисовка карточек менторов === */
function renderMentors(mentors, container) {
  if (!mentors.length) {
    container.innerHTML = '<div class="loader">Менторы не найдены.</div>';
    return;
  }
  container.innerHTML = '';

  mentors.forEach(m => {
    const name = m.name || 'Без имени';
    const subject = m.subject || '';
    const cls = m.class || '';
    const tg = m.tg || '';
    const photo = m.photo || '';
    const achievements = m.achievements || '';

    const tgLink = tg ? (tg.startsWith('http') ? tg : 'https://t.me/' + tg.replace(/^@/, '')) : '';
    const initials = name.split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase();

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="left" style="display:flex;align-items:center;gap:12px">
        ${photo ? `<img src="${photo}" alt="${name}" style="width:64px;height:64px;border-radius:10px;object-fit:cover">`
                : `<div class="avatar">${initials}</div>`}
        <div class="meta">
          <h4>${escapeHtml(name)}</h4>
          <p>${escapeHtml(subject)} · ${escapeHtml(cls)}</p>
          ${achievements ? `<p class="ach">${escapeHtml(achievements)}</p>` : ''}
        </div>
      </div>
      <div class="actions">
        ${tgLink ? `<a class="small tg" href="${tgLink}" target="_blank" rel="noopener">TG</a>` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}

/* === Безопасность HTML === */
function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
}

/* === Инициализация === */
document.addEventListener('DOMContentLoaded', () => {
  renderHeaderFooter();
  initLanguageSwitcher();
  if (document.getElementById('mentorsList')) loadMentorsFromSheet();
});
