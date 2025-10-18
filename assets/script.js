
/* Для автоматической подгрузки менторов:
   1) создай Google Sheet. Первая строка = заголовки: name, class, subject, tg, cv, photo, achievements
   2) File → Publish to the web (опубликовать лист)
   3) Вставь ID таблицы ниже (вместо 'REPLACE_SHEET_ID')
   4) Убедись, что имя листа — mentors (или поменяй SHEET_NAME)
*/
const SHEET_ID = 'REPLACE_SHEET_ID'; // <-- заменишь своим ID
const SHEET_NAME = 'mentors';

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
  const headers = document.querySelectorAll('[data-include].site-header, .site-header[data-include]');
  const footers = document.querySelectorAll('[data-include].site-footer, .site-footer[data-include]');

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
          <a href="#" data-lang="ru">RU</a>|
          <a href="#" data-lang="kz">KZ</a>|
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

  
  const singleHeader = document.querySelector('.site-header[data-include]');
  if (singleHeader) singleHeader.innerHTML = headerHtml;
  const singleFooter = document.querySelector('.site-footer[data-include]');
  if (singleFooter) singleFooter.innerHTML = footerHtml;

  
  headers.forEach(h => h.innerHTML = headerHtml);
  footers.forEach(f => f.innerHTML = footerHtml);
}

function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.textContent = TRANSLATIONS[lang][key];
    }
  });
  localStorage.setItem('b_lang', lang);
  // update active lang in header
  const langLinks = document.querySelectorAll('#langSwitch a[data-lang]');
  langLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-lang') === lang);
  });
}

function initLanguageSwitcher() {
  const switcher = document.getElementById('langSwitch');
  if (!switcher) return;
  const saved = localStorage.getItem('b_lang') || 'ru';
  applyTranslations(saved);

  switcher.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-lang]');
    if (!a) return;
    e.preventDefault();
    const lang = a.getAttribute('data-lang');
    applyTranslations(lang);
  });
}


function loadMentorsFromSheet() {
  const container = document.getElementById('mentorsList');
  if (!container) return;

  if (!SHEET_ID || SHEET_ID === 'REPLACE_SHEET_ID') {
    container.innerHTML = '<div class="loader">Таблица не настроена — вставьте SHEET_ID в assets/script.js</div>';
    return;
  }

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
  fetch(url).then(r => r.text()).then(text => {
    const jsonText = text.replace(/^[^\(]+\(|\);?$/g, '');
    const data = JSON.parse(jsonText);
    const cols = data.table.cols.map(c => (c.label||'').trim());
    const rows = data.table.rows.map(r => r.c.map(cell => (cell ? cell.v : '')));
    const mentors = rows.map(r => {
      const obj = {};
      cols.forEach((col,i) => obj[col || `col${i}`] = r[i] || '');
      return obj;
    });
    renderMentors(mentors, container);
  }).catch(err => {
    container.innerHTML = '<div class="loader">Ошибка загрузки</div>';
    console.error(err);
  });
}

function renderMentors(mentors, container) {
  if (!mentors || mentors.length === 0) {
    container.innerHTML = '<div class="loader">Менторы не найдены.</div>';
    return;
  }
  container.innerHTML = '';
  mentors.forEach(m => {
    const name = m.name || m.Name || '—';
    const role = m.subject || m.role || m.Subject || '';
    const cls = m.class || m.Class || '';
    const tg = m.tg || m.TG || '';
    const cv = m.cv || m.CV || '';
    const photo = m.photo || m.Photo || '';
    const achievements = m.achievements || m.Achievements || '';

    const initials = name.split(' ').map(s=>s[0]||'').slice(0,2).join('').toUpperCase() || 'M';
    const avatarHtml = photo ? `<img src="${photo}" alt="${name}" style="width:64px;height:64px;border-radius:10px;object-fit:cover">` : `<div class="avatar">${initials}</div>`;

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="left" style="display:flex;align-items:center;gap:12px">
        ${avatarHtml}
        <div class="meta">
          <h4>${escapeHtml(name)}</h4>
          <p>${escapeHtml(role)} · ${escapeHtml(cls)}</p>
          ${achievements ? `<p style="font-size:13px;color:var(--muted);margin-top:6px">${escapeHtml(achievements)}</p>` : ''}
        </div>
      </div>
      <div class="actions">
        ${cv ? `<a class="small cv" href="${cv}" target="_blank" rel="noopener">CV</a>` : ''}
        ${tg ? `<a class="small tg" href="${tg}" target="_blank" rel="noopener">TG</a>` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}


function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}


document.addEventListener('DOMContentLoaded', () => {
  renderHeaderFooter();
  initLanguageSwitcher();

  
  if (document.getElementById('mentorsList')) {
    loadMentorsFromSheet();
  }

  
  const mentorFormBtn = document.getElementById('mentorFormBtn');
  if (mentorFormBtn && mentorFormBtn.getAttribute('data-form-url')) {
    mentorFormBtn.href = mentorFormBtn.dataset.formUrl;
  }
});


