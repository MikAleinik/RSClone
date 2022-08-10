import Fastify from 'fastify';
import app from './app';

const server = Fastify({ logger: true });

server
    .register(app)
    .then(() => server.ready())
    .then(() => server.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
    }));
