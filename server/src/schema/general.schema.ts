import { FromSchema } from 'json-schema-to-ts';

export type ErrorReplyType = FromSchema<typeof ErrorReplySchema>;

export const ErrorReplySchema = {
    type: 'object',
    properties: {
        message: { type: 'string' },
    },
} as const;
