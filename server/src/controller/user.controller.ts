import { ContentTypeJson, RegisterUser } from "../types/types";
import { ErrorCodes, OkCodes } from "../types/enums";
import { UsersModel } from "../model/user.model";
// import fastifyJwt from "@fastify/jwt";
import { AuthController } from "./auth.controller";
import { User } from "../model/vo/user";
// const { validate: validateUUID } = require("uuid");

export class UsersController {
  private static instance: UsersController;

  private constructor() {}

  errorHandler(error: Error, res: any) {
    res.header(...ContentTypeJson);
    res.send({ message: error.message });
  }

  async preHandler(req: any, res: any) {
    // const users = await usersRepo.getAll();
    // const objUsers = users.map((user) => user.toJsonResponse());
    res.code(OkCodes.OK);
    res.header(...ContentTypeJson);
    res.send([]);
  }

  async processGetAllUsers(req: any, res: any) {
    // const users = await usersRepo.getAll();
    // const objUsers = users.map((user) => user.toJsonResponse());
    res.code(OkCodes.OK);
    res.header(...ContentTypeJson);
    res.send([]);
  }

  async processCreateNewUser(req: any, res: any) {
    try {
      const newUser = await UsersModel.getInstance().processCreateNewUser(req as RegisterUser);
      AuthController.getInstance().setAuthCookie(res, newUser.id);
      res.code(OkCodes.CREATED);
      res.send(newUser.toJsonResponse());
    } catch (err) {
      res.code(ErrorCodes.BAD_REQUEST);
      res.header(...ContentTypeJson);
      res.send((err as Error).message);
    }
  }

  async processGetUserByUUID(req: any, res: any) {
    // const { id } = req.params;
    // try {
    //   if (!validateUUID(id)) {
    //     throw new BadRequestError("UUID is invalid");
    //   }
    //   const user = await usersRepo.getUserByUUID(id);
    //   res.code(OkCodes.OK);
    //   res.header(...ContentTypeJson);
    //   res.send(user.toJsonResponse());
    // } catch (error) {
    //   errorHandler(error, res);
    // }

    const user = new User(); //await usersRepo.addUser({ name, login, password });
    res.code(OkCodes.CREATED);
    res.header(...ContentTypeJson);
    res.send(user.toJsonResponse());
  }

  async processChangeUserByUUID(req: any, res: any) {
    // try {
    //   const { id: userId } = req.params;
    //   if (!validateUUID(userId)) {
    //     throw new BadRequestError("UUID is invalid");
    //   }
    //   const user = await usersRepo.getUserByUUID(userId);
    //   const { name, login, password, id } = req.body;
    //   user.id = id;
    //   user.name = name;
    //   user.login = login;
    //   user.password = password;
    //   res.code(OkCodes.OK);
    //   res.header(...ContentTypeJson);
    //   res.send(user.toJsonResponse());
    // } catch (error) {
    //   errorHandler(error, res);
    // }

    const user = new User(); //await usersRepo.addUser({ name, login, password });
    res.code(OkCodes.CREATED);
    res.header(...ContentTypeJson);
    res.send(user.toJsonResponse());
  }

  async processDeleteUserByUUID(req: any, res: any) {
    // try {
    //   const { id } = req.params;
    //   if (!validateUUID(id)) {
    //     throw new BadRequestError("UUID is invalid");
    //   }
    //   await usersRepo.deleteUserByUUID(id);
    //   tasksRepo.clearUserId(id);
    //   res.code(OkCodes.OK);
    //   res.header(...ContentTypeJson);
    //   res.send({});
    // } catch (error) {
    //   errorHandler(error, res);
    // }

    res.code(OkCodes.OK);
    res.header(...ContentTypeJson);
    res.send({});
  }

  static getInstance() {
    if (!UsersController.instance) {
      UsersController.instance = new UsersController();
    }
    return UsersController.instance;
  }
}
