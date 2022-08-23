import Handler from "../handler";

export default class GetUserHandler extends Handler {

    constructor(params: Map<string, string>) {
        super(params);
    }

    send<T>(): Promise<T> {
        return new Promise((resolve, reject) => {
            const URL = this.SERVER_URL + this.USER_END_POINT + '/' + this._params.get('id')!;
            fetch(URL, {
                method: 'GET',
                credentials: 'include',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
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