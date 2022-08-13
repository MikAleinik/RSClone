import { ErrorNoSuchUser } from '../errors/ErrorNoSuchUser';
import { ErrorCreateNewUser } from '../errors/ErrorCreateNewUser';
import { OkCodes } from '../types/enums';
import { AuthRequestUserSchemaType, ContentTypeJson, RegisterRequestUserSchemaType } from '../types/types';
import { User } from './vo/user';
import { ErrorInvalidPassword } from '../errors/ErrorInvalidPassword';
import { hashPassword, matchPassword } from './util/password.manager';

export class UsersModel {
    private static instance: UsersModel;

    private constructor() {
        //do nothing
    }

    errorHandler(error: Error, res: any) {
        res.header(...ContentTypeJson);
        res.send({ message: error.message });
    }

    async checkUniqueEmail(email: string) {
        //TODO add check
        return true;
    }

    async getUserByEmail(email: string) {
        //TODO real search
        const user = new User(); // user.passwordHash on init is P@55w0rd
        user.passwordHash = hashPassword(user.passwordHash);
        return user;
    }

    validatePassword(password: string, user: User) {
        //TODO add check

        // now we get fake user with password P@55w0rd -
        // so let's validate it

        return matchPassword(password, user.passwordHash);
    }

    async preHandler(req: any, res: any) {
        // const users = await usersRepo.getAll();
        // const objUsers = users.map((user) => user.toJsonResponse());
        res.code(OkCodes.OK);
        res.header(...ContentTypeJson);
        res.send([]);
    }

    async processGetAllUsers(req: any, res: any) {
        // const users = await usersRepo.getAll();
        // const objUsers = users.map((user) => user.toJsonResponse());
        res.code(OkCodes.OK);
        res.header(...ContentTypeJson);
        res.send([]);
    }

    async processCreateNewUser(body: RegisterRequestUserSchemaType) {
        const { email, login, password } = body;
        const isUnique = await this.checkUniqueEmail(email);
        if (!isUnique) {
            throw new ErrorCreateNewUser();
        }
        return new User(email, login, hashPassword(password));
    }

    async processAuthorizeUser(body: AuthRequestUserSchemaType) {
        const { email, password } = body;
        const user = await this.getUserByEmail(email);
        if (!user) {
            throw new ErrorNoSuchUser();
        }
        if (!this.validatePassword(password, user)) {
            throw new ErrorInvalidPassword();
        }
        return user;
    }

    async processGetUserByUUID(req: any, res: any) {
        // const { id } = req.params;
        // try {
        //   if (!validateUUID(id)) {
        //     throw new BadRequestError("UUID is invalid");
        //   }
        //   const user = await usersRepo.getUserByUUID(id);
        //   res.code(OkCodes.OK);
        //   res.header(...ContentTypeJson);
        //   res.send(user.toJsonResponse());
        // } catch (error) {
        //   errorHandler(error, res);
        // }

        const user = new User(); //await usersRepo.addUser({ name, login, password });
        res.code(OkCodes.CREATED);
        res.header(...ContentTypeJson);
        res.send(user.toJsonResponse());
    }

    async processChangeUserByUUID(req: any, res: any) {
        // try {
        //   const { id: userId } = req.params;
        //   if (!validateUUID(userId)) {
        //     throw new BadRequestError("UUID is invalid");
        //   }
        //   const user = await usersRepo.getUserByUUID(userId);
        //   const { name, login, password, id } = req.body;
        //   user.id = id;
        //   user.name = name;
        //   user.login = login;
        //   user.password = password;
        //   res.code(OkCodes.OK);
        //   res.header(...ContentTypeJson);
        //   res.send(user.toJsonResponse());
        // } catch (error) {
        //   errorHandler(error, res);
        // }

        const user = new User(); //await usersRepo.addUser({ name, login, password });
        res.code(OkCodes.CREATED);
        res.header(...ContentTypeJson);
        res.send(user.toJsonResponse());
    }

    async processDeleteUserByUUID(req: any, res: any) {
        // try {
        //   const { id } = req.params;
        //   if (!validateUUID(id)) {
        //     throw new BadRequestError("UUID is invalid");
        //   }
        //   await usersRepo.deleteUserByUUID(id);
        //   tasksRepo.clearUserId(id);
        //   res.code(OkCodes.OK);
        //   res.header(...ContentTypeJson);
        //   res.send({});
        // } catch (error) {
        //   errorHandler(error, res);
        // }

        res.code(OkCodes.OK);
        res.header(...ContentTypeJson);
        res.send({});
    }

    static getInstance() {
        if (!UsersModel.instance) {
            UsersModel.instance = new UsersModel();
        }
        return UsersModel.instance;
    }
}
