// === TELEGRAM WEBAPP INIT ===
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#1A73E8');
  tg.setBackgroundColor('#F8FAFF');
}

const userId = tg?.initDataUnsafe?.user?.id || null;
const userName = tg?.initDataUnsafe?.user?.username || '';
const userFirstName = tg?.initDataUnsafe?.user?.first_name || '';

const MAX_WEBAPP_DATA_SIZE = 6000;

function sendWebAppData(payload) {
  if (!tg) return;
  const json = JSON.stringify(payload);
  if (json.length <= MAX_WEBAPP_DATA_SIZE) {
    tg.sendData(json);
    return;
  }

  if (payload.action === 'save_profile' && payload.profile) {
    const safeProfile = { ...payload.profile, photo_base64: null };
    const safePayload = { ...payload, profile: safeProfile };
    const safeJson = JSON.stringify(safePayload);
    if (safeJson.length <= MAX_WEBAPP_DATA_SIZE) {
      tg.sendData(safeJson);
      showToast('Rasm telegramga yuborilmadi, lekin anketangiz saqlandi.');
      return;
    }
  }

  showToast('Xatolik: ma\'lumot juda uzun. Iltimos, rasm hajmini kamaytiring.');
}

// === SVG ICONS ===
const ICONS = {
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  male: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M18 2h4v4"/><path d="m16 8 6-6"/></svg>`,
  female: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M12 14v8"/><path d="M9 18h6"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  message: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  ban: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  atSign: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
};

// === STATE ===
let selectedGender = '';
let selectedSearchGender = '';
let selectedInterests = [];
let selectedGoals = [];
let selectedSearchGoals = [];
let photoBase64 = '';
let currentSearchResults = [];

const uzbekCities = [
  "Toshkent", "Samarqand", "Buxoro", "Namangan", "Andijon", "Farg'ona",
  "Nukus", "Qarshi", "Termiz", "Jizzax", "Sirdaryo", "Guliston",
  "Navoiy", "Urganch", "Xiva", "Marg'ilon", "Qo'qon", "Chirchiq",
  "Olmaliq", "Bekobod", "Yangiyo'l", "Nurafshon", "Denov", "Bog'ot",
  "Muborak", "G'uzor", "Kitob", "Shahrisabz", "Karshi", "Shofirkon",
  "Kogon", "Vobkent", "Qorovulbozor", "Beshariq", "Rishton", "Quva",
  "Oʻzbekiston", "Iskandar", "Zarafshon", "Uchqo'rg'on", "Chust",
  "Pop", "Toyloq", "Kattaqo'rg'on", "Urgut", "Payariq", "Paxtakor"
];

// === REGISTRATION CHECK ===
function isRegistered() {
  return !!localStorage.getItem('dating_profile');
}

function getProfile() {
  const data = localStorage.getItem('dating_profile');
  return data ? JSON.parse(data) : null;
}

// === CITY SUGGEST ===
function suggestCity(val) {
  showSuggestions('city-suggestions', val, (city) => {
    document.getElementById('inp-city').value = city;
    document.getElementById('city-suggestions').style.display = 'none';
  });
}

function suggestCitySearch(val) {
  showSuggestions('sf-city-suggestions', val, (city) => {
    document.getElementById('sf-city').value = city;
    document.getElementById('sf-city-suggestions').style.display = 'none';
  });
}

function showSuggestions(containerId, val, onSelect) {
  const box = document.getElementById(containerId);
  if (!val || val.length < 1) { box.style.display = 'none'; return; }
  const filtered = uzbekCities.filter(c => c.toLowerCase().includes(val.toLowerCase())).slice(0, 6);
  if (!filtered.length) { box.style.display = 'none'; return; }

  box.innerHTML = filtered.map(c =>
    `<div class="suggestion-item" onclick="(${onSelect.toString()})('${c}')">${c}</div>`
  ).join('');
  box.style.display = 'block';
}

// Suggestion styles (injected dynamically)
const suggStyle = document.createElement('style');
suggStyle.textContent = `
  .suggestions-box { background: white; border: 2px solid var(--border); border-radius: 10px; overflow: hidden; margin-top: 4px; }
  .suggestion-item { padding: 10px 16px; font-size: 14px; font-weight: 600; color: var(--text); cursor: pointer; border-bottom: 1px solid var(--gray-100); }
  .suggestion-item:last-child { border-bottom: none; }
  .suggestion-item:active { background: var(--primary-ultra-light); color: var(--primary); }
`;
document.head.appendChild(suggStyle);

