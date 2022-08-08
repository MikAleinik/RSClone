import { createNewsItemsList } from './news';

const aside = document.querySelector('aside') as HTMLElement;

aside.addEventListener('click', (e) => {
  const tag = e.target as HTMLElement
  if (tag.dataset.page === 'news'){
    createNewsItemsList()
  }
})