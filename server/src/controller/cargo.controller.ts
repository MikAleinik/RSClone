import { ContentTypeJson } from '../types/types';
import { ErrorCodes, OkCodes } from '../types/enums';
import { User } from '../model/vo/user';
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

export class CargoController {
    private static instance: CargoController;

    private constructor() {
        //do nothing
    }

    getAllCargosByUserFunc(): RouteHandler<{ Querystring: IQueryCargoByUser; Reply: ReplyAllCargosType }> {
        return async (req, res) => {
            const { userId } = req.query;
            try {
                const cargos = await CargosModel.getInstance().getAllCargosByUser(userId);
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
                const oldCargo = await CargosModel.getInstance().getById(id);
                if (!oldCargo) {
                    throw new Error(`Cargo with id = ${id} not found`);
                }
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

    changeUserByUUIDFunc(): RouteHandler<{ Body: CargoSchemaType; Reply: CargoSchemaType | ErrorReplyType }> {
        return async (req, res) => {
            //TODO add implementation
            const user = new User(0); //await usersRepo.addUser({ name, login, password });
            res.code(OkCodes.CREATED);
            res.header(ContentTypeJson[0], ContentTypeJson[1]);
            res.send(user.toJsonResponse());
        };
    }

    deleteUserByUUIDFunc(): RouteHandler<{ Body: CargoSchemaType }> {
        return async (req, res) => {
            //TODO add implementation
            res.code(OkCodes.CREATED);
            res.header(ContentTypeJson[0], ContentTypeJson[1]);
            res.send({});
        };
    }

    static getInstance() {
        if (!CargoController.instance) {
            CargoController.instance = new CargoController();
        }
        return CargoController.instance;
    }
}
