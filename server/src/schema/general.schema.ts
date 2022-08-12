import { Type } from '@sinclair/typebox';

export const ErrorReplySchema = Type.Object({
    message: Type.String(),
});

export const UserReplySchema = Type.Object({
    email: Type.String({ format: 'email' }),
    login: Type.String(),
});
