const url = 'https://saurav.tech/NewsAPI/'

async function getNews(){
  try {
    const response = await fetch(`${url}/top-headlines/category/business/ru.json`, {
      method: 'GET'
    })
    const data = await response.json();
    return data.articles;
  } catch(err) {
    console.log(err);
  }
}

async function createNewsItemsList(place: string, embed = 'insert') {
  const data = await getNews();
  const fragment = new DocumentFragment;
  for (const item of data){
    const newsItem = document.createElement('div');
    newsItem.className = 'news__item';
    const newsItemAuthor = document.createElement('span');
    newsItemAuthor.textContent = `Author: ${item.author}`;
    const newsItemTitle = document.createElement('span');
    newsItemTitle.innerHTML = `<h3>${item.title}</h3>`;
    const newsItemDescription = document.createElement('span');
    newsItemDescription.textContent = item.description;
    const newsItemUrl = document.createElement('a');
    newsItemUrl.href = item.url;
    newsItemUrl.innerHTML = '<b>Read more</>'
    const newsItemImg = document.createElement('img');
    newsItemImg.src = item.urlToImage;
    newsItem.appendChild(newsItemTitle);
    newsItem.appendChild(newsItemAuthor);
    newsItem.appendChild(newsItemImg);
    newsItem.appendChild(newsItemDescription);
    newsItem.appendChild(newsItemUrl);
    fragment.append(newsItem)
  }
  const newsList = document.createElement('div');
  newsList.className = 'news__list'
  newsList.appendChild(fragment)
  const main = document.querySelector(place) as HTMLDivElement;
  if (embed === 'replace'){
    main.innerHTML = '';
  }
  main.appendChild(newsList)
}

export { createNewsItemsList }