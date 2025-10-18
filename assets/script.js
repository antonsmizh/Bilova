const SHEET_ID = '109pwbDP_90BGJTjSY4is4cLsR_uHRywmGvNvqz-gl6o';
const SHEET_NAME = 'Лист1';

const TRANSLATIONS = {
  ru: {
    "menu.about":"О нас","menu.team":"Менторы","menu.apply":"Стать ментором",
    "hero.title":"Billova — менторская платформа студентов",
    "hero.lead":"Мы связываем студентов и менторов: портфолио и быстрый контакт.",
    "about.title":"О проекте","about.text":"Billova — простая и удобная площадка, где студенты могут найти ментора по предмету.",
    "about.f1":"","about.f2":"","about.f3":"",
    "how.title":"Как это работает","how.step1":"","how.step2":"","how.step3":"",
    "team.title":"Наши менторы","team.lead":"Выбери ментора и свяжись с ним напрямую через Telegram.",
    "apply.title":"Стать ментором","apply.lead":"Заполни короткую форму — имя, класс, предмет, фото и достижения.",
    "apply.q1":"Имя","apply.q2":"Класс","apply.q3":"Предмет","apply.q4":"Фото","apply.q5":"Достижения",
    "apply.btn":"Заполнить форму",
    "contact.title":"Контакты","footer":"© Billova — peer-to-peer mentoring"
  },
  kz: {
    "menu.about":"Біз туралы","menu.team":"Менторлар","menu.apply":"Ментор болу",
    "hero.title":"Billova — студенттерге арналған менторинг","hero.lead":"Студенттер мен менторларды байланыстырамыз: портфолио және тез байланыс.",
    "about.title":"Жоба туралы","about.text":"Billova — студенттерге ментор табуға арналған қарапайым платформа.",
    "about.f1":"","about.f2":"","about.f3":"",
    "how.title":"Қалай жұмыс істейді","how.step1":"","how.step2":"","how.step3":"",
    "team.title":"Менторларымыз","team.lead":"Менторды таңдап, Telegram арқылы байланысуға болады.",
    "apply.title":"Ментор болу","apply.lead":"Қысқа форманы толтыр — аты, сынып, пән, фото және жетістіктер.",
    "apply.q1":"Аты-жөні","apply.q2":"Сынып","apply.q3":"Пән","apply.q4":"Фото","apply.q5":"Жетістіктер",
    "apply.btn":"Форманы толтыру",
    "contact.title":"Байланыс","footer":"© Billova — peer-to-peer mentoring"
  },
  en: {
    "menu.about":"About","menu.team":"Mentors","menu.apply":"Become a mentor",
    "hero.title":"Billova — peer-to-peer mentoring platform","hero.lead":"We connect students and mentors: portfolios and quick contact.",
    "about.title":"About","about.text":"Billova is a simple platform for students to find mentors by subject.",
    "about.f1":"","about.f2":"","about.f3":"",
    "how.title":"How it works","how.step1":"","how.step2":"","how.step3":"",
    "team.title":"Our mentors","team.lead":"Choose a mentor and contact them via Telegram.",
    "apply.title":"Become a mentor","apply.lead":"Fill a short form — name, class, subject, photo and achievements.",
    "apply.q1":"Name","apply.q2":"Class","apply.q3":"Subject","apply.q4":"Photo","apply.q5":"Achievements",
    "apply.btn":"Fill the form",
    "contact.title":"Contact","footer":"© Billova — peer-to-peer mentoring"
  }
};

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
        <div class="left">© Billova — peer-to-peer mentoring</div>
        <div class="right">Email: hello@billova.example · Telegram: <a href="https://t.me/example_project" target="_blank" rel="noopener">@example_project</a></div>
      </div>
    </div>
  `;

  document.querySelectorAll('.site-header[data-include]').forEach(h => h.innerHTML = headerHtml);
  document.querySelectorAll('.site-footer[data-include]').forEach(f => f.innerHTML = footerHtml);
}

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
  const saved = localStorage.getItem('b_lang') || 'ru';
  applyTranslations(saved);
  const switcher = document.getElementById('langSwitch');
  if (switcher) {
    switcher.addEventListener('click', e => {
      const a = e.target.closest('a[data-lang]');
      if (!a) return;
      e.preventDefault();
      applyTranslations(a.getAttribute('data-lang'));
    });
  }
}

/* ---- ГЛАВНОЕ ИСПРАВЛЕНИЕ ЗДЕСЬ ---- */
function loadMentorsFromSheet() {
  const container = document.getElementById('mentorsList');
  if (!container) return;

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
  fetch(url)
    .then(r => r.text())
    .then(text => {
      const json = JSON.parse(text.substr(47).slice(0, -2));
      const cols = json.table.cols.map(c => (c.label || '').trim().toLowerCase());
      const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : '')));

      // пропускаем строку заголовков и пустые строки
      const dataRows = rows.filter(row => {
        const filled = row.some(cell => cell && String(cell).trim() !== '');
        const isHeader = row.join('').toLowerCase().includes('nameclasssubject');
        return filled && !isHeader;
      });

      const mentors = dataRows
        .map(r => {
          const obj = {};
          cols.forEach((col, i) => (obj[col] = r[i] || ''));
          return obj;
        })
        // убираем те, у кого нет имени
        .filter(m => m.name && m.name.trim() !== '');

      renderMentors(mentors, container);
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = '<div class="loader">Ошибка загрузки данных из таблицы</div>';
    });
}

function renderMentors(mentors, container) {
  if (!mentors.length) {
    container.innerHTML = '<div class="loader">Менторы не найдены.</div>';
    return;
  }
  container.innerHTML = '';
  mentors.forEach(m => {
    const name = m.name || '—';
    const subject = m.subject || '';
    const cls = m.class || '';
    const tg = m.tg || '';
    const photo = m.photo || '';
    const achievements = m.achievements || '';

    const initials = name.split(' ').map(s => s[0]).join('').toUpperCase();
    const avatar = photo
      ? `<img src="${photo}" alt="${name}" style="width:64px;height:64px;border-radius:10px;object-fit:cover;">`
      : `<div class="avatar">${initials}</div>`;

    const tgLink = tg
      ? `<a class="small tg" href="${tg.startsWith('http') ? tg : 'https://t.me/' + tg.replace('@', '')}" target="_blank" rel="noopener">TG</a>`
      : '';

    container.innerHTML += `
      <div class="card">
        <div class="left" style="display:flex;align-items:center;gap:12px;">
          ${avatar}
          <div class="meta">
            <h4>${escapeHtml(name)}</h4>
            <p>${escapeHtml(subject)} · ${escapeHtml(cls)}</p>
            ${achievements ? `<p style="font-size:13px;color:var(--muted);margin-top:6px;">${escapeHtml(achievements)}</p>` : ''}
          </div>
        </div>
        <div class="actions">${tgLink}</div>
      </div>
    `;
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s]));
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeaderFooter();
  initLanguageSwitcher();
  if (document.getElementById('mentorsList')) loadMentorsFromSheet();
});
