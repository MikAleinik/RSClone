import { ContentTypeJson } from '../types/types';
import { ErrorCodes, OkCodes } from '../types/enums';
import { UsersModel } from '../model/user.model';
import { AuthController } from './auth.controller';
import { RouteHandler } from 'fastify';
import { RegisterUserSchemaType, ReplyAllUsersType, UserSchemaType } from '../routes/v1/user.router';
import { ErrorReplyType } from '../schema/general.schema';
import { IBodyWithJWT } from '../types/interfaces';

export class UsersController {
    private static instance: UsersController;

    private constructor() {
        //do nothing
    }

    getAllUsersFunc(): RouteHandler<{ Reply: ReplyAllUsersType }> {
        return async (req, res) => {
            try {
                const cargos = await UsersModel.getInstance().getAllUsers();
                res.code(OkCodes.OK);
                let items: Array<UserSchemaType>;
                if (!cargos) {
                    items = new Array<UserSchemaType>();
                } else {
                    items = cargos
                        .filter((item1) => item1.getData() != undefined && item1.getData() !== null)
                        .map((item3) => item3.toJsonResponse());
                }
                const rp = {
                    items: items,
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
                const userData = newUser.getData();
                AuthController.getInstance().createTokenAndSetAuthCookie(res, {
                    id: userData.id,
                    email: userData.email,
                });
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

    getUserByHandshakeFunc(): RouteHandler<{ Body: IBodyWithJWT; Reply: UserSchemaType | ErrorReplyType }> {
        return async (req, res) => {
            try {
                const { jwtDecoded } = req.body;
                const oldUser = await UsersModel.getInstance().getUserById(jwtDecoded.id);
                if (!oldUser) {
                    throw new Error(`User with id = ${jwtDecoded.id} not found`);
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

    changeUserByUUIDFunc(): RouteHandler<{
        Params: { id: number };
        Body: RegisterUserSchemaType;
        Reply: UserSchemaType | ErrorReplyType;
    }> {
        return async (req, res) => {
            try {
                const { id } = req.params;
                const cargo = await UsersModel.getInstance().updateCargo(req.body, id);
                res.code(OkCodes.OK);
                res.send(cargo?.toJsonResponse());
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send({ message: (err as Error).message });
            }
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
