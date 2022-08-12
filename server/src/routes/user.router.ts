import { FastifyPluginAsync } from 'fastify';
import { AuthController } from '../controller/auth.controller';
import { UsersController } from '../controller/user.controller';
import { RouterPath } from '../types/enums';
import { SchemaTypeString } from '../types/types';
import { errorSchema, userReplySchema } from '../schema/general.schema';

const registerUserBodySchema = {
    type: 'object',
    properties: {
        email: SchemaTypeString,
        login: SchemaTypeString,
        password: SchemaTypeString,
    },
    required: ['email', 'login', 'password'],
};

const updateUserSchema = {
    type: 'object',
    properties: {
        email: SchemaTypeString,
        login: SchemaTypeString,
        password: SchemaTypeString,
    },
    required: ['email', 'login', 'password'],
};

const getAllUsersOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: userReplySchema,
            },
            400: errorSchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWT],
    handler: UsersController.getInstance().processGetAllUsers,
};

const getUserByUUIDOpts = {
    schema: {
        response: {
            200: userReplySchema,
            400: errorSchema,
            404: errorSchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWT],
    handler: UsersController.getInstance().processGetUserByUUID,
};

const changeUserByUUIDOpts = {
    schema: {
        body: updateUserSchema,
        response: {
            200: userReplySchema,
            400: errorSchema,
            404: errorSchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWT],
    handler: UsersController.getInstance().processChangeUserByUUID,
};

const deleteUserByUUIDOpts = {
    schema: {
        response: {},
    },
    preHandler: [AuthController.getInstance().verifyJWT],
    handler: UsersController.getInstance().processDeleteUserByUUID,
};

const createUserOpts = {
    schema: {
        body: registerUserBodySchema,
        response: {
            201: userReplySchema,
            401: errorSchema,
            404: errorSchema,
        },
    },
    handler: UsersController.getInstance().processCreateNewUser,
};

const users: FastifyPluginAsync = async (fastify, options): Promise<void> => {
    fastify.get(`/${RouterPath.USERS}`, getAllUsersOpts);
    fastify.post(`/${RouterPath.USERS_REGISTER}`, createUserOpts);
    fastify.get(`/${RouterPath.USERS}/:id`, getUserByUUIDOpts);
    fastify.put(`/${RouterPath.USERS}/:id`, changeUserByUUIDOpts);
    fastify.delete(`/${RouterPath.USERS}/:id`, deleteUserByUUIDOpts);
};

export default users;
