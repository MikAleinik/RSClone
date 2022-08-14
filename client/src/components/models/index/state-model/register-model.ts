export default class RegisterModel {
    private _stateWindow = false;
    private _stateButton = true;

    isChangeStateWindow():boolean {
        this._stateWindow = !this._stateWindow;
        return this._stateWindow;
    }
    isChangeStateButton():boolean {
        this._stateButton = !this._stateButton;
        return this._stateButton;
    }
}