import IView from "../../../interfaces/IView";
import './header.scss';

export default class HeaderView implements IView {
    private readonly TAG_CONTAINER = 'h1';
    private readonly TAG_LINK = 'a';
    private readonly CLASS_CONTAINER = '';//TODO удалить если не будет классов элемента
    private readonly CLASS_LINK = '';//TODO удалить если не будет классов элемента

    private readonly NAME_CURRENT = 'rs-trans';//TODO (local) выносится в локализацию

    private _headerElement = document.createElement(this.TAG_CONTAINER);

    constructor(link: string) {
        this.createHeaderElement(link);
    }
    getCurrentElement(): HTMLElement {
        return this._headerElement;
    }
    private createHeaderElement(link: string): void {
        this._headerElement.classList.add(this.CLASS_CONTAINER);
        this._headerElement.insertAdjacentElement('beforeend', this.createLinkElement(link, this.NAME_CURRENT));
    }
    private createLinkElement(link: string, text: string): HTMLElement {
        let linkElement = document.createElement(this.TAG_LINK);
        linkElement.classList.add(this.CLASS_LINK);
        linkElement.setAttribute('href', link);
        linkElement.textContent = text;
        return linkElement;
    }
}