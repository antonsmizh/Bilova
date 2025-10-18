// === Настройки ===
const SHEET_ID = "109pwbDP_90BGJTjSY4is4cLsR_uHRywmGvNvqz-gl6o";
const SHEET_NAME = "Лист1";
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

// === Переводы ===
const TRANSLATIONS = {
  ru: {
    "menu.about":"О нас","menu.team":"Менторы","menu.apply":"Стать ментором",
    "hero.title":"Billova — менторская платформа студентов",
    "hero.lead":"Мы связываем студентов и менторов: портфолио и быстрый контакт.",
    "about.title":"О проекте","about.text":"Billova — простая и удобная площадка, где студенты могут найти ментора по предмету.",
    "team.title":"Наши менторы","team.lead":"Выбери ментора и свяжись с ним напрямую через Telegram.",
    "apply.title":"Стать ментором","apply.lead":"Заполни короткую форму — имя, класс, предмет, фото и достижения.",
    "apply.q1":"Имя","apply.q2":"Класс","apply.q3":"Предмет","apply.q4":"Фото","apply.q5":"Достижения",
    "apply.btn":"Заполнить форму",
    "footer":"© Billova — peer-to-peer mentoring"
  },
  kz: {
    "menu.about":"Біз туралы","menu.team":"Менторлар","menu.apply":"Ментор болу",
    "hero.title":"Billova — студенттерге арналған менторинг","hero.lead":"Студенттер мен менторларды байланыстырамыз: портфолио және тез байланыс.",
    "about.title":"Жоба туралы","about.text":"Billova — студенттерге ментор табуға арналған қарапайым платформа.",
    "team.title":"Менторларымыз","team.lead":"Менторды таңдап, Telegram арқылы байланысуға болады.",
    "apply.title":"Ментор болу","apply.lead":"Қысқа форманы толтыр — аты, сынып, пән, фото және жетістіктер.",
    "apply.q1":"Аты-жөні","apply.q2":"Сынып","apply.q3":"Пән","apply.q4":"Фото","apply.q5":"Жетістіктер",
    "apply.btn":"Форманы толтыру",
    "footer":"© Billova — peer-to-peer mentoring"
  },
  en: {
    "menu.about":"About","menu.team":"Mentors","menu.apply":"Become a mentor",
    "hero.title":"Billova — peer-to-peer mentoring platform","hero.lead":"We connect students and mentors: portfolios and quick contact.",
    "about.title":"About","about.text":"Billova is a simple platform for students to find mentors by subject.",
    "team.title":"Our mentors","team.lead":"Choose a mentor and contact them via Telegram.",
    "apply.title":"Become a mentor","apply.lead":"Fill a short form — name, class, subject, photo and achievements.",
    "apply.q1":"Name","apply.q2":"Class","apply.q3":"Subject","apply.q4":"Photo","apply.q5":"Achievements",
    "apply.btn":"Fill the form",
    "footer":"© Billova — peer-to-peer mentoring"
  }
};

// === Рендеринг хедера и футера ===
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
        <div class="right">Email: hello@billova.example · Telegram: <a href="https://t.me/example_project" target="_blank">@example_project</a></div>
      </div>
    </div>
  `;

  const header = document.querySelector('.site-header[data-include]');
  const footer = document.querySelector('.site-footer[data-include]');
  if (header) header.innerHTML = headerHtml;
  if (footer) footer.innerHTML = footerHtml;
}

// === Переводы ===
function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.textContent = TRANSLATIONS[lang][key];
    }
  });
  localStorage.setItem('b_lang', lang);

  const links = document.querySelectorAll('#langSwitch a[data-lang]');
  links.forEach(a => a.classList.toggle('active', a.dataset.lang === lang));
}

function initLanguageSwitcher() {
  const switcher = document.getElementById('langSwitch');
  if (!switcher) return;

  const savedLang = localStorage.getItem('b_lang') || 'ru';
  applyTranslations(savedLang);

  switcher.addEventListener('click', e => {
    const a = e.target.closest('a[data-lang]');
    if (!a) return;
    e.preventDefault();
    applyTranslations(a.dataset.lang);
  });
}

// === Загрузка менторов ===
async function loadMentors() {
  const container = document.getElementById('mentorsList');
  if (!container) return;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    container.innerHTML = "";

    data.forEach(m => {
      if (!m.name || m.name.trim() === "") return;

      const card = document.createElement("div");
      card.className = "card";

      const photo = m.photo || "";
      const avatar = photo
        ? `<img src="${photo}" alt="${m.name}" style="width:64px;height:64px;border-radius:10px;object-fit:cover">`
        : `<div class="avatar">${m.name[0]?.toUpperCase() || "M"}</div>`;

      const tgLink = m.tg
        ? `<a class="small tg" href="https://t.me/${m.tg.replace('@','')}" target="_blank">Telegram</a>`
        : "";

      card.innerHTML = `
        <div class="left" style="display:flex;align-items:center;gap:12px">
          ${avatar}
          <div class="meta">
            <h4>${escapeHtml(m.name)}</h4>
            <p>${escapeHtml(m.subject || '')} · ${escapeHtml(m.class || '')}</p>
            ${m.achievements ? `<p style="font-size:13px;color:var(--muted);margin-top:6px">${escapeHtml(m.achievements)}</p>` : ''}
          </div>
        </div>
        <div class="actions">${tgLink}</div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    container.innerHTML = "<p>Ошибка загрузки данных.</p>";
  }
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"]/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"
  }[c]));
}

// === Инициализация ===
document.addEventListener("DOMContentLoaded", () => {
  renderHeaderFooter();
  initLanguageSwitcher();

  if (document.getElementById("mentorsList")) {
    loadMentors();
  }

  const mentorFormBtn = document.getElementById("mentorFormBtn");
  if (mentorFormBtn && mentorFormBtn.dataset.formUrl) {
    mentorFormBtn.href = mentorFormBtn.dataset.formUrl;
  }
});
