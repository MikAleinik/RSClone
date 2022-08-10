import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function getCurrentPosition(): any { // L.LatLngExpression | string returns error 
  const options = {
    enableHighAccuracy: true,
    timeout: 6000,
    maximumAge: 0
  }
  function success(position: GeolocationPosition){
    return [position.coords.latitude, position.coords.longitude]  as L.LatLngExpression;
  }
  function error(err: GeolocationPositionError){
    console.log(`${err.message} `)
  }
  navigator.geolocation.getCurrentPosition(success, error, options)
}

function loadMap(width: string, height: string, place: string, embed = 'insert') {
  
  L.Icon.Default.imagePath = '.';

  const block = document.querySelector(place) as HTMLDivElement;
  
  block.style.height = height;
  block.style.width = width;
  if (embed === 'replace'){
    block.innerHTML = '';
  }

  const map = L.map(<HTMLElement>block);
  const defaultPosition: L.LatLngTuple = [53.90332, 27.608643];
  const defaultZoom = 16
  const tilesSrc = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const tiles = L.tileLayer(tilesSrc)
  map.setView(defaultPosition, defaultZoom)
  tiles.addTo(map);
}

export { loadMap }