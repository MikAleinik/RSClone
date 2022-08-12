import { AppEvents } from "../controller/app-events";

export default interface IController {
    sendEvent(nameEvent: AppEvents): void;
}