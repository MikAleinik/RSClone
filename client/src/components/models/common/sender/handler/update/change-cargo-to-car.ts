import Handler from "../handler";

export default class ChangeCargoToCarHandler extends Handler {

    constructor(params: Map<string, string>) {
        super(params);
    }

    send<T>(): Promise<T> {
        return new Promise((resolve, reject) => {
            const URL = this.SERVER_URL + this.CARGO_TO_CAR_END_POINT + '/' + this._params.get('id_cargotocar')!;
            this._options.method = 'PUT';
            this._options.body = JSON.stringify({
                argree: this._params.get('argree')!,
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