// === PAGE NAVIGATION ===
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  const pageEl = document.getElementById('page-' + name);
  if (pageEl) pageEl.classList.add('active');
  
  const navBtn = document.getElementById('nav-' + name);
  if (navBtn) navBtn.classList.add('active');

  if (name === 'search') setDefaultSearchGender();
  if (name === 'myprofile') loadMyProfile();
  if (name === 'invite') loadInviteData();
}

// === GENDER SELECT ===
function selectGender(g) {
  selectedGender = g;
  document.getElementById('gender-erkak').classList.toggle('selected', g === 'erkak');
  document.getElementById('gender-ayol').classList.toggle('selected', g === 'ayol');
}

function getOppositeGender(g) {
  return g === 'erkak' ? 'ayol' : g === 'ayol' ? 'erkak' : '';
}

function selectSearchGender(g) {
  selectedSearchGender = g;
  document.getElementById('sf-gender-erkak').classList.toggle('selected', g === 'erkak');
  document.getElementById('sf-gender-ayol').classList.toggle('selected', g === 'ayol');
}

function setDefaultSearchGender() {
  const profile = getProfile();
  const opposite = profile ? getOppositeGender(profile.gender) : '';
  if (opposite) {
    selectSearchGender(opposite);
  }
}

// === CHIP TOGGLE ===
function toggleChip(el, group) {
  el.classList.toggle('selected');
  const value = el.textContent.trim();

  if (group === 'interests') {
    if (el.classList.contains('selected')) selectedInterests.push(value);
    else selectedInterests = selectedInterests.filter(i => i !== value);
  } else if (group === 'goals') {
    if (el.classList.contains('selected')) selectedGoals.push(value);
    else selectedGoals = selectedGoals.filter(i => i !== value);
  } else if (group === 'sf-goals') {
    if (el.classList.contains('selected')) selectedSearchGoals.push(value);
    else selectedSearchGoals = selectedSearchGoals.filter(i => i !== value);
  }
}

