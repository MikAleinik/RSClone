// import { v4 as uuid } from 'uuid';

export class User {
    id = 0;
    login: string;
    password: string;
    email: string;
    role_id = 1;
    first_name = '';
    last_name = '';
    phone = '';
    company = '';
    address = '';
    rating = 0;
    rating_count = 0;
    point_lat = 0;
    point_lon = 0;

    constructor(
        id = 0,
        login = '',
        password = '',
        email = '',
        role_id = 1,
        first_name = '',
        last_name = '',
        phone = '',
        company = '',
        address = '',
        rating = 0,
        rating_count = 0,
        point_lat = 0,
        point_lon = 0
    ) {
        this.password = password;
        this.id = id;
        this.email = email;
        this.login = login;
        this.role_id = role_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone = phone;
        this.company = company;
        this.address = address;
        this.rating = rating;
        this.rating_count = rating_count;
        this.point_lat = point_lat;
        this.point_lon = point_lon;
    }

    toJsonResponse() {
        const {
            id,
            email,
            login,
            role_id,
            first_name,
            last_name,
            phone,
            company,
            address,
            rating,
            rating_count,
            point_lat,
            point_lon,
        } = this;
        return {
            id,
            email,
            login,
            role_id,
            first_name,
            last_name,
            phone,
            company,
            address,
            rating,
            rating_count,
            point_lat,
            point_lon,
        };
    }

    static toResponse(user: User) {
        const { id, email, login } = user;
        return { id, email, login };
    }
}
