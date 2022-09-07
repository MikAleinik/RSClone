import Handler from "../handler";

export default class GetAllCargoHandler extends Handler {

    constructor(params: Map<string, string>) {
        super(params);
    }

    send<T>(): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            const URL = this.SERVER_URL + this.CARGO_END_POINT;
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