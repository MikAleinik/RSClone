import { AppEvents } from "../../../controller/app-events";
import Observer from "../../../controller/observer";
import ILocale from "../../../interfaces/i-locale";
import INotify from "../../../interfaces/i-notify";
import { LocaleKeys } from "../../../models/common/localization/locale-keys";
import LocaleModel from "../../../models/common/localization/locale-model";
import View from "../../index/view";
import './register-window.scss';

export default class RegisterWindowView extends View implements INotify, ILocale {
    private readonly TAG_CONTAINER = 'section';
    private readonly TAG_WINDOW = 'form';
    private readonly TAG_HEADER = 'h5';
    private readonly TAG_ROW_CONTAINER = 'div';
    private readonly TAG_BUTTON = 'button';
    private readonly TAG_LABEL = 'label';
    private readonly TAG_FIELD = 'input';
    private readonly CLASS_CONTAINER = 'window-register__wrapper';
    private readonly CLASS_WINDOW = 'window-register';
    private readonly CLASS_HEADER = 'window-register__header';
    private readonly CLASS_ROW_CONTAINER = 'window-register__row-container';
    private readonly CLASS_LABEL = 'window-register__info';
    private readonly CLASS_FIELD = 'window-register__field';
    private readonly CLASS_FIELD_SELECT = 'window-register__field_select';
    private readonly CLASS_FIELD_INVALID = 'window-register__field_invalid';
    private readonly CLASS_BUTTON = 'big__button';

    private readonly ID_FIELD_LOGIN = 'login';
    private readonly ID_FIELD_PASS = 'password';
    private readonly ID_FIELD_EMAIL = 'email';
    private readonly ID_FIELD_ROLE = 'role';

    private _windowElement = document.createElement(this.TAG_CONTAINER);
    private _formElement = document.createElement(this.TAG_WINDOW);
    private _header = document.createElement(this.TAG_HEADER);
    private _textLogin = document.createElement(this.TAG_LABEL);
    private _textEmail = document.createElement(this.TAG_LABEL);
    private _textPassword = document.createElement(this.TAG_LABEL);
    private _textRole = document.createElement(this.TAG_LABEL);
    private _textFieldRole = document.createElement(this.TAG_LABEL);
    private _loginButton = document.createElement(this.TAG_BUTTON);
    private _cancelButton = document.createElement(this.TAG_BUTTON);
    private _indexSelectedRole = 0;
    private _roles = new Array<string>();

