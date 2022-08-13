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
        body: AuthRequestUserSchema,
        response: {
            200: UserSchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    handler: AuthController.getInstance().authorizeUserFunc(),
};

const auth: FastifyPluginAsync = async (fastify, options): Promise<void> => {
    options;
    fastify.post(`/${RouterPath.AUTH}`, authUserOpts);
};

export default auth;
