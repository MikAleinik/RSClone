import { AppEvents } from "../controller/app-events";
import View from "../view/index/view";

export default interface INotify {
    notify(nameEvent: AppEvents, sender: View | INotify): void;
}
