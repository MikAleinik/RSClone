import user from "../../../../types/user";
import { AppEvents } from "../../../controller/app-events";
import DataMapper from "../../common/sender/data-mapper";

export default class UserModel {
    private ID_ROLE_CUSTOMER = '1';
    private ID_ROLE_CARRIER = '2';
    private NAME_ROLE_CUSTOMER = 'customer';
    private NAME_ROLE_CARRIER = 'carrier';

    private _dataMapper = new DataMapper();
    private _currentUser: user = {
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
    constructor() {

    }
    registerUser(nameEvents: AppEvents, param: Map<string, string>): Promise<Map<string, string>> {
        return new Promise((resolve, reject) => {
            this._dataMapper.create(nameEvents, param)
                .then((result) => {
                    result = (result as unknown) as Map<string, string>;
                    this.setUser(result);
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
    getAuthUser(): Promise<user> {
        return new Promise((resolve, reject) => {
            if (this._currentUser.login !== '') {
                resolve(this._currentUser);
            } else {
                let param = new Map<string, string>();
                //TODO согласовать с Денисом отправку нуля для получения текущего юзера
                param.set('id', '1');
                this._dataMapper.read(AppEvents.AUTH_GET_AUTH_USER, param)
                .then((result) => {
                    console.log(result);
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
    private setUser (result: Map<string, string>): void {
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
        if (result.get('role_id')! === this.NAME_ROLE_CUSTOMER) {
            this._currentUser.role_id = this.ID_ROLE_CUSTOMER;
        } else {
            this._currentUser.role_id = this.ID_ROLE_CARRIER;
        }
    }
    private clearUser (): void {
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