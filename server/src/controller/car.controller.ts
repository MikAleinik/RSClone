import { ContentTypeJson, RecordStringUnknown } from '../types/types';
import { ErrorCodes, OkCodes } from '../types/enums';
import { RouteHandler } from 'fastify';
import { ErrorReplyType } from '../schema/general.schema';
import { CargosModel } from '../model/cargo.model';
import { IBodyWithJWT } from '../types/interfaces';
import { DBDataVO } from '../model/vo/db.data';
import { CarSchemaType, CreateCarSchemaType, IQueryCarByUserOrCargo, ReplyAllCarsType } from '../routes/v1/car.router';
import { CarsModel } from '../model/car.model';
import { Car } from '../model/vo/car';

export class CarsController {
    private static instance: CarsController;

    private constructor() {
        //do nothing
    }

    getAllCarsByUserFunc(): RouteHandler<{ Querystring: IQueryCarByUserOrCargo; Reply: ReplyAllCarsType }> {
        return async (req, res) => {
            const { userId, cargoId } = req.query;
            try {
                let cars: DBDataVO<Car, RecordStringUnknown>[] | null;
                if (!userId) {
                    if (cargoId) {
                        cars = await CarsModel.getInstance().getAllCarsByCargo(cargoId);
                    } else {
                        cars = await CarsModel.getInstance().getAllCars();
                    }
                } else {
                    cars = await CarsModel.getInstance().getAllCarsByUser(userId);
                }
                res.code(OkCodes.OK);
                let items: Array<CarSchemaType>;
                if (!cars) {
                    items = new Array<CarSchemaType>();
                } else {
                    items = cars
                        .filter((item1) => item1.getData() != undefined && item1.getData() !== null)
                        .map((item3) => item3.toJsonResponse())
                        .map((item4) => {
                            if (item4.date_start != null) {
                                item4.date_start = (item4.date_start as Date).toUTCString();
                            }
                            return item4;
                        });
                }
                const rp = {
                    items: items,
                };
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send(rp);
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send();
            }
        };
    }

    getAllCargosFunc(): RouteHandler<{ Reply: ReplyAllCarsType }> {
        return async (req, res) => {
            try {
                const cargos = await CargosModel.getInstance().getAllCargos();
                res.code(OkCodes.OK);
                let items: Array<CarSchemaType>;
                if (!cargos) {
                    items = new Array<CarSchemaType>();
                } else {
                    items = cargos
                        .filter((item1) => item1.getData() != undefined && item1.getData() !== null)
                        .map((item3) => item3.toJsonResponse());
                }
                const rp = {
                    items: items,
                };
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send(rp);
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send();
            }
        };
    }

    createNewCarFunc(): RouteHandler<{ Body: CreateCarSchemaType; Reply: CarSchemaType | ErrorReplyType }> {
        return async (req, res) => {
            try {
                const newCar = await CarsModel.getInstance().createNewCar(req.body);
                res.code(OkCodes.CREATED);
                res.send(newCar.toJsonResponse());
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send({ message: (err as Error).message });
            }
        };
    }

    getCarByUUIDFunc(): RouteHandler<{ Params: { id: number }; Reply: CarSchemaType | ErrorReplyType }> {
        return async (req, res) => {
            try {
                const { id } = req.params;
                const oldCar = await CarsController.getInstance().getById(id);
                res.code(OkCodes.OK);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                const respCar = oldCar.toJsonResponse();
                if (respCar.date_start) {
                    respCar.date_start = (respCar.date_start as Date).toUTCString();
                }
                res.send(respCar);
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send({ message: (err as Error).message });
            }
        };
    }

    changeCarByUUIDFunc(): RouteHandler<{
        Params: { id: number };
        Body: CreateCarSchemaType;
        Reply: CarSchemaType;
    }> {
        return async (req, res) => {
            try {
                const { id } = req.params;
                const car = await CarsModel.getInstance().updateCar(req.body, id);
                res.code(OkCodes.OK);
                res.send(car?.toJsonResponse());
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send({ message: (err as Error).message });
            }
        };
    }

    async getById(id: number) {
        const oldCargo = await CarsModel.getInstance().getById(id);
        if (!oldCargo) {
            throw new Error(`Cargo with id = ${id} not found`);
        }
        return oldCargo;
    }

    deleteCarByUUIDFunc(): RouteHandler<{ Params: { id: number } }> {
        return async (req, res) => {
            try {
                const { id } = req.params;
                const { jwtDecoded } = req.body as IBodyWithJWT;
                await CarsModel.getInstance().deleteCarByUUID(id, jwtDecoded.id);
                res.code(OkCodes.OK);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send({});
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send({ message: (err as Error).message });
            }
        };
    }

    static getInstance() {
        if (!CarsController.instance) {
            CarsController.instance = new CarsController();
        }
        return CarsController.instance;
    }
}
