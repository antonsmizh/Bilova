// ---------- CONFIG ----------
// Подставь сюда ID Google Sheets (или оставь пустым для заглушки)
const SHEET_ID = 'REPLACE_WITH_YOUR_SHEET_ID';
// Имя листа с данными (как в Google Sheets)
const SHEET_NAME = 'mentors';
// Формат ожидания: первая строка — заголовки:
// name | role | tg | cv | photo (photo optional)
// ----------------------------

// Translation strings
const TRANSLATIONS = {
  ru: {
    "menu.about":"О нас","menu.team":"Менторы","menu.apply":"Стать ментором","menu.contact":"Контакты","menu.become":"Стать ментором",
    "hero.title":"Billova — менторская платформа студентов","hero.subtitle":"Мы связываем студентов и менторов: портфолио и быстрый контакт.",
    "hero.ctaTeam":"Посмотреть менторов","hero.ctaApply":"Стать ментором",
    "about.title":"О проекте","about.body":"Billova — простая площадка для соединения студентов с опытными менторами.",
    "about.f1":"Простые профили менторов","about.f2":"Подача заявок через Google Forms","about.f3":"Поддерживаем RU / KZ / EN",
    "how.title":"Как это работает","how.step1":"Найти ментора на странице «Менторы».","how.step2":"Написать ментору в Telegram.","how.step3":"Подать заявку, если хочешь стать ментором.",
    "team.title":"Наши менторы","team.subtitle":"Выбери ментора и свяжись с ним через Telegram.",
    "apply.title":"Стать ментором","apply.intro":"Спасибо! Заполни форму — укажи специализацию, опыт и ссылки.",
    "apply.what":"Что указывать в форме","apply.q1":"ФИО и краткая биография","apply.q2":"Специализация и навыки","apply.q3":"Ссылка на портфолио / CV","apply.q4":"Telegram для связи",
    "apply.note":"После проверки администратором карточка появится в каталоге.",
    "apply.btnMentor":"Заполнить форму (ментор)","apply.btnStudent":"Заполнить форму (студент)",
    "contact.title":"Контакты","footer":"© Billova — peer-to-peer mentoring"
  },
  kz: {
    "menu.about":"Біз туралы","menu.team":"Менторлар","menu.apply":"Ментор болу","menu.contact":"Байланыс","menu.become":"Ментор болу",
    "hero.title":"Billova — студенттерге арналған менторинг","hero.subtitle":"Студенттер мен менторларды байланыстырамыз: портфолио және тез байланыс.",
    "hero.ctaTeam":"Менторларға қарау","hero.ctaApply":"Ментор болу",
    "about.title":"Жоба туралы","about.body":"Billova — студенттер мен тәжірибелі менторларды байланыстыратын платформа.",
    "about.f1":"Менторлардың қарапайым профильдері","about.f2":"Google Forms арқылы өтініш","about.f3":"RU / KZ / EN қолдау",
    "how.title":"Қалай жұмыс істейді","how.step1":"«Менторлар» бетінде ментор табу.","how.step2":"Telegram арқылы хабарласу.","how.step3":"Ментор болғың келсе өтініш жіберу.",
    "team.title":"Біздің менторлар","team.subtitle":"Менторды таңдап, Telegram арқылы байланыс орнат.",
    "apply.title":"Ментор болу","apply.intro":"Рақмет! Форманы толтыр — мамандандыру, тәжірибе және портфолио сілтемесін көрсет.",
    "apply.what":"Формада не жазу керек","apply.q1":"Аты-жөні және қысқаша өмірбаян","apply.q2":"Мамандандыру және дағдылар","apply.q3":"Портфолио сілтемесі / CV","apply.q4":"Telegram",
    "apply.note":"Администратор тексергеннен кейін профиль қосылады.",
    "apply.btnMentor":"Форманы толтыру (ментор)","apply.btnStudent":"Форманы толтыру (студент)",
    "contact.title":"Байланыс","footer":"© Billova — peer-to-peer mentoring"
  },
  en: {
    "menu.about":"About","menu.team":"Mentors","menu.apply":"Apply","menu.contact":"Contact","menu.become":"Become a Mentor",
    "hero.title":"Billova — peer-to-peer mentoring platform","hero.subtitle":"We connect students with mentors: portfolios and fast contact.",
    "hero.ctaTeam":"Browse mentors","hero.ctaApply":"Become a mentor",
    "about.title":"About","about.body":"Billova is a simple platform connecting students with experienced mentors.",
    "about.f1":"Clean mentor profiles","about.f2":"Apply via Google Forms","about.f3":"Supports RU / KZ / EN",
    "how.title":"How it works","how.step1":"Find a mentor on the Mentors page.","how.step2":"Contact them via Telegram.","how.step3":"Apply to become a mentor if you wish.",
    "team.title":"Our mentors","team.subtitle":"Choose a mentor and contact them via Telegram.",
    "apply.title":"Become a mentor","apply.intro":"Thank you! Fill the form: specialization, experience and portfolio links.",
    "apply.what":"What to include","apply.q1":"Full name and short bio","apply.q2":"Specialization and skills","apply.q3":"Portfolio / CV link","apply.q4":"Telegram for contact",
    "apply.note":"After admin review your profile will appear in the catalog.",
    "apply.btnMentor":"Fill mentor form","apply.btnStudent":"Fill student form",
    "contact.title":"Contact","footer":"© Billova — peer-to-peer mentoring"
  }
};

