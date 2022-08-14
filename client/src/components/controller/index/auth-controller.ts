import UserModel from "../../models/index/data-model/user-model";
import AuthModel from "../../models/index/state-model/auth-model";
import { AppEvents } from "../app-events";
import INotify from "../../interfaces/i-notify";
import AuthView from "../../view/index/auth/auth-view";
import AuthWindowView from "../../view/index/content/auth-window/auth-window-view";
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
                return AppEvents.AUTH_CHANGE_STATE_WINDOW;
                break;
            }
            case AppEvents.AUTH_CHANGE_STATE_WINDOW: {
                if (sender instanceof AuthWindowView) {
                    this.changeStateWindowHandler(sender);
                }
                if (sender instanceof AuthView) {
                    this.clickButtonHandler(sender);
                    // return AppEvents.AUTH_CHANGE_STATE_WINDOW;
                }
                break;
            }
            default: {

            }
        }
    }
    private clickButtonHandler(sender: View): AppEvents | void {
        let stateButton = this._authModel.isChangeStateButton();
        let verifySender = (sender as unknown) as AuthView;
        verifySender.setAuthButtonState(stateButton);
    }
    private changeStateWindowHandler(sender: View): void {
        let stateWindow = this._authModel.isChangeStateWindow();;
        let verifySender = (sender as unknown) as AuthWindowView;
        verifySender.setWindowVisibilityState(stateWindow);
    }
}
