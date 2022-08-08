const url = 'https://saurav.tech/NewsAPI/'

interface article {
  author: string,
  content: string,
  description: string,
  publishedAt: string,
  source: string,
  title: string,
  url: string,
  urlToImage: string
}

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

async function createNewsItemsList() {
  const main = document.querySelector('main') as HTMLDivElement;
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
  main.innerHTML = '';
  main.appendChild(fragment)
}

export { createNewsItemsList }