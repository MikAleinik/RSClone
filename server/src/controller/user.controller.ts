import { ContentTypeJson } from '../types/types';
import { ErrorCodes, OkCodes } from '../types/enums';
import { UsersModel } from '../model/user.model';
import { AuthController } from './auth.controller';
import { User } from '../model/vo/user';
import { RouteHandler } from 'fastify';
import { RegisterUserSchemaType, ReplyAllUsersType, UserSchemaType } from '../routes/v1/user.router';
import { ErrorReplyType } from '../schema/general.schema';

export class UsersController {
    private static instance: UsersController;

    private constructor() {
        //do nothing
    }

    getAllUsersFunc(): RouteHandler<{ Reply: ReplyAllUsersType }> {
        return async (req, res) => {
            req;
            try {
                res.code(OkCodes.OK);
                const rp = {
                    users: [
                        {
                            email: 'asdf@lll.com',
                            login: 'login1',
                        },
                    ],
                };
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send(rp);
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send();
            }
        };
    }

    createNewUserFunc(): RouteHandler<{ Body: RegisterUserSchemaType; Reply: UserSchemaType | ErrorReplyType }> {
        return async (req, res) => {
            try {
                const newUser = await UsersModel.getInstance().processCreateNewUser(req.body);
                AuthController.getInstance().setAuthCookie(res, newUser.email);
                res.code(OkCodes.CREATED);
                res.send(newUser.toJsonResponse());
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send({ message: (err as Error).message });
            }
        };
    }

    getUserByUUIDFunc(): RouteHandler<{ Params: { id: number }; Reply: UserSchemaType | ErrorReplyType }> {
        return async (req, res) => {
            try {
                const { id } = req.params;
                const oldUser = await UsersModel.getInstance().getUserById(id);
                if (!oldUser) {
                    throw new Error(`User with id = ${id} not found`);
                }
                res.code(OkCodes.OK);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send(oldUser.toJsonResponse());
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send({ message: (err as Error).message });
            }
        };
    }

    changeUserByUUIDFunc(): RouteHandler<{ Body: UserSchemaType; Reply: UserSchemaType | ErrorReplyType }> {
        return async (req, res) => {
            //TODO add implementation
            const user = new User(0); //await usersRepo.addUser({ name, login, password });
            res.code(OkCodes.CREATED);
            res.header(ContentTypeJson[0], ContentTypeJson[1]);
            res.send(user.toJsonResponse());
        };
    }

    deleteUserByUUIDFunc(): RouteHandler<{ Body: UserSchemaType }> {
        return async (req, res) => {
            //TODO add implementation
            res.code(OkCodes.CREATED);
            res.header(ContentTypeJson[0], ContentTypeJson[1]);
            res.send({});
        };
    }

    static getInstance() {
        if (!UsersController.instance) {
            UsersController.instance = new UsersController();
        }
        return UsersController.instance;
    }
}
