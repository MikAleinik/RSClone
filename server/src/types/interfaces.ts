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

export interface BodyWithJWT {
    jwtDecoded: JWTTokenDataWithTimestamps;
}
