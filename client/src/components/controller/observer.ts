import IController from "../interfaces/i-controller";
import IView from "../interfaces/i-view";
import { AppEvents } from "./app-events";
/**
 * Класс регистрирующий 
 */
export default class Observer {
    private _sender;
    private _listeners = new Array<IController>();
    constructor(sender: IView | null) {
        this._sender = sender;
    }
    set(listener: IController) {
        this._listeners.push(listener);
        return this;
    }
    notify(nameEvent: AppEvents) {
        this._listeners.forEach((controller) => {
            controller.sendEvent(nameEvent);
        })
    }
}