// === PHOTO PREVIEW ===
function previewPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Rasm 5MB dan katta!'); return; }

  const reader = new FileReader();
  reader.onload = (e) => {
    photoBase64 = e.target.result;
    const preview = document.getElementById('photo-preview');
    preview.src = photoBase64;
    preview.style.display = 'block';
    document.getElementById('upload-icon').style.display = 'none';
    document.getElementById('upload-text').style.display = 'none';
    document.getElementById('upload-sub').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// === SAVE PROFILE ===
function saveProfile() {
  const name = document.getElementById('inp-name').value.trim();
  const age = parseInt(document.getElementById('inp-age').value);
  const city = document.getElementById('inp-city').value.trim();
  const zodiac = document.getElementById('sel-zodiac').value;

  if (!selectedGender) { showToast('Jinsni tanlang!'); return; }
  if (!name) { showToast('Ismingizni kiriting!'); return; }
  if (!age || age < 16 || age > 80) { showToast('Yoshingizni to\'g\'ri kiriting! (16-80)'); return; }
  if (!city) { showToast('Shahar/tuman kiriting!'); return; }
  if (selectedGoals.length === 0) { showToast('Kamida 1 ta maqsad tanlang!'); return; }

  const profile = {
    gender: selectedGender,
    full_name: name,
    age: age,
    city: city,
    zodiac: zodiac,
    interests: selectedInterests,
    goals: selectedGoals,
    photo_base64: photoBase64 || null
  };

  // LocalStorage ga saqlash (birinchi marta va keyingi tahrirlar uchun)
  localStorage.setItem('dating_profile', JSON.stringify(profile));

  if (tg) {
    sendWebAppData({ action: 'save_profile', profile });
  }

  setDefaultSearchGender();
  showToast('Anketangiz muvaffaqiyatli saqlandi!');
  
  // Asosiy ilovaga o'tish
  document.querySelector('.bottom-nav').style.display = 'flex';
  showPage('search');
}

// === SEARCH ===
function doSearch() {
  const filters = {
    gender: selectedSearchGender || null,
    age_from: document.getElementById('sf-age-from').value || null,
    age_to: document.getElementById('sf-age-to').value || null,
    city: document.getElementById('sf-city').value.trim() || null,
    goals: selectedSearchGoals.length > 0 ? selectedSearchGoals : null
  };

  const resultsEl = document.getElementById('search-results');
  resultsEl.innerHTML = '<div class="loading"><div class="spinner"></div> Qidirilmoqda...</div>';

  setTimeout(() => {
    resultsEl.innerHTML = renderSearchResults(filters);
  }, 500);
}

function renderSearchResults(filters) {
  const demos = [
    { name: "Aziz", age: 24, city: "Toshkent", gender: "erkak", goals: ["Do'stlik", "Muloqot"], interests: ["Kitob", "Kino"], id: 1001 },
    { name: "Malika", age: 21, city: "Samarqand", gender: "ayol", goals: ["Sevgi", "Romantika"], interests: ["Raqs", "Musiqa"], id: 1002 },
    { name: "Dilshod", age: 28, city: "Samarqand", gender: "erkak", goals: ["Tanishuv", "Oila"], interests: ["Sport", "Sayohat"], id: 1003 },
    { name: "Nilufar", age: 23, city: "Farg'ona", gender: "ayol", goals: ["Do'stlik", "Romantika"], interests: ["Foto", "Musiqa"], id: 1004 }
  ];

  const filtered = demos.filter((u) => {
    if (filters.gender && u.gender !== filters.gender) return false;
    if (filters.age_from && u.age < Number(filters.age_from)) return false;
    if (filters.age_to && u.age > Number(filters.age_to)) return false;
    if (filters.city && !u.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
    if (filters.goals && filters.goals.length && !filters.goals.some(g => u.goals.includes(g))) return false;
    return true;
  });

  if (!filtered.length) {
    return `<div class="empty-state"><div class="empty-icon">${ICONS.info}</div><h3>Hech kim topilmadi</h3><p>Iltimos, filtrlarni o'zgartiring va qayta urinib ko'ring.</p></div>`;
  }

  return filtered.map(u => renderProfileCard(u)).join('');
}

function renderProfileCard(u) {
  const icon = u.gender === 'erkak' ? ICONS.male : ICONS.female;
  const goals = (u.goals || []).map(g => `<span class="tag">${g}</span>`).join('');
  const interests = (u.interests || []).map(i => `<span class="tag" style="background:var(--accent-soft);color:var(--accent);">${i}</span>`).join('');
  const photoHtml = u.photo_file_id || u.photo_base64
    ? `<img src="${u.photo_file_id || u.photo_base64}" alt="${u.name || u.full_name}" />`
    : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--primary);">${icon}</div>`;

  return `
  <div class="profile-card">
    <div class="profile-photo">${photoHtml}</div>
    <div class="profile-info">
      <div class="profile-name"><span style="display:inline-flex;vertical-align:middle;margin-right:6px;">${icon}</span> ${u.name || u.full_name}</div>
      <div class="profile-age-city">Yosh: ${u.age} &nbsp;•&nbsp; Shahar: ${u.city}</div>
      <div class="profile-tags" style="margin-top:8px;">${goals}${interests}</div>
    </div>
    <div class="profile-actions">
      <button class="action-btn btn-like" onclick="sendLike(${u.id || u.telegram_id})">
        <span class="btn-icon">${ICONS.heart}</span> Like
      </button>
      <button class="action-btn btn-write" onclick="sendWrite(${u.id || u.telegram_id})">
        <span class="btn-icon">${ICONS.message}</span> Yozish
      </button>
      <button class="action-btn btn-block" onclick="sendBlock(${u.id || u.telegram_id})">
        <span class="btn-icon">${ICONS.ban}</span> Blok
      </button>
    </div>
  </div>`;
}

// === ACTIONS ===
function sendLike(toUser) {
  if (tg) {
    tg.sendData(JSON.stringify({ action: 'like_user', to_user: toUser }));
    showToast('Like yuborildi!');
  } else {
    showToast('Like yuborildi!');
  }
}

function sendWrite(toUser) {
  if (tg) {
    tg.sendData(JSON.stringify({ action: 'check_write', to_user: toUser }));
    showToast('Tekshirilmoqda...');
  } else {
    showToast('Yozish tekshirildi!');
  }
}

function sendBlock(blockedId) {
  if (confirm('Bu foydalanuvchini bloklamoqchimisiz?')) {
    if (tg) {
      tg.sendData(JSON.stringify({ action: 'block_user', blocked_id: blockedId }));
      showToast('Bloklandi!');
    } else {
      showToast('Bloklandi!');
    }
  }
}

// === MY PROFILE ===
function loadMyProfile() {
  const el = document.getElementById('my-profile-content');
  const profile = getProfile();
  
  if (!profile) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${ICONS.info}</div>
        <h3>Anketa topilmadi</h3>
        <p>Iltimos, anketangizni to'ldiring.</p>
      </div>`;
    return;
  }

  const genderIcon = profile.gender === 'erkak' ? ICONS.male : ICONS.female;
  const goalsText = (profile.goals || []).join(', ') || 'ko\'rsatilmagan';
  const interestsText = (profile.interests || []).join(', ') || 'ko\'rsatilmagan';

  const photoHtml = profile.photo_base64
    ? `<img src="${profile.photo_base64}" alt="photo" />`
    : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--primary);">${genderIcon}</div>`;

  el.innerHTML = `
    <div class="my-profile-wrap">
      <div class="my-profile-photo">${photoHtml}</div>
      <div class="card">
        <div class="info-row">
          <span class="info-icon">${ICONS.user}</span>
          <div>
            <div class="info-label">Ism</div>
            <div class="info-value">${profile.full_name}</div>
          </div>
        </div>
        <div class="info-row">
          <span class="info-icon">${ICONS.atSign}</span>
          <div>
            <div class="info-label">Username</div>
            <div class="info-value">${userName ? '@' + userName : 'Yo\'q'}</div>
          </div>
        </div>
        <div class="info-row">
          <span class="info-icon">${ICONS.info}</span>
          <div>
            <div class="info-label">Yosh</div>
            <div class="info-value">${profile.age} yosh</div>
          </div>
        </div>
        <div class="info-row">
          <span class="info-icon">${ICONS.mapPin}</span>
          <div>
            <div class="info-label">Shahar</div>
            <div class="info-value">${profile.city}</div>
          </div>
        </div>
        <div class="info-row">
          <span class="info-icon">${ICONS.target}</span>
          <div>
            <div class="info-label">Maqsad</div>
            <div class="info-value">${goalsText}</div>
          </div>
        </div>
        <div class="info-row">
          <span class="info-icon">${ICONS.book}</span>
          <div>
            <div class="info-label">Qiziqishlar</div>
            <div class="info-value">${interestsText}</div>
          </div>
        </div>
      </div>
    </div>`;
}

// === INVITE ===
function loadInviteData() {
  const botUsername = 'ZnakomstvouzBot';
  const link = `https://t.me/${botUsername}?start=ref_${userId || '0'}`;
  document.getElementById('invite-link').innerHTML = `
    <span style="display:flex;align-items:center;gap:8px;">
      ${ICONS.copy}
      ${link}
    </span>`;

  updateInviteProgress(0);
}

function updateInviteProgress(count) {
  document.getElementById('invite-count').innerHTML = `${count}<span>/2</span>`;
  const pct = Math.min((count / 2) * 100, 100);
  document.getElementById('invite-progress').style.width = pct + '%';
}

function copyInviteLink() {
  const linkText = document.getElementById('invite-link').textContent.trim();
  navigator.clipboard.writeText(linkText).then(() => showToast('Havola nusxalandi!'));
}

function shareInviteLink() {
  const link = document.getElementById('invite-link').textContent.trim();
  const text = `Do'stlik & Tanishuv botiga xush kelibsiz! Yangi do'stlar toping\n${link}`;
  if (tg) {
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent("Do'stlik & Tanishuv botiga qo'shiling!")}`);
  } else {
    navigator.share?.({ text }) || copyInviteLink();
  }
}

// === TOAST ===
function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// === INIT ===
function init() {
  if (!isRegistered()) {
    // Birinchi marta: anketa ko'rsatish, menyu yashirish
    showPage('profile');
    document.querySelector('.bottom-nav').style.display = 'none';
  } else {
    // Ro'yxatdan o'tgan: asosiy ilova
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || 'search';
    showPage(page);
    document.querySelector('.bottom-nav').style.display = 'flex';
  }

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.form-input')) {
      document.querySelectorAll('.suggestions-box').forEach(b => b.style.display = 'none');
    }
  });
}

init();
