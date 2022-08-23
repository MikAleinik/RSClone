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

    async updateCargo(body: CreateCargoSchemaType, id: number) {
        const { jwtDecoded } = body;
        await CargosModel.getInstance().checkCargoByIdAndUser(id, jwtDecoded.id);
        return await CargosModel.mapper.changeCargo(id, body);
    }

    checkMapper() {
        if (!CargosModel.mapper) {
            throw new ErrorNoMapper();
        }
    }

    async checkCargoByIdAndUser(id: number, userId: number) {
        const cargo = await CargosModel.mapper.getById(id);
        if (!cargo) {
            throw new Error(`No cargo with id = ${id}`);
        }
        if (userId !== cargo.user_id) {
            throw new Error(`Cargo ${id} doesn't belong to user ${userId}`);
        }
    }

    async deleteCargoByUUID(id: number, userId: number) {
        await CargosModel.getInstance().checkCargoByIdAndUser(id, userId);
        await CargosModel.mapper.deleteCargo(id);
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
