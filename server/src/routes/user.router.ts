import { FastifyPluginAsync } from "fastify";
import { UsersController } from "../controller/user.controller";
import { RouterPath } from "../types/enums";
import { SchemaTypeString } from "../types/types";

const userSchema = {
  type: "object",
  properties: {
    id: SchemaTypeString,
    name: SchemaTypeString,
    login: SchemaTypeString,
  },
};

const errorSchema = {
  type: "object",
  properties: {
    message: SchemaTypeString,
  },
};

const createUserSchema = {
  type: "object",
  properties: {
    name: SchemaTypeString,
    login: SchemaTypeString,
    password: SchemaTypeString,
  },
  required: ["name", "login", "password"],
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
  handler: UsersController.getInstance().processGetAllUsers,
};

const getUserByUUIDOpts = {
  schema: {
    response: {
      200: userSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },
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
    body: createUserSchema,
    response: {
      201: userSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },
  handler: UsersController.getInstance().processCreateNewUser,
};

const cars: FastifyPluginAsync = async (fastify, options): Promise<void> => {
  fastify.get(`/${RouterPath.USERS}`, getAllUsersOpts);
  fastify.post(`/${RouterPath.USERS}`, createUserOpts);
  fastify.get(`/${RouterPath.USERS}/:id`, getUserByUUIDOpts);
  fastify.put(`/${RouterPath.USERS}/:id`, changeUserByUUIDOpts);
  fastify.delete(`/${RouterPath.USERS}/:id`, deleteUserByUUIDOpts);
};

export default cars;
