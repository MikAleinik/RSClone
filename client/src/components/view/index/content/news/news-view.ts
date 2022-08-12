import IModel from "../../../../interfaces/i-model";
import IView from "../../../../interfaces/i-view";
import { AppModels } from "../../../../models/index/AppModels";
import View from "../../view";
import './news.scss';

export default class NewsView extends View implements IView {
    private readonly TAG_CONTAINER = 'div';
    private readonly TAG_HEADER = 'h3';
    private readonly CLASS_CONTAINER = 'news';

    private readonly TEXT_HEADER = 'News';//TODO (local) выносится в локализацию

    private _newsElement = document.createElement(this.TAG_CONTAINER);

    constructor(models: Map<AppModels, IModel>) {
        super(models);
        this.createNewsElement();
    }
    getCurrentElement(): HTMLElement {
        return this._newsElement;
    }
    private createNewsElement(): void {
        this._newsElement.classList.add(this.CLASS_CONTAINER);
        let headerElement = document.createElement(this.TAG_HEADER);
        headerElement.textContent = this.TEXT_HEADER;
        this._newsElement.insertAdjacentElement('beforeend', headerElement);
    }
}