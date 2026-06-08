// ============================================================
//  MY SEOUL MAP — app.js
// ============================================================


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


// ─── 4. MARKER HELPERS ────────────────────────────────────────
function makeMarkerIcon(category) {
  const color = categoryColors[category] || '#b8afa8';
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 22px; height: 22px;
      background: ${color};
      border: 3px solid white;
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
    icon: makeMarkerIcon(place.category)
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
  const list = document.getElementById('place-list');
  list.innerHTML = '';

  const filtered = filterCat === 'all'
    ? places
    : places.filter(p => p.category === filterCat);

  if (filtered.length === 0) {
    list.innerHTML = '<li style="color:#aaa;font-size:1rem;">No places yet. Click the map to add one!</li>';
    return;
  }

  filtered.forEach(place => {
    const li = document.createElement('li');
    li.className = 'place-card';
    const icon = categoryIcons[place.category] || categoryIcons['Other'];
    li.innerHTML = `
      <div class="card-name">${place.name}</div>
      <div class="card-meta">
        <span class="card-icon" style="color:${categoryColors[place.category]}">${icon}</span>
        ${place.category} · ${place.date || 'No date'}
      </div>
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
function openAddModal(latlng) {
  pendingLatLng = latlng;
  document.getElementById('input-name').value = '';
  document.getElementById('input-notes').value = '';
  document.getElementById('input-category').value = 'Restaurant';
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('input-date').value = today;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

document.getElementById('btn-cancel').addEventListener('click', () => {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-title').textContent = 'Add a New Place';
  pendingLatLng = null;
  editingPlaceId = null;
});

document.getElementById('btn-save').addEventListener('click', async () => {
  const name = document.getElementById('input-name').value.trim();
  if (!name) { alert('Please enter a name for this place!'); return; }

  if (editingPlaceId) {
    // ── Editing an existing place ──
    const updates = {
      name,
      category: document.getElementById('input-category').value,
      date:     document.getElementById('input-date').value,
      notes:    document.getElementById('input-notes').value.trim(),
    };
    await placesRef().doc(editingPlaceId).update(updates);
    // Update the local array so the detail modal reflects the change immediately
    const idx = places.findIndex(p => p.id === editingPlaceId);
    if (idx !== -1) Object.assign(places[idx], updates);
    // Refresh the marker color in case category changed
    removeMarkerFromMap(editingPlaceId);
    addMarkerToMap(places[idx]);
    editingPlaceId = null;
  } else {
    // ── Adding a new place ──
    const newPlace = {
      name,
      category: document.getElementById('input-category').value,
      date:     document.getElementById('input-date').value,
      notes:    document.getElementById('input-notes').value.trim(),
      lat:      pendingLatLng.lat,
      lng:      pendingLatLng.lng,
    };
    await placesRef().add(newPlace);
    pendingLatLng = null;
  }

  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-title').textContent = 'Add a New Place';
  renderList(currentFilter);
});


// ─── 8. DETAIL MODAL ──────────────────────────────────────────
function openDetailModal(id) {
  const place = places.find(p => p.id === id);
  if (!place) return;

  detailPlaceId = id;
  document.getElementById('detail-name').textContent = place.name;

  const icon = categoryIcons[place.category] || categoryIcons['Other'];
  document.getElementById('detail-category').innerHTML =
    `<span style="color:${categoryColors[place.category]};vertical-align:middle">${icon}</span> ${place.category}`;
  document.getElementById('detail-date').textContent = place.date ? `Visited: ${place.date}` : '';
  document.getElementById('detail-notes').textContent = place.notes || '(no notes)';

  document.getElementById('detail-overlay').classList.remove('hidden');
}

document.getElementById('btn-close-detail').addEventListener('click', () => {
  document.getElementById('detail-overlay').classList.add('hidden');
  detailPlaceId = null;
});

document.getElementById('btn-edit-place').addEventListener('click', () => {
  const place = places.find(p => p.id === detailPlaceId);
  if (!place) return;

  // Pre-fill the add/edit modal with this place's current data
  editingPlaceId = detailPlaceId;
  document.getElementById('modal-title').textContent = 'Edit Place';
  document.getElementById('input-name').value     = place.name;
  document.getElementById('input-category').value = place.category;
  document.getElementById('input-date').value     = place.date || '';
  document.getElementById('input-notes').value    = place.notes || '';

  document.getElementById('detail-overlay').classList.add('hidden');
  document.getElementById('modal-overlay').classList.remove('hidden');
});

document.getElementById('btn-delete').addEventListener('click', async () => {
  if (!confirm('Delete this place?')) return;

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
  allBtn.textContent = 'All';
  allBtn.addEventListener('click', () => { currentFilter = 'all'; renderFilterButtons(); renderList('all'); });
  container.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (currentFilter === cat ? ' active' : '');
    btn.innerHTML = `<span class="btn-icon">${categoryIcons[cat]}</span>${cat}`;
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
      openAddModal({ lat, lng });
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
  document.getElementById('stats-total').innerHTML =
    `${total} <span>place${total !== 1 ? 's' : ''} visited</span>`;

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
      <span style="min-width:88px;font-size:0.8rem">${cat}</span>
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
    ? 'Start adding places to see your stats!'
    : `Favourite spot type: <strong>${favorite}</strong> (${counts[favorite]} visits)`;
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
        <button class="btn-accept" data-uid="${req.fromUid}">Accept</button>
        <button class="btn-decline" data-uid="${req.fromUid}">Decline</button>
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
  const req    = (await friendRequestsRef(currentUser.uid).doc(fromUid).get()).data();
  if (!req) return;
  const myData = (await publicProfileRef(currentUser.uid).get()).data() || {};

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
  await friendRequestsRef(currentUser.uid).doc(fromUid).delete();
}

async function declineRequest(fromUid) {
  await friendRequestsRef(currentUser.uid).doc(fromUid).delete();
}

// ── Listen for friends list ──
let friendsUnsubscribe = null;

function setupFriendsListener() {
  if (friendsUnsubscribe) friendsUnsubscribe();
  friendsUnsubscribe = friendsRef(currentUser.uid)
    .onSnapshot(snap => renderFriendsList(snap.docs.map(d => d.data())));
}

function renderFriendsList(friends) {
  const list = document.getElementById('friends-list');
  list.innerHTML = '';

  if (friends.length === 0) {
    list.innerHTML = '<li class="friends-empty">No friends yet. Search above to add someone!</li>';
    return;
  }

  friends.forEach(friend => {
    const li = document.createElement('li');
    li.className = 'friend-card';

    const photo = friend.photoURL
      ? `<img src="${friend.photoURL}" class="friend-avatar-sm" onerror="this.style.display='none'" />`
      : `<div class="friend-avatar-sm friend-avatar-default"></div>`;

    li.innerHTML = `
      ${photo}
      <span class="friend-card-name">${friend.name}</span>
      <button class="btn-view-map" data-uid="${friend.uid}" data-name="${friend.name}">View Map</button>
    `;
    list.appendChild(li);
  });

  list.querySelectorAll('.btn-view-map').forEach(btn =>
    btn.addEventListener('click', () => viewFriendMap(btn.dataset.uid, btn.dataset.name)));
}

// ── View a friend's map ──
let friendMarkers = [];

async function viewFriendMap(friendUid, friendName) {
  clearFriendMarkers();

  document.getElementById('friend-view-banner').classList.remove('hidden');
  document.getElementById('friend-view-name').textContent = `${friendName}'s map`;

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
      alert(`${friendName} hasn't added any places yet!`);
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
