import { FastifyPluginAsync } from 'fastify';
import { RouterPath } from '../../types/enums';
import { AuthController } from '../../controller/auth.controller';
import { ErrorReplySchema } from '../../schema/general.schema';
import { FromSchema } from 'json-schema-to-ts';
import { UserSchema } from './user.router';

// export Schema types

export type AuthRequestUserSchemaType = FromSchema<typeof AuthRequestUserSchema>;

// Schemas

const AuthRequestUserSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
    },
    required: ['email', 'password'],
    additionalProperties: false,
} as const;

// Optiions

const authUserOpts = {
    schema: {
        tags: ['Authorization'],
        description: 'Passing authorization',
        body: AuthRequestUserSchema,
        response: {
            200: UserSchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    handler: AuthController.getInstance().authorizeUserFunc(),
};

const unAuthUserOpts = {
    schema: {
        tags: ['UNauthorization'],
        description: 'User preses exit btn',
        response: {
            200: UserSchema,
            401: ErrorReplySchema,
        },
    },
    preHandler: [AuthController.getInstance().verifyJWTFunc()],
    handler: AuthController.getInstance().unAuthorizeUserFunc(),
};

const auth: FastifyPluginAsync = async (fastify, options): Promise<void> => {
    options;
    fastify.post(`/${RouterPath.AUTH}`, authUserOpts);
    fastify.get(`/${RouterPath.UNAUTH}`, unAuthUserOpts);
};

export default auth;
