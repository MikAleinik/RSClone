import Observer from "../../controller/observer";

export default abstract class View {
    readonly _observer: Observer;
    constructor(observer: Observer) {
        this._observer = observer;
    };
    abstract getCurrentElement(): HTMLElement;
}
