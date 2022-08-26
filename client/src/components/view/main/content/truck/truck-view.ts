import { getPointInfo } from '../map/map-view'
import * as GeoSearch from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { Truck, userTruck, userCargo } from '../../user-adapter';
import { routeCalc } from '../map/map-routes'

function loadTruck(place: HTMLElement){
  place.innerHTML = '';
  place.appendChild(createForm());
  place.appendChild(createTable());
} 

function createTable() {
  const table_wrapper = document.createElement('table');
  table_wrapper.className = 'table_wrapper';

  const table_header = document.createElement('tr');
  table_header.innerHTML = '<th>Name</th><th>Capacity</th><th>Location</th><th>Filling</th><th>Status</th><th></th>'
  table_wrapper.appendChild(table_header);

  for (const el of userTruck){
    const table_row = document.createElement('tr');
    table_row.className = 'table_row';
    table_row.dataset.id = userTruck.indexOf(el).toString();
    
    const table_cell_name = document.createElement('td');
    table_cell_name.textContent = el.name;

    const table_cell_capacity = document.createElement('td');
    table_cell_capacity.textContent = `${el.capacity}`;
    
    const table_cell_location = document.createElement('td');
    getPointInfo(el.location[0], el.location[1])
      .then((info) => {
        info !== null ? table_cell_location.textContent = info : el.location.toString();
      })

    const table_cell_status = document.createElement('td');
    table_cell_status.textContent = el.status;
    
    const table_cell_filling = document.createElement('td');
    table_cell_filling.textContent = el.filling.toString();

    const table_cell_buttons = document.createElement('td');
    const button_remove = document.createElement('button');
    button_remove.innerHTML = '&#10005';
    button_remove.name = 'remove';
    table_cell_buttons.appendChild(button_remove);
    const button_race = document.createElement('button');
    button_race.innerHTML = '&#9872;';
    button_race.name = 'race'
    table_cell_buttons.appendChild(button_race);
    
    table_row.appendChild(table_cell_name);
    table_row.appendChild(table_cell_capacity);
    table_row.appendChild(table_cell_location);
    table_row.appendChild(table_cell_filling);
    table_row.appendChild(table_cell_status);
    table_row.appendChild(table_cell_buttons);
    table_wrapper.appendChild(table_row);
  }
  table_wrapper.addEventListener('click', (event) => {
    const target = event.target as HTMLInputElement;
    const id = Number(target.closest('tr')?.dataset.id);
    if (id !== undefined){
      switch (target.name){
        case 'remove':
          userTruck.splice(id, 1)
          updateTable();
          break;
        case 'race':
          race(userTruck[id]);
          break;
      }
    }
  })
  return table_wrapper;
}

function updateTable(){
  const table_wrapper = document.querySelector('.table_wrapper') as HTMLElement;
  const parent = table_wrapper.parentElement as HTMLElement;
  parent.removeChild(table_wrapper);
  parent.appendChild(createTable());
}

function createForm() {
  const form = document.createElement('fieldset');
  form.className = 'item_form';
  const form_legend = document.createElement('legend')
  form_legend.textContent = 'Add new'
  form.appendChild(form_legend);
  
  const name = document.createElement('input');
  name.type = 'text';
  name.id = 'truck_name'
  name.required = true;
  const name_label = document.createElement('label')
  name_label.textContent = 'Name'
  
  const capacity = document.createElement('input');
  capacity.type = 'number';
  capacity.id = 'truck_size';
  capacity.required = true;
  const capacity_label = document.createElement('label')
  capacity_label.textContent = 'Capacity'
  
  const location = document.createElement('input');
  location.type = 'search';
  location.id = 'truck_location';
  location.required = true;
  const location_label = document.createElement('label')
  location_label.textContent = 'Location'
  
  const buttons = document.createElement('div');
  buttons.className = 'truck_form-buttons'
  const save = document.createElement('button');
  save.id = 'truck_save'
  save.innerHTML = '&check;'
  save.addEventListener('click', (event) => {
    getCoordinates(location.value)
      .then((crds) => {
        userTruck.push({
          name: name.value,
          capacity: JSON.parse(capacity.value),
          location: crds,
          status: 'pending',
          filling: 0
        });
        updateTable();
      })
  })
  buttons.appendChild(save);
  
  form.appendChild(name_label);
  form.appendChild(name);
  form.appendChild(capacity_label);
  form.appendChild(capacity);
  form.appendChild(location_label);
  form.appendChild(location);
  form.appendChild(buttons);

  return form;
}

async function getCoordinates(address: string) {
  const provider = new GeoSearch.OpenStreetMapProvider();
  const results = await provider.search({query: address});
  return [results[0].y, results[0].x];
}

function race(truck: Truck){
  const trackPoints: number[][] = [];
  trackPoints.push(truck.location); // truck location
  for (const cargo of userCargo){ // assigned cargoes location
    if (cargo.status === truck.name){
      trackPoints.push(cargo.from);
      trackPoints.push(cargo.to);
    }
  }
  routeCalc(trackPoints, truck);
}

export { loadTruck, race } 
