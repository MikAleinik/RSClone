import answer from "../../../../types/answer";
import news from "../../../../types/news";
import user from "../../../../types/user";
import { AppEvents } from "../../../controller/app-events";
import CreateCarHandler from "./handler/create/create-car";
import CreateCargoHandler from "./handler/create/create-cargo";
import CreateUserHandler from "./handler/create/create-user";
import DeleteCarHandler from "./handler/delete/delete-car";
import DeleteCargoHandler from "./handler/delete/delete-cargo";
import GetAllCarHandler from "./handler/read/get-all-car";
import GetAllCargoHandler from "./handler/read/get-all-cargo";
import GetAllUserHandler from "./handler/read/get-all-user";
import GetCarHandler from "./handler/read/get-car";
import GetCarByUserCarHandler from "./handler/read/get-car-by-user-car";
import GetCargoHandler from "./handler/read/get-cargo";
import GetCargoByUserCarHandler from "./handler/read/get-cargo-by-user-car";
import GetUserHandler from "./handler/read/get-user";
import ReadNewsHandler from "./handler/read/read-news";
import ChangeCarHandler from "./handler/update/change-car";
import ChangeCargoHandler from "./handler/update/change-cargo";
import ChangeUserHandler from "./handler/update/change-user";
import LogInUserHandler from "./handler/update/login";
import LogOutUserHandler from "./handler/update/logout";
import { HttpCodes } from "./http-codes";

export default class DataMapper {
    private readonly KEY_EVENT = 'event';
    constructor() {

    }
    create<T>(nameEvent: AppEvents, params: Map<string, string> = new Map()): Promise<Map<string, string> | T> {
        return new Promise((resolve, reject) => {
            switch (nameEvent) {
                case AppEvents.MAIN_CAR_CREATE: {
                    const handler = new CreateCarHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_CREATED: {
                                    delete ((data as unknown) as answer<T>).statusCode;
                                    resolve((data as unknown) as T);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_UNAUTHORIZED:
                                case HttpCodes.CODE_NOT_ALLOWED: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка создания машины');
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
                case AppEvents.MAIN_CARGO_CREATE: {
                    const handler = new CreateCargoHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_CREATED: {
                                    delete ((data as unknown) as answer<T>).statusCode;
                                    resolve((data as unknown) as T);
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
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_CREATED: {
                                    delete ((data as unknown) as answer<T>).statusCode;
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
                case AppEvents.USER_GET_ALL: {
                    const handler = new GetAllUserHandler();
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    // delete ((data as unknown) as answer<T>).statusCode;
                                    // const result = new Map<string, string>();
                                    // for (const [key, value] of Object.entries(((data as unknown) as user))) {
                                    //     result.set(key, value.toString());
                                    // }
                                    // resolve(result);
                                    resolve(((data as unknown) as answer<T>).users!);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_UNAUTHORIZED: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка получения всех пользователей');
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
                case AppEvents.USER_GET_BY_ID: {
                    const handler = new GetUserHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    delete ((data as unknown) as answer<T>).statusCode;
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
                                    result.set('message', 'TODO Ошибка получения пользователя по id');
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
                case AppEvents.MAIN_CAR_GET_ALL: {
                    const handler = new GetAllCarHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    resolve(((data as unknown) as answer<T>).items!);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_NOT_FOUND: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка получения всех машин');
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
                case AppEvents.MAIN_CAR_GET_BY_ID: {
                    const handler = new GetCarHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    delete ((data as unknown) as answer<T>).statusCode;
                                    const result = ((data as unknown) as answer<T>).body;
                                    if (result !== undefined) {
                                        resolve(result);
                                        break;
                                    }
                                    resolve(params);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_NOT_FOUND: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка получения машины по ID');
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
                case AppEvents.MAIN_CAR_GET_BY_USER: {
                    params.set(this.KEY_EVENT, nameEvent);
                    const handler = new GetCarByUserCarHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    resolve(((data as unknown) as answer<T>).items!);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_UNAUTHORIZED: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка получения всех машин по id пользователя или груза');
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
                case AppEvents.MAIN_CARGO_GET_ALL: {
                    const handler = new GetAllCargoHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    resolve(((data as unknown) as answer<T>).items!);
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
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    delete ((data as unknown) as answer<T>).statusCode;
                                    const result = ((data as unknown) as answer<T>).body;
                                    if (result !== undefined) {
                                        resolve(result);
                                        break;
                                    }
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
                case AppEvents.MAIN_CARGO_GET_BY_CAR:
                case AppEvents.MAIN_CARGO_GET_BY_USER: {
                    params.set(this.KEY_EVENT, nameEvent);
                    const handler = new GetCargoByUserCarHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    resolve(((data as unknown) as answer<T>).items!);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_UNAUTHORIZED: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка получения всех грузов по id пользователя или машины');
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
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    delete ((data as unknown) as answer<T>).statusCode;
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
                case AppEvents.MAIN_USER_SAVE_INFO: {
                    const handler = new ChangeUserHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    resolve(params);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_NOT_FOUND: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка редактирования пользователя');
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
                case AppEvents.MAIN_CAR_CHANGE: {
                    const handler = new ChangeCarHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    resolve(params);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST:
                                case HttpCodes.CODE_NOT_FOUND: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка редактирования машины');
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
                case AppEvents.MAIN_CARGO_CHANGE: {
                    const handler = new ChangeCargoHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
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
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    delete ((data as unknown) as answer<T>).statusCode;
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
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    delete ((data as unknown) as answer<T>).statusCode;
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
                case AppEvents.MAIN_CAR_DELETE: {
                    const handler = new DeleteCarHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
                                    resolve(params);
                                    break;
                                }
                                case HttpCodes.CODE_BAD_REQUEST: {
                                    const result = new Map<string, string>();
                                    result.set('message', 'TODO Ошибка удаления машины');
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
                case AppEvents.MAIN_CARGO_DELETE: {
                    const handler = new DeleteCargoHandler(params);
                    handler.send()
                        .then((data) => {
                            switch (((data as unknown) as answer<T>).statusCode) {
                                case HttpCodes.CODE_OK: {
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
