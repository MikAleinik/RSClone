export default class AuthModel {
    private _stateWindow = false;
    private _stateButton = false;
    private _visibilityButton = true;//состояние видимости кнопки
    
    isChangeStateWindow():boolean {
        this._stateWindow = !this._stateWindow;
        return this._stateWindow;
    }
    isChangeStateButton():boolean {
        this._stateButton = !this._stateButton;
        return this._stateButton;
    }
    isChangeVisibilityButton():boolean {
        this._visibilityButton = !this._visibilityButton;
        return this._visibilityButton;
    }
    getStateWindow():boolean {
        return this._stateWindow;
    }
    getStateButton():boolean {
        return this._stateButton;
    }
    getVisibilityButton():boolean {
        return this._visibilityButton;
    }
}