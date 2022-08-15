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
                return AppEvents.REGISTER_SHOW_WINDOW;
            }
            case AppEvents.REGISTER_ENABLE_BUTTON: {
                this.enableButtonHandler(sender);
                break;
            }
            case AppEvents.REGISTER_DISABLE_BUTTON: {
                this.disableButtonHandler(sender);
                break;
            }
            case AppEvents.REGISTER_SHOW_WINDOW: {
                this.showWindowHandler(sender);
                break;
            }
            case AppEvents.REGISTER_HIDE_WINDOW: {
                this.hideWindowHandler(sender);
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
    private enableButtonHandler(sender: View): AppEvents | void {
        if (!this._registerModel.getStateButton()) {
            this._registerModel.isChangeStateButton();
        }
        let stateButton = this._registerModel.getStateButton();
        let verifySender = (sender as unknown) as AuthView;
        verifySender.setRegisterButtonState(stateButton);
    }
    private disableButtonHandler(sender: View): AppEvents | void {
        if (this._registerModel.getStateButton()) {
            this._registerModel.isChangeStateButton();
        }
        let stateButton = this._registerModel.getStateButton();
        let verifySender = (sender as unknown) as AuthView;
        verifySender.setRegisterButtonState(stateButton);
    }
    private showWindowHandler(sender: View): void {
        if (!this._registerModel.getStateWindow()) {
            this._registerModel.isChangeStateWindow();
        }
        let stateWindow = this._registerModel.getStateWindow();;
        let verifySender = (sender as unknown) as RegisterWindowView;
        verifySender.setWindowVisibilityState(stateWindow);
    }
    private hideWindowHandler(sender: View): void {
        if (this._registerModel.getStateWindow()) {
            this._registerModel.isChangeStateWindow();
        }
        let stateWindow = this._registerModel.getStateWindow();;
        let verifySender = (sender as unknown) as RegisterWindowView;
        verifySender.setWindowVisibilityState(stateWindow);
    }
}
