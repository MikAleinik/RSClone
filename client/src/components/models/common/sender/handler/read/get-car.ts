import Handler from "../handler";

export default class GetCarHandler extends Handler {

    constructor(params: Map<string, string>) {
        super(params);
    }

    send<T>(): Promise<T> {
        return new Promise((resolve, reject) => {
            const URL = this.SERVER_URL + this.CAR_END_POINT + '/' + this._params.get('id');
            console.log(URL);
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