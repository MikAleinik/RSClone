import user from "../../../../types/user";
import { AppEvents } from "../../../controller/app-events";
import DataMapper from "../../common/sender/data-mapper";

export default class UserModel {
    private _dataMapper = new DataMapper();
    private _currentUser: user = {
        name: '',
        email: '',
        password: ''
    };
    constructor() {

    }
    registerUser(nameEvents: AppEvents, param: Map<string, string>): Promise<Map<string, string>> {
        return new Promise((resolve, reject) => {
            this._dataMapper.send(nameEvents, param)
                .then((result) => {
                    this._currentUser.name = param.get('login')!;
                    this._currentUser.email = param.get('email')!;
                    this._currentUser.password = param.get('password')!;
                    resolve(result as Map<string, string>);
                })
                .catch((result) => {
                    reject(result);
                });
        });
    }
    isLogIn(nameEvents: AppEvents, param: Map<string, string>): Promise<Map<string, string>> {
        return new Promise((resolve, reject) => {
            this._dataMapper.send(nameEvents, param)
                .then((result) => {
                    this._currentUser.name = param.get('login')!;
                    this._currentUser.email = param.get('email')!;
                    this._currentUser.password = param.get('password')!;
                    resolve(result as Map<string, string>);
                })
                .catch((result) => {
                    reject(result);
                });
        });
    }
    isLogOut(nameEvent: AppEvents): Promise<Map<string, string>> {
        return new Promise((resolve, reject) => {
            this._dataMapper.send(nameEvent)
                .then((result) => {
                    this._currentUser.name = '';
                    this._currentUser.email = '';
                    this._currentUser.password = '';
                    resolve(result as Map<string, string>);
                })
                .catch((result) => {
                    reject(result);
                });
        });
    }
    getAuthUser(): string {
        return this._currentUser.name;
    }
}