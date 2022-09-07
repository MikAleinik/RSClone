import Handler from "../handler";

export default class ChangeCargoHandler extends Handler {

    constructor(params: Map<string, string>) {
        super(params);
    }

    send<T>(): Promise<T> {
        return new Promise((resolve, reject) => {
            const URL = this.SERVER_URL + this.CARGO_END_POINT + '/' + this._params.get('id')!;
            this._options.method = 'PUT';
            this._options.body = JSON.stringify({
                user_id: this._params.get('user_id')!,
                point_start_lat: this._params.get('point_start_lat')!,
                point_start_lon: this._params.get('point_start_lon')!,
                point_end_lat: this._params.get('point_end_lat')!,
                point_end_lon: this._params.get('point_end_lon')!,
                price: this._params.get('price')!,
                currency: this._params.get('currency')!,
                date_from: this._params.get('date_from')!,
                volume: this._params.get('volume')!,
                weigth: this._params.get('weigth')!,
                finished: this._params.get('finished')!,
                description: this._params.get('description')!
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