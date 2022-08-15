import { AppEvents } from "../../../controller/app-events";
import Observer from "../../../controller/observer";
import INotify from "../../../interfaces/i-notify";
import View from "../view";
import './register-window.scss';

export default class RegisterWindowView extends View implements INotify {
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
    private readonly CLASS_FIELD_INVALID = 'window-register__field_invalid';
    private readonly CLASS_BUTTON = 'big__button';

    private readonly TEXT_HEADER = 'Registration new user';//TODO (local) выносится в локализацию
    private readonly TEXT_FIELD_LOGIN = 'Login';//TODO (local) выносится в локализацию
    private readonly TEXT_FIELD_PASS = 'Password';//TODO (local) выносится в локализацию
    private readonly TEXT_FIELD_EMAIL = 'Email';//TODO (local) выносится в локализацию
    private readonly TEXT_BUTTON_LOGIN = 'Register';//TODO (local) выносится в локализацию
    private readonly TEXT_BUTTON_CANCEL = 'Cancel';//TODO (local) выносится в локализацию
    private readonly ID_FORM = 'form_auth';
    private readonly ID_FIELD_LOGIN = 'login';
    private readonly ID_FIELD_PASS = 'password';
    private readonly ID_FIELD_EMAIL = 'email';

    private _windowElement = document.createElement(this.TAG_CONTAINER);
    private _formElement = document.createElement(this.TAG_WINDOW);

    constructor(observer: Observer) {
        super(observer);
        this.createWindowElement();
        this._observer.addSender(AppEvents.REGISTER_CLICK_BUTTON, this);
    }
    getCurrentElement(): HTMLElement {
        return this._windowElement;
    }
    notify(nameEvent: AppEvents): AppEvents | void {
        if(nameEvent === AppEvents.REGISTER_CLICK_BUTTON) {
            this._observer.notify(AppEvents.REGISTER_SHOW_WINDOW, this);  
        }
    }
    setWindowVisibilityState(state: boolean): void {
        if (state) {
            this._windowElement.style.visibility = 'visible';
        } else {
            this._windowElement.style.visibility = 'hidden';
        }
    }
    successRegistrationHandler() {
        this.setWindowVisibilityState(false);
        this._observer.notify(AppEvents.REGISTER_USER_SUCCESS, this);
    }
    failRegistrationHandler(result: Map<string, string>) {
        //TODO запилить отдельный компонент инфо окна для всех страниц
        alert(result.get('message'));
    }
    private closeWindow() {
        event?.preventDefault();
        this._observer.notify(AppEvents.REGISTER_HIDE_WINDOW, this);
    }
    private registerUser() {
        event?.preventDefault();
        if(this.checkFormData()) {
            let params = new Map<string, string>();
            params.set(this.ID_FIELD_LOGIN, this._formElement.login.value);
            params.set(this.ID_FIELD_EMAIL, this._formElement.email.value);
            params.set(this.ID_FIELD_PASS, this._formElement.password.value);
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
    private createWindowElement(): void {
        this._windowElement.classList.add(this.CLASS_CONTAINER);
        this._formElement.classList.add(this.CLASS_WINDOW);

        const header = document.createElement(this.TAG_HEADER);
        header.classList.add(this.CLASS_HEADER);
        header.textContent = this.TEXT_HEADER;
        this._formElement.insertAdjacentElement('beforeend', header);

        let rowElement = document.createElement(this.TAG_ROW_CONTAINER);
        rowElement.classList.add(this.CLASS_ROW_CONTAINER);
        const textLogin = document.createElement(this.TAG_LABEL);
        textLogin.classList.add(this.CLASS_LABEL);
        textLogin.textContent = this.TEXT_FIELD_LOGIN;
        const fieldLogin = document.createElement(this.TAG_FIELD);
        fieldLogin.classList.add(this.CLASS_FIELD);
        fieldLogin.setAttribute('id', this.ID_FIELD_LOGIN);
        rowElement.insertAdjacentElement('beforeend', textLogin);
        rowElement.insertAdjacentElement('beforeend', fieldLogin);
        this._formElement.insertAdjacentElement('beforeend', rowElement);

        rowElement = document.createElement(this.TAG_ROW_CONTAINER);
        rowElement.classList.add(this.CLASS_ROW_CONTAINER);
        const textEmail = document.createElement(this.TAG_LABEL);
        textEmail.classList.add(this.CLASS_LABEL);
        textEmail.textContent = this.TEXT_FIELD_EMAIL;
        const fieldEmail = document.createElement(this.TAG_FIELD);
        fieldEmail.classList.add(this.CLASS_FIELD);
        fieldEmail.setAttribute('id', this.ID_FIELD_EMAIL);
        rowElement.insertAdjacentElement('beforeend', textEmail);
        rowElement.insertAdjacentElement('beforeend', fieldEmail);
        this._formElement.insertAdjacentElement('beforeend', rowElement);

        rowElement = document.createElement(this.TAG_ROW_CONTAINER);
        rowElement.classList.add(this.CLASS_ROW_CONTAINER);
        const textPassword = document.createElement(this.TAG_LABEL);
        textPassword.classList.add(this.CLASS_LABEL);
        textPassword.textContent = this.TEXT_FIELD_PASS;
        const fieldPassword = document.createElement(this.TAG_FIELD);
        fieldPassword.classList.add(this.CLASS_FIELD);
        fieldPassword.setAttribute('type', 'password');
        fieldPassword.setAttribute('id', this.ID_FIELD_PASS);
        rowElement.insertAdjacentElement('beforeend', textPassword);
        rowElement.insertAdjacentElement('beforeend', fieldPassword);
        this._formElement.insertAdjacentElement('beforeend', rowElement);

        rowElement = document.createElement(this.TAG_ROW_CONTAINER);
        rowElement.classList.add(this.CLASS_ROW_CONTAINER);
        const loginButton = document.createElement(this.TAG_BUTTON);
        loginButton.classList.add(this.CLASS_BUTTON);
        loginButton.textContent = this.TEXT_BUTTON_LOGIN;
        loginButton.setAttribute('type', 'submit');

        loginButton.addEventListener('click', this.registerUser.bind(this));
        const cancelButton = document.createElement(this.TAG_BUTTON);
        cancelButton.classList.add(this.CLASS_BUTTON);
        cancelButton.textContent = this.TEXT_BUTTON_CANCEL;
        cancelButton.addEventListener('click', this.closeWindow.bind(this));
        rowElement.insertAdjacentElement('beforeend', loginButton);
        rowElement.insertAdjacentElement('beforeend', cancelButton);
        this._formElement.insertAdjacentElement('beforeend', rowElement);

        this._windowElement.insertAdjacentElement('beforeend', this._formElement);
    }
}