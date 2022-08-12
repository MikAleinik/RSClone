import UserModel from "../../models/index/data-model/user-model";
import AuthModel from "../../models/index/state-model/auth-model";
import { AppEvents } from "../app-events";
import IController from "../../interfaces/i-controller";
import INotify from "../../interfaces/i-notify";

export default class AuthController implements IController {
    private _sender: INotify;
    private _userModel = new UserModel();
    private _authModel = new AuthModel();

    constructor(sender: INotify) {
        this._sender = sender;
    }
    sendEvent(nameEvent: AppEvents): void {
        switch (nameEvent) {
            case AppEvents.STATE_CHANGE_VISIBILITY_AUTH: {
                this.changeStateWindowHandler();
            }
            default: {

            }
        }
    }
    private changeStateWindowHandler():void {
        let result = this._authModel.isChangeStateWindow();
        this._sender.notify({
            target: null,
            state: result,
        });
    }
}
