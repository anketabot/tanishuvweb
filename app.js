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
  document.getElementById('page-' + name).classList.add('active');
  const navBtn = document.getElementById('nav-' + name);
  if (navBtn) navBtn.classList.add('active');

  if (name === 'myprofile') loadMyProfile();
  if (name === 'invite') loadInviteData();
}

// === GENDER SELECT ===
function selectGender(g) {
  selectedGender = g;
  document.getElementById('gender-erkak').classList.toggle('selected', g === 'erkak');
  document.getElementById('gender-ayol').classList.toggle('selected', g === 'ayol');
}

function selectSearchGender(g) {
  selectedSearchGender = g;
  document.getElementById('sf-gender-erkak').classList.toggle('selected', g === 'erkak');
  document.getElementById('sf-gender-ayol').classList.toggle('selected', g === 'ayol');
}

// === CHIP TOGGLE ===
function toggleChip(el, group) {
  el.classList.toggle('selected');
  const text = el.textContent.trim().replace(/^[\u{1F000}-\u{1FFFF}✈️🎵📚⚽🎮🍳🎨📸💃🧘]\s*/u, '');
  const cleaned = el.textContent.trim();

  if (group === 'interests') {
    if (el.classList.contains('selected')) selectedInterests.push(cleaned);
    else selectedInterests = selectedInterests.filter(i => i !== cleaned);
  } else if (group === 'goals') {
    if (el.classList.contains('selected')) selectedGoals.push(cleaned);
    else selectedGoals = selectedGoals.filter(i => i !== cleaned);
  } else if (group === 'sf-goals') {
    if (el.classList.contains('selected')) selectedSearchGoals.push(cleaned);
    else selectedSearchGoals = selectedSearchGoals.filter(i => i !== cleaned);
  }
}

// === PHOTO PREVIEW ===
function previewPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('❌ Rasm 5MB dan katta!'); return; }

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

  if (!selectedGender) { showToast('⚠️ Jinsni tanlang!'); return; }
  if (!name) { showToast('⚠️ Ismingizni kiriting!'); return; }
  if (!age || age < 16 || age > 80) { showToast('⚠️ Yoshingizni to\'g\'ri kiriting! (16-80)'); return; }
  if (!city) { showToast('⚠️ Shahar/tuman kiriting!'); return; }
  if (selectedGoals.length === 0) { showToast('⚠️ Kamida 1 ta maqsad tanlang!'); return; }

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

  if (tg) {
    tg.sendData(JSON.stringify({ action: 'save_profile', profile }));
    showToast('✅ Saqlandi! Botga qaytishingiz mumkin.');
  } else {
    showToast('✅ (Test) Profil saqlandi!');
    console.log('Profile data:', profile);
  }
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

  if (tg) {
    tg.sendData(JSON.stringify({ action: 'search', filters }));
    // Bot natijalarni yuboradi
    setTimeout(() => {
      resultsEl.innerHTML = '<div class="empty-state"><div class="empty-icon">💬</div><h3>Natijalar botga yuborildi</h3><p>Telegram chatni oching va natijalarni ko\'ring.</p></div>';
    }, 1500);
  } else {
    // Demo mode
    setTimeout(() => {
      resultsEl.innerHTML = renderDemoResults();
    }, 800);
  }
}

function renderDemoResults() {
  const demos = [
    { name: "Aziz", age: 24, city: "Toshkent", gender: "erkak", goals: ["Do'stlik", "Muloqot"], interests: ["Kitob", "Kino"], id: 1001 },
    { name: "Malika", age: 21, city: "Samarqand", gender: "ayol", goals: ["Sevgi", "Romantika"], interests: ["Raqs", "Musiqa"], id: 1002 },
  ];
  return demos.map(u => renderProfileCard(u)).join('');
}

