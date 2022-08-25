import INotify from "../../interfaces/i-notify";
import UserModel from "../../models/index/data-model/user-model";
import RegisterModel from "../../models/index/state-model/register-model";
import AuthView from "../../view/common/auth/auth-view";
import RegisterWindowView from "../../view/common/register-window/register-window-view";
import View from "../../view/index/view";
import { AppEvents } from "../app-events";

export default class RegisterController implements INotify {
    private _registerModel: RegisterModel;
    private _userModel: UserModel;

    constructor(userModel: UserModel, registerModel: RegisterModel) {
        this._registerModel = registerModel;
        this._userModel = userModel;
    }
    notify(nameEvent: AppEvents, sender: View, params?: Map<string, string>): AppEvents | void {
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
            case AppEvents.REGISTER_HIDE_BUTTON: {
                this.hideButtonHandler(sender);
                break;
            }
            case AppEvents.REGISTER_SHOW_BUTTON: {
                this.showButtonHandler(sender);
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
            case AppEvents.REGISTER_USER: {
                if (params !== undefined) {
                    this.registerNewUser(nameEvent, sender, params);
                } else {
                    //TODO возврат ошибки если не передались параметры? избыточная проверка после view?
                }
                break;
            }
            case AppEvents.REGISTER_USER: {
                if (this._registerModel.getStateButton()){
                    this._registerModel.isChangeStateButton();
                }
                if (this._registerModel.getStateWindow()){
                    this._registerModel.isChangeStateWindow();
                }
            }
            default: {

            }
        }
    }
    private registerNewUser(nameEvent: AppEvents, sender: View, params: Map<string, string>): void {
        this._userModel.registerUser(nameEvent, params)
            .then((result) => {
                let verifySender = sender as RegisterWindowView;
                verifySender.successRegistrationHandler();
            })
            .catch((result) => {
                let verifySender = sender as RegisterWindowView;
                verifySender.failRegistrationHandler(result as Map<string, string>);
            });
    }
    private clickButtonHandler(sender: View): void {
        let result = this._registerModel.isChangeStateButton();
        let verifySender = sender as AuthView;
        verifySender.setRegisterButtonState(result);
    }
    private enableButtonHandler(sender: View): AppEvents | void {
        if (!this._registerModel.getStateButton()) {
            this._registerModel.isChangeStateButton();
        }
        let stateButton = this._registerModel.getStateButton();
        let verifySender = sender as AuthView;
        verifySender.setRegisterButtonState(stateButton);
    }
    private disableButtonHandler(sender: View): AppEvents | void {
        if (this._registerModel.getStateButton()) {
            this._registerModel.isChangeStateButton();
        }
        let stateButton = this._registerModel.getStateButton();
        let verifySender = sender as AuthView;
        verifySender.setRegisterButtonState(stateButton);
    }
    private showButtonHandler(sender: View): AppEvents | void {
        if (!this._registerModel.getVisibilityButton()) {
            this._registerModel.isChangeVisibilityButton();
        }
        let visibiltyButton = this._registerModel.getVisibilityButton();
        let verifySender = sender as AuthView;
        verifySender.setRegisterButtonVisibility(visibiltyButton);
    }
    private hideButtonHandler(sender: View): AppEvents | void {
        if (this._registerModel.getVisibilityButton()) {
            this._registerModel.isChangeVisibilityButton();
        }
        let stateButton = this._registerModel.getVisibilityButton();
        let verifySender = sender as AuthView;
        verifySender.setRegisterButtonVisibility(stateButton);
    }
    private showWindowHandler(sender: View): void {
        if (!this._registerModel.getStateWindow()) {
            this._registerModel.isChangeStateWindow();
        }
        let stateWindow = this._registerModel.getStateWindow();;
        let verifySender = sender as RegisterWindowView;
        verifySender.setWindowVisibilityState(stateWindow);
    }
    private hideWindowHandler(sender: View): void {
        if (this._registerModel.getStateWindow()) {
            this._registerModel.isChangeStateWindow();
        }
        let stateWindow = this._registerModel.getStateWindow();;
        let verifySender = sender as RegisterWindowView;
        verifySender.setWindowVisibilityState(stateWindow);
    }
}
