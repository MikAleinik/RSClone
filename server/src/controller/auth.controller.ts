// import { ContentTypeJson } from "../types/types";
// import { OkCodes } from "../types/enums";
import jwt, { SignOptions } from 'jsonwebtoken';
import { ContentTypeJson } from '../types/types';
import { UsersModel } from '../model/user.model';
import { ErrorCodes, OkCodes } from '../types/enums';
import { FastifyReply, FastifyRequest, RouteHandler } from 'fastify';
import { AuthRequestUserSchemaType } from '../routes/v1/auth.router';
import { IBodyWithJWT, JWTTokenData, JWTTokenDataWithTimestamps } from '../types/interfaces';
import { ErrorNoSuchUser } from '../errors/ErrorNoSuchUser';

export class AuthController {
    private static SECRET_FOR_JWT = 'testSecret123';
    private static TOKEN_OPTIONS = {
        algorithm: 'HS256',
        expiresIn: '1d',
    } as SignOptions;
    private static COOKIE_OPTIONS = {
        path: '/',
        // httpOnly: true,
        domain: 'http://localhost:8080',
        // secure: true,
        // sameSite: <boolean>(<unknown>'none'),
    };
    // private static COOKIE_OPTIONS = {
    //     path: '/',
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: <boolean>(<unknown>'none'),
    // };
    private static COOKIE_NAME = 'authCookie';
    // private static COOKIE_UNAUTH = '-1';
    private static instance: AuthController;

    private constructor() {
        //do nothing
    }

    async verifyJWT(req: FastifyRequest, res: FastifyReply) {
        try {
            const cookie = req.cookies[AuthController.COOKIE_NAME];
            if (!cookie) {
                res.code(401);
                res.send({ message: 'unauthorized msg' });
                // throw new Error('unauthorized 1');
                return;
            }
            jwt.verify(cookie, AuthController.SECRET_FOR_JWT, AuthController.TOKEN_OPTIONS);
            const decoded = jwt.decode(cookie, { complete: true, json: false });
            decoded;
            req;
        } catch (err) {
            res.code(401);
            res.send({ message: 'authentication expired, please login again' });
        }
    }

    verifyJWTFunc(): RouteHandler {
        return async (req, res) => {
            try {
                const cookie = req.cookies[AuthController.COOKIE_NAME];
                // -1 is set to cookie when user exits from account. It's because there is no way to delete the cookie
                if (!cookie || cookie === '-1') {
                    res.code(401);
                    res.send({ message: 'unauthorized msg' });
                    // throw new Error('unauthorized 1');
                    return;
                }
                jwt.verify(cookie, AuthController.SECRET_FOR_JWT, AuthController.TOKEN_OPTIONS);
                const decoded = jwt.decode(cookie, { complete: true, json: false });
                if (!req.body) {
                    req.body = {};
                }
                (req.body as IBodyWithJWT).jwtDecoded = decoded?.payload as JWTTokenDataWithTimestamps;
            } catch (err) {
                res.code(401);
                res.send({ message: 'authentication expired, please login again' });
            }
        };
    }

    createToken(tokenData: JWTTokenData) {
        try {
            const tok = jwt.sign(tokenData, AuthController.SECRET_FOR_JWT, AuthController.TOKEN_OPTIONS);
            return tok;
        } catch (err) {
            throw new Error('cant create token');
        }
    }

    setAuthCookie(resp: FastifyReply, token: string) {
        resp.setCookie(AuthController.COOKIE_NAME, token, AuthController.COOKIE_OPTIONS);
    }

    createTokenAndSetAuthCookie(resp: FastifyReply, tokenData: JWTTokenData) {
        const token = AuthController.getInstance().createToken(tokenData);
        resp.setCookie(AuthController.COOKIE_NAME, token, AuthController.COOKIE_OPTIONS);
    }

    authorizeUserFunc(): RouteHandler<{ Body: AuthRequestUserSchemaType }> {
        return async (req, res) => {
            try {
                const oldUser = await UsersModel.getInstance().processAuthorizeUser(req.body);
                const userData = oldUser?.getData();
                if (!oldUser || !userData) {
                    throw new ErrorNoSuchUser();
                }
                AuthController.getInstance().createTokenAndSetAuthCookie(res, {
                    id: userData.id,
                    email: userData.email,
                });
                res.code(OkCodes.OK);
                res.send(oldUser.toJsonResponse());
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send((err as Error).message);
            }
        };
    }

    unAuthorizeUserFunc(): RouteHandler {
        return async (req, res) => {
            try {
                res.clearCookie(AuthController.COOKIE_NAME, AuthController.COOKIE_OPTIONS);
                res.code(OkCodes.OK);
                res.send({});
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send((err as Error).message);
            }
        };
    }

    static getInstance() {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }
}
