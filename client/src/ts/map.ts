function loadMap(width: string, height: string, place: string, embed = 'insert') {
  const block = document.querySelector(place) as HTMLDivElement;
  const map = document.createElement('iframe') as HTMLIFrameElement;
  map.src = 'https://www.openstreetmap.org/export/embed.html?bbox=21.346435546875004%2C50.8267584823633%2C34.61791992187501%2C56.32262930069559&amp';
  map.width = width;
  map.height = height;
  map.frameBorder = '0';
  if (embed === 'replace'){
    block.innerHTML = '';
  }
  block.appendChild(map);
}

export { loadMap }