import { AppEvents } from "../controller/app-events";
import IView from "./i-view";

export default interface INotify {
    notify(nameEvent: AppEvents, sender: IView | INotify): AppEvents | void;
}
