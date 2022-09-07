// This file contains code that we reuse between our tests.
import Fastify from 'fastify';
import fp from 'fastify-plugin';
import App from '../src/app';
import * as tap from 'tap';
import { AppConfig } from '../src/config/app.config';

import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastifyAuth from '@fastify/auth';

export type Test = typeof tap['Test']['prototype'];

// Fill in this config with all the configurations
// needed for testing the application
async function config() {
    return {};
}

// Automatically build and tear down our instance
async function build(t: Test) {
    const app = Fastify();

    // fastify-plugin ensures that all decorators
    // are exposed for testing purposes, this is
    // different from the production setup
    void app.register(fp(App), await config());

    await app.ready();

    // Tear down our app after we are done
    t.teardown(() => void app.close());

    return app;
}

async function registerServ(t: Test) {
    AppConfig.init();

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
    // t.teardown(() => void server.close());
    await server
        .register(cors, {
            strictPreflight: false,
            origin: true,
            credentials: true,
        })
        .register(cookie)
        .register(fastifyAuth)
        .register(App);

    return server;
}

function registerServT(t: Test) {
    AppConfig.init();

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
    t.teardown(() => void server.close());
    server
        .register(cors, {
            strictPreflight: false,
            origin: true,
            credentials: true,
        })
        .register(cookie)
        .register(fastifyAuth)
        .register(App);

    return server;
}

async function runningServ(t: Test) {
    AppConfig.init();

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
    t.teardown(() => void server.close());
    server
        .register(cors, {
            strictPreflight: false,
            origin: true,
            credentials: true,
        })
        .register(cookie)
        .register(fastifyAuth)
        .register(App)
        .then(() => server.ready())
        .then(() =>
            server.listen({ port: AppConfig.config.PORT, host: '0.0.0.0' }, (err) => {
                if (err) {
                    server.log.error(err);
                    process.exit(1);
                }
            })
        );
    return server;
}

function buildFastify() {
    const fastify = Fastify();

    fastify.get('/', function (request, reply) {
        reply.send({ hello: 'world' });
    });

    return fastify;
}

export { config, build, registerServ, registerServT, runningServ, buildFastify };
