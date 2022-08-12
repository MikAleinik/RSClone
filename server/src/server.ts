import Fastify, { FastifyRequest } from 'fastify';
import app from './app';
import pino from "pino";
// import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
// import { FastifyRequest } from 'fastify';
// import decorators from "./decorators/decorators";
// import * as fastifyAuth from "@fastify/auth";
// import jwt from "jsonwebtoken";
const jwt = require("@fastify/jwt");

const server = Fastify({
  trustProxy: true,
  logger: pino({ level: "info" }),
});

server
  .register(require("@fastify/auth"))
  .register(jwt,
    {
    secret: "secret"
    ,
    verify: {
      extractToken: (req: FastifyRequest) => {
        //@ts-ignore
        const tok = "123"//req.body.token;
        // const tok = req.headers['auth'] as string;
        return tok;
      }
    }
  }
  )
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
  
// server.addHook("onRequest", async (request: any, reply) => {
//   try {
//     await request.jwtVerify();
//   } catch (err) {
//     reply.send(err);
//   }
// });
