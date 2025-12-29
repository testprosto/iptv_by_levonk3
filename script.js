// Твой M3U плейлист (можно добавить больше каналов)
const channels = [
  {
    name: "Animax (544p)",
    url: "http://cdns.jp-primehome.com:8000/zhongying/live/playlist.m3u8?cid=bs15&checkedby:iptvcat.net",
    logo: "https://ri.zzls.xyz/bYX8NqT.png"
  }
];

const player = document.getElementById('iptvPlayer');

// Для HLS потоков (m3u8) нужно использовать hls.js
if (Hls.isSupported()) {
  const hls = new Hls();
  hls.loadSource(channels[0].url);
  hls.attachMedia(player);
  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    player.play();
  });
} else if (player.canPlayType('application/vnd.apple.mpegurl')) {
  player.src = channels[0].url;
  player.addEventListener('loadedmetadata', () => {
    player.play();
  });
}
