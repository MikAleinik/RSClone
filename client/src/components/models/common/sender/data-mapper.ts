import answer from "../../../../types/answer";
import user from "../../../../types/user";
import { AppEvents } from "../../../controller/app-events";

export default class DataMapper {
    //TODO хранящиеся данные пользователй заглушка
    private _users = new Array<user>;
    private _currentUser: user = {
        name: '',
        email: '',
        password: ''
    };
    constructor() {
        this._users.push({
            name: 'admin',
            email: 'admin@admin.ru',
            password: 'adm',
        });
    }
    send(nameEvent: AppEvents, params: Map<string, string> = new Map()): Promise<Map<string, string>> {
        //TODO заглушка
        //TODO обработка по названиям приходящих событий
        //TODO названия событий жестко ассоциировать с контроллерами сервера
        return new Promise((resolve, reject) => {
            switch (nameEvent) {
                case AppEvents.AUTH_LOGIN_USER: {
                    this.logInUser_TEMP(params)
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
                case AppEvents.AUTH_CLICK_LOGOUT_BUTTON: {
                    this.logOutUser_TEMP()
                        .then((data) => {
                            const result = new Map<string, string>();
                            result.set('result', 'true');
                            resolve(result);
                        })
                        .catch((data) => {
                            const result = new Map<string, string>();
                            result.set('result', 'false');
                            result.set('message', data.message);
                            reject(result);
                        });
                }
                default: {
                    break;
                }
            }
        });
    }
    private logInUser_TEMP(params: Map<string, string>): Promise<answer> {
        return new Promise((resolve, reject) => {
            if (params.get('login')! === '' || params.get('password')! === '') {
                reject({
                    code: 400,
                    status: 'Bad request',
                    message: 'Введены не все необходимые данные авторизации.'
                });
            }
            let result = false;
            this._users.forEach((user) => {
                if (user.name === params.get('login')! && user.password === params.get('password')!) {
                    result = true;
                    this._currentUser.name = user.name;
                    this._currentUser.email = this._currentUser.email;
                    resolve({
                        code: 200,
                        status: 'ОК',
                        message: ''
                    });
                }
            });
            if (!result) {
                reject({
                    code: 403,
                    status: 'Forbidden',
                    message: 'Не верное имя пользователя или пароль.'
                });
            }
        });
    }
    private logOutUser_TEMP(): Promise<answer> {
        return new Promise((resolve, reject) => {
            if (this._currentUser.name === '' && this._currentUser.email === '') {
                reject({
                    code: 404,
                    status: 'Not Found',
                    message: 'Пользователь не найден.'
                });
            } else {
                this._currentUser.name = '';
                this._currentUser.email = '';
                this._currentUser.password = '';
                resolve({
                    code: 200,
                    status: 'ОК',
                    message: ''
                });
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
            let checkUser = true;
            this._users.forEach((user) => {
                if (user.name === params.get('login')! || user.email === params.get('email')!) {
                    checkUser = false;
                    reject({
                        code: 403,
                        status: 'Forbidden',
                        message: 'Пользователь с таким именем или почтой существует.'
                    });
                }
            });
            if (checkUser) {
                this._users.push({
                    name: params.get('login')!,
                    email: params.get('email')!,
                    password: params.get('password')!,
                });
                this._currentUser = {
                    name: params.get('login')!,
                    email: params.get('email')!,
                    password: params.get('password')!,
                };
                resolve({
                    code: 200,
                    status: 'ОК',
                    message: ''
                });
            }
        });
    }
}
