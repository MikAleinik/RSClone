import INotify from "../../interfaces/i-notify";
import UserModel from "../../models/index/data-model/user-model";
import RegisterModel from "../../models/index/state-model/register-model";
import AuthView from "../../view/index/auth/auth-view";
import RegisterWindowView from "../../view/index/content/register-window/register-window-view";
import View from "../../view/index/view";
import { AppEvents } from "../app-events";

export default class RegisterController implements INotify {
    private _registerModel: RegisterModel;
    private _userModel: UserModel;

    constructor(userModel: UserModel, registerModel: RegisterModel) {
        this._registerModel = registerModel;
        this._userModel = userModel;
    }
    notify(nameEvent: AppEvents, sender: View): AppEvents | void {
        switch (nameEvent) {
            case AppEvents.REGISTER_CLICK_BUTTON: {
                this.clickButtonHandler(sender);
                return AppEvents.REGISTER_CHANGE_STATE_WINDOW;
                break;
            }
            case AppEvents.REGISTER_CHANGE_STATE_WINDOW: {
                if (sender instanceof RegisterWindowView) {
                    this.changeStateWindowHandler(sender);
                }
                if (sender instanceof AuthView) {
                    this.clickButtonHandler(sender);
                    // return AppEvents.REGISTER_CHANGE_STATE_WINDOW;
                }
                break;
            }
            default: {

            }
        }
    }
    private clickButtonHandler(sender: View): void {
        let result = this._registerModel.isChangeStateButton();
        let verifySender = (sender as unknown) as AuthView;
        verifySender.setRegisterButtonState(result);
        
    }
    private changeStateWindowHandler(sender: View): void {
        let stateWindow = this._registerModel.isChangeStateWindow();;
        let verifySender = (sender as unknown) as RegisterWindowView;
        verifySender.setWindowVisibilityState(stateWindow);
    }
}
