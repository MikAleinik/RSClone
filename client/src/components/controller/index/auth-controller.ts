import UserModel from "../../models/index/data-model/user-model";
import AuthModel from "../../models/index/state-model/auth-model";
import { AppEvents } from "../app-events";
import INotify from "../../interfaces/i-notify";
import AuthView from "../../view/index/auth/auth-view";
import AuthWindowView from "../../view/index/auth-window/auth-window-view";
import View from "../../view/index/view";

export default class AuthController implements INotify {
    private _userModel: UserModel;
    private _authModel: AuthModel;

    constructor(userModel: UserModel, authModel: AuthModel) {
        this._authModel = authModel;
        this._userModel = userModel;
    }
    notify(nameEvent: AppEvents, sender: View): AppEvents | void {
        switch (nameEvent) {
            case AppEvents.AUTH_CLICK_BUTTON: {
                this.clickButtonHandler(sender);
                return AppEvents.AUTH_SHOW_WINDOW;
            }
            case AppEvents.AUTH_ENABLE_BUTTON: {
                this.enableButtonHandler(sender);
                break;
            }
            case AppEvents.AUTH_DISABLE_BUTTON: {
                this.disableButtonHandler(sender);
                break;
            }
            case AppEvents.AUTH_SHOW_WINDOW: {
                this.showWindowHandler(sender);
                break;
            }
            case AppEvents.AUTH_HIDE_WINDOW: {
                this.hideWindowHandler(sender);
                break;
            }
            case AppEvents.AUTH_GET_AUTH_USER: {
                this.getAuthUserHandler(sender);
                break;
            }
            default: {

            }
        }
    }
    private getAuthUserHandler(sender: View): AppEvents | void {
        let nameUser = this._userModel.getAuthUser();
        let verifySender = (sender as unknown) as AuthView;
        verifySender.showUserName(nameUser);
    }
    private clickButtonHandler(sender: View): AppEvents | void {
        let stateButton = this._authModel.isChangeStateButton();
        let verifySender = (sender as unknown) as AuthView;
        verifySender.setAuthButtonState(stateButton);
    }
    private enableButtonHandler(sender: View): AppEvents | void {
        if (!this._authModel.getStateButton()) {
            this._authModel.isChangeStateButton();
        }
        let stateButton = this._authModel.getStateButton();
        let verifySender = (sender as unknown) as AuthView;
        verifySender.setAuthButtonState(stateButton);
    }
    private disableButtonHandler(sender: View): AppEvents | void {
        if (this._authModel.getStateButton()) {
            this._authModel.isChangeStateButton();
        }
        let stateButton = this._authModel.getStateButton();
        let verifySender = (sender as unknown) as AuthView;
        verifySender.setAuthButtonState(stateButton);
    }
    private showWindowHandler(sender: View): void {
        if (!this._authModel.getStateWindow()) {
            this._authModel.isChangeStateWindow();
        }
        let stateWindow = this._authModel.getStateWindow();;
        let verifySender = (sender as unknown) as AuthWindowView;
        verifySender.setWindowVisibilityState(stateWindow);
    }
    private hideWindowHandler(sender: View): void {
        if (this._authModel.getStateWindow()) {
            this._authModel.isChangeStateWindow();
        }
        let stateWindow = this._authModel.getStateWindow();;
        let verifySender = (sender as unknown) as AuthWindowView;
        verifySender.setWindowVisibilityState(stateWindow);
    }
}
