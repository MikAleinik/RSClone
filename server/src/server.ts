import Fastify from 'fastify';
import app from './app';
import pino from 'pino';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastifyAuth from '@fastify/auth';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

const server = Fastify({
    trustProxy: true,
    logger: pino({ level: 'info' }),
}).withTypeProvider<TypeBoxTypeProvider>();

server
    .register(cors, {
        origin: '*',
    })
    .register(cookie)
    .register(fastifyAuth)
    .register(app)
    .then(() => server.ready())
    .then(() =>
        server.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
            if (err) {
                server.log.error(err);
                process.exit(1);
            }
        })
    );
