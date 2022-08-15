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
                    // console.log(this._currentUser);
                    resolve(result);
                })
                .catch((result) => {
                    reject(result);
                });
        });
    }
    isLogIn(name: string, pass: string): boolean {
        //TODO заглушка
        return true;
    }
    isLogOut(): boolean {
        //TODO заглушка
        return true;
    }
    getAuthUser(): string {
        return this._currentUser.name;
    }
}