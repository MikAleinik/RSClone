import { loadMap } from './map';
import { createNewsItemsList } from './news';

const aside = document.querySelector('aside') as HTMLElement;

aside.addEventListener('click', (e) => {
  const tag = e.target as HTMLElement
  const li = tag.closest('li');
  if (li !== null){
    if (li.dataset.page === 'news'){
      createNewsItemsList()
    }
    if (li.dataset.page === 'map'){
      loadMap()
    }
  }
})