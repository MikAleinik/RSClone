import answer from "../../../../types/answer";
import news from "../../../../types/news";
import user from "../../../../types/user";
import { AppEvents } from "../../../controller/app-events";

export default class DataMapper {
    private readonly NEWS_URL = 'https://saurav.tech/NewsAPI/top-headlines/category/business/ru.json';

    private _users = new Array<user>;//TODO хранящиеся данные пользователй заглушка
    private _currentUser: user = {//TODO хранящийся текущий авториз пользователь заглушка
        name: '',
        email: '',
        password: '',
        role: ''
    };
    constructor() {
        this._users.push({//TODO для проверки хранения пользователй заглушка
            name: 'admin',
            email: 'admin@admin.ru',
            password: 'adm',
            role: 'customer'//carrier
        });
    }
    send<T>(nameEvent: AppEvents, params: Map<string, string> = new Map()): Promise<Map<string, string> | Array<T>> {
        //TODO заглушка
        //TODO обработка по названиям приходящих событий
        //TODO названия событий жестко ассоциировать с контроллерами сервера
        return new Promise((resolve, reject) => {
            switch (nameEvent) {
                case AppEvents.NEWS_GET_DATA: {
                    this.getNews()
                        .then((data) => {
                            resolve((data as unknown) as Array<T>);
                        })
                        .catch((data) => {
                            reject(new Map<string, string>());
                        });
                        break;
                }
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
    private getNews (): Promise<Array<news>> {
        return new Promise((resolve, reject) => {
            fetch(this.NEWS_URL, { method: 'GET' })
                .then((response) => response.json())
                .then((data) => {
                    const answer = (data.articles as unknown) as Array<news>;
                    const result = new Array<news>;
                    for(let i = 0; i < answer.length; i += 1) {
                        result.push({
                            title: answer[i].title,
                            author: answer[i].author,
                            urlToImage: answer[i].urlToImage,
                            description: answer[i].description,
                            url: answer[i].url,
                        });
                    }
                    resolve(result);
                })
                .catch((data) => {
                    reject();
                });
        });
    }
    //TODO заглушка
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
    //TODO заглушка
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
    //TODO заглушка
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
                    role: params.get('role')!
                });
                this._currentUser = {
                    name: params.get('login')!,
                    email: params.get('email')!,
                    password: params.get('password')!,
                    role: params.get('role')!
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
