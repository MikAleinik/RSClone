import { FastifyRequest } from "fastify";

export const SchemaTypeString = { type: ['string', 'null'], nullable: true };

export const ContentTypeJson = ['Content-Type', 'application/json'];


export type RegisterUser = FastifyRequest & { body: { email: string, login: string, password: string}};