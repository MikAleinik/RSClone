import { FastifyPluginAsync } from 'fastify';
import { AuthController } from '../../controller/auth.controller';
import { RouterPath } from '../../types/enums';
import { ErrorReplySchema } from '../../schema/general.schema';
import { FromSchema } from 'json-schema-to-ts';
import { CargoController } from '../../controller/cargo.controller';
import { IBodyWithJWT } from '../../types/interfaces';
import { CargoToCarModel } from '../../model/cargotocar.model';
import { CargoToCarsMapper } from '../../model/mappers/cargotocar.mapper';
import { CargoToCarsController } from '../../controller/cargotocar.controller';

// export Schema types

export type CreateCargoToCarsSchemaType = FromSchema<typeof CreateCargoToCarsSchema> & IBodyWithJWT;
export type CargoToCarsSchemaType = FromSchema<typeof CargoToCarsSchema>;
export type ReplyAllCargosToCarsType = FromSchema<typeof ReplyAllCargosToCars>;

// Schemas

export const CreateCargoToCarsSchema = {
    type: 'object',
    properties: {
        id_cargo: { type: 'number' },
        id_cars: { type: 'number' },
    },
    required: ['id_cargo', 'id_cars'],
    additionalProperties: false,
} as const;

export const CargoToCarsSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        id_cargo: { type: 'number' },
        id_cars: { type: 'number' },
        agree: { type: 'string' },
    },
} as const;

export const ReplyAllCargosToCars = {
    type: 'object',
    properties: {
        items: {
            type: 'array',
            items: CargoToCarsSchema,
        },
    },
    additionalProperties: false,
} as const;

// Optiions

const getAllCargosByCarOpts = {
    schema: {
        tags: ['Cargo to Cars'],
        description: 'Get all cargos in car by car id',
        response: {
            200: ReplyAllCargosToCars,
            400: ErrorReplySchema,
            401: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CargoToCarsController.getInstance().getAllCargosByCarFunc(),
};

const getAllCargoToCars = {
    schema: {
        tags: ['Cargo to Cars'],
        description: 'Get all cargos_to_cars',
        response: {
            200: ReplyAllCargosToCars,
            400: ErrorReplySchema,
            401: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CargoToCarsController.getInstance().getAllCargosFunc(),
};

const getCargoByUUIDOpts = {
    schema: {
        tags: ['Cargo to Cars'],
        description: 'Get  by Id',
        response: {
            200: CargoToCarsSchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CargoToCarsController.getInstance().getCargoByUUIDFunc(),
};

const changeCargoByUUIDOpts = {
    schema: {
        tags: ['Cargo to Cars'],
        description: 'Change cargo by Id',
        body: CreateCargoToCarsSchema,
        response: {
            200: CargoToCarsSchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CargoController.getInstance().changeCargoByUUIDFunc(),
};

const deleteCargoByUUIDOpts = {
    schema: {
        tags: ['Cargo to Cars'],
        description: 'Delete cargo by Id',
        response: {
            200: {},
            400: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CargoController.getInstance().deleteCargoByUUIDFunc(),
};

const createCargoToCarOpts = {
    schema: {
        tags: ['Cargo to Cars'],
        description: 'Create new cargo to carry/truck',
        body: CreateCargoToCarsSchema,
        response: {
            201: CargoToCarsSchema,
            401: ErrorReplySchema,
            405: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CargoToCarsController.getInstance().createNewCargoToCarFunc(),
};

const cargotocar: FastifyPluginAsync = async (fastify, options): Promise<void> => {
    options;
    CargoToCarModel.setMapper(new CargoToCarsMapper(fastify.db));
    fastify.get(`/${RouterPath.CARGO_TO_CAR}/getcarbycargo/:id`, getAllCargosByCarOpts);
    fastify.get(`/${RouterPath.CARGO_TO_CAR}/getcargosbycar/:id`, getAllCargosByCarOpts);
    fastify.post(`/${RouterPath.CARGO_TO_CAR_REGISTER}`, createCargoToCarOpts);
    fastify.get(`/${RouterPath.CARGO_TO_CAR}`, getAllCargoToCars);
    fastify.get(`/${RouterPath.CARGO_TO_CAR}/:id`, getCargoByUUIDOpts);
    fastify.put(`/${RouterPath.CARGO_TO_CAR}/:id`, changeCargoByUUIDOpts);
    fastify.delete(`/${RouterPath.CARGO_TO_CAR}/:id`, deleteCargoByUUIDOpts);
};

export default cargotocar;
