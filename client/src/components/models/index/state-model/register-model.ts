import IModel from "../../../interfaces/i-model";

export default class RegisterModel implements IModel {
    private _stateWindow = false;
    private _stateButton = true;

    isChangeState():boolean {
        this._stateWindow = !this._stateWindow;
        return this._stateWindow;
    }
    isChangeStateButton():boolean {
        this._stateButton = !this._stateButton;
        return this._stateButton;
    }
}