import { FastifyPluginAsync } from 'fastify';
import { AuthController } from '../../controller/auth.controller';
import { UsersController } from '../../controller/user.controller';
import { RouterPath } from '../../types/enums';
import { ErrorReplySchema } from '../../schema/general.schema';
import { FromSchema } from 'json-schema-to-ts';
import { UsersModel } from '../../model/user.model';
import { UsersMapper } from '../../model/mappers/user.mapper';

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
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        phone: { type: 'string' },
        role_id: { type: 'number' },
        company: { type: 'string' },
        address: { type: 'string' },
        point_lat: { type: 'number' },
        point_lon: { type: 'number' },
    },
    required: ['email', 'login', 'password', 'role_id'],
    additionalProperties: false,
} as const;

export const UserSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        email: { type: 'string', format: 'email' },
        login: { type: 'string' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        phone: { type: 'string' },
        role_id: { type: 'number' },
        company: { type: 'string' },
        address: { type: 'string' },
        point_lat: { type: 'number' },
        point_lon: { type: 'number' },
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
        tags: ['Users'],
        description: 'Get all users',
        response: {
            200: ReplyAllUsers,
            400: ErrorReplySchema,
            401: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: UsersController.getInstance().getAllUsersFunc(),
};

const getUserByUUIDOpts = {
    schema: {
        tags: ['Users'],
        description: 'Get user by Id',
        response: {
            200: UserSchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: UsersController.getInstance().getUserByUUIDFunc(),
};

const changeUserByUUIDOpts = {
    schema: {
        tags: ['Users'],
        description: 'Change user by Id',
        body: RegisterUserSchema,
        response: {
            200: UserSchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: UsersController.getInstance().changeUserByUUIDFunc(),
};

const deleteUserByUUIDOpts = {
    schema: {
        tags: ['Users'],
        description: 'Delete user by Id',
        response: {
            200: {},
            400: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: UsersController.getInstance().deleteUserByUUIDFunc(),
};

const createUserOpts = {
    schema: {
        tags: ['Users'],
        description: 'Register a new user',
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
    UsersModel.setMapper(new UsersMapper(fastify.db));
    fastify.get(`/${RouterPath.USERS}`, getAllUsersOpts);
    fastify.post(`/${RouterPath.USERS_REGISTER}`, createUserOpts);
    fastify.get(`/${RouterPath.USERS}/:id`, getUserByUUIDOpts);
    fastify.put(`/${RouterPath.USERS}/:id`, changeUserByUUIDOpts);
    fastify.delete(`/${RouterPath.USERS}/:id`, deleteUserByUUIDOpts);
};

export default users;
