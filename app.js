// ============================================================
//  MY SEOUL MAP — app.js
// ============================================================


// ─── 0. TRANSLATIONS ──────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    appTitle: 'My Seoul Map', tabPlaces: 'My Places', tabFriends: 'Friends',
    sectionVisited: 'Visited', sectionWishlist: 'Want to Go',
    filterAll: 'All',
    cats: { Restaurant: 'Restaurant', Cafe: 'Cafe', Entertainment: 'Entertainment', Shop: 'Shop', Other: 'Other' },
    searchPlaceholder: 'Search a place in Seoul...', friendSearchPlaceholder: 'Search people by name...',
    friendRequests: 'Friend Requests', myFriends: 'My Friends',
    btnAccept: 'Accept', btnDecline: 'Decline', btnViewMap: 'View Map',
    noFriends: 'No friends yet. Search above to add someone!', noneYet: 'None yet',
    addPlace: 'Add a New Place', editPlace: 'Edit Place',
    labelName: 'Name of Place', labelCategory: 'Category', labelDate: 'Date Visited', labelNotes: 'Notes',
    btnSave: 'Save Place', btnCancel: 'Cancel',
    statusVisited: '✓ Visited', statusWishlist: '♡ Want to Go',
    btnDelete: 'Delete', btnEdit: 'Edit', btnClose: 'Close',
    myProfile: 'My Profile', btnChangePhoto: 'Change Photo',
    labelProfileName: 'Name', labelBio: 'Bio', myStats: 'My Stats',
    btnSaveProfile: 'Save Profile', btnSignOut: 'Sign Out',
    signinSubtitle: 'Your personal little diary of Seoul', btnSignIn: 'Sign in with Google',
    backToMyMap: '← My Map',
    cropTitle: 'Adjust your photo', cropHint: 'Drag to reposition · Scroll to zoom', btnUsePhoto: 'Use Photo',
    settingsTitle: 'Settings', settingsLang: 'Language', settingsBtn: 'Settings',
    statsVisited: 'visited', statsWishlist: 'want to go', statsLoves: 'Loves',
    friendMapSuffix: "'s map", noPlacesAlert: "hasn't added any places yet!",
    statsTotal: (n) => `${n} place${n !== 1 ? 's' : ''} saved`,
    statsFavorite: (cat, n) => `Favourite: <strong>${cat}</strong> (${n})`,
    statsEmpty: 'Start adding places to see your stats!',
    visitedLabel: 'Visited:', noNotes: '(no notes)',
    deleteConfirm: 'Delete this place?', nameMissing: 'Please enter a name for this place!',
    phName: 'e.g. Myeongdong Dakgalbi', phNotes: 'Write your memories here...',
    phProfileName: 'Your name', phProfileBio: 'A little about yourself...',
  },
  ko: {
    appTitle: '나의 서울 지도', tabPlaces: '내 장소', tabFriends: '친구',
    sectionVisited: '방문함', sectionWishlist: '가고 싶어',
    filterAll: '전체',
    cats: { Restaurant: '식당', Cafe: '카페', Entertainment: '엔터테인먼트', Shop: '쇼핑', Other: '기타' },
    searchPlaceholder: '서울의 장소를 검색하세요...', friendSearchPlaceholder: '이름으로 검색...',
    friendRequests: '친구 요청', myFriends: '내 친구',
    btnAccept: '수락', btnDecline: '거절', btnViewMap: '지도 보기',
    noFriends: '아직 친구가 없어요. 위에서 검색해보세요!', noneYet: '아직 없어요',
    addPlace: '새 장소 추가', editPlace: '장소 수정',
    labelName: '장소 이름', labelCategory: '카테고리', labelDate: '방문 날짜', labelNotes: '메모',
    btnSave: '저장', btnCancel: '취소',
    statusVisited: '✓ 방문함', statusWishlist: '♡ 가고 싶어',
    btnDelete: '삭제', btnEdit: '수정', btnClose: '닫기',
    myProfile: '내 프로필', btnChangePhoto: '사진 변경',
    labelProfileName: '이름', labelBio: '소개', myStats: '내 통계',
    btnSaveProfile: '프로필 저장', btnSignOut: '로그아웃',
    signinSubtitle: '나만의 서울 일기', btnSignIn: 'Google로 로그인',
    backToMyMap: '← 내 지도',
    cropTitle: '사진 조정', cropHint: '드래그로 이동 · 스크롤로 확대', btnUsePhoto: '사진 사용',
    settingsTitle: '설정', settingsLang: '언어', settingsBtn: '설정',
    statsVisited: '방문', statsWishlist: '가고 싶어', statsLoves: '즐겨 찾는',
    friendMapSuffix: '의 지도', noPlacesAlert: '아직 등록한 장소가 없어요!',
    statsTotal: (n) => `총 ${n}개의 장소`,
    statsFavorite: (cat, n) => `자주 찾는 곳: <strong>${cat}</strong> (${n}회)`,
    statsEmpty: '장소를 추가하면 통계를 볼 수 있어요!',
    visitedLabel: '방문일:', noNotes: '(메모 없음)',
    deleteConfirm: '이 장소를 삭제할까요?', nameMissing: '장소 이름을 입력해 주세요!',
    phName: '예) 명동 닭갈비', phNotes: '기억을 적어보세요...',
    phProfileName: '이름을 입력하세요', phProfileBio: '나를 소개해 주세요...',
  },
  zh: {
    appTitle: '我的首尔地图', tabPlaces: '我的地点', tabFriends: '朋友',
    sectionVisited: '已去过', sectionWishlist: '想去',
    filterAll: '全部',
    cats: { Restaurant: '餐厅', Cafe: '咖啡厅', Entertainment: '娱乐', Shop: '购物', Other: '其他' },
    searchPlaceholder: '搜索首尔的地点...', friendSearchPlaceholder: '按姓名搜索...',
    friendRequests: '好友申请', myFriends: '我的朋友',
    btnAccept: '接受', btnDecline: '拒绝', btnViewMap: '查看地图',
    noFriends: '还没有朋友，在上面搜索吧！', noneYet: '暂无',
    addPlace: '添加新地点', editPlace: '编辑地点',
    labelName: '地点名称', labelCategory: '类别', labelDate: '到访日期', labelNotes: '备注',
    btnSave: '保存', btnCancel: '取消',
    statusVisited: '✓ 已去过', statusWishlist: '♡ 想去',
    btnDelete: '删除', btnEdit: '编辑', btnClose: '关闭',
    myProfile: '我的资料', btnChangePhoto: '更换照片',
    labelProfileName: '姓名', labelBio: '简介', myStats: '我的统计',
    btnSaveProfile: '保存资料', btnSignOut: '退出登录',
    signinSubtitle: '你的首尔私密日记', btnSignIn: '使用Google登录',
    backToMyMap: '← 我的地图',
    cropTitle: '调整照片', cropHint: '拖动移动 · 滚动缩放', btnUsePhoto: '使用此照片',
    settingsTitle: '设置', settingsLang: '语言', settingsBtn: '设置',
    statsVisited: '已去过', statsWishlist: '想去', statsLoves: '最爱',
    friendMapSuffix: '的地图', noPlacesAlert: '还没有添加地点！',
    statsTotal: (n) => `共 ${n} 个地点`,
    statsFavorite: (cat, n) => `最爱：<strong>${cat}</strong>（${n} 次）`,
    statsEmpty: '添加地点后即可查看统计！',
    visitedLabel: '到访日期:', noNotes: '（无备注）',
    deleteConfirm: '确定删除这个地点吗？', nameMissing: '请输入地点名称！',
    phName: '例）明洞炸鸡排骨', phNotes: '写下你的记忆...',
    phProfileName: '请输入姓名', phProfileBio: '介绍一下自己吧...',
  },
};

