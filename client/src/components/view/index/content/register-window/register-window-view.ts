import detail from "../../../../../types/detail";
import { AppEvents } from "../../../../controller/app-events";
import IModel from "../../../../interfaces/i-model";
import IView from "../../../../interfaces/i-view";
import { AppModels } from "../../../../models/index/AppModels";
import View from "../../view";
import './register-window.scss';

export default class RegisterhWindowView extends View implements IView {
    private readonly TAG_CONTAINER = 'div';
    private readonly TAG_BUTTON = 'button';
    private readonly CLASS_CONTAINER = 'window-register';
    private readonly CLASS_BUTTON = 'window__button';

    private readonly TEXT_BUTTON = 'Register user';//TODO (local) выносится в локализацию

    private _windowElement = document.createElement(this.TAG_CONTAINER);

    constructor(models: Map<AppModels, IModel>) {
        super(models);
        this.createWindowElement();
        document.addEventListener(AppEvents.STATE_CHANGE_VISIBILITY_REGISTER, this.setWindowState.bind(this));
    }
    getCurrentElement(): HTMLElement {
        return this._windowElement;
    }
    notify(eventDetail: detail): void {
        //TODO реализация
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