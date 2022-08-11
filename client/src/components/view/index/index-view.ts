import IView from "../../interfaces/IView";
import '../common/color.scss';
import '../common/common.scss';
import FooterView from "../common/footer/footer-view";
import HeaderView from "../common/header/header-view";
import PageNavigationView from "../common/page-navigation/page-navigation-view";
import AuthView from "./auth/auth-view";
import ContentView from "./content/content-view";

export default class IndexView implements IView{
    private readonly TAG_CONTAINER = 'body';
    private readonly CLASS_CONTAINER = 'index';

    private readonly LINK_HEADER = '#';

    private _indexElement = document.getElementsByTagName(this.TAG_CONTAINER)[0];

    constructor() {
        this.createIndexElement();
    }
    getCurrentElement(): HTMLElement {
        return this._indexElement;
    }
    private createIndexElement(): void {
        this._indexElement.classList.add(this.CLASS_CONTAINER);
        let headerElement = new HeaderView(this.LINK_HEADER);
        let navigationElement = new PageNavigationView();
        let authElement = new AuthView();
        let contentElement = new ContentView();
        let footerElement = new FooterView();

        this._indexElement.insertAdjacentElement('beforeend', headerElement.getCurrentElement());
        this._indexElement.insertAdjacentElement('beforeend', navigationElement.getCurrentElement());
        this._indexElement.insertAdjacentElement('beforeend', authElement.getCurrentElement());
        this._indexElement.insertAdjacentElement('beforeend', contentElement.getCurrentElement());
        this._indexElement.insertAdjacentElement('beforeend', footerElement.getCurrentElement());
    }
}