let currentLang = localStorage.getItem('seoulLang') || 'en';
function t(key) { return TRANSLATIONS[currentLang][key] ?? TRANSLATIONS.en[key]; }

function applyLanguage() {
  const L = TRANSLATIONS[currentLang];
  document.title = L.appTitle;

  // Topbar & tabs
  const h1 = document.querySelector('#topbar h1');
  if (h1) h1.childNodes[h1.childNodes.length - 1].textContent = ' ' + L.appTitle;
  document.getElementById('tab-btn-places').textContent = L.tabPlaces;
  document.getElementById('tab-friends-text').textContent = L.tabFriends;

  // Sidebar sections
  const titles = document.querySelectorAll('.places-section-title');
  if (titles[0]) titles[0].textContent = L.sectionVisited;
  if (titles[1]) titles[1].textContent = L.sectionWishlist;

  // Friends tab
  const reqTitles = document.querySelectorAll('.friends-section-title');
  if (reqTitles[0]) reqTitles[0].textContent = L.friendRequests;
  if (reqTitles[1]) reqTitles[1].textContent = L.myFriends;
  const fsi = document.getElementById('friend-search-input');
  if (fsi) fsi.placeholder = L.friendSearchPlaceholder;

  // Add/edit modal
  document.getElementById('modal-title').textContent = L.addPlace;
  document.querySelector('.status-btn[data-status="visited"]').textContent = L.statusVisited;
  document.querySelector('.status-btn[data-status="wishlist"]').textContent = L.statusWishlist;
  document.getElementById('label-name').textContent = L.labelName;
  document.getElementById('label-category').textContent = L.labelCategory;
  document.getElementById('label-date').textContent = L.labelDate;
  document.getElementById('label-notes').textContent = L.labelNotes;
  document.getElementById('btn-save').textContent = L.btnSave;
  document.getElementById('btn-cancel').textContent = L.btnCancel;
  document.getElementById('input-name').placeholder = L.phName;
  document.getElementById('input-notes').placeholder = L.phNotes;

  // Category <select> options
  document.querySelectorAll('#input-category option').forEach(opt => {
    opt.textContent = L.cats[opt.value] || opt.value;
  });

  // Detail modal
  document.getElementById('btn-delete').textContent = L.btnDelete;
  document.getElementById('btn-edit-place').textContent = L.btnEdit;
  document.getElementById('btn-close-detail').textContent = L.btnClose;

  // Profile panel
  document.getElementById('profile-panel-title').textContent = L.myProfile;
  document.getElementById('btn-change-photo').textContent = L.btnChangePhoto;
  document.getElementById('label-profile-name').textContent = L.labelProfileName;
  document.getElementById('label-profile-bio').textContent = L.labelBio;
  document.getElementById('label-my-stats').textContent = L.myStats;
  document.getElementById('btn-save-profile').textContent = L.btnSaveProfile;
  document.getElementById('btn-signout').textContent = L.btnSignOut;
  document.getElementById('profile-name').placeholder = L.phProfileName;
  document.getElementById('profile-bio').placeholder = L.phProfileBio;

  // Sign-in screen
  document.querySelector('#signin-card p').textContent = L.signinSubtitle;
  document.getElementById('signin-btn-text').textContent = L.btnSignIn;

  // Search
  document.getElementById('search-input').placeholder = L.searchPlaceholder;

  // Map banner
  document.getElementById('btn-back-to-my-map').textContent = L.backToMyMap;

  // Crop modal
  document.querySelector('#crop-modal h3').textContent = L.cropTitle;
  document.querySelector('.crop-hint').textContent = L.cropHint;
  document.getElementById('btn-crop-confirm').textContent = L.btnUsePhoto;
  document.getElementById('btn-crop-cancel').textContent = L.btnCancel;

  // Settings panel
  document.getElementById('settings-title').textContent = L.settingsTitle;
  document.getElementById('settings-lang-label').textContent = L.settingsLang;
  document.getElementById('settings-btn-text').textContent = L.settingsBtn;

  // Active language button
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === currentLang);
  });

  // Re-render dynamic content in the current language
  renderFilterButtons();
  renderList(currentFilter);
  renderStats();
}


// ─── 1. FIREBASE SETUP ────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBxuO8v709_l0iR-nuONUv1epGDK1YfFeo",
  authDomain: "my-seoul-map.firebaseapp.com",
  projectId: "my-seoul-map",
  storageBucket: "my-seoul-map.firebasestorage.app",
  messagingSenderId: "348065694038",
  appId: "1:348065694038:web:bdf6bfa6a1c17a356196f7"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

// Tracks the currently signed-in user (null = not signed in)
let currentUser = null;

// Holds the Firestore "unsubscribe" function so we can stop
// listening for place updates when the user signs out
let unsubscribePlaces = null;


