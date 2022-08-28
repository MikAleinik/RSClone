import { AppEvents } from "../../../../../controller/app-events";
import Handler from "../handler";

export default class GetCargoByUserCarHandler extends Handler {
    private readonly NAME_KEY = 'event';
    private readonly KEY_USER = '?userId=';
    private readonly KEY_CAR = '?carId=';

    constructor(params: Map<string, string>) {
        super(params);
    }

    send<T>(): Promise<T> {
        return new Promise((resolve, reject) => {
            let URL = '';
            if (this._params.get(this.NAME_KEY) === AppEvents.MAIN_CARGO_GET_BY_USER) {
                URL = this.SERVER_URL + this.CARGO_END_POINT + this.KEY_USER + this._params.get('id');
            } else {
                URL = this.SERVER_URL + this.CARGO_END_POINT + this.KEY_CAR + this._params.get('id');
            }
            fetch(URL, this._options)
                .then((response) => {
                    return response.json()
                        .then((data) => {
                            data.statusCode = response.status;
                            return data;
                        });
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((data) => {
                    reject(data);
                });
        });
    }
}