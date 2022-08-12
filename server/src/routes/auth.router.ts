import { FastifyPluginAsync } from "fastify";
// import jwt from "jsonwebtoken";
// import { SchemaTypeString } from "../types/types";
// import { AuthController } from "../controller/auth.controller";
// // import { RouterPath } from "../types/enums";

// const authUserSchema = {
//   type: "object",
//   properties: {
//     name: SchemaTypeString,
//     email: SchemaTypeString
//   },
//   required: ["name", "email"],
// };

// const authUserHeaderSchema = {
//   type: "object",
//   properties: {
//     UserToken: SchemaTypeString
//   },
//   required: ["X-access-token"],
// };

// const createUserOpts = {
//   schema: {
//     body: authUserSchema,
//     headers: authUserHeaderSchema
//     // response: {
//     //   201: userSchema,
//     //   400: errorSchema,
//     //   404: errorSchema,
//     // },
//   },
//   handler: AuthController.getInstance().processUserAuth,
// };

const auth: FastifyPluginAsync = async (fastify: any, options): Promise<void> => {
//   fastify.post(`/${RouterPath.AUTH}`, createUserOpts);
    fastify.post(`/auth`, (req: any, reply: any) => {
        const token = fastify.jwt.sign({ email: req.body.email });//jwt.sign({ foo: "bar" }, 'sdfasdf');
        const decoded = fastify.jwt.decode(token);
        // const isOk = req
      reply.send({ token, decoded });
    });
};

export default auth;
