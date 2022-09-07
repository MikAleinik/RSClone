import { ErrorNoSuchUser } from '../errors/ErrorNoSuchUser';
import { ContentTypeJson } from '../types/types';
import { User } from './vo/user';
import { ErrorInvalidPassword } from '../errors/ErrorInvalidPassword';
import { matchPassword } from './util/password.manager';
import { AuthRequestUserSchemaType } from '../routes/v1/auth.router';
import { RegisterUserSchemaType } from '../routes/v1/user.router';
import { UsersMapper } from './mappers/user.mapper';
import { ErrorNoMapper } from '../errors/ErrorNoMapper';

export class UsersModel {
    private static instance: UsersModel;
    private static mapper: UsersMapper;

    private constructor() {
        //do nothing
    }

    errorHandler(error: Error, res: any) {
        res.header(...ContentTypeJson);
        res.send({ message: error.message });
    }

    async getUserByEmail(email: string) {
        const user = await UsersModel.getMapperWithWarning().getUserByEmail(email);
        if (!user) {
            return null;
        }
        return user;
    }

    async getUserById(id: number) {
        return await UsersModel.getMapperWithWarning().getById(id);
    }

    validatePassword(password: string, user: User) {
        return matchPassword(password, user.password);
    }

    async getAllUsers() {
        return await UsersModel.getMapperWithWarning().getAllUsers();
    }

    async processCreateNewUser(body: RegisterUserSchemaType) {
        return await UsersModel.mapper.createUser({ ...body });
    }

    async updateUser(body: RegisterUserSchemaType, id: number) {
        const { jwtDecoded } = body;
        if (id !== jwtDecoded.id) {
            throw new Error("You can't modify other users");
        }
        return await UsersModel.mapper.changeUser(id, body);
    }

    async deleteUserByUUID(id: number) {
        const user = await UsersModel.mapper.getById(id);
        if (!user) {
            throw new Error(`${id}`);
        }
        await UsersModel.mapper.deleteUser(id);
    }

    checkMapper() {
        if (!UsersModel.mapper) {
            throw new ErrorNoMapper();
        }
    }

    async processAuthorizeUser(body: AuthRequestUserSchemaType) {
        const { email, password } = body;
        const user = await UsersModel.getMapperWithWarning().getUserByEmail(email);
        const userData = user?.getData();
        if (!userData) {
            throw new ErrorNoSuchUser();
        }
        if (!this.validatePassword(password, userData)) {
            throw new ErrorInvalidPassword();
        }
        return user;
    }

    static getInstance() {
        if (!UsersModel.instance) {
            UsersModel.instance = new UsersModel();
        }
        return UsersModel.instance;
    }

    private static getMapperWithWarning() {
        if (!UsersModel.mapper) {
            throw new ErrorNoMapper();
        }
        return UsersModel.mapper;
    }

    static setMapper(mapper: UsersMapper) {
        UsersModel.mapper = mapper;
        UsersModel.mapper;
    }
}
