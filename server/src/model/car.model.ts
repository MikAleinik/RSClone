import { ContentTypeJson } from '../types/types';
import { ErrorNoMapper } from '../errors/ErrorNoMapper';
import { CarMapper } from './mappers/car.mapper';
import { CreateCarSchemaType } from '../routes/v1/car.router';

export class CarsModel {
    private static instance: CarsModel;
    private static mapper: CarMapper;

    private constructor() {
        //do nothing
    }

    errorHandler(error: Error, res: any) {
        res.header(...ContentTypeJson);
        res.send({ message: error.message });
    }

    async getById(id: number) {
        return await CarsModel.getMapperWithWarning().getById(id);
    }

    async getAllCarsByUser(id: number) {
        return await CarsModel.getMapperWithWarning().getByPropValue('user_id', id);
    }

    async getAllCars() {
        return await CarsModel.getMapperWithWarning().getAllCars();
    }

    async getAllCarsByCargo(id: number) {
        return await CarsModel.getMapperWithWarning().getByCargo(id);
    }

    async createNewCar(body: CreateCarSchemaType) {
        return await CarsModel.getMapperWithWarning().createCar({ ...body, user_id: body.jwtDecoded.id });
    }

    async updateCar(body: CreateCarSchemaType, id: number) {
        const { jwtDecoded } = body;
        await CarsModel.getInstance().checkCarByIdAndUser(id, jwtDecoded.id);
        return await CarsModel.getMapperWithWarning().changeCar(id, body);
    }

    checkMapper() {
        if (!CarsModel.mapper) {
            throw new ErrorNoMapper();
        }
    }

    async checkCarByIdAndUser(id: number, userId: number) {
        const car = await CarsModel.getMapperWithWarning().getById(id);
        if (!car) {
            throw new Error(`No car with id = ${id}`);
        }
        if (userId !== car.getData().user_id) {
            throw new Error(`Car ${id} doesn't belong to user ${userId}`);
        }
    }

    async deleteCarByUUID(id: number, userId: number) {
        await CarsModel.getInstance().checkCarByIdAndUser(id, userId);
        await CarsModel.mapper.deleteCar(id);
    }

    static getInstance() {
        if (!CarsModel.instance) {
            CarsModel.instance = new CarsModel();
        }
        return CarsModel.instance;
    }

    private static getMapperWithWarning() {
        if (!CarsModel.mapper) {
            throw new ErrorNoMapper();
        }
        return CarsModel.mapper;
    }

    static setMapper(mapper: CarMapper) {
        CarsModel.mapper = mapper;
        CarsModel.mapper;
    }
}
