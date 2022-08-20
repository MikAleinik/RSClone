import answer from "../../../../../types/answer";

export default abstract class Handler {
    protected readonly SERVER_URL = 'https://rs-clone-server.lm.r.appspot.com/v1';
    protected readonly AUTH_END_POINT = '/auth';
    protected readonly USER_END_POINT = '/users';
    protected readonly USER_REGISTER_END_POINT = '/register';

    protected _params: Map<string, string>;

    constructor(params: Map<string, string> = new Map()) {
        this._params = params;
    }

    abstract send <T>(): Promise<T | Array<T>>;
}