// ─── 2. SET UP THE MAP ────────────────────────────────────────
const SEOUL_CENTER = [37.5665, 126.9780];
const map = L.map('map').setView(SEOUL_CENTER, 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

// Local array of places (kept in sync with Firestore via onSnapshot)
let places = [];

let pendingLatLng = null;   // coordinates of the last map click
let pendingAddressEn = '';  // EN address from the search result when "+" is clicked
let detailPlaceId = null;   // id of the place shown in the detail modal
let editingPlaceId = null;  // id of the place being edited (null = adding new)
const markerMap = {};       // leaflet marker objects, keyed by place id


// ─── 3. CATEGORY COLORS & ICONS ───────────────────────────────
const categoryColors = {
  'Restaurant':    '#c9a99a',
  'Cafe':          '#c4a882',
  'Entertainment': '#9aab9a',
  'Shop':          '#b5a8c0',
  'Other':         '#b8afa8',
};

const categoryIcons = {
  'Restaurant': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
    <path d="M7 2v20"/>
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/>
    <path d="M21 15v7"/>
  </svg>`,

  'Cafe': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 3 Q7 1 8 3"/>
    <path d="M10 3 Q11 1 12 3"/>
    <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
  </svg>`,

  'Entertainment': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3 L13.5 9 L20 10 L13.5 11 L12 21 L10.5 11 L4 10 L10.5 9 Z"/>
    <line x1="4" y1="3" x2="4" y2="6"/>
    <line x1="2.5" y1="4.5" x2="5.5" y2="4.5"/>
  </svg>`,

  'Shop': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>`,

  'Other': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 21 L12 17 L5 21 V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>
  </svg>`,
};

const categories = ['Restaurant', 'Cafe', 'Entertainment', 'Shop', 'Other'];


// ─── 3b. ADDRESS HELPERS ──────────────────────────────────────
// Strip country name and postal code, keep first 3 meaningful parts
function shortenAddress(displayName, lang) {
  if (!displayName) return '';
  const skip = lang === 'ko' ? ['대한민국'] : ['South Korea'];
  const parts = displayName.split(',').map(p => p.trim())
    .filter(p => !skip.includes(p) && !/^\d{4,6}$/.test(p));
  return parts.slice(0, 3).join(', ');
}

async function reverseGeocode(lat, lng, lang) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(url, { headers: { 'Accept-Language': lang } });
    const data = await res.json();
    return shortenAddress(data.display_name, lang);
  } catch { return ''; }
}

// Fetch KO address in the background and update Firestore if missing
async function ensureAddresses(place) {
  if (place.addressKo && place.addressEn) return;
  const updates = {};
  if (!place.addressEn) updates.addressEn = await reverseGeocode(place.lat, place.lng, 'en');
  if (!place.addressKo) updates.addressKo = await reverseGeocode(place.lat, place.lng, 'ko');
  if (Object.keys(updates).length) {
    await placesRef().doc(place.id).update(updates);
    Object.assign(place, updates);
  }
}


// ─── 4. MARKER HELPERS ────────────────────────────────────────
function makeMarkerIcon(category, status) {
  const color = categoryColors[category] || '#b8afa8';
  const isWishlist = status === 'wishlist';
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 22px; height: 22px;
      background: ${isWishlist ? 'white' : color};
      border: 3px solid ${isWishlist ? color : 'white'};
      border-radius: 50%;
      box-shadow: 0 2px 10px rgba(0,0,0,0.45), 0 0 0 1.5px rgba(0,0,0,0.18);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function addMarkerToMap(place) {
  // Don't add a duplicate marker if one already exists
  if (markerMap[place.id]) return;

  const marker = L.marker([place.lat, place.lng], {
    icon: makeMarkerIcon(place.category, place.status)
  }).addTo(map);

  marker.on('click', () => openDetailModal(place.id));
  markerMap[place.id] = marker;
}

function removeMarkerFromMap(id) {
  if (markerMap[id]) {
    map.removeLayer(markerMap[id]);
    delete markerMap[id];
  }
}


// ─── 5. RENDER THE SIDEBAR LIST ────────────────────────────────
function renderList(filterCat = 'all') {
  const filtered = filterCat === 'all'
    ? places
    : places.filter(p => p.category === filterCat);

  const visited  = filtered.filter(p => p.status !== 'wishlist');
  const wishlist = filtered.filter(p => p.status === 'wishlist');

  document.getElementById('count-visited').textContent  = visited.length;
  document.getElementById('count-wishlist').textContent = wishlist.length;

  renderPlaceGroup('place-list-visited',  visited);
  renderPlaceGroup('place-list-wishlist', wishlist);
}

function renderPlaceGroup(listId, items) {
  const list = document.getElementById(listId);
  list.innerHTML = '';

  if (items.length === 0) {
    const li = document.createElement('li');
    li.style.cssText = 'color:#b8afa8;font-size:0.85rem;padding:6px 2px;font-style:italic;';
    li.textContent = t('noneYet');
    list.appendChild(li);
    return;
  }

  items.forEach(place => {
    const li = document.createElement('li');
    li.className = 'place-card';
    const icon = categoryIcons[place.category] || categoryIcons['Other'];
    const catLabel = t('cats')[place.category] || place.category;
    const addrKo = place.addressKo ? `<div class="card-address">${place.addressKo}</div>` : '';
    const addrEn = place.addressEn ? `<div class="card-address card-address-en">${place.addressEn}</div>` : '';
    li.innerHTML = `
      <div class="card-name">${place.name}</div>
      <div class="card-meta">
        <span class="card-icon" style="color:${categoryColors[place.category]}">${icon}</span>
        ${catLabel}${place.date ? ' · ' + place.date : ''}
      </div>
      ${addrKo}${addrEn}
    `;
    li.addEventListener('click', () => {
      map.flyTo([place.lat, place.lng], 16);
      openDetailModal(place.id);
    });
    list.appendChild(li);
  });
}


// ─── 6. FIRESTORE: PLACES ─────────────────────────────────────
// Returns a reference to this user's places collection in Firestore
function placesRef() {
  return db.collection('users').doc(currentUser.uid).collection('places');
}

// Starts listening for real-time place updates from Firestore.
// onSnapshot fires immediately with all existing places, then again
// whenever anything is added, changed, or deleted.
function setupPlacesListener() {
  unsubscribePlaces = placesRef().onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      const place = { id: change.doc.id, ...data };

      if (change.type === 'added') {
        places.push(place);
        addMarkerToMap(place);
        // Quietly backfill addresses for places that don't have them yet
        if (!place.addressEn || !place.addressKo) ensureAddresses(place);
      } else if (change.type === 'removed') {
        places = places.filter(p => p.id !== place.id);
        removeMarkerFromMap(place.id);
      }
    });
    renderList(currentFilter);
  });
}

// Stops listening and clears all local data (called on sign-out)
function teardownPlaces() {
  if (unsubscribePlaces) {
    unsubscribePlaces();
    unsubscribePlaces = null;
  }
  places = [];
  Object.keys(markerMap).forEach(id => removeMarkerFromMap(id));
  renderList();
}


// ─── 7. ADD PLACE MODAL ───────────────────────────────────────

// Status toggle — wire up the two buttons
document.querySelectorAll('.status-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Show/hide date field based on status
    const isWishlist = btn.dataset.status === 'wishlist';
    document.getElementById('label-date').style.display = isWishlist ? 'none' : '';
    document.getElementById('input-date').style.display  = isWishlist ? 'none' : '';
  });
});

function getSelectedStatus() {
  return document.querySelector('.status-btn.active')?.dataset.status || 'visited';
}

function setStatus(status) {
  document.querySelectorAll('.status-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.status === status);
  });
  const isWishlist = status === 'wishlist';
  document.getElementById('label-date').style.display = isWishlist ? 'none' : '';
  document.getElementById('input-date').style.display  = isWishlist ? 'none' : '';
}

function openAddModal(latlng, addressEn = '') {
  pendingLatLng = latlng;
  pendingAddressEn = addressEn;
  document.getElementById('input-name').value = '';
  document.getElementById('input-notes').value = '';
  document.getElementById('input-category').value = 'Restaurant';
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('input-date').value = today;
  setStatus('visited');
  document.getElementById('modal-overlay').classList.remove('hidden');
}

document.getElementById('btn-cancel').addEventListener('click', () => {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-title').textContent = t('addPlace');
  pendingLatLng = null;
  editingPlaceId = null;
});

document.getElementById('btn-save').addEventListener('click', async () => {
  const name = document.getElementById('input-name').value.trim();
  if (!name) { alert(t('nameMissing')); return; }

  if (editingPlaceId) {
    // ── Editing an existing place ──
    const status = getSelectedStatus();
    const updates = {
      name,
      category: document.getElementById('input-category').value,
      date:     status === 'wishlist' ? '' : document.getElementById('input-date').value,
      notes:    document.getElementById('input-notes').value.trim(),
      status,
    };
    await placesRef().doc(editingPlaceId).update(updates);
    // Update the local array so the detail modal reflects the change immediately
    const idx = places.findIndex(p => p.id === editingPlaceId);
    if (idx !== -1) Object.assign(places[idx], updates);
    // Refresh the marker color in case category changed
    removeMarkerFromMap(editingPlaceId);
    if (idx !== -1) addMarkerToMap(places[idx]);
    editingPlaceId = null;
  } else {
    // ── Adding a new place ──
    const status = getSelectedStatus();
    const newPlace = {
      name,
      category: document.getElementById('input-category').value,
      date:     status === 'wishlist' ? '' : document.getElementById('input-date').value,
      notes:    document.getElementById('input-notes').value.trim(),
      status,
      lat:      pendingLatLng.lat,
      lng:      pendingLatLng.lng,
      addressEn: pendingAddressEn,
      addressKo: '',
    };
    const docRef = await placesRef().add(newPlace);
    // Fetch KO address in the background without blocking save
    reverseGeocode(pendingLatLng.lat, pendingLatLng.lng, 'ko').then(addressKo => {
      if (addressKo) docRef.update({ addressKo });
    });
    pendingLatLng = null;
    pendingAddressEn = '';
  }

  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-title').textContent = t('addPlace');
  renderList(currentFilter);
});


// ─── 8. DETAIL MODAL ──────────────────────────────────────────
function openDetailModal(id) {
  const place = places.find(p => p.id === id);
  if (!place) return;

  detailPlaceId = id;
  document.getElementById('detail-name').textContent = place.name;

  const icon = categoryIcons[place.category] || categoryIcons['Other'];
  const catLabel = t('cats')[place.category] || place.category;
  document.getElementById('detail-category').innerHTML =
    `<span style="color:${categoryColors[place.category]};vertical-align:middle">${icon}</span> ${catLabel}`;
  document.getElementById('detail-date').textContent = place.date ? `${t('visitedLabel')} ${place.date}` : '';
  document.getElementById('detail-notes').textContent = place.notes || t('noNotes');

  const addrEl = document.getElementById('detail-address');
  const parts = [place.addressKo, place.addressEn].filter(Boolean);
  addrEl.innerHTML = parts.map(a => `<span>${a}</span>`).join('');
  addrEl.style.display = parts.length ? '' : 'none';

  document.getElementById('detail-overlay').classList.remove('hidden');
}

document.getElementById('btn-close-detail').addEventListener('click', () => {
  document.getElementById('detail-overlay').classList.add('hidden');
  detailPlaceId = null;
});

document.getElementById('btn-close-friend-profile').addEventListener('click', () => {
  document.getElementById('friend-profile-overlay').classList.add('hidden');
});

document.getElementById('friend-profile-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget)
    e.currentTarget.classList.add('hidden');
});

document.getElementById('btn-edit-place').addEventListener('click', () => {
  const place = places.find(p => p.id === detailPlaceId);
  if (!place) return;

  // Pre-fill the add/edit modal with this place's current data
  editingPlaceId = detailPlaceId;
  document.getElementById('modal-title').textContent = t('editPlace');
  document.getElementById('input-name').value     = place.name;
  document.getElementById('input-category').value = place.category;
  document.getElementById('input-date').value     = place.date || '';
  document.getElementById('input-notes').value    = place.notes || '';
  setStatus(place.status || 'visited');

  document.getElementById('detail-overlay').classList.add('hidden');
  document.getElementById('modal-overlay').classList.remove('hidden');
});

document.getElementById('btn-delete').addEventListener('click', async () => {
  if (!confirm(t('deleteConfirm'))) return;

  // Delete from Firestore — onSnapshot handles removing the marker and list item
  await placesRef().doc(detailPlaceId).delete();

  document.getElementById('detail-overlay').classList.add('hidden');
  detailPlaceId = null;
});


// ─── 9. FILTER BUTTONS ────────────────────────────────────────
let currentFilter = 'all';

function renderFilterButtons() {
  const container = document.getElementById('filters');
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn' + (currentFilter === 'all' ? ' active' : '');
  allBtn.textContent = t('filterAll');
  allBtn.addEventListener('click', () => { currentFilter = 'all'; renderFilterButtons(); renderList('all'); });
  container.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (currentFilter === cat ? ' active' : '');
    btn.innerHTML = `<span class="btn-icon">${categoryIcons[cat]}</span>${t('cats')[cat] || cat}`;
    btn.addEventListener('click', () => { currentFilter = cat; renderFilterButtons(); renderList(cat); });
    container.appendChild(btn);
  });
}


// Map click is disabled — places are added via the search bar only


// ─── 11. SEARCH BAR ───────────────────────────────────────────
const searchInput   = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
let searchTimer = null;

searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  const query = searchInput.value.trim();
  if (!query) { searchResults.classList.add('hidden'); return; }
  searchTimer = setTimeout(() => fetchSearchResults(query), 400);
});

async function fetchSearchResults(query) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=kr`;
    const response = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await response.json();
    showSearchResults(data);
  } catch (err) {
    showSearchResults([]);
  }
}

