const fileInput = document.getElementById('fileInput');
const loadBtn = document.getElementById('loadBtn');
const channelList = document.getElementById('channelList');
const Favorites = document.getElementById('Favorites');
const video = document.getElementById('video');
const now = document.getElementById('now');
const searchInput = document.getElementById('search');
const groupList = document.getElementById('groupList');

let hls;
let allChannels = [];
let favorites = [];
let currentGroup = 'Все';

// Загрузка плейлиста
loadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    allChannels = parseM3U(text);
    displayGroups();
    filterChannels();
    displayFavoritesTablo();
  };
  reader.readAsText(file);
});

// Разбор M3U
function parseM3U(data) {
  const lines = data.split(/\r?\n/);
  const channels = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#EXTINF')) {
      const nameMatch = lines[i].match(/,(.*)$/);
      const logoMatch = lines[i].match(/tvg-logo="(.*?)"/);
      const groupMatch = lines[i].match(/group-title="(.*?)"/);
      const name = nameMatch ? nameMatch[1].trim() : 'Без имени';
      const logo = logoMatch ? logoMatch[1] : '';
      const group = groupMatch ? groupMatch[1] : 'Без группы';
      const url = lines[i+1];
      if (url && !url.startsWith('#')) {
        channels.push({name, url, logo, group});
      }
      i++;
    }
  }
  return channels;
}

// Отображение групп
function displayGroups() {
  const groups = ['Все', ...new Set(allChannels.map(ch => ch.group))];
  groupList.innerHTML = '';
  groups.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'groupBtn';
    btn.textContent = g;
    btn.onclick = () => {
      currentGroup = g;
      Array.from(groupList.children).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterChannels();
    };
    if (g === 'Все') btn.classList.add('active');
    groupList.appendChild(btn);
  });
}

// Фильтр
searchInput.addEventListener('input', filterChannels);
function filterChannels() {
  const query = searchInput.value.toLowerCase();
  const filtered = allChannels.filter(ch => {
    const matchGroup = currentGroup === 'Все' || ch.group === currentGroup;
    const matchSearch = ch.name.toLowerCase().includes(query) || ch.group.toLowerCase().includes(query);
    return matchGroup && matchSearch;
  });
  displayChannels(filtered);
}

// Отображение каналов
function displayChannels(channels) {
  channelList.innerHTML = '';
  channels.forEach(ch => {
    const div = document.createElement('div');
    div.className = 'channel';
    const heartClass = favorites.find(f => f.url === ch.url) ? 'red' : 'gray';
    div.innerHTML = `<div style="display:flex;align-items:center;gap:12px">
                       <img src="${ch.logo}" alt=""><span>${ch.name}</span>
                     </div>
                     <button class="heartBtn ${heartClass}">❤</button>`;
    div.querySelector('.heartBtn').onclick = (e) => {
      e.stopPropagation();
      toggleFavorite(ch);
      filterChannels();
      displayFavoritesTablo();
    };
    div.onclick = () => playChannel(ch);
    channelList.appendChild(div);
  });
}

// Табло избранного
function displayFavoritesTablo() {
  Favorites.innerHTML = '';
  favorites.forEach(ch => {
    const div = document.createElement('div');
    div.className = 'favoriteItem';
    div.title = ch.name;
    div.innerHTML = `<img src="${ch.logo}" alt="">`;
    div.onclick = () => playChannel(ch);
    Favorites.appendChild(div);
  });
}

// Добавление / удаление избранного
function toggleFavorite(ch) {
  const index = favorites.findIndex(c => c.url === ch.url);
  if (index === -1) favorites.push(ch);
  else favorites.splice(index, 1);
}

// Воспроизведение
function playChannel(ch) {
  now.textContent = ch.name;
  if (hls) { hls.destroy(); hls = null; }
  const url = ch.url;
  if (url.endsWith('.mp4')) {
    video.src = url;
    video.play();
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.play();
  } else if (Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() { video.play(); });
  } else alert('HLS не поддерживается этим браузером');
}
