import { ErrorNoSuchUser } from '../errors/ErrorNoSuchUser';
import { ErrorCreateNewUser } from '../errors/ErrorCreateNewUser';
import { OkCodes } from '../types/enums';
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

    async checkUniqueEmail(email: string) {
        //TODO add check
        return true;
    }

    async getUserByEmail(email: string) {
        const user = await UsersModel.getMapperWithWarning().getUserByEmail(email);
        if (!user) {
            return null;
        }
        return user;
    }

    async getUserById(id: number) {
        return await UsersModel.getMapperWithWarning().getUserById(id);
    }

    validatePassword(password: string, user: User) {
        return matchPassword(password, user.password);
    }

    async processGetAllUsers(req: any, res: any) {
        // const users = await usersRepo.getAll();
        // const objUsers = users.map((user) => user.toJsonResponse());
        res.code(OkCodes.OK);
        res.header(...ContentTypeJson);
        res.send([]);
    }

    async processCreateNewUser(body: RegisterUserSchemaType) {
        const {
            email,
            login,
            password,
            first_name,
            last_name,
            role_id,
            company,
            address,
            point_lat,
            point_lon,
            phone,
        } = body;
        const oldUser = await UsersModel.getMapperWithWarning().getUserByEmail(email);
        if (oldUser) {
            throw new ErrorCreateNewUser();
        }
        return await UsersModel.mapper.createUser(
            login,
            password,
            email,
            role_id,
            first_name,
            last_name,
            phone,
            company,
            address,
            0,
            point_lat,
            point_lon
        );
    }

    checkMapper() {
        if (!UsersModel.mapper) {
            throw new ErrorNoMapper();
        }
    }

    async processAuthorizeUser(body: AuthRequestUserSchemaType) {
        const { email, password } = body;
        const user = await UsersModel.getMapperWithWarning().getUserByEmail(email);
        if (!user) {
            throw new ErrorNoSuchUser();
        }
        if (!this.validatePassword(password, user)) {
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
