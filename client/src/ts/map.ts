import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as GeoSearch from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

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

  getPointCoordinates();
  mapSearch();
}

async function applyCurrentPosition(){
  try {
    const position = await getCurrentPosition()
    map.panTo(position)
    const marker = L.marker(position).addTo(map);
    marker.bindPopup("You are here!").openPopup();
  } catch(err) {
    console.log(err)
  }
}

function getPointCoordinates(){
  const popup = L.popup();
  map.on('click', (e) => {
    getPointInfo(e.latlng.lat, e.latlng.lng)
      .then((data) => {
        popup
            .setLatLng(e.latlng)
            .setContent(`${data}`)
            .openOn(map);
      }) 
  });
}

/* interface POI {
  place_id: number,
  licence: string,
  osm_type: string,
  osm_id: number,
  lat: string,
  lon: string,
  display_name: string,
  address: {
      house_number: string,
      road: string,
      neighbourhood: string,
      suburb: string,
      city_district: string,
      city: string,
      state: string,
      postcode: string,
      country: string,
      country_code: string
  },
  boundingbox: string[]
} */

async function getPointInfo(latitude: number, longitude: number){
  const infoUrl = 'https://nominatim.openstreetmap.org/reverse?';
  const infoFormat = 'format=json';
  const infoCoordinates = `lat=${latitude}&lon=${longitude}`
  const response = await fetch(`${infoUrl}${infoFormat}&${infoCoordinates}`);
  const data = await response.json();
  return data.display_name;
}

async function mapSearch(){
  console.log('search')
  const search = GeoSearch.GeoSearchControl({
    provider: new GeoSearch.OpenStreetMapProvider(),
    notFoundMessage: 'Sorry, that address could not be found.',
    style: 'bar'
  })
  map.addControl(search)
}

export { loadMap, applyCurrentPosition }