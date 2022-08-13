// import { ContentTypeJson } from "../types/types";
// import { OkCodes } from "../types/enums";
import jwt, { SignOptions } from 'jsonwebtoken';
import { ContentTypeJson } from '../types/types';
import { UsersModel } from '../model/user.model';
import { ErrorCodes, OkCodes } from '../types/enums';
import { FastifyReply, FastifyRequest, RouteHandler } from 'fastify';
import { AuthRequestUserSchemaType } from '../routes/v1/auth.router';

export class AuthController {
    private static SECRET_FOR_JWT = 'testSecret123';
    private static TOKEN_OPTIONS = {
        algorithm: 'HS256',
        expiresIn: '1d',
    } as SignOptions;
    private static COOKIE_NAME = 'authCookie';
    private static instance: AuthController;

    private constructor() {
        //do nothing
    }

    async verifyJWT(req: FastifyRequest, res: FastifyReply) {
        //, done: any) {
        try {
            const cookie = req.cookies[AuthController.COOKIE_NAME];
            if (!cookie) {
                res.code(401);
                res.send({ message: 'unauthorized msg' });
                // throw new Error('unauthorized 1');
                return;
            }
            jwt.verify(cookie, AuthController.SECRET_FOR_JWT, AuthController.TOKEN_OPTIONS);
        } catch (err) {
            res.code(401);
            res.send({ message: 'authentication expired, please login again' });
        }
    }

    createToken(id: string) {
        try {
            const tok = jwt.sign(
                {
                    id,
                },
                AuthController.SECRET_FOR_JWT,
                AuthController.TOKEN_OPTIONS
            );
            return tok;
        } catch (err) {
            throw new Error('cant create token');
        }
    }

    setAuthCookie(resp: FastifyReply, id: string) {
        const token = this.createToken(id); //create a token with custom data
        resp.setCookie(AuthController.COOKIE_NAME, token, {
            httpOnly: true,
            // secure: true,
        });
    }

    authorizeUserFunc(): RouteHandler<{ Body: AuthRequestUserSchemaType }> {
        return async (req, res) => {
            try {
                req.headers;
                const newUser = await UsersModel.getInstance().processAuthorizeUser(req.body);
                res.code(OkCodes.OK);
                AuthController.instance.setAuthCookie(res, newUser.id);
                res.send(newUser.toJsonResponse());
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
