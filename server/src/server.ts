import Fastify from 'fastify';
import app from './app';
import pino from 'pino';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';

const server = Fastify({
    trustProxy: true,
    logger: pino({ level: 'info' }),
});

server
    .register(cors, {
        origin: '*',
    })
    .register(require('@fastify/auth'))
    .register(app)
    .register(cookie)
    .then(() => server.ready())
    .then(() =>
        server.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
            if (err) {
                server.log.error(err);
                process.exit(1);
            }
        })
    );
