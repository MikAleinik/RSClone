// import { Static } from '@sinclair/typebox';
// import { FastifyRequestType } from 'fastify/types/type-provider';
// import { RegisterUserSchema } from '../routes/v1/user.router';

export const SchemaTypeString = { type: ['string', 'null'], nullable: true };
export const SchemaTypeStringNonNullable = { type: ['string'] };
export const ContentTypeJson = ['Content-Type', 'application/json'];

export type JWTDEcodedData = {
    id: string;
    email: string;
};