function renderProfileCard(u) {
  const icon = u.gender === 'erkak' ? '👨' : '👩';
  const goals = (u.goals || []).map(g => `<span class="tag">${g}</span>`).join('');
  const interests = (u.interests || []).map(i => `<span class="tag" style="background:var(--accent-soft);color:var(--accent);">${i}</span>`).join('');
  const photoHtml = u.photo_file_id
    ? `<img src="${u.photo_file_id}" alt="${u.name}" />`
    : `<span style="font-size:64px">${icon}</span>`;

  return `
  <div class="profile-card">
    <div class="profile-photo">${photoHtml}</div>
    <div class="profile-info">
      <div class="profile-name">${icon} ${u.name || u.full_name}</div>
      <div class="profile-age-city">🎂 ${u.age} yosh &nbsp;•&nbsp; 📍 ${u.city}</div>
      <div class="profile-tags" style="margin-top:8px;">${goals}${interests}</div>
    </div>
    <div class="profile-actions">
      <button class="action-btn btn-like" onclick="sendLike(${u.id || u.telegram_id})">
        <span class="btn-icon">❤️</span> Like
      </button>
      <button class="action-btn btn-write" onclick="sendWrite(${u.id || u.telegram_id})">
        <span class="btn-icon">✉️</span> Yozish
      </button>
      <button class="action-btn btn-block" onclick="sendBlock(${u.id || u.telegram_id})">
        <span class="btn-icon">🚫</span> Blok
      </button>
    </div>
  </div>`;
}

// === ACTIONS ===
function sendLike(toUser) {
  if (tg) {
    tg.sendData(JSON.stringify({ action: 'like_user', to_user: toUser }));
    showToast('❤️ Like yuborildi!');
  } else {
    showToast('❤️ (Demo) Like yuborildi!');
  }
}

function sendWrite(toUser) {
  if (tg) {
    tg.sendData(JSON.stringify({ action: 'check_write', to_user: toUser }));
    showToast('🔍 Tekshirilmoqda...');
  } else {
    showToast('💬 (Demo) Yozish tekshirildi!');
  }
}

function sendBlock(blockedId) {
  if (confirm('Bu foydalanuvchini bloklamoqchimisiz?')) {
    if (tg) {
      tg.sendData(JSON.stringify({ action: 'block_user', blocked_id: blockedId }));
      showToast('🚫 Bloklandi!');
    } else {
      showToast('🚫 (Demo) Bloklandi!');
    }
  }
}

// === MY PROFILE ===
function loadMyProfile() {
  const el = document.getElementById('my-profile-content');
  // botdan ma'lumot keladi. Hozircha demo ko'rsatamiz
  el.innerHTML = `
    <div class="my-profile-wrap">
      <div class="my-profile-photo"><span>👤</span></div>
      <div class="card">
        <div class="info-row">
          <span class="info-icon">👤</span>
          <div>
            <div class="info-label">Ism</div>
            <div class="info-value">${userFirstName || 'Ko\'rsatilmagan'}</div>
          </div>
        </div>
        <div class="info-row">
          <span class="info-icon">📱</span>
          <div>
            <div class="info-label">Username</div>
            <div class="info-value">${userName ? '@' + userName : 'Yo\'q'}</div>
          </div>
        </div>
        <div class="info-row">
          <span class="info-icon">ℹ️</span>
          <div>
            <div class="info-label">Holat</div>
            <div class="info-value">Anketani to'ldirib saqlang</div>
          </div>
        </div>
      </div>
    </div>`;
}

// === INVITE ===
function loadInviteData() {
  const botUsername = 'YOUR_BOT_USERNAME'; // config.pyda sozlangan bot username
  const link = `https://t.me/${botUsername}?start=ref_${userId || '0'}`;
  document.getElementById('invite-link').textContent = link;

  // Count bot orqali yuklanadi, hozircha 0
  updateInviteProgress(0);
}

function updateInviteProgress(count) {
  document.getElementById('invite-count').innerHTML = `${count}<span>/2</span>`;
  const pct = Math.min((count / 2) * 100, 100);
  document.getElementById('invite-progress').style.width = pct + '%';
}

function copyInviteLink() {
  const link = document.getElementById('invite-link').textContent;
  navigator.clipboard.writeText(link).then(() => showToast('🔗 Havola nusxalandi!'));
}

function shareInviteLink() {
  const link = document.getElementById('invite-link').textContent;
  const text = `Do'stlik & Tanishuv botiga xush kelibsiz! Yangi do'stlar toping 💙\n${link}`;
  if (tg) {
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent("Do'stlik & Tanishuv botiga qo'shiling! 💙")}`);
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
(function init() {
  // URL parameter bo'yicha sahifani aniqlash
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page') || 'profile';
  showPage(page);

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.form-input')) {
      document.querySelectorAll('.suggestions-box').forEach(b => b.style.display = 'none');
    }
  });
})();
