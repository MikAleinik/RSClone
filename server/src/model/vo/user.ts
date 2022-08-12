import { v4 as uuid } from 'uuid';

export class User {
    id: string;
    email: string;
    login: string;
    password: string;

    constructor(mail = 'USER', login = 'user', password = 'P@55w0rd') {
        this.id = uuid();
        this.email = mail;
        this.login = login;
        this.password = password;
    }

    toJsonResponse() {
        const { email, login } = this;
        return { email, login };
    }

    async checkExistUserByEmail(email: string) {
        //TODO add check
        return false;
    }

    static toResponse(user: User) {
        const { id, email: name, login, password } = user;
        return { id, name, login, password };
    }
}
