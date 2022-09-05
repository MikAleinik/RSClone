import Handler from "../handler";

export default class ChangeUserHandler extends Handler {

    constructor(params: Map<string, string>) {
        super(params);
    }

    send<T>(): Promise<T> {
        return new Promise((resolve, reject) => {
            const URL = this.SERVER_URL + this.USER_END_POINT + '/' + this._params.get('id')!;
            this._options.method = 'PUT';
            this._options.body = JSON.stringify({
                login: this._params.get('login')!,
                email: this._params.get('email')!,
                password: this._params.get('password')!,
                first_name: this._params.get('first_name')!,
                last_name: this._params.get('last_name')!,
                phone: this._params.get('phone')!,
                company: this._params.get('company')!,
                address: this._params.get('address')!,
                point_lat: Number(this._params.get('point_lat')!),
                point_lon: Number(this._params.get('point_lon')!),
                role_id: Number(this._params.get('role_id')!),
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