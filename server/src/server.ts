import Fastify from 'fastify';
import app from './app';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastifyAuth from '@fastify/auth';
import * as dotenv from 'dotenv';

dotenv.config();

const server = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                destination: 1,
                colorize: true,
                translateTime: 'HH:MM:ss.l',
                ignore: 'pid,hostname',
            },
        },
    },
});

server
    // .register(cors, {
    //     origin: '*',
    // })
    // .register(cors, {
    //     origin: 'http://localhost:8080/',
    //     credentials: true,
    // })
    .register(cors, {
        strictPreflight: false,
        origin: true,
        credentials: true,
    })
    .register(cookie)
    .register(fastifyAuth)
    .register(app)
    .then(() => server.ready())
    .then(() =>
        server.listen({ port: 4000, host: '0.0.0.0' }, (err) => {
            if (err) {
                server.log.error(err);
                process.exit(1);
            }
        })
    );
