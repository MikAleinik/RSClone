import './cargo-view.scss'
import { getPointInfo } from '../map/map-view'
import { loadUserData } from '../../user-adapter';
import * as GeoSearch from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { userCargo } from '../../user-adapter';

function loadCargo(place: HTMLElement){
  place.innerHTML = '';
  place.appendChild(createForm());
  place.appendChild(createTable());
} 

const data = loadUserData();

function createTable() {
  const table_wrapper = document.createElement('table');
  table_wrapper.className = 'table_wrapper';

  const table_header = document.createElement('tr');
  table_header.innerHTML = '<th>Name</th><th>Size</th><th>From</th><th>To</th><th>Date</th><th>Status</th><th></th>'
  table_wrapper.appendChild(table_header);

  for (const el of userCargo){
    const table_row = document.createElement('tr');
    table_row.className = 'table_row';
    table_row.dataset.id = userCargo.indexOf(el).toString();
    
    const table_cell_name = document.createElement('td');
    table_cell_name.textContent = el.name;

    const table_cell_size = document.createElement('td');
    table_cell_size.textContent = `${el.size}`;
    
    const table_cell_from = document.createElement('td');
    getPointInfo(el.from[0], el.from[1])
      .then((info) => {
        info !== null ? table_cell_from.textContent = info : el.from.toString();
      })

    const table_cell_to = document.createElement('td');
    getPointInfo(el.to[0], el.to[1])
      .then((info) => {
        info !== null ? table_cell_to.textContent = info : el.to.toString();
      })

    const table_cell_status = document.createElement('td');
    table_cell_status.textContent = el.status;
    
    const table_cell_date = document.createElement('td');
    table_cell_date.textContent = el.date;

    const table_cell_buttons = document.createElement('td');
    const button_remove = document.createElement('button');
    button_remove.innerHTML = '&#10005';
    button_remove.name = 'remove';
    table_cell_buttons.appendChild(button_remove);
    
    table_row.appendChild(table_cell_name);
    table_row.appendChild(table_cell_size);
    table_row.appendChild(table_cell_from);
    table_row.appendChild(table_cell_to);
    table_row.appendChild(table_cell_date);
    table_row.appendChild(table_cell_status);
    table_row.appendChild(table_cell_buttons);
    table_wrapper.appendChild(table_row);
  }
  table_wrapper.addEventListener('click', (event) => {
    const target = event.target as HTMLInputElement;
    if (target.name === 'remove') {
      const id = Number(target.closest('tr')?.dataset.id);
      if (id !== undefined){
        userCargo.splice(id, 1)
      }
      updateTable();
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
  name.id = 'cargo_name'
  name.required = true;
  const name_label = document.createElement('label')
  name_label.textContent = 'Name'
  
  const size = document.createElement('input');
  size.type = 'number';
  size.id = 'cargo_size';
  size.required = true;
  const size_label = document.createElement('label')
  size_label.textContent = 'Size'
  
  const from = document.createElement('input');
  from.type = 'search';
  from.id = 'cargo_from';
  from.required = true;
  const from_label = document.createElement('label')
  from_label.textContent = 'From'

  const to = document.createElement('input');
  to.type = 'search';
  to.id = 'cargo_to';
  to.required = true;
  const to_label = document.createElement('label')
  to_label.textContent = 'To'
 
  const date = document.createElement('input');
  date.type = 'date'
  date.id = 'cargo_date'
  date.required = true;
  const date_label = document.createElement('label')
  date_label.textContent = 'Date'
  
  const buttons = document.createElement('div');
  buttons.className = 'cargo_form-buttons'
  const save = document.createElement('button');
  save.id = 'cargo_save'
  save.innerHTML = '&check;'
  save.addEventListener('click', (event) => {
    Promise.all([getCoordinates(from.value), getCoordinates(to.value)])
      .then((crds) => {
        userCargo.push({
          name: name.value,
          size: JSON.parse(size.value),
          from: crds[0],
          to: crds[1],
          date: date.value,
          status: 'pending'
        });
        updateTable();
      })
  })
  buttons.appendChild(save);
  
  form.appendChild(name_label);
  form.appendChild(name);
  form.appendChild(size_label);
  form.appendChild(size);
  form.appendChild(from_label);
  form.appendChild(from);
  form.appendChild(to_label);
  form.appendChild(to);
  form.appendChild(date_label);
  form.appendChild(date);
  form.appendChild(buttons);

  return form;
}

async function getCoordinates(address: string) {
  const provider = new GeoSearch.OpenStreetMapProvider();
  const results = await provider.search({query: address});
  return [results[0].y, results[0].x];
}

export { loadCargo } 