function showSearchResults(results) {
  searchResults.innerHTML = '';
  searchResults.classList.remove('hidden');

  if (results.length === 0) {
    const li = document.createElement('li');
    li.className = 'no-result';
    li.textContent = 'No results found';
    searchResults.appendChild(li);
    return;
  }

  results.forEach(result => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    const li = document.createElement('li');
    li.className = 'search-result-row';

    // Location name — clicking flies the map there
    const nameSpan = document.createElement('span');
    nameSpan.className = 'result-name';
    nameSpan.textContent = result.display_name;
    nameSpan.addEventListener('click', () => {
      map.flyTo([lat, lng], 17);
      searchInput.value = '';
      searchResults.classList.add('hidden');
    });

    // "+" button — flies there AND opens the add place modal
    const addBtn = document.createElement('button');
    addBtn.className = 'result-add-btn';
    addBtn.title = 'Add this place';
    addBtn.textContent = '+';
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      map.flyTo([lat, lng], 17);
      searchInput.value = '';
      searchResults.classList.add('hidden');
      openAddModal({ lat, lng }, shortenAddress(result.display_name, 'en'));
    });

    li.appendChild(nameSpan);
    li.appendChild(addBtn);
    searchResults.appendChild(li);
  });
}

document.addEventListener('click', (e) => {
  if (!document.getElementById('search-container').contains(e.target))
    searchResults.classList.add('hidden');
});

