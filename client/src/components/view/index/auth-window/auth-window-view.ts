import { AppEvents } from "../../../controller/app-events";
import Observer from "../../../controller/observer";
import INotify from "../../../interfaces/i-notify";
import View from "../view";
import './auth-window.scss';
import '../../common/button.scss';
export default class AuthWindowView extends View implements INotify {
    private readonly TAG_CONTAINER = 'section';
    private readonly TAG_WINDOW = 'form';
    private readonly TAG_HEADER = 'h5';
    private readonly TAG_ROW_CONTAINER = 'div';
    private readonly TAG_BUTTON = 'button';
    private readonly TAG_LABEL = 'label';
    private readonly TAG_FIELD = 'input';
    private readonly CLASS_CONTAINER = 'window-auth__wrapper';
    private readonly CLASS_WINDOW = 'window-auth';
    private readonly CLASS_HEADER = 'window-auth__header';
    private readonly CLASS_ROW_CONTAINER = 'window-auth__row-container';
    private readonly CLASS_LABEL = 'window-auth__info';
    private readonly CLASS_FIELD = 'window-auth__field';
    private readonly CLASS_BUTTON = 'big__button';

    private readonly TEXT_HEADER = 'User authorization';//TODO (local) выносится в локализацию
    private readonly TEXT_FIELD_LOGIN = 'Login';//TODO (local) выносится в локализацию
    private readonly TEXT_FIELD_PASS = 'Password';//TODO (local) выносится в локализацию
    private readonly TEXT_BUTTON_LOGIN = 'Login user';//TODO (local) выносится в локализацию
    private readonly TEXT_BUTTON_CANCEL = 'Cancel';//TODO (local) выносится в локализацию

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
    private closeWindow() {
        event?.preventDefault();
        this._observer.notify(AppEvents.AUTH_HIDE_WINDOW, this);
    }
    private createWindowElement(): void {
        this._windowElement.classList.add(this.CLASS_CONTAINER);
        const formElement = document.createElement(this.TAG_WINDOW);
        formElement.classList.add(this.CLASS_WINDOW);

        const header = document.createElement(this.TAG_HEADER);
        header.classList.add(this.CLASS_HEADER);
        header.textContent = this.TEXT_HEADER;
        formElement.insertAdjacentElement('beforeend', header);

        let rowElement = document.createElement(this.TAG_ROW_CONTAINER);
        rowElement.classList.add(this.CLASS_ROW_CONTAINER);
        const textLogin = document.createElement(this.TAG_LABEL);
        textLogin.classList.add(this.CLASS_LABEL);
        textLogin.textContent = this.TEXT_FIELD_LOGIN;
        const fieldLogin = document.createElement(this.TAG_FIELD);
        fieldLogin.classList.add(this.CLASS_FIELD);
        rowElement.insertAdjacentElement('beforeend', textLogin);
        rowElement.insertAdjacentElement('beforeend', fieldLogin);
        formElement.insertAdjacentElement('beforeend', rowElement);

        rowElement = document.createElement(this.TAG_ROW_CONTAINER);
        rowElement.classList.add(this.CLASS_ROW_CONTAINER);
        const textPassword = document.createElement(this.TAG_LABEL);
        textPassword.classList.add(this.CLASS_LABEL);
        textPassword.textContent = this.TEXT_FIELD_PASS;
        const fieldPassword = document.createElement(this.TAG_FIELD);
        fieldPassword.classList.add(this.CLASS_FIELD);
        fieldPassword.setAttribute('type', 'password');
        rowElement.insertAdjacentElement('beforeend', textPassword);
        rowElement.insertAdjacentElement('beforeend', fieldPassword);
        formElement.insertAdjacentElement('beforeend', rowElement);

        rowElement = document.createElement(this.TAG_ROW_CONTAINER);
        rowElement.classList.add(this.CLASS_ROW_CONTAINER);
        const loginButton = document.createElement(this.TAG_BUTTON);
        loginButton.classList.add(this.CLASS_BUTTON);
        loginButton.textContent = this.TEXT_BUTTON_LOGIN;
        const cancelButton = document.createElement(this.TAG_BUTTON);
        cancelButton.classList.add(this.CLASS_BUTTON);
        cancelButton.textContent = this.TEXT_BUTTON_CANCEL;
        cancelButton.addEventListener('click', this.closeWindow.bind(this));
        rowElement.insertAdjacentElement('beforeend', loginButton);
        rowElement.insertAdjacentElement('beforeend', cancelButton);
        formElement.insertAdjacentElement('beforeend', rowElement);

        this._windowElement.insertAdjacentElement('beforeend', formElement);
    }
}