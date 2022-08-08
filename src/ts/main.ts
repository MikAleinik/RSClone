import { loadUserData } from './user';
import { loadMap } from './map';
import { createNewsItemsList } from './news';


// aside menu event listeners holder

const aside = document.querySelector('aside') as HTMLElement;
aside.addEventListener('click', (e) => {
  const tag = e.target as HTMLElement
  const li = tag.closest('li');
  if (li !== null){
    if (li.dataset.page === 'news'){
      createNewsItemsList()
    }
    if (li.dataset.page === 'map'){
      loadMap('99%', '99%', 'replace')
    }
  }
})

// load user data

const userData = loadUserData();

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
  applyCategoryData('goods');
  applyCategoryData('transport');
  applyCategoryData('races');
  applyUserRating()
  loadMap('60%', '99%')
}

applyUserData()