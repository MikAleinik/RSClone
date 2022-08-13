import { FastifyPluginAsync } from 'fastify';
import { AuthController } from '../../controller/auth.controller';
import { UsersController } from '../../controller/user.controller';
import { RouterPath } from '../../types/enums';
import { ErrorReplySchema } from '../../schema/general.schema';
// import { Type } from '@sinclair/typebox';
import { FromSchema } from 'json-schema-to-ts';

// export Schema types

export type RegisterUserSchemaType = FromSchema<typeof RegisterUserSchema>;
export type UserSchemaType = FromSchema<typeof UserSchema>;
export type ReplyAllUsersType = FromSchema<typeof ReplyAllUsers>;

// Schemas

export const RegisterUserSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        login: { type: 'string' },
        password: { type: 'string' },
    },
    required: ['email', 'login', 'password'],
    additionalProperties: false,
} as const;

export const UserSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        login: { type: 'string' },
    },
} as const;

export const ReplyAllUsers = {
    type: 'object',
    properties: {
        users: {
            type: 'array',
            items: UserSchema,
        },
    },
    additionalProperties: false,
} as const;

// Optiions

const getAllUsersOpts = {
    schema: {
        response: {
            200: ReplyAllUsers,
            400: ErrorReplySchema,
            401: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWT],
    handler: UsersController.getInstance().getAllUsersFunc(),
};

const getUserByUUIDOpts = {
    schema: {
        response: {
            200: UserSchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWT],
    handler: UsersController.getInstance().getUserByUUIDFunc(),
};

const changeUserByUUIDOpts = {
    schema: {
        body: RegisterUserSchema,
        response: {
            200: UserSchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWT],
    handler: UsersController.getInstance().changeUserByUUIDFunc(),
};

const deleteUserByUUIDOpts = {
    schema: {
        response: {
            200: {},
            400: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWT],
    handler: UsersController.getInstance().deleteUserByUUIDFunc(),
};

const createUserOpts = {
    schema: {
        body: RegisterUserSchema,
        response: {
            201: UserSchema,
            401: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    handler: UsersController.getInstance().createNewUserFunc(),
};

const users: FastifyPluginAsync = async (fastify, options): Promise<void> => {
    options;
    fastify.get(`/${RouterPath.USERS}`, getAllUsersOpts);
    fastify.post(`/${RouterPath.USERS_REGISTER}`, createUserOpts);
    fastify.get(`/${RouterPath.USERS}/:id`, getUserByUUIDOpts);
    fastify.put(`/${RouterPath.USERS}/:id`, changeUserByUUIDOpts);
    fastify.delete(`/${RouterPath.USERS}/:id`, deleteUserByUUIDOpts);
};

export default users;
