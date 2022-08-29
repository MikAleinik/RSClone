import { loadUserData, userRoleContent } from '../../user-adapter'
import { loadMap, applyItemsLocation } from '../map/map-view'

/*  user__overview
      user__data
        user__name --> name & surname
        user__rating --> rating
        user__transport --> transport
        user__cargoes --> cargo
      user__map
*/

function loadOverview(place: HTMLElement){
  place.innerHTML = '';
  place.appendChild(createOverview())
  loadMap('99%', '99%', '.user__map', 'insert');
  applyItemsLocation('transport');
  applyItemsLocation('logistic');
}

function userDataBlocks() {
  const user__data = document.createElement('div');
  user__data.className = 'user__data';
  for (const el of userRoleContent.user__data){
    const block = document.createElement('div');
    block.className = el;
    block.textContent = 'Test'
    user__data.appendChild(block)
  }
  return user__data;
}

function generateItemsList(obj: {[index: string]: number}){
  const list = document.createElement('ul');
  for (const el in obj){
    const item = document.createElement('li');
    item.textContent = `${el}: ${obj[el].toString()}`;
    list.appendChild(item);
  }
  return list;
}

const userData = loadUserData(); // load fake user data

function createOverview(){
  const user__overview = document.createElement('div');
  user__overview.className = 'user__overview';
  
  const user__data = userDataBlocks()  
  user__overview.appendChild(user__data);
  
  const user__name = user__data.querySelector('.user__name') as HTMLElement;
  user__name.innerHTML = `<h3>${userData.name} ${userData.surname}</h3>`

  const user__rating = user__data.querySelector('.user__rating') as HTMLElement;
  user__rating.innerHTML = `Rating: ${userData.rating}`

  const user__transport = user__data.querySelector('.user__transport') as HTMLElement;
  user__transport.innerHTML = '<h4>Your transport</h4>'
  user__transport.appendChild(generateItemsList(userData.transport))

  const user__cargo = user__data.querySelector('.user__cargo') as HTMLElement;
  user__cargo.innerHTML = '<h4>Your cargoes</h4>'
  user__cargo.appendChild(generateItemsList(userData.cargo))

  const user__company = user__data.querySelector('.user__company') as HTMLElement;
  user__company.innerHTML = '<h4>Your companies</h4>'
  user__company.appendChild(generateItemsList(userData.company))
  
  const user__map = document.createElement('div');
  user__map.className = 'user__map';
 
  user__overview.appendChild(user__map);

  return user__overview
}

export { loadOverview }