document.getElementById('search-container').addEventListener('click', (e) => {
  e.stopPropagation();
});


// ─── 12. PROFILE PAGE ─────────────────────────────────────────
let profile = {};

// Updates the name and avatar shown in the topbar profile button
function updateUsernameDisplay() {
  document.getElementById('profile-username').textContent = profile.name || '';

  const photo = localStorage.getItem('seoulCustomPhoto') || profile.googlePhotoURL || null;
  const avatarImg = document.getElementById('topbar-avatar');
  const avatarDefault = document.getElementById('topbar-avatar-default');

  if (photo) {
    avatarImg.src = photo;
    avatarImg.classList.remove('hidden');
    avatarDefault.classList.add('hidden');
  } else {
    avatarImg.classList.add('hidden');
    avatarDefault.classList.remove('hidden');
  }
}

// Loads profile from Firestore. On first sign-in, auto-fills from Google account.
async function loadProfile() {
  const ref = db.collection('users').doc(currentUser.uid);
  const doc = await ref.get();

  if (doc.exists && doc.data().profile) {
    profile = doc.data().profile;
  } else {
    // First time this user signs in — seed from their Google account
    profile = {
      name: currentUser.displayName || '',
      bio:  '',
      googlePhotoURL: currentUser.photoURL || '',
    };
    await ref.set({ profile }, { merge: true });
  }
  updateUsernameDisplay();
}

// Saves name & bio to Firestore. Custom photo stays in localStorage
// because base64 images can be too large for Firestore documents.
async function saveProfile() {
  profile.name = document.getElementById('profile-name').value.trim();
  profile.bio  = document.getElementById('profile-bio').value.trim();
  await db.collection('users').doc(currentUser.uid).set({ profile }, { merge: true });
  // Also update the public profile so friends can find this user by name
  await savePublicProfile();
  updateUsernameDisplay();
}

function openProfile() {
  document.getElementById('profile-name').value = profile.name || '';
  document.getElementById('profile-bio').value  = profile.bio  || '';

  // Show custom uploaded photo, or fall back to Google photo, or default avatar
  const customPhoto = localStorage.getItem('seoulCustomPhoto');
  const photoToShow = customPhoto || profile.googlePhotoURL || null;

  if (photoToShow) {
    document.getElementById('profile-photo-img').src = photoToShow;
    document.getElementById('profile-photo-img').classList.remove('hidden');
    document.getElementById('default-avatar').classList.add('hidden');
  } else {
    document.getElementById('profile-photo-img').classList.add('hidden');
    document.getElementById('default-avatar').classList.remove('hidden');
  }

  renderStats();
  document.getElementById('profile-overlay').classList.remove('hidden');
}

