import Handler from "../handler";

export default class CreateUserHandler extends Handler {

    constructor(params: Map<string, string>) {
        super(params);
    }

    send<T>(): Promise<T> {
        return new Promise((resolve, reject) => {
            const URL = this.SERVER_URL + this.USER_END_POINT + this.USER_REGISTER_END_POINT;
            const userData = {
                login: this._params.get('login')!,
                email: this._params.get('email')!,
                password: this._params.get('password')!,
                role_id: this._params.get('role_id')!,
            };
            this._options.method = 'POST';
            this._options.body = JSON.stringify(userData);
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