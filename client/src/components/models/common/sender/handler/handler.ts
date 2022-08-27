import answer from "../../../../../types/answer";

export default abstract class Handler {
    protected readonly SERVER_URL = 'https://rs-clone-server.lm.r.appspot.com/v1';
    // protected readonly SERVER_URL = 'http://localhost:3000';
    protected readonly AUTH_END_POINT = '/auth';
    protected readonly UNAUTH_END_POINT = '/unauth';
    protected readonly USER_END_POINT = '/users';
    protected readonly HANDSHAKE_END_POINT = '/users/handshake';
    protected readonly USER_REGISTER_END_POINT = '/register';
    protected readonly CARGO_END_POINT = '/cargo';
    protected readonly CARGO_CREATE_END_POINT = '/cargo/create';

    protected _params: Map<string, string>;
    protected _headers: Headers;
    protected _options: RequestInit;

    constructor(params: Map<string, string> = new Map()) {
        this._params = params;
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json;charset=utf-8');
        this._options= {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
            headers: this._headers,
        }
    }

    abstract send <T>(): Promise<T | Array<T>>;
}