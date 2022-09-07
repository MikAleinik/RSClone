import Handler from "../handler";

export default class CreateCargoToCarHandler extends Handler {

    constructor(params: Map<string, string>) {
        super(params);
    }

    send<T>(): Promise<T> {
        return new Promise((resolve, reject) => {
            const URL = this.SERVER_URL + this.CARGO_TO_CAR_CREATE_END_POINT;
            this._options.method = 'POST';
            this._options.body = JSON.stringify({
                id_cargo: Number(this._params.get('id_cargo')!),
                id_cars: Number(this._params.get('id_cars')!),
            });
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