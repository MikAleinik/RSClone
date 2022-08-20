import Handler from "../handler";

export default class LogInUserHandler extends Handler {

    constructor(params: Map<string, string>) {
        super(params);
    }

    send<T>(): Promise<T> {
        return new Promise((resolve, reject) => {
            const URL = this.SERVER_URL + this.AUTH_END_POINT;
            const userData = {
                email: this._params.get('auth_email')!,
                password: this._params.get('auth_password')!,
            };
            fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(userData)
            })
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