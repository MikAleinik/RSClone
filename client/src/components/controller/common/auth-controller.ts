import UserModel from "../../models/index/data-model/user-model";
import AuthModel from "../../models/index/state-model/auth-model";
import { AppEvents } from "../app-events";
import INotify from "../../interfaces/i-notify";
import AuthView from "../../view/common/auth/auth-view";
import AuthWindowView from "../../view/common/auth-window/auth-window-view";
import View from "../../view/index/view";
import user from "../../../types/user";
import User from "../../../types/user";
import OverviewView from "../../view/main/content/overview/overview-view";
import CompanyView from "../../view/main/content/company/company-view";

export default class AuthController implements INotify {
    private readonly LINK_INDEX_PAGE = '/';
    private readonly LINK_MAIN_PAGE = '/main.html';
    private readonly LINK_ABOUT_PAGE = '/about.html';

    private _userModel: UserModel;
    private _authModel: AuthModel;

    constructor(userModel: UserModel, authModel: AuthModel) {
        this._authModel = authModel;
        this._userModel = userModel;
    }
    notify(nameEvent: AppEvents, sender: View, params?: Map<string, string> | user): AppEvents | void {
        switch (nameEvent) {
            case AppEvents.AUTH_CLICK_BUTTON: {
                this.clickButtonHandler(sender);
                return AppEvents.AUTH_SHOW_WINDOW;
            }
            case AppEvents.AUTH_CLICK_LOGOUT_BUTTON: {
                this.clickLogOutButtonHandler(nameEvent, sender);
            }
            case AppEvents.AUTH_ENABLE_BUTTON: {
                this.enableButtonHandler(sender);
                break;
            }
            case AppEvents.AUTH_DISABLE_BUTTON: {
                this.disableButtonHandler(sender);
                break;
            }
            case AppEvents.AUTH_HIDE_BUTTON: {
                this.hideButtonHandler(sender);
                break;
            }
            case AppEvents.AUTH_SHOW_BUTTON: {
                this.showButtonHandler(sender);
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
            case AppEvents.AUTH_LOGIN_USER: {
                if (params !== undefined) {
                    this.logInUserHandler(nameEvent, sender, params as Map<string, string>);
                } else {
                    //TODO возврат ошибки если не передались параметры? избыточная проверка после view?
                }
                break;
            }
            case AppEvents.AUTH_LOGOUT_USER: {
                if (document.location.pathname === this.LINK_MAIN_PAGE) {
                    document.location.href = this.LINK_INDEX_PAGE;
                }
                break;
            }
            case AppEvents.MAIN_USER_SAVE_INFO: {
                this.saveUserInfoHandler(nameEvent, sender, params as User);
                break;
            }
            case AppEvents.USER_GET_ALL: {
                this.getAllUser(nameEvent, sender);
                break;
            }
            default: {

            }
        }
    }
    private getAllUser(nameEvent: AppEvents, sender: View) {
        this._userModel.getUserAll(nameEvent)
            .then((result) => {
                let verifySender = sender as CompanyView;
                verifySender.setAllUser(result);
            })
            .catch(() => {
                let verifySender = sender as CompanyView;
                verifySender.setAllUser(false);
            });
    }
    private saveUserInfoHandler(nameEvent: AppEvents, sender: View, user: User): void {
        this._userModel.save(nameEvent, user)
            .then(() => {
                let verifySender = (sender as unknown) as OverviewView;
                verifySender.setAuthorizedUser(user);
            })
            .catch(() => {
                let verifySender = sender as OverviewView;
                verifySender.setAuthorizedUser(false);
            });
    }
    private logInUserHandler(nameEvent: AppEvents, sender: View, params: Map<string, string>): AppEvents | void {
        this._userModel.logIn(nameEvent, params)
            .then((result) => {
                let verifySender = (sender as unknown) as AuthWindowView;
                verifySender.successLogInHandler();
            })
            .catch((result) => {
                let verifySender = sender as AuthWindowView;
                verifySender.failLogInHandler(result as Map<string, string>);
            });
    }
    private getAuthUserHandler(sender: View): AppEvents | void {
        this._userModel.getAuthUser()
            .then((data) => {
                let verifySender = sender as AuthView;
                verifySender.setAuthorizedUser(data);
            })
            .catch((data) => {
                //TODO включить после переноса БД
                if (document.location.pathname === this.LINK_MAIN_PAGE) {
                    document.location.href = this.LINK_INDEX_PAGE;
                }
                let verifySender = sender as AuthView;
                verifySender.setAuthorizedUser(false);
            });
    }
    private clickButtonHandler(sender: View): AppEvents | void {
        let stateButton = this._authModel.isChangeStateButton();
        let verifySender = sender as AuthView;
        verifySender.setAuthButtonState(stateButton);
    }
    private clickLogOutButtonHandler(nameEvent: AppEvents, sender: View): void {
        this._userModel.logOut(nameEvent)
            .then((result) => {
                let verifySender = sender as AuthView;
                verifySender.successLogOutHandler();
            })
            .catch((result) => {
                let verifySender = sender as AuthView;
                verifySender.failLogOutHandler(result);
            });
    }
    private enableButtonHandler(sender: View): AppEvents | void {
        if (!this._authModel.getStateButton()) {
            this._authModel.isChangeStateButton();
        }
        let stateButton = this._authModel.getStateButton();
        let verifySender = sender as AuthView;
        verifySender.setAuthButtonState(stateButton);
    }
    private disableButtonHandler(sender: View): AppEvents | void {
        if (this._authModel.getStateButton()) {
            this._authModel.isChangeStateButton();
        }
        let stateButton = this._authModel.getStateButton();
        let verifySender = sender as AuthView;
        verifySender.setAuthButtonState(stateButton);
    }
    private showButtonHandler(sender: View): AppEvents | void {
        if (!this._authModel.getVisibilityButton()) {
            this._authModel.isChangeVisibilityButton();
        }
        let visibiltyButton = this._authModel.getVisibilityButton();
        let verifySender = sender as AuthView;
        verifySender.setAuthButtonVisibility(visibiltyButton);
    }
    private hideButtonHandler(sender: View): AppEvents | void {
        if (this._authModel.getVisibilityButton()) {
            this._authModel.isChangeVisibilityButton();
        }
        let stateButton = this._authModel.getVisibilityButton();
        let verifySender = sender as AuthView;
        verifySender.setAuthButtonVisibility(stateButton);
    }
    private showWindowHandler(sender: View): void {
        if (!this._authModel.getStateWindow()) {
            this._authModel.isChangeStateWindow();
        }
        let stateWindow = this._authModel.getStateWindow();;
        let verifySender = sender as AuthWindowView;
        verifySender.setWindowVisibilityState(stateWindow);
    }
    private hideWindowHandler(sender: View): void {
        if (this._authModel.getStateWindow()) {
            this._authModel.isChangeStateWindow();
        }
        let stateWindow = this._authModel.getStateWindow();;
        let verifySender = sender as AuthWindowView;
        verifySender.setWindowVisibilityState(stateWindow);
    }
}
