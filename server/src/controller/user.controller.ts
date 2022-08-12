import { ContentTypeJson, RegisterRequestType } from '../types/types';
import { ErrorCodes, OkCodes } from '../types/enums';
import { UsersModel } from '../model/user.model';
import { AuthController } from './auth.controller';
import { User } from '../model/vo/user';
import { FastifyReply, FastifyRequest } from 'fastify';

export class UsersController {
    private static instance: UsersController;

    private constructor() {
        //do nothing
    }

    async processGetAllUsers(req: FastifyRequest, res: FastifyReply) {
        // const users = await usersRepo.getAll();
        // const objUsers = users.map((user) => user.toJsonResponse());
        res.code(OkCodes.OK);
        res.header(ContentTypeJson[0], ContentTypeJson[1]);
        res.send([]);
    }

    async processCreateNewUser(req: RegisterRequestType, res: FastifyReply) {
        try {
            const newUser = await UsersModel.getInstance().processCreateNewUser(req.body);
            AuthController.getInstance().setAuthCookie(res, newUser.id);
            res.code(OkCodes.CREATED);
            res.send(newUser.toJsonResponse());
        } catch (err) {
            res.code(ErrorCodes.BAD_REQUEST);
            res.header(ContentTypeJson[0], ContentTypeJson[1]);
            res.send((err as Error).message);
        }
    }

    async processGetUserByUUID(req: FastifyRequest, res: FastifyReply) {
        const user = new User(); //await usersRepo.addUser({ name, login, password });
        res.code(OkCodes.CREATED);
        res.header(ContentTypeJson[0], ContentTypeJson[1]);
        res.send(user.toJsonResponse());
    }

    async processChangeUserByUUID(req: RegisterRequestType, res: FastifyReply) {
        const user = new User(); //await usersRepo.addUser({ name, login, password });
        res.code(OkCodes.CREATED);
        res.header(ContentTypeJson[0], ContentTypeJson[1]);
        res.send(user.toJsonResponse());
    }

    async processDeleteUserByUUID(req: FastifyRequest, res: FastifyReply) {
        res.code(OkCodes.OK);
        res.header(ContentTypeJson[0], ContentTypeJson[1]);
        res.send({});
    }

    static getInstance() {
        if (!UsersController.instance) {
            UsersController.instance = new UsersController();
        }
        return UsersController.instance;
    }
}
