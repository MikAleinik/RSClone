import { FastifyPluginAsync } from 'fastify';
import { AuthController } from '../../controller/auth.controller';
import { RouterPath } from '../../types/enums';
import { ErrorReplySchema } from '../../schema/general.schema';
import { FromSchema } from 'json-schema-to-ts';
import { CargoController } from '../../controller/cargo.controller';
import { IBodyWithJWT } from '../../types/interfaces';
import { CargosModel } from '../../model/cargo.model';
import { CargoMapper } from '../../model/mappers/cargo.mapper';

// export Schema types

export type CreateCargoSchemaType = FromSchema<typeof CreateCargoSchema> & IBodyWithJWT;
export type CargoSchemaType = FromSchema<typeof CargoSchema>;
export type ReplyAllCargosType = FromSchema<typeof ReplyAllCargos>;

// Query interface

export interface IQueryCargoByUser {
    userId: number;
    carId: number;
}

// Schemas

export const CreateCargoSchema = {
    type: 'object',
    properties: {
        user_id: { type: 'number' },
        point_start_lat: { type: 'number' },
        point_start_lon: { type: 'number' },
        point_end_lat: { type: 'number' },
        point_end_lon: { type: 'number' },
        price: { type: 'number' },
        currency: { type: 'string' },
        volume: { type: 'number' },
        weigth: { type: 'number' },
        finished: { type: 'string' },
        description: { type: 'string' },
    },
    required: ['point_start_lat', 'point_start_lon', 'point_end_lat', 'point_end_lon', 'volume', 'weigth'],
    additionalProperties: false,
} as const;

export const CargoSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        user_id: { type: 'number' },
        point_start_lat: { type: 'number' },
        point_start_lon: { type: 'number' },
        point_end_lat: { type: 'number' },
        point_end_lon: { type: 'number' },
        price: { type: 'number' },
        currency: { type: 'string' },
        volume: { type: 'number' },
        weigth: { type: 'number' },
        finished: { type: 'boolean' },
        description: { type: 'string' },
    },
} as const;

export const ReplyAllCargos = {
    type: 'object',
    properties: {
        items: {
            type: 'array',
            items: CargoSchema,
        },
    },
    additionalProperties: false,
} as const;

// Optiions

const getAllCargosByUserOpts = {
    schema: {
        tags: ['Cargo'],
        description: 'Get all user`s cargos',
        querystring: {
            userId: { type: 'number' },
            carId: { type: 'number' },
        },
        response: {
            200: ReplyAllCargos,
            400: ErrorReplySchema,
            401: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CargoController.getInstance().getAllCargosByUserFunc(),
};

const getCargoByUUIDOpts = {
    schema: {
        tags: ['Cargo'],
        description: 'Get cargo by Id',
        response: {
            200: CargoSchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CargoController.getInstance().getCargoByUUIDFunc(),
};

const changeCargoByUUIDOpts = {
    schema: {
        tags: ['Cargo'],
        description: 'Change cargo by Id',
        body: CreateCargoSchema,
        response: {
            200: CargoSchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CargoController.getInstance().changeCargoByUUIDFunc(),
};

const deleteCargoByUUIDOpts = {
    schema: {
        tags: ['Cargo'],
        description: 'Delete cargo by Id',
        response: {
            200: {},
            400: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CargoController.getInstance().deleteCargoByUUIDFunc(),
};

const createCargoOpts = {
    schema: {
        tags: ['Cargo'],
        description: 'Create new cargo to carry/truck',
        body: CreateCargoSchema,
        response: {
            201: CargoSchema,
            401: ErrorReplySchema,
            405: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CargoController.getInstance().createNewCargoFunc(),
};

const cargo: FastifyPluginAsync = async (fastify, options): Promise<void> => {
    options;
    CargosModel.setMapper(new CargoMapper(fastify.db));
    fastify.get<{ Querystring: IQueryCargoByUser; Reply: ReplyAllCargosType }>(
        `/${RouterPath.CARGO}`,
        getAllCargosByUserOpts
    );
    // fastify.get<{ Reply: ReplyAllCargosType }>(`/${RouterPath.CARGO}`, getAllCargosOpts);
    fastify.post(`/${RouterPath.CARGO_REGISTER}`, createCargoOpts);
    fastify.get(`/${RouterPath.CARGO}/:id`, getCargoByUUIDOpts);
    fastify.put(`/${RouterPath.CARGO}/:id`, changeCargoByUUIDOpts);
    fastify.delete(`/${RouterPath.CARGO}/:id`, deleteCargoByUUIDOpts);
};

export default cargo;
