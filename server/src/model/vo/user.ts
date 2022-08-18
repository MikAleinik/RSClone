// import { v4 as uuid } from 'uuid';

export class User {
    id: number;
    email: string;
    login: string;
    passwordHash: string;

    constructor(
        passwordHash: string,
        id = 0,
        login = 'login',
        email = 'email@email.com',
        first_name = 'fName',
        last_name = 'lName',
        role_id = 1,
        company = '',
        address = '',
        rating = 0,
        point_lat = 0,
        point_lon = 0
    ) {
        first_name;
        last_name;
        role_id;
        company;
        address;
        rating;
        point_lat;
        point_lon;
        this.passwordHash = passwordHash;
        this.id = id;
        this.email = email;
        this.login = login;
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
        const { id, email, login } = user;
        return { id, email, login };
    }
}
