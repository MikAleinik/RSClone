import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { map } from './map-view';

function routeStart(){
  L.Routing.control({
    waypoints: [
      L.latLng(53.90, 27.55),
      L.latLng(52.43, 30.99)
    ],
    router: L.Routing.mapbox('pk.eyJ1IjoiaXZhbmZlZG9yb3YiLCJhIjoiY2w2bWV0d2gyMGZpNTNlbXJvdjQ2c2pvNyJ9.JsbGZNi2e7pBwvSQze-cYQ', {timeout: 3000}),
    routeWhileDragging: true,
  }).addTo(map);
}

export { routeStart }