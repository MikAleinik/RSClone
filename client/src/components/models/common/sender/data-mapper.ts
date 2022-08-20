import answer from "../../../../types/answer";
import news from "../../../../types/news";
import user from "../../../../types/user";
import { AppEvents } from "../../../controller/app-events";
import CreateUserHandler from "./handler/create/create-user";
import ReadNewsHandler from "./handler/read/read-news";
import LogInUserHandler from "./handler/update/login";
import { HttpCodes } from "./http-codes";

export default class DataMapper {
    //TODO Внести в локализацию все ответы сервера

    constructor() {

    }
    create<T>(nameEvent: AppEvents, params: Map<string, string> = new Map()): Promise<Map<string, string> | Array<T>> {
        return new Promise((resolve, reject) => {
            switch (nameEvent) {
                case AppEvents.REGISTER_USER: {
                    params.set('role_id', '1');
                    const handler = new CreateUserHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer).statusCode) {
                                case HttpCodes.CODE_CREATED: {
                                    delete ((data as unknown) as answer).statusCode;
                                    //TODO уточнить после реги юзер становится залогинившимся или нет 
                                    resolve(params);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_FORBIDDEN: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка создания');
                                    reject(result);
                                    break;
                                }
                            }
                        })
                        .catch((data) => {
                            reject();
                        });
                    break;
                }
                default: {
                    const result = new Map<string, string>();
                    result.set('message', 'TODO Не известная ошибка');
                    reject(result);
                    break;
                }
            }
        });
    }
    read<T>(nameEvent: AppEvents, params: Map<string, string> = new Map()): Promise<Map<string, string> | Array<T>> {
        return new Promise((resolve, reject) => {
            switch (nameEvent) {
                case AppEvents.NEWS_GET_DATA: {
                    const handler = new ReadNewsHandler(params);
                    handler.send()
                        .then((data) => {
                            resolve((data as unknown) as Array<T>);
                        })
                        .catch((data) => {
                            reject(new Map<string, string>());
                        });
                    break;
                }
                default: {
                    const result = new Map<string, string>();
                    result.set('message', 'TODO Не известная ошибка');
                    reject(result);
                    break;
                }
            }
        });
    }
    update<T>(nameEvent: AppEvents, params: Map<string, string> = new Map()): Promise<Map<string, string> | Array<T>> {
        return new Promise((resolve, reject) => {
            switch (nameEvent) {
                case AppEvents.AUTH_LOGIN_USER: {
                    const handler = new LogInUserHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    delete ((data as unknown) as answer).statusCode;
                                    const result = new Map<string, string>();
                                    for (const [key, value] of Object.entries(((data as unknown) as user))) {
                                        result.set(key, value.toString());
                                    }
                                    resolve(result);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_FORBIDDEN: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка авторизации');
                                    reject(result);
                                    break;
                                }
                            }
                        })
                        .catch((data) => {
                            const result = new Map<string, string>();
                            result.set('message', data.message);
                            reject(result);
                        });
                    break;
                }
                case AppEvents.AUTH_CLICK_LOGOUT_BUTTON: {
                    throw new Error('not implemented');
                }
                default: {
                    const result = new Map<string, string>();
                    result.set('message', '');
                    reject(result);
                    break;
                }
            }
        });
    }
    delete<T>(nameEvent: AppEvents, params: Map<string, string> = new Map()): Promise<Map<string, string> | Array<T>> {
        return new Promise((resolve, reject) => {
            switch (nameEvent) {
                default: {
                    const result = new Map<string, string>();
                    result.set('result', 'false');
                    result.set('message', '');
                    reject(result);
                    break;
                }
            }
        });
    }
}
