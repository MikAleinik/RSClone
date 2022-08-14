import Observer from '../../../controller/observer';
import View from '../../index/view';
import './page-navigation.scss';

export default class PageNavigationView extends View {
    private readonly TAG_CONTAINER = 'nav';
    private readonly TAG_LIST = 'ul';
    private readonly TAG_LIST_ITEM = 'li';
    private readonly TAG_LINK = 'a';

    private readonly LINK_FOOTER = '#footer';
    private readonly TEXT_CONTACT = 'Contact';//TODO (local) выносится в локализацию
    private readonly TEXT_ABOUT = 'About';//TODO (local) выносится в локализацию

    private _navElement = document.createElement(this.TAG_CONTAINER);

    constructor(observer: Observer, link: string = '#') {
        super(observer);
        this.createHeaderElement(link);
    }
    getCurrentElement(): HTMLElement {
        return this._navElement;
    }
    private createHeaderElement(link: string): void {
        let listElement = document.createElement(this.TAG_LIST);
        listElement.insertAdjacentElement('beforeend', this.createListItemElement(link, this.TEXT_ABOUT));
        listElement.insertAdjacentElement('beforeend', this.createListItemElement(this.LINK_FOOTER, this.TEXT_CONTACT));
        this._navElement.insertAdjacentElement('beforeend', listElement);
    }
    private createListItemElement(link: string, text: string): HTMLElement {
        let listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.insertAdjacentElement('beforeend', this.createLinkElement(link, text));
        return listItemElement;
    }
    private createLinkElement(link: string, text: string): HTMLElement {
        let linkElement = document.createElement(this.TAG_LINK);
        linkElement.setAttribute('href', link);
        linkElement.textContent = text;
        return linkElement;
    }
}