function renderStats() {
  const total = places.length;
  document.getElementById('stats-total').innerHTML = t('statsTotal')(total);

  const counts = {};
  categories.forEach(cat => counts[cat] = 0);
  places.forEach(p => { if (counts[p.category] !== undefined) counts[p.category]++; });

  const maxCount = Math.max(...Object.values(counts), 1);
  const breakdown = document.getElementById('stats-breakdown');
  breakdown.innerHTML = '';

  categories.forEach(cat => {
    const count = counts[cat];
    const pct   = Math.round((count / maxCount) * 100);
    const row = document.createElement('div');
    row.className = 'stat-row';
    row.innerHTML = `
      <span class="stat-icon" style="color:${categoryColors[cat]}">${categoryIcons[cat]}</span>
      <span style="min-width:88px;font-size:0.8rem">${t('cats')[cat] || cat}</span>
      <div class="stat-bar-wrap">
        <div class="stat-bar" style="width:${pct}%;background:${categoryColors[cat]}"></div>
      </div>
      <span class="stat-count">${count}</span>
    `;
    breakdown.appendChild(row);
  });

  const favorite = categories.reduce((a, b) => counts[a] >= counts[b] ? a : b);
  const favEl = document.getElementById('stats-favorite');
  favEl.innerHTML = total === 0
    ? t('statsEmpty')
    : t('statsFavorite')(t('cats')[favorite] || favorite, counts[favorite]);
}

// "Change Photo" — opens file picker, then shows crop modal
let cropper = null;

document.getElementById('btn-change-photo').addEventListener('click', () => {
  document.getElementById('photo-upload').click();
});

document.getElementById('photo-upload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const cropImage = document.getElementById('crop-image');
    cropImage.src = ev.target.result;

    // Show the crop modal
    document.getElementById('crop-modal-overlay').classList.remove('hidden');

    // Destroy any previous cropper instance before creating a new one
    if (cropper) { cropper.destroy(); cropper = null; }

    cropImage.onload = () => {
      cropper = new Cropper(cropImage, {
        aspectRatio: 1,         // square = perfect circle
        viewMode: 1,            // keep image within crop box
        dragMode: 'move',       // drag moves the image, not the box
        autoCropArea: 0.9,
        cropBoxResizable: false,
        cropBoxMovable: false,
        toggleDragModeOnDblclick: false,
        guides: false,
        center: false,
        highlight: false,
      });
    };
  };
  reader.readAsDataURL(file);
  // Reset so the same file can be re-selected if needed
  e.target.value = '';
});

// Confirm crop — draw to canvas, save as base64 in localStorage
document.getElementById('btn-crop-confirm').addEventListener('click', () => {
  if (!cropper) return;

  const canvas = cropper.getCroppedCanvas({
    width: 400,
    height: 400,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
  });

  const base64 = canvas.toDataURL('image/jpeg', 0.88);
  localStorage.setItem('seoulCustomPhoto', base64);

  document.getElementById('profile-photo-img').src = base64;
  document.getElementById('profile-photo-img').classList.remove('hidden');
  document.getElementById('default-avatar').classList.add('hidden');

  // Update the topbar avatar immediately
  updateUsernameDisplay();

  cropper.destroy();
  cropper = null;
  document.getElementById('crop-modal-overlay').classList.add('hidden');
});

// Cancel crop
document.getElementById('btn-crop-cancel').addEventListener('click', () => {
  if (cropper) { cropper.destroy(); cropper = null; }
  document.getElementById('crop-modal-overlay').classList.add('hidden');
});

document.getElementById('btn-save-profile').addEventListener('click', async () => {
  try {
    await saveProfile();
    document.getElementById('profile-overlay').classList.add('hidden');
  } catch (err) {
    alert('Could not save profile: ' + err.message);
  }
});

document.getElementById('btn-close-profile').addEventListener('click', () => {
  document.getElementById('profile-overlay').classList.add('hidden');
});

document.getElementById('btn-profile').addEventListener('click', openProfile);


// ─── 13. AUTH: SIGN IN / SIGN OUT ─────────────────────────────

// Sign in with a Google popup window
document.getElementById('btn-google-signin').addEventListener('click', async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await auth.signInWithPopup(provider);
    // onAuthStateChanged below will handle the rest
  } catch (err) {
    alert('Sign in failed. Please try again.');
  }
});

// Sign out
document.getElementById('btn-signout').addEventListener('click', async () => {
  await auth.signOut();
  document.getElementById('profile-overlay').classList.add('hidden');
});


// ─── 14. FRIENDS SYSTEM ───────────────────────────────────────

// ── Firestore refs ──
function publicProfileRef(uid) {
  return db.collection('publicProfiles').doc(uid);
}
function friendRequestsRef(uid) {
  return db.collection('users').doc(uid).collection('friendRequests');
}
function friendsRef(uid) {
  return db.collection('users').doc(uid).collection('friends');
}

// ── Save to public profile so others can search for you ──
async function savePublicProfile() {
  const name = profile.name || currentUser.displayName || '';
  const photoURL = localStorage.getItem('seoulCustomPhoto') || profile.googlePhotoURL || '';
  await publicProfileRef(currentUser.uid).set({
    uid: currentUser.uid,
    name,
    nameLower: name.toLowerCase(),
    photoURL,
    bio: profile.bio || '',
  }, { merge: true });
}

// ── Sidebar tab switching ──
function switchTab(tab) {
  const isPlaces = tab === 'places';
  document.getElementById('tab-places').classList.toggle('hidden', !isPlaces);
  document.getElementById('tab-friends').classList.toggle('hidden', isPlaces);
  document.getElementById('tab-btn-places').classList.toggle('active', isPlaces);
  document.getElementById('tab-btn-friends').classList.toggle('active', !isPlaces);
}

document.getElementById('tab-btn-places').addEventListener('click', () => switchTab('places'));
document.getElementById('tab-btn-friends').addEventListener('click', () => switchTab('friends'));

// ── Search users by name ──
const friendSearchInput   = document.getElementById('friend-search-input');
const friendSearchResults = document.getElementById('friend-search-results');
let friendSearchTimer = null;

friendSearchInput.addEventListener('input', () => {
  clearTimeout(friendSearchTimer);
  const q = friendSearchInput.value.trim();
  if (!q) { friendSearchResults.classList.add('hidden'); return; }
  friendSearchTimer = setTimeout(() => searchUsers(q), 400);
});

// Close results when clicking outside the search wrap
document.addEventListener('click', (e) => {
  if (!document.getElementById('friend-search-wrap').contains(e.target))
    friendSearchResults.classList.add('hidden');
});

async function searchUsers(query) {
  const q = query.toLowerCase();
  try {
    const snap = await db.collection('publicProfiles')
      .orderBy('nameLower')
      .startAt(q)
      .endAt(q + '')
      .limit(8)
      .get();

    const results = snap.docs.map(d => d.data()).filter(u => u.uid !== currentUser.uid);
    renderUserSearchResults(results);
  } catch (err) {
    console.error('User search error:', err);
  }
}