// ---- Common HTML injection for header/footer (rendered on every page) ----
function renderHeaderFooter() {
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.site-footer');

  const headerHtml = `
    <div class="nav">
      <div class="logo"><span class="logo-box">B</span><span class="site-title">Billova</span></div>
      <nav>
        <a href="index.html" data-i18n="menu.about">О нас</a>
        <a href="team.html" data-i18n="menu.team">Менторы</a>
        <a href="apply.html" data-i18n="menu.apply">Заявка</a>
        <a href="contact.html" data-i18n="menu.contact">Контакты</a>
      </nav>
      <div class="controls">
        <select id="languageSwitcher" aria-label="Language">
          <option value="ru">RU</option>
          <option value="kz">KZ</option>
          <option value="en">EN</option>
        </select>
        <a class="cta" href="apply.html" data-i18n="menu.become">Стать ментором</a>
      </div>
    </div>
  `;

  const footerHtml = `
    <div class="container">
      <div class="footer-row">
        <div>© Billova — peer-to-peer mentoring</div>
        <div class="contacts">Email: hello@billova.example · Telegram: <a href="https://t.me/example_project">@example_project</a></div>
      </div>
    </div>
  `;

  if (header) header.innerHTML = headerHtml;
  if (footer) footer.innerHTML = footerHtml;
}

// ---- Translation system ----
function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.textContent = TRANSLATIONS[lang][key];
    }
  });
  localStorage.setItem('lang', lang);
}

function initLanguage() {
  const select = document.getElementById('languageSwitcher');
  if (!select) return;
  const saved = localStorage.getItem('lang') || 'ru';
  select.value = saved;
  applyTranslations(saved);
  select.addEventListener('change', (e) => applyTranslations(e.target.value));
}

// ---- Mentors loader (Google Sheets via gviz endpoint) ----
function fetchMentors() {
  const container = document.getElementById('mentorsList');
  if (!container) return;

  if (!SHEET_ID || SHEET_ID === 'REPLACE_WITH_YOUR_SHEET_ID') {
    container.innerHTML = '<div class="loader">Таблица не настроена — замените SHEET_ID в assets/script.js</div>';
    return;
  }

  // URL: https://docs.google.com/spreadsheets/d/SHEET_ID/gviz/tq?tqx=out:json&sheet=SHEET_NAME
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

  fetch(url).then(r => r.text()).then(text => {
    // gviz returns "/*O_o*/\ngoogle.visualization.Query.setResponse(...json...);"
    const jsonText = text.replace(/^[^\(]+\(|\);?$/g, '');
    const data = JSON.parse(jsonText);
    const cols = data.table.cols.map(c => c.label);
    const rows = data.table.rows.map(r => r.c.map(cell => (cell ? cell.v : '')));

    const mentors = rows.map(r => {
      const obj = {};
      cols.forEach((col, i) => obj[col.trim()] = r[i] || '');
      return obj;
    });

    renderMentors(mentors, container);
  }).catch(err => {
    container.innerHTML = '<div class="loader">Ошибка загрузки менторов</div>';
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
    // expected fields: name, role, tg, cv, photo
    const card = document.createElement('div');
    card.className = 'card';
    const initials = (m.name || '').split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase() || 'MN';
    const photoHtml = m.photo ? `<img src="${m.photo}" alt="${m.name}" style="width:64px;height:64px;border-radius:10px;object-fit:cover">` : `<div class="avatar">${initials}</div>`;
    const tgLink = m.tg ? `<a class="small tg" href="${m.tg}" target="_blank" rel="noopener">TG</a>` : '';
    const cvLink = m.cv ? `<a class="small cv" href="${m.cv}" target="_blank" rel="noopener">CV</a>` : '';
    card.innerHTML = `
      <div class="left">${photoHtml}<div class="meta" style="margin-left:12px"><h4>${m.name || '—'}</h4><p>${m.role || ''}</p></div></div>
      <div class="actions">${cvLink}${tgLink}</div>
    `;
    container.appendChild(card);
  });
}

// ---- Init on DOM ready ----
document.addEventListener('DOMContentLoaded', () => {
  renderHeaderFooter();
  initLanguage();

  // If we are on team page, attempt to fetch mentors
  if (document.getElementById('mentorsList')) {
    fetchMentors();
  }
});
