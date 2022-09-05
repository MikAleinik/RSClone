import { ContentTypeJson } from '../types/types';
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

    async getAllCargos() {
        return await CargosModel.getMapperWithWarning().getAllCargo();
    }

    async getAllCargosByCar(id: number) {
        return await CargosModel.getMapperWithWarning().getByCar(id);
    }

    async createNewCargo(body: CreateCargoSchemaType) {
        return await CargosModel.mapper.createCargo({ ...body, user_id: body.jwtDecoded.id });
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
        if (userId !== cargo.getData().user_id) {
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
