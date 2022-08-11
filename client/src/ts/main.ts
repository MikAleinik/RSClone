import { loadUserData } from './user';
import { loadMap, applyCurrentPosition, applyItemsLocation } from './map';
import { createNewsItemsList } from './news';

// aside menu event listeners holder

const aside = document.querySelector('aside') as HTMLElement;
aside.addEventListener('click', (e) => {
  const tag = e.target as HTMLElement
  const li = tag.closest('li');
  if (li !== null){
    if (li.dataset.page === 'cargo'){
      applyCategoryContent('cargoes');
    }
    if (li.dataset.page === 'transport'){
      applyCategoryContent('transport');
    }
    if (li.dataset.page === 'news'){
      createNewsItemsList('main', 'replace')
    }
    if (li.dataset.page === 'map'){
      loadMap('auto', 'auto', 'main', 'replace')
      applyCurrentPosition();
    }
  }
})

// load user data

const userData = loadUserData();

function applyCategoryContent(category: string){
  const main = document.querySelector('main') as HTMLElement;
  main.textContent = ''
  const userDataContainer = document.createElement('div');
  userDataContainer.className = `user__${category}`;
  const userDataTitle = document.createElement('h3');
  userDataTitle.textContent = category.toUpperCase()
  const userDataContent = document.createElement('span');
  userDataContainer.appendChild(userDataTitle);
  userDataContainer.appendChild(userDataContent);
  main.appendChild(userDataContainer);
  applyCategoryData(category)
}

function applyUserName(){
  const userName = document.querySelectorAll('.user__name') as NodeListOf<HTMLElement>;
  userName.forEach((el) => el.textContent = `${userData.name} ${userData.surname}`)
}

function applyCategoryData(category: string): void{
  const categoryContainer = document.querySelector(`.user__${category}`) as HTMLElement;
  const categoryList = document.createElement('ul');
  for (const item in userData[category]){
    const listItem = document.createElement('li');
    listItem.textContent = `${item}: ${userData[category][item]}`
    categoryList.appendChild(listItem)
  }
  categoryContainer.appendChild(categoryList);
}

function applyUserRating(){
  const userRating = document.querySelector('.user__rating > h4') as HTMLElement;
  userRating.textContent += ` ${userData.rating}`
}

function applyUserData(){
  applyUserName();
  applyCategoryData('cargoes');
  applyCategoryData('transport');
  applyCategoryData('races');
  applyUserRating()
  loadMap('99%', '99%', '.user__map', 'insert');
  applyItemsLocation();
}

applyUserData()

export { applyCategoryData }