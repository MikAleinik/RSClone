import FooterView from "../common/footer/footer-view";
import HeaderView from "../common/header/header-view";
import PageNavigationView from "../common/page-navigation/page-navigation-view";
import AuthView from "../common/auth/auth-view";
import ContentView from "./content/content-view";
import View from "./view";
import Observer from "../../controller/observer";
import AuthWindowView from '../common/auth-window/auth-window-view';
import RegisterWindowView from '../common/register-window/register-window-view';

export default class AboutView extends View {
    private readonly TAG_CONTAINER = 'body';
    private readonly CLASS_CONTAINER = 'about';

    private readonly LINK_HEADER = '#';

    private _aboutElement = document.querySelector('body') as HTMLElement;

    constructor(observer: Observer) {
        super(observer);
        this.createAboutElement();
    }
    getCurrentElement(): HTMLElement {
        return this._aboutElement;
    }
    private createAboutElement(): void {
        this._aboutElement.innerHTML = '';
        this._aboutElement.className = this.CLASS_CONTAINER;
        let headerElement = new HeaderView(this._observer, this.LINK_HEADER);
        let navigationElement = new PageNavigationView(this._observer);
        let authElement = new AuthView(this._observer);
        let contentElement = new ContentView(this._observer);
        let footerElement = new FooterView(this._observer);
        let authWindow = new AuthWindowView(this._observer);
        let registerWindow = new RegisterWindowView(this._observer);

        this._aboutElement.appendChild(headerElement.getCurrentElement());
        this._aboutElement.appendChild(navigationElement.getCurrentElement());
        this._aboutElement.appendChild(authElement.getCurrentElement());
        // this._aboutElement.appendChild(contentElement.getCurrentElement()); // 
        this._aboutElement.appendChild(footerElement.getCurrentElement());
        this._aboutElement.appendChild(authWindow.getCurrentElement());
        this._aboutElement.appendChild(registerWindow.getCurrentElement());
    }
}