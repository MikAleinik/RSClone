import IView from "../../../interfaces/IView";
import './page-navigation.scss';

export default class PageNavigationView implements IView {
    private readonly TAG_CONTAINER = 'nav';
    private readonly TAG_LIST = 'ul';
    private readonly TAG_LIST_ITEM = 'li';
    private readonly TAG_LINK = 'a';
    private readonly CLASS_CONTAINER = '';//TODO удалить если не будет классов элемента
    private readonly CLASS_LIST = '';//TODO удалить если не будет классов элемента
    private readonly CLASS_LIST_ITEM = '';//TODO удалить если не будет классов элемента
    private readonly CLASS_LINK = '';//TODO удалить если не будет классов элемента

    private readonly LINK_FOOTER = '#footer';
    private readonly TEXT_CONTACT = 'Contact';//TODO (local) выносится в локализацию
    private readonly TEXT_ABOUT = 'About';//TODO (local) выносится в локализацию

    private _navElement = document.createElement(this.TAG_CONTAINER);

    constructor(link: string = '#') {
        this.createHeaderElement(link);
    }
    getCurrentElement(): HTMLElement {
        return this._navElement;
    }
    private createHeaderElement(link: string): void {
        this._navElement.classList.add(this.CLASS_CONTAINER);
        let listElement = document.createElement(this.TAG_LIST);
        listElement.classList.add(this.CLASS_LIST);
        listElement.insertAdjacentElement('beforeend', this.createListItemElement(link, this.TEXT_ABOUT));
        listElement.insertAdjacentElement('beforeend', this.createListItemElement(this.LINK_FOOTER, this.TEXT_CONTACT));
        this._navElement.insertAdjacentElement('beforeend', listElement);
    }
    private createListItemElement(link: string, text: string): HTMLElement {
        let listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.classList.add(this.CLASS_LIST_ITEM);
        listItemElement.insertAdjacentElement('beforeend', this.createLinkElement(link, text));
        return listItemElement;
    }
    private createLinkElement(link: string, text: string): HTMLElement {
        let linkElement = document.createElement(this.TAG_LINK);
        linkElement.classList.add(this.CLASS_LINK);
        linkElement.setAttribute('href', link);
        linkElement.textContent = text;
        return linkElement;
    }
}