    constructor(observer: Observer) {
        super(observer);
        this.createWindowElement();
        this._observer.addSender(AppEvents.REGISTER_CLICK_BUTTON, this);
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
    }
    getCurrentElement(): HTMLElement {
        return this._windowElement;
    }
    notify(nameEvent: AppEvents): AppEvents | void {
        switch (nameEvent) {
            case AppEvents.REGISTER_CLICK_BUTTON: {
                this._observer.notify(AppEvents.REGISTER_SHOW_WINDOW, this);
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
        this._header.textContent = locale.getPhrase(LocaleKeys.REGISTER_HEADER);
        this._textLogin.textContent = locale.getPhrase(LocaleKeys.REGISTER_LOGIN);
        this._textEmail.textContent = locale.getPhrase(LocaleKeys.REGISTER_EMAIL);
        this._textPassword.textContent = locale.getPhrase(LocaleKeys.REGISTER_PASSWORD);
        this._textRole.textContent = locale.getPhrase(LocaleKeys.REGISTER_ROLE);
        this._roles = new Array();
        this._roles.push(locale.getPhrase(LocaleKeys.ROLE_CUSTOMER));
        this._roles.push(locale.getPhrase(LocaleKeys.ROLE_CARRIER));
        this._textFieldRole.textContent = this._roles[this._indexSelectedRole];
        this._loginButton.textContent = locale.getPhrase(LocaleKeys.BUTTON_REGISTER);
        this._cancelButton.textContent = locale.getPhrase(LocaleKeys.BUTTON_CANCEL);
    }
    setWindowVisibilityState(state: boolean): void {
        if (state) {
            this._windowElement.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
        } else {
            this._windowElement.style.visibility = 'hidden';
            document.body.style.overflow = 'auto'
        }
    }
    successRegistrationHandler() {
        this.setWindowVisibilityState(false);//TODO убрать прямое изменение состояния
        this._observer.notify(AppEvents.REGISTER_USER_SUCCESS, this);
    }
    failRegistrationHandler(result: Map<string, string>) {
        // alert(result.get('message'));
    }
    private closeWindow() {
        event?.preventDefault();
        this._observer.notify(AppEvents.REGISTER_HIDE_WINDOW, this);
    }
    private registerUser() {
        event?.preventDefault();
        if (this.checkFormData()) {
            let params = new Map<string, string>();
            params.set(this.ID_FIELD_LOGIN, this._formElement.login.value);
            params.set(this.ID_FIELD_EMAIL, this._formElement.email.value);
            params.set(this.ID_FIELD_PASS, this._formElement.password.value);
            const role = this._formElement.getElementsByClassName(this.CLASS_FIELD_SELECT)[0].textContent;
            params.set(this.ID_FIELD_ROLE, (role !== null ? role : ''));
            this._observer.notify(AppEvents.REGISTER_USER, this, params);
        }
    }
    private checkFormData(): boolean {
        let result = true;
        if (this._formElement.login.value == '') {
            this._formElement.login.classList.add(this.CLASS_FIELD_INVALID);
            result = false;
        } else {
            this._formElement.login.classList.remove(this.CLASS_FIELD_INVALID);
        }
        if (this._formElement.password.value == '') {
            this._formElement.password.classList.add(this.CLASS_FIELD_INVALID);
            result = false;
        } else {
            this._formElement.password.classList.remove(this.CLASS_FIELD_INVALID);
        }
        if (this._formElement.email.value == '') {
            this._formElement.email.classList.add(this.CLASS_FIELD_INVALID);
            result = false;
        } else {
            this._formElement.email.classList.remove(this.CLASS_FIELD_INVALID);
        }
        return result;
    }
    private changeRole() {
        if (this._indexSelectedRole === 0) {
            this._indexSelectedRole = 1;
        } else {
            this._indexSelectedRole = 0;
        }
        this._textFieldRole.textContent = this._roles[this._indexSelectedRole];
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
        fieldLogin.setAttribute('id', this.ID_FIELD_LOGIN);
        rowElement.insertAdjacentElement('beforeend', this._textLogin);
        rowElement.insertAdjacentElement('beforeend', fieldLogin);
        this._formElement.insertAdjacentElement('beforeend', rowElement);

        rowElement = document.createElement(this.TAG_ROW_CONTAINER);
        rowElement.classList.add(this.CLASS_ROW_CONTAINER);
        this._textEmail.classList.add(this.CLASS_LABEL);
        const fieldEmail = document.createElement(this.TAG_FIELD);
        fieldEmail.classList.add(this.CLASS_FIELD);
        fieldEmail.setAttribute('id', this.ID_FIELD_EMAIL);
        rowElement.insertAdjacentElement('beforeend', this._textEmail);
        rowElement.insertAdjacentElement('beforeend', fieldEmail);
        this._formElement.insertAdjacentElement('beforeend', rowElement);

        rowElement = document.createElement(this.TAG_ROW_CONTAINER);
        rowElement.classList.add(this.CLASS_ROW_CONTAINER);
        this._textRole.classList.add(this.CLASS_LABEL);
        this._textFieldRole.classList.add(this.CLASS_FIELD_SELECT);
        this._textFieldRole.setAttribute('id', this.ID_FIELD_ROLE);
        this._textFieldRole.addEventListener('click', this.changeRole.bind(this));
        rowElement.insertAdjacentElement('beforeend', this._textRole);
        rowElement.insertAdjacentElement('beforeend', this._textFieldRole);
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
        this._loginButton.setAttribute('type', 'submit');
        this._loginButton.addEventListener('click', this.registerUser.bind(this));

        this._cancelButton.classList.add(this.CLASS_BUTTON);
        this._cancelButton.addEventListener('click', this.closeWindow.bind(this));
        rowElement.insertAdjacentElement('beforeend', this._loginButton);
        rowElement.insertAdjacentElement('beforeend', this._cancelButton);
        this._formElement.insertAdjacentElement('beforeend', rowElement);

        this._windowElement.insertAdjacentElement('beforeend', this._formElement);
    }
}