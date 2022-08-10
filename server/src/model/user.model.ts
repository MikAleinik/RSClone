const { v4: uuid } = require("uuid");

export class User {
    private id: string;
    private name: string;
    private login: string;
    private password: string;

  constructor({
    id = uuid(),
    name = "USER",
    login = "user",
    password = "P@55w0rd",
  } = {}) {
    this.id = id;
    this.name = name;
    this.login = login;
    this.password = password;
  }

  toJsonResponse() {
    const { id, name, login, password } = this;
    return { id, name, login, password };
  }

  static toResponse(user: User) {
    const { id, name, login, password } = user;
    return { id, name, login, password };
  }
}
