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
                first_name: '',
                last_name: '',
                phone: '',
                company: '',
                address: '',
                rating: 0,
                rating_count: 0,
                point_lat: 0,
                point_lon: 0
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
                    console.log(data);
                    resolve(data);
                })
                .catch((data) => {
                    reject(data);
                });
        });
    }
}