import { getPointInfo } from '../map/map-view';
import { userTruck, userCargo } from '../../user-adapter';
import { userInfo } from 'os';

function loadCompany(place: HTMLElement){
  place.innerHTML = '';
  place.appendChild(createTable());
}

const table_headers: {[index: string]: string} = {
  mainExchangeCargoName:'Name',
  mainExchangeCargoWeight: 'Weight',
  mainExchangeCargoLocationFrom: 'From',
  mainExchangeCargoLocationTo: 'To',
  mainExchangeCargoDate: 'Date',
  mainExchangeTransportNumber: 'Plate number',
  null: ''
};

function createTable() {
  const table_wrapper = document.createElement('table');
  table_wrapper.className = 'table_wrapper';

  const table_header = document.createElement('tr');
  for (const h in table_headers){
    const th = document.createElement('th');
    th.dataset.ln = h;
    th.textContent = table_headers[h];
    table_header.appendChild(th)
  }
  table_wrapper.appendChild(table_header)

  for (const el of userCargo){
    if (el.status === 'pending'){
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
  
      const table_cell_career = document.createElement('td');
      const career = document.createElement('select');
      table_cell_career.appendChild(career);
      const empty = document.createElement('option');
      empty.textContent = '';
      career.appendChild(empty);
      for (const el of userTruck){
        const vehicle = document.createElement('option');
        vehicle.textContent = el.name;
        career.appendChild(vehicle);
      }
  
      const table_cell_buttons = document.createElement('td');
      const save = document.createElement('button');
      save.name = 'save'
      save.innerHTML = '&check;'
      save.addEventListener('click', (event) => {
        const target = event.target as HTMLInputElement;
        const id = Number(target.closest('tr')?.dataset.id);
        if (id !== undefined){
          userCargo[id].status = career.value;
          for (const el of userTruck){
            if (el.name === career.value){
              el.filling += Number(table_cell_size.textContent)
              el.filling === el.capacity ? el.status = 'full' : 'filling'
            }
          }
          updateTable();
        }
      })
      table_cell_buttons.appendChild(save)
      
      const table_cell_date = document.createElement('td');
      table_cell_date.textContent = el.date;
      
      table_row.appendChild(table_cell_name);
      table_row.appendChild(table_cell_size);
      table_row.appendChild(table_cell_from);
      table_row.appendChild(table_cell_to);
      table_row.appendChild(table_cell_date);
      table_row.appendChild(table_cell_career);
      table_row.appendChild(table_cell_buttons);
      table_wrapper.appendChild(table_row);
    }
  }
  
  return table_wrapper;
}

function updateTable(){
  const table_wrapper = document.querySelector('.table_wrapper') as HTMLElement;
  const parent = table_wrapper.parentElement as HTMLElement;
  parent.removeChild(table_wrapper);
  parent.appendChild(createTable());
}


export { loadCompany } 
