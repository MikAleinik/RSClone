import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { AuthController } from '../../controller/auth.controller';
import { CarsController } from '../../controller/car.controller';
import { CarsModel } from '../../model/car.model';
import { CarMapper } from '../../model/mappers/car.mapper';
import { ErrorReplySchema } from '../../schema/general.schema';
import { RouterPath } from '../../types/enums';
import { IBodyWithJWT } from '../../types/interfaces';

export type CreateCarSchemaType = FromSchema<typeof CreateCarSchema> & IBodyWithJWT;
export type CarSchemaType = FromSchema<typeof CarSchema>;
export type ReplyAllCarsType = FromSchema<typeof ReplyAllCar>;

// interface

export interface IQueryCarByUserOrCargo {
    userId: number;
    cargoId: number;
}

// Schemas

export const CreateCarSchema = {
    type: 'object',
    properties: {
        model: { type: 'string' },
        description: { type: 'string' },
        point_current_lat: { type: 'number' },
        point_current_lon: { type: 'number' },
        route_lat: {
            type: ['array', 'null'],
            items: { type: 'number' },
        },
        route_lon: {
            type: ['array', 'null'],
            items: { type: 'number' },
        },
        price: { type: 'number' },
        currency: { type: 'string' },
        volume_max: { type: 'number' },
        weight_max: { type: 'number' },
    },
    required: ['point_current_lat', 'point_current_lon'],
    additionalProperties: false,
} as const;

export const CarSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        user_id: { type: 'number' },
        model: { type: 'string' },
        description: { type: 'string' },
        point_current_lat: { type: 'number' },
        point_current_lon: { type: 'number' },
        route_lat: {
            type: ['array', 'null'],
            items: { type: 'number' },
        },
        route_lon: {
            type: ['array', 'null'],
            items: { type: 'number' },
        },
        date_start: { type: ['string', 'null'] },
        price: { type: 'number' },
        currency: { type: 'string' },
        volume_max: { type: 'number' },
        weight_max: { type: 'number' },
    },
} as const;

export const ReplyAllCar = {
    type: 'object',
    properties: {
        items: {
            type: 'array',
            items: CarSchema,
        },
    },
    additionalProperties: false,
} as const;

// Optiions

const getAllCarsByUserOpts = {
    schema: {
        tags: ['Cars'],
        description: 'Get all user`s cargos',
        querystring: {
            userId: { type: 'number' },
            carId: { type: 'number' },
        },
        response: {
            200: ReplyAllCar,
            400: ErrorReplySchema,
            401: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CarsController.getInstance().getAllCarsByUserFunc(),
};

const getCargoByUUIDOpts = {
    schema: {
        tags: ['Cars'],
        description: 'Get cargo by Id',
        response: {
            200: CarSchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CarsController.getInstance().getCarByUUIDFunc(),
};

const changeCargoByUUIDOpts = {
    schema: {
        tags: ['Cars'],
        description: 'Change cargo by Id',
        body: CreateCarSchema,
        response: {
            200: CarSchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CarsController.getInstance().changeCarByUUIDFunc(),
};

const deleteCarByUUIDOpts = {
    schema: {
        tags: ['Cars'],
        description: 'Delete cargo by Id',
        response: {
            200: {},
            400: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CarsController.getInstance().deleteCarByUUIDFunc(),
};

const createCarOpts = {
    schema: {
        tags: ['Cars'],
        description: 'Create new car',
        body: CreateCarSchema,
        response: {
            201: CarSchema,
            401: ErrorReplySchema,
            405: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: CarsController.getInstance().createNewCarFunc(),
};

const cars: FastifyPluginAsync = async (fastify, options): Promise<void> => {
    options;
    CarsModel.setMapper(new CarMapper(fastify.db));
    fastify.get<{ Querystring: IQueryCarByUserOrCargo; Reply: ReplyAllCarsType }>(
        `/${RouterPath.CARS}`,
        getAllCarsByUserOpts
    );
    // fastify.get<{ Reply: ReplyAllCargosType }>(`/${RouterPath.CARGO}`, getAllCargosOpts);
    fastify.post(`/${RouterPath.CARS_REGISTER}`, createCarOpts);
    fastify.get(`/${RouterPath.CARS}/:id`, getCargoByUUIDOpts);
    fastify.put(`/${RouterPath.CARS}/:id`, changeCargoByUUIDOpts);
    fastify.delete(`/${RouterPath.CARS}/:id`, deleteCarByUUIDOpts);
};

export default cars;
