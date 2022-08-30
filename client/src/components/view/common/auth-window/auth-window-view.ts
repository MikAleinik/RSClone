import { AppEvents } from "../../../controller/app-events";
import Observer from "../../../controller/observer";
import INotify from "../../../interfaces/i-notify";
import View from "../../index/view";
import './auth-window.scss';
import ILocale from "../../../interfaces/i-locale";
import LocaleModel from "../../../models/common/localization/locale-model";
import { LocaleKeys } from "../../../models/common/localization/locale-keys";
export default class AuthWindowView extends View implements INotify, ILocale {
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
    private readonly CLASS_FIELD_INVALID = 'window-auth__field_invalid';
    private readonly CLASS_BUTTON = 'big__button';

    private readonly ID_FIELD_EMAIL = 'auth_email';
    private readonly ID_FIELD_PASS = 'auth_password';

    private _windowElement = document.createElement(this.TAG_CONTAINER);
    private _formElement = document.createElement(this.TAG_WINDOW);
    private _header = document.createElement(this.TAG_HEADER);
    private _textLogin = document.createElement(this.TAG_LABEL);
    private _textPassword = document.createElement(this.TAG_LABEL);
    private _loginButton = document.createElement(this.TAG_BUTTON);
    private _cancelButton = document.createElement(this.TAG_BUTTON);

    constructor(observer: Observer) {
        super(observer);
        this.createWindowElement();
        this._observer.addSender(AppEvents.AUTH_CLICK_BUTTON, this);
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
    }
    getCurrentElement(): HTMLElement {
        return this._windowElement;
    }
    notify(nameEvent: AppEvents): AppEvents | void {
        switch (nameEvent) {
            case AppEvents.AUTH_CLICK_BUTTON: {
                this._observer.notify(AppEvents.AUTH_SHOW_WINDOW, this);
                break;
            }
            case AppEvents.LOCALE_SET: {
                this._observer.notify(AppEvents.LOCALE_GET, this);
                break;
            }
            default: {
                break;
            }
        }
    }
    setLocale(locale: LocaleModel): void {
        this._header.textContent = locale.getPhrase(LocaleKeys.AUTH_HEADER);
        this._textLogin.textContent = locale.getPhrase(LocaleKeys.AUTH_EMAIL);
        this._textPassword.textContent = locale.getPhrase(LocaleKeys.AUTH_PASSWORD);
        this._loginButton.textContent = locale.getPhrase(LocaleKeys.BUTTON_LOGIN);
        this._cancelButton.textContent = locale.getPhrase(LocaleKeys.BUTTON_CANCEL);
    }
    setWindowVisibilityState(state: boolean): void {
        if (state) {
            this._windowElement.style.visibility = 'visible';
        } else {
            this._windowElement.style.visibility = 'hidden';
        }
    }
    successLogInHandler() {
        this.setWindowVisibilityState(false);//TODO убрать прямое изменение состояния
        this._observer.notify(AppEvents.AUTH_LOGIN_USER_SUCCESS, this);
    }
    failLogInHandler(result: Map<string, string>) {
        //TODO запилить отдельный компонент инфо окна для всех страниц
        alert(result.get('message'));
    }
    private logInUser() {
        event?.preventDefault();
        if(this.checkFormData()) {
            let params = new Map<string, string>();
            params.set(this.ID_FIELD_EMAIL, this._formElement.auth_email.value);
            params.set(this.ID_FIELD_PASS, this._formElement.auth_password.value);
            this._observer.notify(AppEvents.AUTH_LOGIN_USER, this, params);
        }
    }
    private checkFormData(): boolean {
        let result = true;
        if (this._formElement.auth_email.value == '') {
            this._formElement.auth_email.classList.add(this.CLASS_FIELD_INVALID);
            result = false;
        } else {
            this._formElement.auth_email.classList.remove(this.CLASS_FIELD_INVALID);
        }
        if (this._formElement.auth_password.value == '') {
            this._formElement.auth_password.classList.add(this.CLASS_FIELD_INVALID);
            result = false;
        } else {
            this._formElement.auth_password.classList.remove(this.CLASS_FIELD_INVALID);
        }
        return result;
    }
    private closeWindow() {
        event?.preventDefault();
        this._observer.notify(AppEvents.AUTH_HIDE_WINDOW, this);
    }
    private createWindowElement(): void {
        this._windowElement.classList.add(this.CLASS_CONTAINER);
        this._formElement.classList.add(this.CLASS_WINDOW);

        this._header.classList.add(this.CLASS_HEADER);
        this._formElement.insertAdjacentElement('beforeend', this._header);

        let rowElement = document.createElement(this.TAG_ROW_CONTAINER);
        rowElement.classList.add(this.CLASS_ROW_CONTAINER);
        this._textLogin.classList.add(this.CLASS_LABEL);
        const fieldLogin = document.createElement(this.TAG_FIELD);
        fieldLogin.classList.add(this.CLASS_FIELD);
        fieldLogin.setAttribute('id', this.ID_FIELD_EMAIL);
        rowElement.insertAdjacentElement('beforeend', this._textLogin);
        rowElement.insertAdjacentElement('beforeend', fieldLogin);
        this._formElement.insertAdjacentElement('beforeend', rowElement);

        rowElement = document.createElement(this.TAG_ROW_CONTAINER);
        rowElement.classList.add(this.CLASS_ROW_CONTAINER);
        this._textPassword.classList.add(this.CLASS_LABEL);
        const fieldPassword = document.createElement(this.TAG_FIELD);
        fieldPassword.classList.add(this.CLASS_FIELD);
        fieldPassword.setAttribute('type', 'password');
        fieldPassword.setAttribute('id', this.ID_FIELD_PASS);
        rowElement.insertAdjacentElement('beforeend', this._textPassword);
        rowElement.insertAdjacentElement('beforeend', fieldPassword);
        this._formElement.insertAdjacentElement('beforeend', rowElement);

        rowElement = document.createElement(this.TAG_ROW_CONTAINER);
        rowElement.classList.add(this.CLASS_ROW_CONTAINER);
        this._loginButton.classList.add(this.CLASS_BUTTON);
        this._loginButton.addEventListener('click', this.logInUser.bind(this));
        this._cancelButton.classList.add(this.CLASS_BUTTON);
        this._cancelButton.addEventListener('click', this.closeWindow.bind(this));
        rowElement.insertAdjacentElement('beforeend', this._loginButton);
        rowElement.insertAdjacentElement('beforeend', this._cancelButton);
        this._formElement.insertAdjacentElement('beforeend', rowElement);

        this._windowElement.insertAdjacentElement('beforeend', this._formElement);
    }
}