export default class AuthModel {
    private _stateWindow = false;
    private _stateButton = false;
    
    isChangeStateWindow():boolean {
        this._stateWindow = !this._stateWindow;
        return this._stateWindow;
    }
    isChangeStateButton():boolean {
        this._stateButton = !this._stateButton;
        return this._stateButton;
    }
    getStateWindow():boolean {
        return this._stateWindow;
    }
    getStateButton():boolean {
        return this._stateButton;
    }
}