import fp from 'fastify-plugin';
import { appConfig } from '../config/app.config';
import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
// const pgp = require('pg-promise');

declare module 'fastify' {
    export interface FastifyInstance {
        // eslint-disable-next-line @typescript-eslint/ban-types
        db: pgPromise.IDatabase<{}, pg.IClient>;
    }
}

export default fp(async (fastify) => {
    fastify.log.info(appConfig.postgresURI);
    const pgp = pgPromise();
    const db = pgp(appConfig.postgresURI);
    fastify.decorate('db', db);
});
