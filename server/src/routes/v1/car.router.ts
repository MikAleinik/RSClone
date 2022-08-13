import { FastifyPluginAsync } from 'fastify';
import { CarsController } from '../../controller/car.controller';
import { RouterPath } from '../../types/enums';
import { SchemaTypeString } from '../../types/types';

const carSchema = {
    type: 'object',
    properties: {
        id: SchemaTypeString,
        name: SchemaTypeString,
    },
};

const getAllCarsOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: carSchema,
            },
        },
    },
    handler: CarsController.getInstance().processGetAllCars,
};

const cars: FastifyPluginAsync = async (fastify, options): Promise<void> => {
    fastify.get(`/${RouterPath.CARS}`, getAllCarsOpts);
    fastify.get(`/${RouterPath.CARS}/:id`, getAllCarsOpts);
};

export default cars;
