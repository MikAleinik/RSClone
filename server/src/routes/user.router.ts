import { FastifyPluginAsync } from "fastify";
import { AuthController } from "../controller/auth.controller";
import { UsersController } from "../controller/user.controller";
import { RouterPath } from "../types/enums";
import { SchemaTypeString } from "../types/types";

const userSchema = {
  type: "object",
  properties: {
    id: SchemaTypeString,
    email: SchemaTypeString,
    login: SchemaTypeString,
  },
};

const errorSchema = {
  type: "object",
  properties: {
    message: SchemaTypeString,
  },
};

const registerUserSchema = {
  type: "object",
  properties: {
    email: SchemaTypeString,
    login: SchemaTypeString,
    password: SchemaTypeString,
  },
  required: ["email", "login", "password"],
};

const updateUserSchema = {
  type: "object",
  properties: {
    name: SchemaTypeString,
    login: SchemaTypeString,
    password: SchemaTypeString,
    id: SchemaTypeString,
  },
  required: ["name", "login", "password", "id"],
};

const getAllUsersOpts = {
  schema: {
    response: {
      200: {
        type: "array",
        items: userSchema,
      },
    },
  },
  preHandler: [AuthController.getInstance().verifyJWT],
  handler: UsersController.getInstance().processGetAllUsers,
};

const prehandler = async (req: any, resp: any) => {
  console.log("prehandle");
};

const getUserByUUIDOpts = {
    schema: {
        response: {
            200: userSchema,
            400: errorSchema,
            404: errorSchema,
        },
    },
    
    preHandler: [prehandler],
    handler: UsersController.getInstance().processGetUserByUUID,
};



const changeUserByUUIDOpts = {
  schema: {
    body: updateUserSchema,
    response: {
      200: userSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },
  handler: UsersController.getInstance().processChangeUserByUUID,
};

const deleteUserByUUIDOpts = {
  schema: {
    response: {},
  },
  handler: UsersController.getInstance().processDeleteUserByUUID,
};

const createUserOpts = {
    schema: {
    body: registerUserSchema,
    response: {
      201: userSchema,
      401: errorSchema,
      404: errorSchema,
    },
  },
  handler: UsersController.getInstance().processCreateNewUser,
};

const cars: FastifyPluginAsync = async (fastify, options): Promise<void> => {
  fastify.get(`/${RouterPath.USERS}`, getAllUsersOpts);
  fastify.post(`/${RouterPath.USERS_REGISTER}`, createUserOpts);
  fastify.get(`/${RouterPath.USERS}/:id`, getUserByUUIDOpts);
  fastify.put(`/${RouterPath.USERS}/:id`, changeUserByUUIDOpts);
  fastify.delete(`/${RouterPath.USERS}/:id`, deleteUserByUUIDOpts);
};

export default cars;
