import './cargo-view.scss'
import { getPointInfo } from '../map/map-view'
import { loadUserData } from '../../user-adapter';
import * as GeoSearch from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { removeAllListeners } from 'process';


function loadCargo(place: HTMLElement){
  place.innerHTML = '';
  place.appendChild(createForm());
  place.appendChild(createTable());
} 

const data = loadUserData();

interface Cargo {
  name: string;
  size: number;
  from: number[];
  to: number[];
  career: string;
  date: string;
}

const userCargo: Cargo[] = [
  {
    name: 'Horns',
    size: 200,
    from: [53.90, 27.55],
    to: [52.43, 30.99],
    career: 'truck1',
    date: '2022-10-01'
  },
  {
    name: 'Hooves',
    size: 200,
    from: [53.90, 27.55],
    to: [52.43, 30.99],
    career: 'truck2',
    date: '2022-10-01'
  },
  {
    name: 'Skin',
    size: 100,
    from: [ 53.90, 27.55],
    to: [52.43, 30.99],
    career: 'truck3',
    date: '2022-10-01'
  }
]

function createTable() {
  const table_wrapper = document.createElement('div');
  table_wrapper.className = 'table_wrapper';
  
  const table_header = document.createElement('div')
  table_header.className = 'table_row table_header';
  const table_header_name = document.createElement('span');
  table_header_name.className = 'table_cell_small';
  table_header_name.innerHTML = '<h4>Name</h4>';
  table_header.appendChild(table_header_name);
  const table_header_size = document.createElement('span');
  table_header_size.className = 'table_cell_small';
  table_header_size.innerHTML = '<h4>Size</h4>';
  table_header.appendChild(table_header_size);
  const table_header_from = document.createElement('span');
  table_header_from.className = 'table_cell_big';
  table_header_from.innerHTML = '<h4>From</h4>';
  table_header.appendChild(table_header_from);
  const table_header_to = document.createElement('span');
  table_header_to.className = 'table_cell_big';
  table_header_to.innerHTML = '<h4>To</h4>';
  table_header.appendChild(table_header_to);
  const table_header_career = document.createElement('span');
  table_header_career.className = 'table_cell_small';
  table_header_career.innerHTML = '<h4>Career</h4>';
  table_header.appendChild(table_header_career);
  const table_header_date = document.createElement('span');
  table_header_date.className = 'table_cell_small';
  table_header_date.innerHTML = '<h4>Delivery date</h4>';
  table_header.appendChild(table_header_date);
  table_wrapper.appendChild(table_header);

  for (const el of userCargo){
    const table_row = document.createElement('div');
    table_row.className = 'table_row';
    
    const table_cell_name = document.createElement('span');
    table_cell_name.className = 'table_cell_small'
    table_cell_name.textContent = el.name;

    const table_cell_size = document.createElement('span');
    table_cell_size.className = 'table_cell_small';
    table_cell_size.textContent = `${el.size} kg`;
    
    const table_cell_from = document.createElement('span');
    table_cell_from.className = 'table_cell_big';
    getPointInfo(el.from[0], el.from[1])
      .then((info) => {
        info !== null ? table_cell_from.textContent = info : el.from.toString();
      })

    const table_cell_to = document.createElement('span');
    table_cell_to.className = 'table_cell_big';
    getPointInfo(el.to[0], el.to[1])
      .then((info) => {
        info !== null ? table_cell_to.textContent = info : el.to.toString();
      })

    const table_cell_career = document.createElement('span');
    table_cell_career.className = 'table_cell_small';
    table_cell_career.textContent = el.career.toString();
    
    const table_cell_date = document.createElement('span');
    table_cell_date.className = 'table_cell_small';
    table_cell_date.textContent = el.date;

    const table_cell_edit = document.createElement('img');
    table_cell_edit.className = 'table_cell_edit';
    table_cell_edit.src = '../../../../../assets/icons/edit.png'
    table_cell_edit.alt = 'edit'
    
    table_row.appendChild(table_cell_name);
    table_row.appendChild(table_cell_size);
    table_row.appendChild(table_cell_from);
    table_row.appendChild(table_cell_to);
    table_row.appendChild(table_cell_career);
    table_row.appendChild(table_cell_date);
    table_row.appendChild(table_cell_edit);
    table_wrapper.appendChild(table_row);
  }
  return table_wrapper;
}

function updateTable(){
  const table_wrapper = document.querySelector('.table_wrapper') as HTMLElement;
  const parent = table_wrapper.parentElement as HTMLElement;
  parent.removeChild(table_wrapper);
  parent.appendChild(createTable());
}

function createForm() {
  const form = document.createElement('form');
  form.className = 'cargo_form';
  
  const name = document.createElement('input');
  name.type = 'text';
  name.id = 'cargo_name'
  
  const size = document.createElement('input');
  size.type = 'number';
  size.id = 'cargo_size';
  
  const from = document.createElement('input');
  from.type = 'search';
  from.id = 'cargo__from';

  const to = document.createElement('input');
  to.type = 'search';
  to.id = 'cargo_to';

  const career = document.createElement('select');
  for (const el in data.transport){
    const vehicle = document.createElement('option');
    vehicle.textContent = el;
    career.appendChild(vehicle);
  }
  
  const date = document.createElement('input');
  date.type = 'date'
  date.id = 'cargo_date'
  
  const buttons = document.createElement('div');
  buttons.className = 'cargo_form-buttons'
  const save = document.createElement('button');
  save.id = 'cargo_save'
  save.innerHTML = '&check;'
  const remove = document.createElement('button');
  remove.id = 'cargo_remove'
  remove.innerHTML = 'X'
  buttons.appendChild(save);
  buttons.appendChild(remove);
  
  form.appendChild(name);
  form.appendChild(size);
  form.appendChild(from);
  form.appendChild(to);
  form.appendChild(career);
  form.appendChild(date);
  form.appendChild(buttons);

  form.addEventListener('click', (event) => {
    event.preventDefault();

    switch (event.target){
      case save:
        Promise.all([getCoordinates(from.value), getCoordinates(to.value)])
          .then((crds) => {
            userCargo.push({
              name: name.value,
              size: JSON.parse(size.value),
              from: crds[0],
              to: crds[1],
              career: career.value,
              date: date.value
            });
            updateTable();
          })
        break;
      case remove:
        console.log(event.target)
        break;
    }
  })

  return form;
}

async function getCoordinates(address: string) {
  const provider = new GeoSearch.OpenStreetMapProvider();
  const results = await provider.search({query: address});
  return [results[0].y, results[0].x];
}

export { loadCargo } 
