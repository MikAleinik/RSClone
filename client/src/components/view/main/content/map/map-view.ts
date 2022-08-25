import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as GeoSearch from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { getTransportLocation } from './map-transport';
import { getLogisticsLocation } from './map-logistics';
import { routeStart } from './map-routes';

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
    block.textContent = '';
  }
  
  const map__wrapper = document.createElement('div'); //resolve replacing css styles of outer block by leaflet
  map__wrapper.style.width = '100%'
  map__wrapper.style.height = '100%'
  block.appendChild(map__wrapper);

  map = L.map(<HTMLElement>map__wrapper);
  const defaultPosition: L.LatLngTuple = [53.90332, 27.608643];
  const defaultZoom = 14
  const tilesSrc = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const tiles = L.tileLayer(tilesSrc)
  map.setView(defaultPosition, defaultZoom)
  tiles.addTo(map);

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

async function applyItemsLocation(subject: string){
  try{
    let items;
    let itemIcon;

    if (subject === 'transport'){
      items = await getTransportLocation()
      itemIcon = L.icon({
        iconUrl: './assets/icons/truck-color.png',
        iconSize: [22, 22], 
      });
    }
    if (subject === 'logistic'){
      items = await getLogisticsLocation();
      itemIcon = L.icon({
        iconUrl: './assets/icons/storage-color.png',
        iconSize: [22, 22], 
      });
    }
    const bounds: any = [] // can' resolve this :(
    for (const i in items){
      const position = items[i] as L.LatLng
      const marker = L.marker(position, {icon: itemIcon}).addTo(map);
      marker.bindPopup(`${i}`).openPopup();
      bounds.push(items[i])
    }
    map.fitBounds(bounds);
  } catch(err) {
    console.log(err)
  }
}

let targetLatitude: number;
let targetLongitude: number;

function getPointCoordinates(){
  const popupButtons = '<div class="map__popup_buttons"><button id="map__button_from">From</button><button id="map__button_to">To</button></div>';
  const popup = L.popup();
  map.on('click', (e: { latlng: { lat: number; lng: number; }; }) => {
    targetLatitude = e.latlng.lat;
    targetLongitude = e.latlng.lng
    getPointInfo(targetLatitude, targetLongitude)
      .then((data) => {
        popup
            .setLatLng(e.latlng)
            .setContent(`<div class='map__popup_title'>${data}</div>${popupButtons}`)
            .openOn(map);
      })
  });
}

async function getPointInfo(latitude: number, longitude: number){
  const infoUrl = 'https://nominatim.openstreetmap.org/reverse?';
  const infoFormat = 'format=json';
  const infoCoordinates = `lat=${latitude}&lon=${longitude}`
  const response = await fetch(`${infoUrl}${infoFormat}&${infoCoordinates}`);
  const data = await response.json();
  return data.display_name;
}

async function mapSearch(){
  const search = GeoSearch.GeoSearchControl({
    provider: new GeoSearch.OpenStreetMapProvider(),
    notFoundMessage: 'Sorry, that address could not be found.',
    style: 'bar'
  })
  map.addControl(search)
}

export { map, loadMap, applyCurrentPosition, applyItemsLocation, getPointCoordinates, getPointInfo  }