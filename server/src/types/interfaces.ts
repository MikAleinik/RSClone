export interface JWTTokenData {
    id: number;
    email: string;
}

export interface JWTTokenDataWithTimestamps {
    id: number;
    email: string;
    iat: number;
    exp: number;
}

export interface IBodyWithJWT {
    jwtDecoded: JWTTokenDataWithTimestamps;
}

export interface GenericInterface<T> {
    new (): T;
}
