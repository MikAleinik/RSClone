import { FastifyPluginAsync } from 'fastify';
import { RouterPath } from '../../types/enums';
import { AuthController } from '../../controller/auth.controller';
import { Type } from '@sinclair/typebox';
// import { AuthRequestUserSchemaType } from '../../types/types';
import { ErrorReplySchema, UserReplySchema } from '../../schema/general.schema';

export const AuthRequestUserSchema = Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String(),
});

const authUserOpts = {
    schema: {
        body: AuthRequestUserSchema,
        response: {
            200: UserReplySchema,
            400: ErrorReplySchema,
            404: ErrorReplySchema,
        },
    },
    // handler: AuthController.getInstance().authenticateUser,
};

const auth: FastifyPluginAsync = async (fastify, options): Promise<void> => {
    options;
    fastify.post(`/${RouterPath.AUTH}`, authUserOpts, AuthController.getInstance().authorizeUserFunc());
};

export default auth;
