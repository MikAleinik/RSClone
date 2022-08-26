import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { map } from './map-view';
import { Truck, userTruck } from '../../user-adapter';

const mapboxKey = 'pk.eyJ1IjoiaXZhbmZlZG9yb3YiLCJhIjoiY2w2bWV0d2gyMGZpNTNlbXJvdjQ2c2pvNyJ9.JsbGZNi2e7pBwvSQze-cYQ'

function routeStart(){
  const routeControl = L.Routing.control({
    waypoints: [
      L.latLng(53.90, 27.55),
      L.latLng(52.43, 30.99)
    ],
    router: L.Routing.mapbox(mapboxKey, {timeout: 3000}),
    routeWhileDragging: true,
  });
  routeControl.addTo(map);
}

function routeCalc(array: any, truck: Truck){
  const crds = [];
  for (const i of array){ // convert array with numbers to LatLng
    crds.push(L.latLng(i));
  }
  const routeControl = L.Routing.control({
    waypoints: crds,
    router: L.Routing.mapbox(mapboxKey, {timeout: 3000}),
  });
  routeControl.addTo(map);
  routeControl.on('routesfound', (e) => {
    const truckRoute = e.routes[0].coordinates;
    truck.track = truckRoute;
  })
}

function moveCar(){
  for (const t of userTruck){
    if (t.status !== 'panding'){
      console.log(t.status);
    }
  }
}

export { routeStart, routeCalc, moveCar }