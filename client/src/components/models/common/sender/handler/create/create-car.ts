import Handler from "../handler";

export default class CreateCarHandler extends Handler {

    constructor(params: Map<string, string>) {
        super(params);
    }

    send<T>(): Promise<T> {
        return new Promise((resolve, reject) => {
            const URL = this.SERVER_URL + this.CAR_CREATE_END_POINT;
            this._options.method = 'POST';
            this._options.body = JSON.stringify({
                user_id: Number(this._params.get('user_id')!),
                model: this._params.get('model')!,
                point_current_lat: Number(this._params.get('point_current_lat')!),
                point_current_lon: Number(this._params.get('point_current_lon')!),
                date_start: new Date(this._params.get('date_start')!),
                price: Number(this._params.get('price')!),
                currency: this._params.get('currency')!,
                volume_max: Number(this._params.get('volume_max')!),
                weigth_max: Number(this._params.get('weigth_max')!),
                speed: Number(this._params.get('speed')!),
                drived: this._params.get('drived')!,
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