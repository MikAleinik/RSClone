import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import View from "../../view";
import './register-window.scss';

export default class RegisterhWindowView extends View {
    private readonly TAG_CONTAINER = 'div';
    private readonly TAG_BUTTON = 'button';
    private readonly CLASS_CONTAINER = 'window-register';
    private readonly CLASS_BUTTON = 'window__button';

    private readonly TEXT_BUTTON = 'Register user';//TODO (local) выносится в локализацию

    private _windowElement = document.createElement(this.TAG_CONTAINER);

    constructor(observer: Observer) {
        super(observer);
        this.createWindowElement();
        document.addEventListener(AppEvents.REGISTER_CLICK_BUTTON, this.setWindowState.bind(this));
    }
    getCurrentElement(): HTMLElement {
        return this._windowElement;
    }
    private createWindowElement(): void {
        this._windowElement.classList.add(this.CLASS_CONTAINER);
        let loginButton = document.createElement(this.TAG_BUTTON);
        loginButton.classList.add(this.CLASS_BUTTON);
        loginButton.textContent = this.TEXT_BUTTON;
        this._windowElement.insertAdjacentElement('beforeend', loginButton);
    }
    private setWindowState(): void {
        const currentEvent = <CustomEvent>event;
        if (currentEvent.detail.state) {
            this._windowElement.style.visibility = 'visible';
        } else {
            this._windowElement.style.visibility = 'hidden';
        }
    }
}