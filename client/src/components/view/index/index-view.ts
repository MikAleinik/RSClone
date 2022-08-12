import IView from "../../interfaces/i-view";
import './index.scss';
import FooterView from "../common/footer/footer-view";
import HeaderView from "../common/header/header-view";
import PageNavigationView from "../common/page-navigation/page-navigation-view";
import AuthView from "./auth/auth-view";
import ContentView from "./content/content-view";
import IModel from "../../interfaces/i-model";
import { AppModels } from "../../models/index/AppModels";
import View from "./view";

export default class IndexView extends View implements IView {
    private readonly TAG_CONTAINER = 'body';
    private readonly CLASS_CONTAINER = 'index';

    private readonly LINK_HEADER = '#';

    private _indexElement = document.getElementsByTagName(this.TAG_CONTAINER)[0];

    constructor(models: Map<AppModels, IModel>) {
        super(models);
        this.createIndexElement();
    }
    getCurrentElement(): HTMLElement {
        return this._indexElement;
    }
    private createIndexElement(): void {
        this._indexElement.classList.add(this.CLASS_CONTAINER);
        let headerElement = new HeaderView(this.LINK_HEADER);
        let navigationElement = new PageNavigationView();
        let authElement = new AuthView(this._models);
        let contentElement = new ContentView(this._models);
        let footerElement = new FooterView();

        this._indexElement.insertAdjacentElement('beforeend', headerElement.getCurrentElement());
        this._indexElement.insertAdjacentElement('beforeend', navigationElement.getCurrentElement());
        this._indexElement.insertAdjacentElement('beforeend', authElement.getCurrentElement());
        this._indexElement.insertAdjacentElement('beforeend', contentElement.getCurrentElement());
        this._indexElement.insertAdjacentElement('beforeend', footerElement.getCurrentElement());
    }
}