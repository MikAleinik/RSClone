import User from "../../../../types/user";
import { AppEvents } from "../../../controller/app-events";
import Observer from "../../../controller/observer";
import DataMapper from "../../common/sender/data-mapper";

export default class UserModel {
    private ID_ROLE_CUSTOMER = '1';
    private ID_ROLE_CARRIER = '2';
    private NAME_ROLE_CUSTOMER_EN = 'Customer';
    private NAME_ROLE_CUSTOMER_RU = 'Заказчик';

    private _dataMapper = new DataMapper();
    private _currentUser: User = {
        id: 0,
        login: '',
        email: '',
        password: '',
        role_id: '',
        first_name: '',
        last_name: '',
        phone: '',
        company: '',
        address: '',
        rating: 0,
        rating_count: 0,
        point_lat: 0,
        point_lon: 0,
    };
    private _users: Array<User>;

    constructor() {
        this._users = new Array<User>();
        this.getUserAll(AppEvents.USER_GET_ALL)
            .then((result) => {
                if (typeof result !== 'undefined') {
                    this._users = result;
                }
            });
    }
    save(nameEvents: AppEvents, user: User): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._dataMapper.update(nameEvents, this.setUserToMap(user))
                .then((result) => {
                    this.setUser(this.setUserToMap(user));
                    resolve(true);
                })
                .catch(() => {
                    reject(false);
                });
        });
    }
    getUserAll(nameEvents: AppEvents): Promise<Array<User>> {
        return new Promise((resolve, reject) => {
            if (this._users.length === 0) {
                this._dataMapper.read(nameEvents)
                .then((result) => {
                    resolve(result as Array<User>);
                })
                .catch((result) => {
                    reject(result);
                });
            } else {
                resolve(this._users);
            }
        });
    }
    getUserById(nameEvents: AppEvents, param: Map<string, string>): Promise<User> {
        return new Promise((resolve, reject) => {
            let findResult = false;
            for (let i = 0; i < this._users.length; i += 1) {
                if (this._users[i].id === Number(param.get('id'))) {
                    findResult = true;
                    resolve(this._users[i]);
                    break;
                }
            }
            if (!findResult) {
                this._dataMapper.read(nameEvents, param)
                    .then((result) => {
                        const user = this.setMapToUser(result as Map<string, string>);
                        this._users.push(user);
                        resolve(user);
                    })
                    .catch((result) => {
                        reject(result);
                    });
            }
        });
    }
    registerUser(nameEvents: AppEvents, param: Map<string, string>): Promise<Map<string, string>> {
        return new Promise((resolve, reject) => {
            if (param.get('role')! === this.NAME_ROLE_CUSTOMER_EN || param.get('role')! === this.NAME_ROLE_CUSTOMER_RU) {
                param.set('role_id', this.ID_ROLE_CUSTOMER);
            } else {
                param.set('role_id', this.ID_ROLE_CARRIER);
            }
            param.delete('role');
            this._dataMapper.create(nameEvents, param)
                .then((result) => {
                    this.setUser(result as Map<string, string>);
                    resolve(result as Map<string, string>);
                })
                .catch((result) => {
                    reject(result);
                });
        });
    }
    logIn(nameEvents: AppEvents, param: Map<string, string>): Promise<Map<string, string>> {
        return new Promise((resolve, reject) => {
            this._dataMapper.update(nameEvents, param)
                .then((result) => {
                    result = (result as unknown) as Map<string, string>;
                    this.setUser(result);
                    resolve(result);
                })
                .catch((result) => {
                    reject(result);
                });
        });
    }
    logOut(nameEvent: AppEvents): Promise<Map<string, string>> {
        return new Promise((resolve, reject) => {
            this._dataMapper.update(nameEvent)
                .then((result) => {
                    this.clearUser();
                    resolve(result as Map<string, string>);
                })
                .catch((result) => {
                    reject(result);
                });
        });
    }
    getAuthUser(): Promise<User> {
        return new Promise((resolve, reject) => {
            if (this._currentUser.login !== '') {
                resolve(this._currentUser);
            } else {
                this._dataMapper.read(AppEvents.AUTH_GET_AUTH_USER)
                    .then((result) => {
                        this.clearUser();
                        result = (result as unknown) as Map<string, string>;
                        this.setUser(result);
                        resolve(this._currentUser);
                    })
                    .catch((result) => {
                        reject(result);
                    });
            }
        });
    }
    private setUser(result: Map<string, string>): void {
        this._currentUser.id = Number(result.get('id')!);
        this._currentUser.login = result.get('login')!;
        this._currentUser.email = result.get('email')!;
        this._currentUser.password = '',
            this._currentUser.first_name = result.get('first_name')!;
        this._currentUser.last_name = result.get('last_name')!;
        this._currentUser.phone = result.get('phone')!;
        this._currentUser.company = result.get('company')!;
        this._currentUser.address = result.get('address')!;
        this._currentUser.rating = Number(result.get('rating')!);
        this._currentUser.rating_count = Number(result.get('rating_count')!);
        this._currentUser.point_lat = Number(result.get('point_lat')!);
        this._currentUser.point_lon = Number(result.get('point_lon')!);
        this._currentUser.role_id = result.get('role_id')!;
        //     if (result.get('role_id')! === this.NAME_ROLE_CUSTOMER_EN || this.NAME_ROLE_CUSTOMER_RU) {
        //         this._currentUser.role_id = this.ID_ROLE_CUSTOMER;
        //     } else {
        //         this._currentUser.role_id = this.ID_ROLE_CARRIER;
        //     }
    }
    private setMapToUser(result: Map<string, string>): User {
        return {
            id: Number(result.get('id')!),
            login: result.get('login')!,
            email: result.get('email')!,
            password: result.get('password')!,
            first_name: result.get('first_name')!,
            last_name: result.get('last_name')!,
            phone: result.get('phone')!,
            company: result.get('company')!,
            address: result.get('address')!,
            rating: Number(result.get('rating')!),
            rating_count: Number(result.get('rating_count')!),
            point_lat: Number(result.get('point_lat')!),
            point_lon: Number(result.get('point_lon')!),
            role_id: result.get('role_id')!,
        }
    }
    private setUserToMap(user: User): Map<string, string> {
        const result = new Map<string, string>();
        result.set('id', user.id.toString());
        result.set('login', user.login);
        result.set('email', user.email);
        result.set('password', user.password);
        result.set('first_name', user.first_name);
        result.set('last_name', user.last_name);
        result.set('phone', user.phone);
        result.set('company', user.company);
        result.set('address', user.address);
        result.set('rating', user.rating.toString());
        result.set('rating_count', user.rating_count.toString());
        result.set('point_lat', user.point_lat.toString());
        result.set('point_lon', user.point_lon.toString());
        result.set('role_id', user.role_id);
        return result;
    }
    private clearUser(): void {
        this._currentUser.id = 0;
        this._currentUser.login = '';
        this._currentUser.email = '';
        this._currentUser.password = '',
            this._currentUser.first_name = '';
        this._currentUser.last_name = '';
        this._currentUser.phone = '';
        this._currentUser.company = '';
        this._currentUser.address = '';
        this._currentUser.rating = 0;
        this._currentUser.rating_count = 0;
        this._currentUser.point_lat = 0;
        this._currentUser.point_lon = 0;
        this._currentUser.role_id = '';
    }
}