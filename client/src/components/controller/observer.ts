import IController from "../interfaces/IController";
/**
 * Класс регистрирующий 
 */
export default class Observer {
    private _sender;
    private _listeners = new Array<IController>();
    constructor(sender: Element) {
        this._sender = sender;
    }
    set(listener: IController) {
        this._listeners.push(listener);
    }
    notify() {
        this._listeners.forEach((currentValue, index, array) => {
            //TODO определить/назначить тип данных args
            // this._listeners[index](this._sender, args);
        })
    }
}