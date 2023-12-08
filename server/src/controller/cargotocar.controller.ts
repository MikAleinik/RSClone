import { ContentTypeJson } from '../types/types';
import { ErrorCodes, OkCodes } from '../types/enums';
import { RouteHandler } from 'fastify';
import { ErrorReplyType } from '../schema/general.schema';
import { CargoSchemaType, ReplyAllCargosType } from '../routes/v1/cargo.router';
import { CargosModel } from '../model/cargo.model';
import { IBodyWithJWT } from '../types/interfaces';
import { CargoToCarModel } from '../model/cargotocar.model';
import {
    CargoToCarsSchemaType,
    ChangeCargoToCarsSchemaType,
    CreateCargoToCarsSchemaType,
} from '../routes/v1/cargotocar.router';

export class CargoToCarsController {
    private static instance: CargoToCarsController;

    private constructor() {
        //do nothing
    }

    getAllCargosByCarFunc(): RouteHandler<{ Params: { id: number }; Reply: ReplyAllCargosType }> {
        return async (req, res) => {
            try {
                const { id } = req.params;
                const cargos = await CargosModel.getInstance().getAllCargosByCar(id);
                res.code(OkCodes.OK);
                let items: Array<CargoSchemaType>;
                if (!cargos) {
                    items = new Array<CargoSchemaType>();
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

    getAllCargosFunc(): RouteHandler<{ Reply: ReplyAllCargosType }> {
        return async (req, res) => {
            try {
                const cargosToCars = await CargoToCarModel.getInstance().getAllCargosToCars();
                res.code(OkCodes.OK);
                let items: Array<CargoSchemaType>;
                if (!cargosToCars) {
                    items = new Array<CargoSchemaType>();
                } else {
                    items = cargosToCars
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

    createNewCargoToCarFunc(): RouteHandler<{
        Body: CreateCargoToCarsSchemaType;
        Reply: CargoSchemaType | ErrorReplyType;
    }> {
        return async (req, res) => {
            try {
                const newCargoToCars = await CargoToCarModel.getInstance().createNewCargoToCar(req.body);
                res.code(OkCodes.CREATED);
                res.send(newCargoToCars.toJsonResponse());
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send({ message: (err as Error).message });
            }
        };
    }

    getCargoByUUIDFunc(): RouteHandler<{ Params: { id: number }; Reply: CargoToCarsSchemaType | ErrorReplyType }> {
        return async (req, res) => {
            try {
                const { id } = req.params;
                const oldCargo = await CargoToCarsController.getInstance().getById(id);
                res.code(OkCodes.OK);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send(oldCargo.toJsonResponse());
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send({ message: (err as Error).message });
            }
        };
    }

    changeCargoToCarByUUIDFunc(): RouteHandler<{
        Params: { id: number };
        Body: ChangeCargoToCarsSchemaType;
        Reply: CargoSchemaType;
    }> {
        return async (req, res) => {
            try {
                const { id } = req.params;
                const cargo = await CargoToCarModel.getInstance().changeCargoToCars(req.body, id);
                res.code(OkCodes.OK);
                res.send(cargo?.toJsonResponse());
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send({ message: (err as Error).message });
            }
        };
    }

    async getById(id: number) {
        const oldCargo = await CargoToCarModel.getInstance().getById(id);
        if (!oldCargo) {
            throw new Error(`CargoToCars with id = ${id} not found`);
        }
        return oldCargo;
    }

    deleteCargoToCarByUUIDFunc(): RouteHandler<{ Params: { id: number } }> {
        return async (req, res) => {
            try {
                const { id } = req.params;
                const { jwtDecoded } = req.body as IBodyWithJWT;
                await CargoToCarModel.getInstance().deleteCargoToCarsByUUID(id, jwtDecoded.id);
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
        if (!CargoToCarsController.instance) {
            CargoToCarsController.instance = new CargoToCarsController();
        }
        return CargoToCarsController.instance;
    }
}
