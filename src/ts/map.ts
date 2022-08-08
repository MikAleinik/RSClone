function loadMap(width: string, height: string, embed = 'insert') {
  const main = document.querySelector('main') as HTMLDivElement;
  const map = document.createElement('iframe') as HTMLIFrameElement;
  map.src = 'https://www.openstreetmap.org/export/embed.html?bbox=21.346435546875004%2C50.8267584823633%2C34.61791992187501%2C56.32262930069559&amp';
  map.width = width;
  map.height = height;
  map.frameBorder = '0';
  if (embed === 'replace'){
    main.innerHTML = '';
  }
  main.appendChild(map);
}

export { loadMap }