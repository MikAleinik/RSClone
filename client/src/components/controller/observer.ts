import INotify from "../interfaces/i-notify";
import View from "../view/index/view";
import { AppEvents } from "./app-events";
/**
 * Класс регистрирующий контроллеры для определенного события
 */
export default class Observer {
    private _listeners = new Map<AppEvents, Array<INotify>>();
    private _senders = new Map<AppEvents, Array<INotify>>();

    addListener(nameEvent: AppEvents, listener: INotify) {
        if (this._listeners.has(nameEvent)) {
            this._listeners.get(nameEvent)?.push(listener);
        } else {
            this._listeners.set(nameEvent, new Array(listener));
        }
        return this;
    }
    addSender(nameEvent: AppEvents, sender: INotify) {
        if (this._senders.has(nameEvent)) {
            this._senders.get(nameEvent)?.push(sender);
        } else {
            this._senders.set(nameEvent, new Array(sender));
        }
    }
    notify(nameEvent: AppEvents, sender: View) {
        let currentListController = this._listeners.get(nameEvent);
        if (currentListController !== undefined) {
            currentListController.forEach((controller) => {
                let result = controller.notify(nameEvent, sender);
                if (result !== undefined) {
                    this.runAdditionalNotify(result);
                }
            })
        }
    }
    private runAdditionalNotify(nameEvent: AppEvents){
        let currentListSender = this._senders.get(nameEvent);
        if (currentListSender !== undefined) {
            currentListSender.forEach((sender) => {
                sender.notify(nameEvent, sender);
            })
        }
    }
}