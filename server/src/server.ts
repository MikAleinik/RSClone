import Fastify from 'fastify';
import app from './app';
import pino from "pino";
// import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
// import { FastifyRequest } from 'fastify';
// import decorators from "./decorators/decorators";
// import * as fastifyAuth from "@fastify/auth";
// import jwt from "jsonwebtoken";
import cors from "@fastify/cors";

const server = Fastify({
  trustProxy: true,
  logger: pino({ level: "info" }),
});

server
  .register(cors, {
    origin: "*",
  })
  .register(require("@fastify/auth"))
  .register(app)
  .register(cookie)
  .then(() => server.ready())
  .then(() =>
    server.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
    })
  );

