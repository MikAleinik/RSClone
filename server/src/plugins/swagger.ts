import fp from 'fastify-plugin';
import swagger, { FastifyDynamicSwaggerOptions } from '@fastify/swagger';

export default fp<FastifyDynamicSwaggerOptions>(async (fastify, opts) => {
    fastify.register(swagger, {
        openapi: {
            info: {
                title: 'Fastify REST API',
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
