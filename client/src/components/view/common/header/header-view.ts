import Observer from '../../../controller/observer';
import View from '../../index/view';
import './header.scss';

export default class HeaderView extends View {
    private readonly TAG_CONTAINER = 'header';
    private readonly TAG_HEADER = 'h1';
    private readonly TAG_LINK = 'a';
    private readonly CLASS_CONTAINER = 'header';

    private readonly NAME_CURRENT = 'rs-trans';//TODO (local) выносится в локализацию

    private _headerElement = document.createElement(this.TAG_CONTAINER);

    constructor(observer: Observer, link: string) {
        super(observer);
        this.createHeaderElement(link);
    }
    getCurrentElement(): HTMLElement {
        return this._headerElement;
    }
    private createHeaderElement(link: string): void {
        this._headerElement.classList.add(this.CLASS_CONTAINER);
        const header = document.createElement(this.TAG_HEADER);
        header.insertAdjacentElement('beforeend', this.createLinkElement(link, this.NAME_CURRENT));
        this._headerElement.insertAdjacentElement('beforeend', header);
    }
    private createLinkElement(link: string, text: string): HTMLElement {
        let linkElement = document.createElement(this.TAG_LINK);
        linkElement.setAttribute('href', link);
        linkElement.textContent = text;
        return linkElement;
    }
}