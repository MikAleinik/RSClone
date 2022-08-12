import { FastifyPluginAsync } from 'fastify';
import { AuthController } from '../controller/auth.controller';
import { UsersController } from '../controller/user.controller';
import { RouterPath } from '../types/enums';
import { RegisterRequestUserSchemaType, SchemaTypeString } from '../types/types';
import { ErrorReplySchema, UserReplySchema } from '../schema/general.schema';
import { Type } from '@sinclair/typebox';

export const RegisterUserSchema = Type.Object({
    email: Type.String({ format: 'email' }),
    login: Type.String(),
    password: Type.String(),
});

const getAllUsersOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: UserReplySchema,
            },
            400: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWT],
    handler: UsersController.getInstance().processGetAllUsers,
};

const getUserByUUIDOpts = {
    schema: {
        response: {
            200: UserReplySchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWT],
    handler: UsersController.getInstance().processGetUserByUUID,
};

const changeUserByUUIDOpts = {
    schema: {
        body: RegisterUserSchema,
        response: {
            200: UserReplySchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
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
        body: RegisterUserSchema,
        response: {
            201: UserReplySchema,
            401: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    handler: UsersController.getInstance().processCreateNewUser,
};

const users: FastifyPluginAsync = async (fastify, options): Promise<void> => {
    options;
    fastify.get(`/${RouterPath.USERS}`, getAllUsersOpts);
    fastify.post<{ Body: RegisterRequestUserSchemaType }>(`/${RouterPath.USERS_REGISTER}`, createUserOpts);
    fastify.get(`/${RouterPath.USERS}/:id`, getUserByUUIDOpts);
    fastify.put<{ Body: RegisterRequestUserSchemaType }>(`/${RouterPath.USERS}/:id`, changeUserByUUIDOpts);
    fastify.delete(`/${RouterPath.USERS}/:id`, deleteUserByUUIDOpts);
};

export default users;
