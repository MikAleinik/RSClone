export enum RouterPath {
    CARS = 'cars',
    USERS = 'users',
    CARGO = 'cargo',
    CARGO_REGISTER = 'cargo/create',
    USERS_REGISTER = 'users/register',
    AUTH = 'auth',
    UNAUTH = 'unauth',
}

export enum OkCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
}

export enum ErrorCodes {
    NOT_FOUND = 404,
    BAD_REQUEST = 400,
    INTERNAL_SERVER_ERROR = 500,
}
