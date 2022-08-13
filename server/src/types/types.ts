import { Static } from '@sinclair/typebox';
import { FastifyRequestType } from 'fastify/types/type-provider';
import { AuthRequestUserSchema } from '../routes/v1/auth.router';
import { RegisterUserSchema } from '../routes/v1/user.router';

export const SchemaTypeString = { type: ['string', 'null'], nullable: true };
export const ContentTypeJson = ['Content-Type', 'application/json'];

// Schema types

export type AuthRequestUserSchemaType = Static<typeof AuthRequestUserSchema>;
export type RegisterRequestUserSchemaType = Static<typeof RegisterUserSchema>;

// Request types

export type AuthRequestType = FastifyRequestType<unknown, unknown, unknown, AuthRequestUserSchemaType>;
export type RegisterRequestType = FastifyRequestType<unknown, unknown, unknown, RegisterRequestUserSchemaType>;
