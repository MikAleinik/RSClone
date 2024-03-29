import answer from "../../../../../types/answer";

export default abstract class Handler {
    protected readonly SERVER_URL = 'http://185.68.21.238:3000/v1';
    // protected readonly SERVER_URL = 'http://localhost:10000/v1';
    protected readonly AUTH_END_POINT = '/auth';
    protected readonly UNAUTH_END_POINT = '/unauth';
    protected readonly USER_END_POINT = '/users';
    protected readonly HANDSHAKE_END_POINT = '/users/handshake';
    protected readonly USER_REGISTER_END_POINT = '/register';
    protected readonly CARGO_END_POINT = '/cargo';
    protected readonly CARGO_CREATE_END_POINT = '/cargo/create';
    protected readonly CAR_END_POINT = '/cars';
    protected readonly CAR_CREATE_END_POINT = '/cars/create';
    protected readonly CARGO_TO_CAR_END_POINT = '/cargotocar';
    protected readonly CARGO_TO_CAR_CREATE_END_POINT = '/cargotocar/create';
    protected readonly CARGO_TO_CAR_BY_CAR_POINT = '/cargotocar/getcarbycargo';
    protected readonly CARGO_TO_CAR_BY_CARGO_POINT = '/cargotocar/getcargosbycar';

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
            // mode: 'cors',
            headers: this._headers,
        }
    }

    abstract send <T>(): Promise<T | Array<T>>;
}