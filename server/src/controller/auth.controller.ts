// import { ContentTypeJson } from "../types/types";
// import { OkCodes } from "../types/enums";
import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthenticateUser, ContentTypeJson } from '../types/types';
import { UsersModel } from '../model/user.model';
import { ErrorCodes, OkCodes } from '../types/enums';

export class AuthController {
    private static SECRET_FOR_JWT = 'testSecret123';
    private static TOKEN_OPTIONS = {
        algorithm: 'HS256',
        expiresIn: '1d',
    } as SignOptions;
    private static COOKIE_NAME = 'authCookie';
    private static instance: AuthController;

    private constructor() {}

    async verifyJWT(req: any, res: any) {
        //, done: any) {
        const cookie = req.cookies[AuthController.COOKIE_NAME];
        try {
            jwt.verify(cookie, AuthController.SECRET_FOR_JWT, AuthController.TOKEN_OPTIONS);
        } catch (err) {
            res.code(401);
            throw new Error('unauthorized');
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

    setAuthCookie(resp: any, id: string) {
        const token = this.createToken(id); //create a token with custom data
        resp.setCookie(AuthController.COOKIE_NAME, token, {
            httpOnly: true,
            // secure: true,
        });
    }

    async authorizeUser(req: any, res: any) {
        try {
            const newUser = await UsersModel.getInstance().processAuthorizeUser(req as AuthenticateUser);
            res.code(OkCodes.OK);
            AuthController.instance.setAuthCookie(res, newUser.id);
            res.send(newUser.toJsonResponse());
        } catch (err) {
            res.code(ErrorCodes.BAD_REQUEST);
            res.header(...ContentTypeJson);
            res.send((err as Error).message);
        }
    }

    static getInstance() {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }
}
