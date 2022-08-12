import { FastifyPluginAsync } from "fastify";
import { RouterPath } from "../types/enums";
import { AuthController } from "../controller/auth.controller";
// import jwt from "jsonwebtoken";
import { SchemaTypeString } from "../types/types";
import { errorSchema, userReplySchema } from "../schema/general.schema";
// import { AuthController } from "../controller/auth.controller";
// // import { RouterPath } from "../types/enums";

const authUserSchema = {
  type: "object",
  properties: {
    email: SchemaTypeString,
    password: SchemaTypeString,
  },
  required: ["email", "password"],
};

const authUserOpts = {
  schema: {
    body: authUserSchema,
    response: {
      200: userReplySchema,
      400: errorSchema,
      404: errorSchema,
    },
  },
  handler: AuthController.getInstance().authorizeUser,
};


const auth: FastifyPluginAsync = async (fastify, options): Promise<void> => {
    fastify.post(`/${RouterPath.AUTH}`, authUserOpts);
};

export default auth;