async function renderUserSearchResults(users) {
  friendSearchResults.innerHTML = '';
  friendSearchResults.classList.remove('hidden');

  if (users.length === 0) {
    const li = document.createElement('li');
    li.className = 'friend-search-no-result';
    li.textContent = 'No users found';
    friendSearchResults.appendChild(li);
    return;
  }

  // Check who is already a friend
  const myFriendsSnap = await friendsRef(currentUser.uid).get();
  const myFriendUids = new Set(myFriendsSnap.docs.map(d => d.id));

  users.forEach(user => {
    const li = document.createElement('li');
    li.className = 'friend-search-row';

    const photo = user.photoURL
      ? `<img src="${user.photoURL}" class="friend-avatar-sm" onerror="this.style.display='none'" />`
      : `<div class="friend-avatar-sm friend-avatar-default"></div>`;

    const action = myFriendUids.has(user.uid)
      ? `<span class="friend-already">Friends ✓</span>`
      : `<button class="btn-add-friend" data-uid="${user.uid}" data-name="${user.name}">Add</button>`;

    li.innerHTML = `${photo}<span class="friend-search-name">${user.name}</span>${action}`;
    friendSearchResults.appendChild(li);
  });

  friendSearchResults.querySelectorAll('.btn-add-friend').forEach(btn => {
    btn.addEventListener('click', async () => {
      btn.textContent = 'Sending…';
      btn.disabled = true;
      try {
        await sendFriendRequest(btn.dataset.uid);
        btn.textContent = 'Sent!';
      } catch (err) {
        btn.textContent = 'Failed';
        console.error(err);
      }
    });
  });
}

