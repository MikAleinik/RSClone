import answer from "../../../../types/answer";
import news from "../../../../types/news";
import user from "../../../../types/user";
import { AppEvents } from "../../../controller/app-events";
import CreateCargoHandler from "./handler/create/create-cargo";
import CreateUserHandler from "./handler/create/create-user";
import DeleteCargoHandler from "./handler/delete/delete-cargo";
import GetAllCargoHandler from "./handler/read/get-all-cargo";
import GetCargoHandler from "./handler/read/get-cargo";
import GetUserHandler from "./handler/read/get-user";
import ReadNewsHandler from "./handler/read/read-news";
import ChangeCargoHandler from "./handler/update/change-cargo";
import LogInUserHandler from "./handler/update/login";
import LogOutUserHandler from "./handler/update/logout";
import { HttpCodes } from "./http-codes";

export default class DataMapper {
    constructor() {

    }
    create<T>(nameEvent: AppEvents, params: Map<string, string> = new Map()): Promise<Map<string, string> | Array<T>> {
        return new Promise((resolve, reject) => {
            switch (nameEvent) {
                case AppEvents.MAIN_CARGO_CREATE: {
                    const handler = new CreateCargoHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer).statusCode) {
                                case HttpCodes.CODE_CREATED: {
                                    delete ((data as unknown) as answer).statusCode;
                                    resolve(params);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_UNAUTHORIZED:
                                case HttpCodes.CODE_NOT_ALLOWED: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка создания груза');
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
                case AppEvents.REGISTER_USER: {
                    const handler = new CreateUserHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer).statusCode) {
                                case HttpCodes.CODE_CREATED: {
                                    delete ((data as unknown) as answer).statusCode;
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
                case AppEvents.MAIN_CARGO_GET_ALL: {
                    console.log('1');
                    const handler = new GetAllCargoHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    delete ((data as unknown) as answer).statusCode;
                                    resolve(params);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_NOT_FOUND: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка получения всех грузов');
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
                case AppEvents.MAIN_CARGO_GET_BY_ID: {
                    const handler = new GetCargoHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    delete ((data as unknown) as answer).statusCode;
                                    resolve(params);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_NOT_FOUND: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка получения груза по ID');
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
                case AppEvents.AUTH_GET_AUTH_USER: {
                    const handler = new GetUserHandler(params);
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
                                case HttpCodes.CODE_UNAUTHORIZED:
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
                case AppEvents.MAIN_CARGO_CHANGE: {
                    const handler = new ChangeCargoHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    delete ((data as unknown) as answer).statusCode;
                                    resolve(params);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_NOT_FOUND: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка редактирования груза');
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
                    const handler = new LogOutUserHandler();
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
                                case HttpCodes.CODE_UNAUTHORIZED: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка выхода пользователя');
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
                case AppEvents.MAIN_CARGO_DELETE: {
                    const handler = new DeleteCargoHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    delete ((data as unknown) as answer).statusCode;
                                    resolve(params);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка удаления груза');
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
                    result.set('result', 'false');
                    result.set('message', '');
                    reject(result);
                    break;
                }
            }
        });
    }
}
