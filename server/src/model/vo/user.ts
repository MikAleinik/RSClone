import { v4 as uuid } from 'uuid';

export class User {
    id: string;
    email: string;
    login: string;
    passwordHash: string;

    constructor(mail = 'USER', login = 'user', passwordH = 'P@55w0rd') {
        this.id = uuid();
        this.email = mail;
        this.login = login;
        this.passwordHash = passwordH;
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
        const { id, email, login, passwordHash } = user;
        return { id, email, login, passwordHash };
    }
}
