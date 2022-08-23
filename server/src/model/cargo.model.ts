import { OkCodes } from '../types/enums';
import { ContentTypeJson } from '../types/types';
import { User } from './vo/user';
import { matchPassword } from './util/password.manager';
import { ErrorNoMapper } from '../errors/ErrorNoMapper';
import { CreateCargoSchemaType } from '../routes/v1/cargo.router';
import { CargoMapper } from './mappers/cargo.mapper';

export class CargosModel {
    private static instance: CargosModel;
    private static mapper: CargoMapper;

    private constructor() {
        //do nothing
    }

    errorHandler(error: Error, res: any) {
        res.header(...ContentTypeJson);
        res.send({ message: error.message });
    }

    async getById(id: number) {
        return await CargosModel.getMapperWithWarning().getById(id);
    }

    async getAllCargosByUser(id: number) {
        return await CargosModel.getMapperWithWarning().getByPropValue('user_id', id);
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

    async createNewCargo(body: CreateCargoSchemaType) {
        const {
            type_id,
            point_start_lat,
            point_start_lon,
            point_start_name,
            point_end_lat,
            point_end_lon,
            point_end_name,
            weigth,
            price,
            currency_id,
            volume,
            jwtDecoded,
        } = body;
        return await CargosModel.mapper.createCargo(
            type_id,
            jwtDecoded.id,
            point_start_lat,
            point_start_lon,
            point_start_name,
            point_end_lat,
            point_end_lon,
            point_end_name,
            weigth,
            price,
            currency_id,
            volume
        );
    }

    checkMapper() {
        if (!CargosModel.mapper) {
            throw new ErrorNoMapper();
        }
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

        const user = new User(0); //await usersRepo.addUser({ name, login, password });
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

        const user = new User(0); //await usersRepo.addUser({ name, login, password });
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
        if (!CargosModel.instance) {
            CargosModel.instance = new CargosModel();
        }
        return CargosModel.instance;
    }

    private static getMapperWithWarning() {
        if (!CargosModel.mapper) {
            throw new ErrorNoMapper();
        }
        return CargosModel.mapper;
    }

    static setMapper(mapper: CargoMapper) {
        CargosModel.mapper = mapper;
        CargosModel.mapper;
    }
}
