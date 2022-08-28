import { ContentTypeJson } from '../types/types';
import { ErrorCodes, OkCodes } from '../types/enums';
import { RouteHandler } from 'fastify';
import { ErrorReplyType } from '../schema/general.schema';
import {
    CargoSchemaType,
    CreateCargoSchemaType,
    IQueryCargoByUser,
    ReplyAllCargosType,
} from '../routes/v1/cargo.router';
import { CargosModel } from '../model/cargo.model';
import { Cargo } from '../model/vo/cargo';
import { IBodyWithJWT } from '../types/interfaces';

export class CargoController {
    private static instance: CargoController;

    private constructor() {
        //do nothing
    }

    getAllCargosByUserFunc(): RouteHandler<{ Querystring: IQueryCargoByUser; Reply: ReplyAllCargosType }> {
        return async (req, res) => {
            const { userId } = req.query;
            try {
                let cargos: (Cargo | null)[] | null;
                if (!userId) {
                    cargos = await CargosModel.getInstance().getAllCargos();
                } else {
                    cargos = await CargosModel.getInstance().getAllCargosByUser(userId);
                }
                res.code(OkCodes.OK);
                let items: Array<CargoSchemaType>;
                if (!cargos) {
                    items = new Array<CargoSchemaType>();
                } else {
                    items = cargos
                        .filter((item1) => item1 != undefined)
                        .filter((item2) => item2 !== null)
                        .map((item3) => (item3 as Cargo).toJsonResponse());
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
                const cargos = await CargosModel.getInstance().getAllCargos();
                res.code(OkCodes.OK);
                let items: Array<CargoSchemaType>;
                if (!cargos) {
                    items = new Array<CargoSchemaType>();
                } else {
                    items = cargos
                        .filter((item1) => item1 != undefined)
                        .filter((item2) => item2 !== null)
                        .map((item3) => (item3 as Cargo).toJsonResponse());
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

    createNewCargoFunc(): RouteHandler<{ Body: CreateCargoSchemaType; Reply: CargoSchemaType | ErrorReplyType }> {
        return async (req, res) => {
            try {
                const newCargo = await CargosModel.getInstance().createNewCargo(req.body);
                res.code(OkCodes.CREATED);
                res.send(newCargo.toJsonResponse());
            } catch (err) {
                res.code(ErrorCodes.BAD_REQUEST);
                res.header(ContentTypeJson[0], ContentTypeJson[1]);
                res.send({ message: (err as Error).message });
            }
        };
    }

    getCargoByUUIDFunc(): RouteHandler<{ Params: { id: number }; Reply: CargoSchemaType | ErrorReplyType }> {
        return async (req, res) => {
            try {
                const { id } = req.params;
                const oldCargo = await CargoController.getInstance().getById(id);
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

    changeCargoByUUIDFunc(): RouteHandler<{
        Params: { id: number };
        Body: CreateCargoSchemaType;
        Reply: CargoSchemaType;
    }> {
        return async (req, res) => {
            try {
                const { id } = req.params;
                const cargo = await CargosModel.getInstance().updateCargo(req.body, id);
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
        const oldCargo = await CargosModel.getInstance().getById(id);
        if (!oldCargo) {
            throw new Error(`Cargo with id = ${id} not found`);
        }
        return oldCargo;
    }

    deleteCargoByUUIDFunc(): RouteHandler<{ Params: { id: number } }> {
        return async (req, res) => {
            try {
                const { id } = req.params;
                const { jwtDecoded } = req.body as IBodyWithJWT;
                await CargosModel.getInstance().deleteCargoByUUID(id, jwtDecoded.id);
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
        if (!CargoController.instance) {
            CargoController.instance = new CargoController();
        }
        return CargoController.instance;
    }
}
