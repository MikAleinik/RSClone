import IView from "../../../interfaces/IView";
import './auth.scss';

export default class AuthView implements IView {
    private readonly TAG_CONTAINER = 'section';
    private readonly TAG_BUTTON = 'button';
    private readonly CLASS_CONTAINER = 'auth';
    private readonly CLASS_BUTTON = 'big__button';
    private readonly CLASS_BUTTON_LOGIN = 'auth__login';
    private readonly CLASS_BUTTON_REGISTRATION = 'auth__registration';

    private readonly TEXT_BUTTON_LOGIN = 'Login';//TODO (local) выносится в локализацию
    private readonly TEXT_BUTTON_REGISTRATION = 'Registration';//TODO (local) выносится в локализацию

    private _authElement = document.createElement(this.TAG_CONTAINER);

    constructor() {
        this.createAuthElement();
    }
    getCurrentElement(): HTMLElement {
        return this._authElement;
    }
    private createAuthElement(): void {
        this._authElement.classList.add(this.CLASS_CONTAINER);
        this._authElement.insertAdjacentElement('beforeend', this.createButtonElement(this.CLASS_BUTTON_LOGIN, this.TEXT_BUTTON_LOGIN));
        this._authElement.insertAdjacentElement('beforeend', this.createButtonElement(this.CLASS_BUTTON_REGISTRATION, this.TEXT_BUTTON_REGISTRATION));
    }
    private createButtonElement(className: string = '', text: string): HTMLElement {
        let linkElement = document.createElement(this.TAG_BUTTON);
        linkElement.classList.add(this.CLASS_BUTTON);
        linkElement.classList.add(className);
        linkElement.textContent = text;
        return linkElement;
    }
}