import Handler from "../handler";

export default class GetAllCargoToCarHandler extends Handler {

    constructor() {
        super(new Map<string, string>());
    }

    send<T>(): Promise<T> {
        return new Promise((resolve, reject) => {
            const URL = this.SERVER_URL + this.CARGO_TO_CAR_END_POINT;
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