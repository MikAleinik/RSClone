import event from "../../types/event";

export default interface INotify {
    notify(event: event): void;
}