import IView from "../../../../interfaces/IView";
import './news.scss';

export default class NewsView implements IView {
    private readonly TAG_CONTAINER = 'div';
    private readonly TAG_HEADER = 'h3';
    private readonly CLASS_CONTAINER = 'news';
    private readonly CLASS_HEADER = '';//TODO удалить если не будет классов элемента

    private readonly TEXT_HEADER = 'News';//TODO (local) выносится в локализацию

    private _newsElement = document.createElement(this.TAG_CONTAINER);

    constructor() {
        this.createNewsElement();
    }
    getCurrentElement(): HTMLElement {
        return this._newsElement;
    }
    private createNewsElement(): void {
        this._newsElement.classList.add(this.CLASS_CONTAINER);
        let headerElement = document.createElement(this.TAG_HEADER);
        headerElement.classList.add(this.CLASS_HEADER);
        headerElement.textContent = this.TEXT_HEADER;
        this._newsElement.insertAdjacentElement('beforeend', headerElement);
    }
}