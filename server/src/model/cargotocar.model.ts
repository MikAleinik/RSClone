import { ContentTypeJson } from '../types/types';
import { ErrorNoMapper } from '../errors/ErrorNoMapper';
import { CargoToCarsMapper } from './mappers/cargotocar.mapper';
import { CargosModel } from './cargo.model';
import { ChangeCargoToCarsSchemaType, CreateCargoToCarsSchemaType } from '../routes/v1/cargotocar.router';
import { CarsModel } from './car.model';

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

    async updateCargoToCars(body: ChangeCargoToCarsSchemaType, id: number) {
        const { jwtDecoded } = body;
        const cargoToCar = await CargoToCarModel.getInstance().getById(id);
        if (!cargoToCar) {
            throw new Error(`${id}`);
        }
        const car = await CarsModel.getInstance().getById(cargoToCar.getData().id_cars);
        if (!car) {
            throw new Error('No car');
        }
        const carData = car.getData();
        if (carData.user_id !== jwtDecoded.id) {
            throw new Error(
                `updateCargoToCars can perform only carId = ${carData.id} ownder (${carData.user_id}) but not ${jwtDecoded.id}`
            );
        }
        return await CargoToCarModel.mapper.changeCargoToCar(id, body);
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
        const cargoToCar = await CargoToCarModel.getInstance().getById(id);
        if (!cargoToCar) {
            throw new Error(`${id}`);
        }
        await CargoToCarModel.getInstance().checkCargoByIdAndUser(cargoToCar.getData().id_cargo, userId);
        await CargoToCarModel.mapper.deleteCargoToCars(id);
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
