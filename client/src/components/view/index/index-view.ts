import './index.scss';
import FooterView from "../common/footer/footer-view";
import HeaderView from "../common/header/header-view";
import PageNavigationView from "../common/page-navigation/page-navigation-view";
import AuthView from "./auth/auth-view";
import ContentView from "./content/content-view";
import View from "./view";
import Observer from "../../controller/observer";

export default class IndexView extends View {
    private readonly TAG_CONTAINER = 'body';
    private readonly CLASS_CONTAINER = 'index';

    private readonly LINK_HEADER = '#';

    private _indexElement = document.getElementsByTagName(this.TAG_CONTAINER)[0];

    constructor(observer: Observer) {
        super(observer);
        this.createIndexElement();
    }
    getCurrentElement(): HTMLElement {
        return this._indexElement;
    }
    private createIndexElement(): void {
        this._indexElement.classList.add(this.CLASS_CONTAINER);
        let headerElement = new HeaderView(this.LINK_HEADER);
        let navigationElement = new PageNavigationView();
        let authElement = new AuthView(this._observer);
        let contentElement = new ContentView(this._observer);
        let footerElement = new FooterView();

        this._indexElement.insertAdjacentElement('beforeend', headerElement.getCurrentElement());
        this._indexElement.insertAdjacentElement('beforeend', navigationElement.getCurrentElement());
        this._indexElement.insertAdjacentElement('beforeend', authElement.getCurrentElement());
        this._indexElement.insertAdjacentElement('beforeend', contentElement.getCurrentElement());
        this._indexElement.insertAdjacentElement('beforeend', footerElement.getCurrentElement());
    }
}