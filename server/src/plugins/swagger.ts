import fp from 'fastify-plugin';
import swagger, { FastifyDynamicSwaggerOptions } from '@fastify/swagger';
// import pgp from 'pg-promise';
// const pgp = require('pg-promise')();

export default fp<FastifyDynamicSwaggerOptions>(async (fastify, opts) => {
    // const db = pgp('postgres://ofpofexk:m-80U-8RJaQjdmqeObQkJkwJ7Xcn6BCf@ruby.db.elephantsql.com/ofpofexk');
    // db;
    fastify.register(swagger, {
        openapi: {
            info: {
                title: 'RS Clone (Project Trans) REST API',
                version: '0.1.0',
                description: 'Use JSON Schema & TypeScript for better DX',
            },
            servers: [
                {
                    url: 'http://127.0.0.1:3000',
                },
            ],
        },
        exposeRoute: true,
    });
});
