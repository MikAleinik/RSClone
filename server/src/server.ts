import Fastify from 'fastify';
import app from './app';
import pino from "pino";

const server = Fastify({
  trustProxy: true,
  logger: pino({ level: "info" }),
});

server
    .register(app)
    .then(() => server.ready())
    .then(() => server.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
    }));
