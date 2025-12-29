const channels = [
  {group:'Общие', name:'Animax', logo:'https://ri.zzls.xyz/bYX8NqT.png', url:'http://cdns.jp-primehome.com:8000/zhongying/live/playlist.m3u8?cid=bs15&checkedby:iptvcat.net'},
  {group:'Кино', name:'test2', logo:'http://epg.one/img/4663.png', url:'http://sewv654wfcsdwfi87fwvgbngh.siauliairsavlt.pw/iptv/8DN2FWQKBVS73T/31547/index.m3u8'},
];

const sidebar = document.getElementById('sidebar');
const video = document.getElementById('video');
const now = document.getElementById('now');
let hls;

const groups = {};

// Проксирование HTTP каналов через Vercel API
function proxify(url) {
  if(url.startsWith('http://')) {
    return `https://iptv-by-levonk3-git-main-levonk3s-projects.vercel.app/api/proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}


// Сортировка каналов по группам
channels.forEach(c => {
  if(!groups[c.group]) groups[c.group] = [];
  groups[c.group].push(c);
});

// Создание боковой панели
for (const g in groups) {
  const h = document.createElement('h3');
  h.textContent = g;
  sidebar.appendChild(h);

  groups[g].forEach(ch => {
    const div = document.createElement('div');
    div.className='channel';
    div.innerHTML = `<img src="${ch.logo}"><span>${ch.name}</span>`;
    div.onclick = () => play(ch);
    sidebar.appendChild(div);
  });
}

// Функция воспроизведения
function play(ch) {
  now.textContent = ch.name;

  if(hls) {
    hls.destroy();
    hls = null;
  }

  const url = proxify(ch.url);

  if(video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.play();
  } else if(Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      video.play();
    });
  } else {
    alert('HLS не поддерживается вашим браузером');
  }
}