// ── Send a friend request ──
async function sendFriendRequest(targetUid) {
  const myData = (await publicProfileRef(currentUser.uid).get()).data() || {};
  await friendRequestsRef(targetUid).doc(currentUser.uid).set({
    fromUid: currentUser.uid,
    fromName: myData.name || currentUser.displayName || 'Someone',
    fromPhotoURL: myData.photoURL || currentUser.photoURL || '',
    status: 'pending',
    sentAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

// ── Listen for incoming friend requests ──
let requestsUnsubscribe = null;

function setupRequestsListener() {
  if (requestsUnsubscribe) requestsUnsubscribe();
  requestsUnsubscribe = friendRequestsRef(currentUser.uid)
    .where('status', '==', 'pending')
    .onSnapshot(snap => renderFriendRequests(snap.docs.map(d => d.data())));
}

function renderFriendRequests(requests) {
  const section = document.getElementById('friend-requests-section');
  const list    = document.getElementById('friend-requests-list');
  const badge   = document.getElementById('requests-badge');

  if (requests.length === 0) {
    section.classList.add('hidden');
    badge.classList.add('hidden');
    return;
  }

  badge.textContent = requests.length;
  badge.classList.remove('hidden');
  section.classList.remove('hidden');
  list.innerHTML = '';

  requests.forEach(req => {
    const li = document.createElement('li');
    li.className = 'friend-request-card';

    const photo = req.fromPhotoURL
      ? `<img src="${req.fromPhotoURL}" class="friend-avatar-sm" onerror="this.style.display='none'" />`
      : `<div class="friend-avatar-sm friend-avatar-default"></div>`;

    li.innerHTML = `
      ${photo}
      <span class="friend-req-name">${req.fromName}</span>
      <div class="friend-req-actions">
        <button class="btn-accept" data-uid="${req.fromUid}">${t('btnAccept')}</button>
        <button class="btn-decline" data-uid="${req.fromUid}">${t('btnDecline')}</button>
      </div>
    `;
    list.appendChild(li);
  });

  list.querySelectorAll('.btn-accept').forEach(btn =>
    btn.addEventListener('click', () => acceptRequest(btn.dataset.uid)));
  list.querySelectorAll('.btn-decline').forEach(btn =>
    btn.addEventListener('click', () => declineRequest(btn.dataset.uid)));
}

// ── Accept a friend request (adds both sides mutually) ──
async function acceptRequest(fromUid) {
  const reqRef = friendRequestsRef(currentUser.uid).doc(fromUid);
  const req    = (await reqRef.get()).data();
  if (!req) return;
  const myData = (await publicProfileRef(currentUser.uid).get()).data() || {};

  // Mark as accepted first — this immediately removes it from the listener
  // query (which filters status == 'pending'), so the UI updates right away
  await reqRef.update({ status: 'accepted' });

  await friendsRef(currentUser.uid).doc(fromUid).set({
    uid: fromUid, name: req.fromName, photoURL: req.fromPhotoURL,
    addedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  await friendsRef(fromUid).doc(currentUser.uid).set({
    uid: currentUser.uid,
    name: myData.name || currentUser.displayName || 'Someone',
    photoURL: myData.photoURL || currentUser.photoURL || '',
    addedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  await reqRef.delete();
}

async function declineRequest(fromUid) {
  await friendRequestsRef(currentUser.uid).doc(fromUid).delete();
}

// ── Listen for friends list ──
let friendsUnsubscribe = null;
let currentFriendUids = new Set(); // track who is already a friend

function setupFriendsListener() {
  if (friendsUnsubscribe) friendsUnsubscribe();
  friendsUnsubscribe = friendsRef(currentUser.uid)
    .onSnapshot(snap => {
      const friends = snap.docs.map(d => d.data());
      currentFriendUids = new Set(friends.map(f => f.uid));
      cleanupStaleRequests();
      renderFriendsList(friends);
    });
}

// Delete any pending requests from people who are already friends
// (cleans up stale requests left over from a failed previous accept)
function cleanupStaleRequests() {
  currentFriendUids.forEach(uid => {
    friendRequestsRef(currentUser.uid).doc(uid).get().then(doc => {
      if (doc.exists) doc.ref.delete();
    });
  });
}

function renderFriendsList(friends) {
  const list = document.getElementById('friends-list');
  list.innerHTML = '';

  if (friends.length === 0) {
    list.innerHTML = `<li class="friends-empty">${t('noFriends')}</li>`;
    return;
  }

  friends.forEach(friend => {
    const li = document.createElement('li');
    li.className = 'friend-card';

    const photo = friend.photoURL
      ? `<img src="${friend.photoURL}" class="friend-avatar-sm friend-avatar-clickable" onerror="this.style.display='none'" />`
      : `<div class="friend-avatar-sm friend-avatar-default friend-avatar-clickable"></div>`;

    li.innerHTML = `
      ${photo}
      <span class="friend-card-name">${friend.name}</span>
      <button class="btn-view-map" data-uid="${friend.uid}" data-name="${friend.name}">${t('btnViewMap')}</button>
    `;
    list.appendChild(li);
  });

  list.querySelectorAll('.btn-view-map').forEach(btn =>
    btn.addEventListener('click', () => viewFriendMap(btn.dataset.uid, btn.dataset.name)));

  list.querySelectorAll('.friend-avatar-clickable').forEach((avatar, i) => {
    avatar.addEventListener('click', () => openFriendProfile(friends[i]));
  });
}

// ── Friend profile popup ──
async function openFriendProfile(friend) {
  const overlay = document.getElementById('friend-profile-overlay');

  // Fill in photo and name right away
  const photoEl = document.getElementById('fp-photo');
  const defaultEl = document.getElementById('fp-avatar-default');
  if (friend.photoURL) {
    photoEl.src = friend.photoURL;
    photoEl.classList.remove('hidden');
    defaultEl.classList.add('hidden');
  } else {
    photoEl.classList.add('hidden');
    defaultEl.classList.remove('hidden');
  }
  document.getElementById('fp-name').textContent = friend.name;
  document.getElementById('fp-bio').textContent = '';
  document.getElementById('fp-stats').textContent = '...';

  overlay.classList.remove('hidden');

  // Fetch bio from publicProfiles
  const pub = (await publicProfileRef(friend.uid).get()).data() || {};
  document.getElementById('fp-bio').textContent = pub.bio || '';

  // Fetch their places for stats
  const placesSnap = await db.collection('users').doc(friend.uid).collection('places').get();
  const allPlaces = placesSnap.docs.map(d => d.data());
  const visited  = allPlaces.filter(p => p.status !== 'wishlist').length;
  const wishlist = allPlaces.filter(p => p.status === 'wishlist').length;

  const cats = {};
  allPlaces.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
  const topCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];

  const topCatLabel = topCat ? (t('cats')[topCat[0]] || topCat[0]) : '';
  let statsHTML = `<span>${visited} ${t('statsVisited')} · ${wishlist} ${t('statsWishlist')}</span>`;
  if (topCat) statsHTML += `<span class="fp-top-cat">${t('statsLoves')} ${topCatLabel}</span>`;
  document.getElementById('fp-stats').innerHTML = statsHTML;
}

// ── View a friend's map ──
let friendMarkers = [];

async function viewFriendMap(friendUid, friendName) {
  clearFriendMarkers();

  document.getElementById('friend-view-banner').classList.remove('hidden');
  document.getElementById('friend-view-name').textContent = `${friendName}${t('friendMapSuffix')}`;

  try {
    const snap = await db.collection('users').doc(friendUid).collection('places').get();
    snap.docs.forEach(doc => {
      const p = doc.data();
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 10,
        fillColor: '#9ab0bc',
        color: '#fff',
        weight: 2,
        fillOpacity: 0.9,
      }).addTo(map);
      marker.bindPopup(`<b>${p.name}</b><br><span style="color:#9a9088">${p.category}${p.date ? ' · ' + p.date : ''}</span>`);
      friendMarkers.push(marker);
    });

    if (friendMarkers.length > 0) {
      map.fitBounds(L.featureGroup(friendMarkers).getBounds().pad(0.2));
    } else {
      alert(`${friendName} ${t('noPlacesAlert')}`);
    }
  } catch (err) {
    console.error('Could not load friend map:', err);
    alert("Couldn't load their map. Make sure the Firestore rules are updated (see instructions).");
    clearFriendMarkers();
  }
}

function clearFriendMarkers() {
  friendMarkers.forEach(m => map.removeLayer(m));
  friendMarkers = [];
  document.getElementById('friend-view-banner').classList.add('hidden');
}

document.getElementById('btn-back-to-my-map').addEventListener('click', clearFriendMarkers);

// ── Teardown on sign-out ──
function teardownFriends() {
  if (requestsUnsubscribe) { requestsUnsubscribe(); requestsUnsubscribe = null; }
  if (friendsUnsubscribe)  { friendsUnsubscribe();  friendsUnsubscribe  = null; }
  clearFriendMarkers();
  renderFriendRequests([]);
  renderFriendsList([]);
  switchTab('places');
}

// This listener fires every time the auth state changes:
//   - when the page first loads (to check if already signed in)
//   - after signing in
//   - after signing out
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // ── User is signed in ──
    currentUser = user;
    document.getElementById('signin-screen').classList.add('hidden');

    await loadProfile();       // load name/bio/photo from Firestore
    setupPlacesListener();     // start real-time sync of places
    renderFilterButtons();     // build the sidebar filter buttons
    setupRequestsListener();   // listen for incoming friend requests
    setupFriendsListener();    // listen for friends list
    setupSectionToggles();     // collapsible Visited / Want to Go sections

  } else {
    // ── User is signed out ──
    currentUser = null;
    profile = {};
    updateUsernameDisplay();
    teardownPlaces();          // clear markers and local array
    teardownFriends();         // clear friends listeners and markers

    document.getElementById('signin-screen').classList.remove('hidden');
  }
});

function setupSectionToggles() {
  ['visited', 'wishlist'].forEach(key => {
    const header  = document.getElementById(`header-${key}`);
    const section = document.getElementById(`section-${key}`);
    header.addEventListener('click', () => section.classList.toggle('collapsed'));
  });
}

// ── Settings modal ──
document.getElementById('btn-settings').addEventListener('click', () => {
  document.getElementById('settings-overlay').classList.remove('hidden');
});

document.getElementById('btn-close-settings').addEventListener('click', () => {
  document.getElementById('settings-overlay').classList.add('hidden');
});

document.getElementById('settings-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
});

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;
    localStorage.setItem('seoulLang', currentLang);
    applyLanguage();
  });
});

// Apply saved language on first load
applyLanguage();
