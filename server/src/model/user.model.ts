import { ErrorNoSuchUser } from "../errors/ErrorNoSuchUser";
import { ErrorCreateNewUser } from "../errors/ErrorCreateNewUser";
// import { registerUserSchema } from "../routes/user.router";
import { OkCodes } from "../types/enums";
import { AuthenticateUser, ContentTypeJson, RegisterUser } from "../types/types";
import { User } from "./vo/user";
import { ErrorInvalidPassword } from "../errors/ErrorInvalidPassword";

export class UsersModel {
  private static instance: UsersModel;

  private constructor() {}

  errorHandler(error: Error, res: any) {
    res.header(...ContentTypeJson);
    res.send({ message: error.message });
  }

  async checkUniqueEmail(email: string) {
    //TODO add check
    return true;
  }

  async getUserByEmail(email: string) {
    //TODO real search
    return new User();
  }

  async validatePassword(password: string, user: User) {
    //TODO add check
    return true;
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

  async processCreateNewUser(req: RegisterUser) {
    const { email, login, password } = req.body;
    const isUnique = await this.checkUniqueEmail(email);
    if (!isUnique) {
      throw new ErrorCreateNewUser();
    }
    return new User(email, login, password);
  }

  async processAuthorizeUser(req: AuthenticateUser) {
    const { email, password } = req.body;
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new ErrorNoSuchUser();
    }
    if (!this.validatePassword(password, user)) {
      throw new ErrorInvalidPassword();
    }
    return user;
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
    if (!UsersModel.instance) {
      UsersModel.instance = new UsersModel();
    }
    return UsersModel.instance;
  }
}
