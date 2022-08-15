import './content.scss';
import NewsView from "./news/news-view";
import View from "../view";
import Observer from "../../../controller/observer";

export default class ContentView extends View {
    private readonly TAG_CONTAINER = 'main';
    private readonly TAG_PROMO = 'div';
    private readonly TAG_LIST = 'ul';
    private readonly TAG_LIST_ITEM = 'li';
    private readonly CLASS_PROMO = 'promo';

    private readonly TEXT_HEADER = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';//TODO (local) выносится в локализацию
    private readonly TEXT_INFO_ONE = 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris';//TODO (local) выносится в локализацию
    private readonly TEXT_INFO_TWO = 'Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in';//TODO (local) выносится в локализацию
    private readonly TEXT_INFO_THREE = 'Reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla';//TODO (local) выносится в локализацию

    private _contentElement = document.createElement(this.TAG_CONTAINER);

    constructor(observer: Observer) {
        super(observer);
        this.createContentElement();
    }
    getCurrentElement(): HTMLElement {
        return this._contentElement;
    }
    private createContentElement(): void {
        let promoElement = this.createPromoElement();
        let listElement = document.createElement(this.TAG_LIST);
        listElement.insertAdjacentElement('beforeend', this.createListItemElement(this.TEXT_INFO_ONE));
        listElement.insertAdjacentElement('beforeend', this.createListItemElement(this.TEXT_INFO_TWO));
        listElement.insertAdjacentElement('beforeend', this.createListItemElement(this.TEXT_INFO_THREE));
        promoElement.insertAdjacentElement('beforeend', listElement);
        let newsElement = new NewsView(this._observer);
        this._contentElement.insertAdjacentElement('beforeend', newsElement.getCurrentElement());
    }
    private createPromoElement(): HTMLElement {
        let contentElement = document.createElement(this.TAG_PROMO);
        contentElement.classList.add(this.CLASS_PROMO);
        contentElement.textContent = this.TEXT_HEADER;//TODO не есть хорошо - сделать взамест заголовок страницы, а ля для сканеров поисковиков
        return contentElement;
    }
    private createListItemElement(text: string): HTMLElement {
        let listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.textContent = text;
        return listItemElement;
    }
}