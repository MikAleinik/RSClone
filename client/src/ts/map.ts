import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function getCurrentPosition(): Promise<L.LatLngExpression>{
  return new Promise ((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      resolve ([position.coords.latitude, position.coords.longitude] as L.LatLngExpression)
    }, (error) => reject(error))
  })
}

let map: L.Map;

function loadMap(width: string, height: string, place: string, embed = 'insert') {
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  const block = document.querySelector(place) as HTMLDivElement;
  
  block.style.height = height;
  block.style.width = width;
  if (embed === 'replace'){
    block.innerHTML = '';
  }

  map = L.map(<HTMLElement>block);
  const defaultPosition: L.LatLngTuple = [53.90332, 27.608643];
  const defaultZoom = 16
  const tilesSrc = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const tiles = L.tileLayer(tilesSrc)
  map.setView(defaultPosition, defaultZoom)
  tiles.addTo(map);
}

async function setCurrentPosition(){
  try {
    const position = await getCurrentPosition()
    map.panTo(position)
    const marker = L.marker(position).addTo(map);
    marker.bindPopup("You are here!").openPopup();
  } catch(err) {
    console.log(err)
  }
}

export { loadMap, setCurrentPosition }