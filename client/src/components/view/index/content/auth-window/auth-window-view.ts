import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import View from "../../view";
import './auth-window.scss';

export default class AuthWindowView extends View implements INotify {
    private readonly TAG_CONTAINER = 'div';
    private readonly TAG_BUTTON = 'button';
    private readonly CLASS_CONTAINER = 'window-auth';
    private readonly CLASS_BUTTON = 'window__button';

    private readonly TEXT_BUTTON = 'Login user';//TODO (local) выносится в локализацию

    private _windowElement = document.createElement(this.TAG_CONTAINER);

    constructor(observer: Observer) {
        super(observer);
        this.createWindowElement();
        this._observer.addSender(AppEvents.AUTH_CLICK_BUTTON, this);
    }
    getCurrentElement(): HTMLElement {
        return this._windowElement;
    }
    notify(nameEvent: AppEvents): AppEvents | void {
        if(nameEvent === AppEvents.AUTH_CLICK_BUTTON) {
            this._observer.notify(AppEvents.AUTH_SHOW_WINDOW, this);  
        }
    }
    setWindowVisibilityState(state: boolean): void {
        if (state) {
            this._windowElement.style.visibility = 'visible';
        } else {
            this._windowElement.style.visibility = 'hidden';
        }
    }
    private createWindowElement(): void {
        this._windowElement.classList.add(this.CLASS_CONTAINER);
        let loginButton = document.createElement(this.TAG_BUTTON);
        loginButton.classList.add(this.CLASS_BUTTON);
        loginButton.textContent = this.TEXT_BUTTON;
        loginButton.addEventListener('click', this.closeWindow.bind(this));
        this._windowElement.insertAdjacentElement('beforeend', loginButton);
    }
    private closeWindow() {
        this._observer.notify(AppEvents.AUTH_HIDE_WINDOW, this);
    }
}