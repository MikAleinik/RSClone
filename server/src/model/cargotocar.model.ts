import { ContentTypeJson } from '../types/types';
import { ErrorNoMapper } from '../errors/ErrorNoMapper';
import { CreateCargoSchemaType } from '../routes/v1/cargo.router';
import { CargoToCarsMapper } from './mappers/cargotocar.mapper';
import { CargosModel } from './cargo.model';
import { CreateCargoToCarsSchemaType } from '../routes/v1/cargotocar.router';

export class CargoToCarModel {
    private static instance: CargoToCarModel;
    private static mapper: CargoToCarsMapper;

    private constructor() {
        //do nothing
    }

    errorHandler(error: Error, res: any) {
        res.header(...ContentTypeJson);
        res.send({ message: error.message });
    }

    async getById(id: number) {
        return await CargoToCarModel.getMapperWithWarning().getById(id);
    }

    async getAllCargosByUser(id: number) {
        return await CargoToCarModel.getMapperWithWarning().getByPropValue('user_id', id);
    }

    async getAllCargosToCars() {
        return await CargoToCarModel.getMapperWithWarning().getAllCargoToCars();
    }

    async getAllCargosByCar(id: number) {
        return await CargoToCarModel.getMapperWithWarning().getByCar(id);
    }

    async createNewCargoToCar(body: CreateCargoToCarsSchemaType) {
        const { id_cargo, jwtDecoded } = body;
        await CargosModel.getInstance().checkCargoByIdAndUser(id_cargo, jwtDecoded.id);
        return await CargoToCarModel.mapper.createCargoToCar({ ...body });
    }

    async updateCargo(body: CreateCargoSchemaType, id: number) {
        const { jwtDecoded } = body;
        await CargoToCarModel.getInstance().checkCargoByIdAndUser(id, jwtDecoded.id);
        return await CargoToCarModel.mapper.changeCargo(id, body);
    }

    checkMapper() {
        if (!CargoToCarModel.mapper) {
            throw new ErrorNoMapper();
        }
    }

    async checkCargoByIdAndUser(id: number, userId: number) {
        await CargosModel.getInstance().checkCargoByIdAndUser(id, userId);
    }

    async deleteCargoByUUID(id: number, userId: number) {
        await CargoToCarModel.getInstance().checkCargoByIdAndUser(id, userId);
        await CargoToCarModel.mapper.deleteCargo(id);
    }

    static getInstance() {
        if (!CargoToCarModel.instance) {
            CargoToCarModel.instance = new CargoToCarModel();
        }
        return CargoToCarModel.instance;
    }

    private static getMapperWithWarning() {
        if (!CargoToCarModel.mapper) {
            throw new ErrorNoMapper();
        }
        return CargoToCarModel.mapper;
    }

    static setMapper(mapper: CargoToCarsMapper) {
        CargoToCarModel.mapper = mapper;
        CargoToCarModel.mapper;
    }
}
