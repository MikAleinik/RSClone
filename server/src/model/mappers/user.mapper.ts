import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
// import { hashPassword } from '../util/password.manager';
import { User } from '../vo/user';

export class UsersMapper {
    // eslint-disable-next-line @typescript-eslint/ban-types
    private _db: pgPromise.IDatabase<{}, pg.IClient>;

    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor(db: pgPromise.IDatabase<{}, pg.IClient>) {
        this._db = db;
    }

    async createUser(
        login: string,
        password: string,
        email: string,
        first_name: string,
        last_name: string,
        role_id = 1,
        company = '',
        address = '',
        rating = 0,
        point_lat = 0,
        point_lon = 0
    ) {
        //TODO add impl
        const hPassword = password; //hashPassword(password);
        const {
            id,
        } = await this._db.one(
            'INSERT INTO users (login, password, email, first_name, last_name, role_id, company, address, rating, point_lat, point_lon, date_change) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id',
            [
                login,
                hPassword,
                email,
                first_name,
                last_name,
                role_id,
                company,
                address,
                rating,
                point_lat,
                point_lon,
                new Date(),
            ]
        );
        return new User(hPassword, id, login, email, first_name, last_name, role_id, company, address, rating, 0, 0);
    }

    async getUserByEmail(email: string) {
        const users = await this._db.oneOrNone(
            'SELECT login, email, first_name, last_name FROM users WHERE email = $1',
            [email]
        );
        return users;
    }
}
