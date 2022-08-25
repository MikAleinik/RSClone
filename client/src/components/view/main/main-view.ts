import './main.scss';
import FooterView from "../common/footer/footer-view";
import HeaderView from "../common/header/header-view";
import PageNavigationView from "../common/page-navigation/page-navigation-view";
import AuthView from "../common/auth/auth-view";
// import ContentView from "./content/content-view";
import View from "./view";
import Observer from "../../controller/observer";

export default class MainView extends View {
    private readonly TAG_CONTAINER = 'body';
    private readonly CLASS_CONTAINER = 'main';

    private readonly LINK_HEADER = 'index.html';

    private _mainElement = document.querySelector(this.TAG_CONTAINER) as HTMLElement;

    constructor(observer: Observer) {
        super(observer);
        this.createMainElement();
    }
    getCurrentElement(): HTMLElement {
        return this._mainElement;
    }
    private createMainElement(): void {
        this._mainElement.innerHTML = '';
        this._mainElement.className = this.CLASS_CONTAINER;
        let headerElement = new HeaderView(this._observer, this.LINK_HEADER);
        let navigationElement = new PageNavigationView(this._observer);
        let authElement = new AuthView(this._observer);
        // let contentElement = new ContentView(this._observer);
        let footerElement = new FooterView(this._observer);

        this._mainElement.appendChild(headerElement.getCurrentElement());
        this._mainElement.appendChild(navigationElement.getCurrentElement());
        this._mainElement.appendChild(authElement.getCurrentElement());
        // this._mainElement.appendChild(contentElement.getCurrentElement()); // 
        this._mainElement.appendChild(footerElement.getCurrentElement());
    }
}