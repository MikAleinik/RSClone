import './content.scss';
import View from "../view";
import Observer from "../../../controller/observer";

export default class ContentView extends View {
    private _rootContainer = document.body;

    private readonly ASIDE_CONTAINER = 'aside';
    private readonly ASIDE_LIST = 'ul';
    private readonly ASIDE_LIST_ITEM = 'li';
    private _asideElement = document.createElement(this.ASIDE_CONTAINER);

    private readonly MAIN_CONTAINER = 'main';
    private readonly ARTICLE_CONTAINER = 'article';
    private _contentElement = document.createElement(this.MAIN_CONTAINER);

    constructor(observer: Observer) {
        super(observer);
        this.createAboutContent();
    }
    
    getCurrentElement(): HTMLElement {
        return this._rootContainer;
    }
    private createAboutContent(): void {
        this._rootContainer.appendChild(this._asideElement);
        this._rootContainer.appendChild(this._contentElement)
        const asideList = document.createElement(this.ASIDE_LIST);
        const article = document.createElement(this.ARTICLE_CONTAINER);
        fetch('./assets/about.json') // content must be replaced to right place
        .then((response) => response.json())
        .then((data) => {
          data.forEach((el: {[index: string]: string}, index: number) => {
              const asideItem = document.createElement(this.ASIDE_LIST_ITEM);
              asideItem.innerHTML = `<a href="#${index}">${el.title}</a>`;
              asideList.appendChild(asideItem);
              const articleHeader = document.createElement('h3');
              articleHeader.textContent = el.title;
              articleHeader.id = index.toString();
              const articleContent = document.createElement('p');
              articleContent.textContent = el.content;
              article.appendChild(articleHeader);
              article.appendChild(articleContent);
            })
          })
        this._asideElement.appendChild(asideList);
        this._contentElement.appendChild(article);
    }
}