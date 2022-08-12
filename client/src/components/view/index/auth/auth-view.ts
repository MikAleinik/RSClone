import detail from "../../../../types/detail";
import { AppEvents } from "../../../controller/app-events";
import AuthController from "../../../controller/index/auth-controller";
import RegisterController from "../../../controller/index/register-controller";
import Observer from "../../../controller/observer";
import IModel from "../../../interfaces/i-model";
import IView from "../../../interfaces/i-view";
import { AppModels } from "../../../models/index/AppModels";
import View from "../view";
import './auth.scss';

export default class AuthView extends View implements IView {
    private readonly TAG_CONTAINER = 'section';
    private readonly TAG_BUTTON = 'button';
    private readonly CLASS_CONTAINER = 'auth';
    private readonly CLASS_BUTTON = 'big__button';
    private readonly CLASS_BUTTON_LOGIN = 'auth__login';
    private readonly CLASS_BUTTON_REGISTRATION = 'auth__registration';

    private readonly TEXT_BUTTON_LOGIN = 'Login';//TODO (local) выносится в локализацию
    private readonly TEXT_BUTTON_REGISTRATION = 'Registration';//TODO (local) выносится в локализацию

    private _authElement = document.createElement(this.TAG_CONTAINER);
    private _observer = new Observer(this);

    constructor(models: Map<AppModels, IModel>) {
        super(models);
        this.createAuthElement();
        this._observer.set(new AuthController(this));
        this._observer.set(new RegisterController(this));
    }
    getCurrentElement(): HTMLElement {
        return this._authElement;
    }
    notify(eventDetail: detail): void {
        //TODO реализация сокрытия кнопок
        //TODO при успешной авторизации
        //TODO при успешной регистрации
    }
    private createAuthElement(): void {
        this._authElement.classList.add(this.CLASS_CONTAINER);
        let authButton = this.createButtonElement(this.CLASS_BUTTON_LOGIN, this.TEXT_BUTTON_LOGIN);
        authButton.addEventListener('click', this.authButtonClickHandler.bind(this));
        let registerButton = this.createButtonElement(this.CLASS_BUTTON_REGISTRATION, this.TEXT_BUTTON_REGISTRATION);
        registerButton.addEventListener('click', this.registerButtonClickHandler.bind(this));
        this._authElement.insertAdjacentElement('beforeend', authButton);
        this._authElement.insertAdjacentElement('beforeend', registerButton);
    }
    private createButtonElement(className: string = '', text: string): HTMLElement {
        let linkElement = document.createElement(this.TAG_BUTTON);
        linkElement.classList.add(this.CLASS_BUTTON);
        linkElement.classList.add(className);
        linkElement.textContent = text;
        return linkElement;
    }
    private authButtonClickHandler(): void {
        this._observer.notify(AppEvents.STATE_CHANGE_VISIBILITY_AUTH);
    }
    private registerButtonClickHandler(): void {
        this._observer.notify(AppEvents.STATE_CHANGE_VISIBILITY_REGISTER);
    }
}