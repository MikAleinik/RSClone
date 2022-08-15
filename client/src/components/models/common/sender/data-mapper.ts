import answer from "../../../../types/answer";
import user from "../../../../types/user";
import { AppEvents } from "../../../controller/app-events";

export default class DataMapper {
    //TODO хранящиеся данные пользователй заглушка
    private _users = new Array<user>;

    constructor() {

    }
    send(nameEvent: AppEvents, params: Map<string, string> = new Map()): Promise<Map<string, string>> {
        //TODO заглушка
        //TODO обработка по названиям приходящих событий
        return new Promise((resolve, reject) => {
            switch (nameEvent) {
                case AppEvents.REGISTER_USER: {
                    this.addUser_TEMP(params)
                        .then((data) => {
                            params.set('result', 'true');
                            resolve(params);
                        })
                        .catch((data) => {
                            const result = new Map<string, string>();
                            result.set('result', 'false');
                            result.set('message', data.message);
                            reject(result);
                        });
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }

    private addUser_TEMP(params: Map<string, string>): Promise<answer> {
        return new Promise((resolve, reject) => {
            if (!params.has('login') || !params.has('password') || !params.has('email')) {
                reject({
                    code: 400,
                    status: 'Bad Request',
                    message: 'Введены не все необходимые данные регистрации.'
                });
            }
            const newUser: user = {
                name: params.get('login')!,
                email: params.get('email')!,
                password: params.get('password')!,
            }
            let checkUser = true;
            this._users.forEach((user) => {
                if (user.name === newUser.name || user.email === newUser.email) {
                    checkUser = false;
                    reject({
                        code: 403,
                        status: 'Forbidden',
                        message: 'Пользователь с таким именем или почтой существует.'
                    });
                }
            });
            if (checkUser) {
                this._users.push(newUser);
                resolve({
                    code: 200,
                    status: 'ОК',
                    message: ''
                });
            }
        });
    }
}
