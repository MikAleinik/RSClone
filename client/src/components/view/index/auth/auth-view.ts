import { AppEvents } from "../../../controller/app-events";
import Observer from "../../../controller/observer";
import INotify from "../../../interfaces/i-notify";
import View from "../view";
import './auth.scss';

export default class AuthView extends View implements INotify {
    private readonly TAG_CONTAINER = 'section';
    private readonly TAG_BUTTON = 'button';
    private readonly CLASS_CONTAINER = 'auth';
    private readonly CLASS_BUTTON = 'big__button';
    private readonly CLASS_BUTTON_LOGIN = 'auth__login';
    private readonly CLASS_BUTTON_REGISTRATION = 'auth__registration';

    private readonly TEXT_BUTTON_LOGIN = 'Login';//TODO (local) выносится в локализацию
    private readonly TEXT_BUTTON_REGISTRATION = 'Registration';//TODO (local) выносится в локализацию

    private _authElement = document.createElement(this.TAG_CONTAINER);
    private _authButton!: HTMLButtonElement;
    private _registerButton!: HTMLButtonElement;

    constructor(observer: Observer) {
        super(observer);
        this.createAuthElement();
        this._observer.addSender(AppEvents.AUTH_SHOW_WINDOW, this);
        this._observer.addSender(AppEvents.AUTH_HIDE_WINDOW, this);
        this._observer.addSender(AppEvents.REGISTER_SHOW_WINDOW, this);
        this._observer.addSender(AppEvents.REGISTER_HIDE_WINDOW, this);
    }
    getCurrentElement(): HTMLElement {
        return this._authElement;
    }
    notify(nameEvent: AppEvents): void {
        switch (nameEvent) {
            case AppEvents.AUTH_SHOW_WINDOW: {
                this._observer.notify(AppEvents.AUTH_DISABLE_BUTTON, this);
                break;
            }
            case AppEvents.AUTH_HIDE_WINDOW: {
                this._observer.notify(AppEvents.AUTH_ENABLE_BUTTON, this);
                break;
            }
            case AppEvents.REGISTER_SHOW_WINDOW: {
                this._observer.notify(AppEvents.REGISTER_DISABLE_BUTTON, this);
                break;
            }
            case AppEvents.REGISTER_HIDE_WINDOW: {
                this._observer.notify(AppEvents.REGISTER_ENABLE_BUTTON, this);
                break;
            }
        }
    }
    setAuthButtonState(state: boolean): void {
        if (!state) {
            this._authButton.setAttribute('disabled', state.toString());
        } else {
            this._authButton.removeAttribute('disabled');
        }
    }
    setRegisterButtonState(state: boolean): void {
        if (!state) {
            this._registerButton.setAttribute('disabled', state.toString());
        } else {
            this._registerButton.removeAttribute('disabled');
        }
    }
    private createAuthElement(): void {
        this._authElement.classList.add(this.CLASS_CONTAINER);
        this._authButton = this.createButtonElement(this.CLASS_BUTTON_LOGIN, this.TEXT_BUTTON_LOGIN);
        this._authButton.addEventListener('click', this.authButtonClickHandler.bind(this));
        this._registerButton = this.createButtonElement(this.CLASS_BUTTON_REGISTRATION, this.TEXT_BUTTON_REGISTRATION);
        this._registerButton.addEventListener('click', this.registerButtonClickHandler.bind(this));
        this._authElement.insertAdjacentElement('beforeend', this._registerButton);
        this._authElement.insertAdjacentElement('beforeend', this._authButton);
    }
    private createButtonElement(className: string = '', text: string): HTMLButtonElement {
        let linkElement = document.createElement(this.TAG_BUTTON);
        linkElement.classList.add(this.CLASS_BUTTON);
        linkElement.classList.add(className);
        linkElement.textContent = text;
        return linkElement;
    }
    private authButtonClickHandler(): void {
        this._observer.notify(AppEvents.AUTH_CLICK_BUTTON, this);
    }
    private registerButtonClickHandler(): void {
        this._observer.notify(AppEvents.REGISTER_CLICK_BUTTON, this);
    }
}