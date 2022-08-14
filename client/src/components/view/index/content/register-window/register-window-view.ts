import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import View from "../../view";
import './register-window.scss';

export default class RegisterWindowView extends View implements INotify {
    private readonly TAG_CONTAINER = 'div';
    private readonly TAG_BUTTON = 'button';
    private readonly CLASS_CONTAINER = 'window-register';
    private readonly CLASS_BUTTON = 'window__button';

    private readonly TEXT_BUTTON = 'Register user';//TODO (local) выносится в локализацию

    private _windowElement = document.createElement(this.TAG_CONTAINER);

    constructor(observer: Observer) {
        super(observer);
        this.createWindowElement();
        this._observer.addSender(AppEvents.REGISTER_CHANGE_STATE_WINDOW, this);
    }
    getCurrentElement(): HTMLElement {
        return this._windowElement;
    }
    notify(nameEvent: AppEvents): AppEvents | void {
        this._observer.notify(nameEvent, this);
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
        let registerButton = document.createElement(this.TAG_BUTTON);
        registerButton.classList.add(this.CLASS_BUTTON);
        registerButton.textContent = this.TEXT_BUTTON;
        registerButton.addEventListener('click', this.closeWindow.bind(this));
        this._windowElement.insertAdjacentElement('beforeend', registerButton);
    }
    private closeWindow() {
        this._observer.notify(AppEvents.REGISTER_CHANGE_STATE_WINDOW, this);
    }
}