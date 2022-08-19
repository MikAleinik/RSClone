import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { hashPassword } from '../util/password.manager';
import { User } from '../vo/user';

export class UsersMapper {
    private ALL_FIELDS_GET =
        'date_change, login, email, phone, first_name, last_name, role_id, company, address, rating, rating_count, point_lat, point_lon';

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
        role_id = 1,
        first_name = '',
        last_name = '',
        phone = '',
        company = '',
        address = '',
        rating = 0,
        point_lat = 0,
        point_lon = 0
    ) {
        const hPassword = hashPassword(password);
        const {
            id,
        } = await this._db.one(
            'INSERT INTO users (login, password, email, first_name, last_name, role_id, company, address, rating, point_lat, point_lon, phone, date_change) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id',
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
                phone,
                new Date(),
            ]
        );
        return new User(
            id,
            login,
            hPassword,
            email,
            role_id,
            first_name,
            last_name,
            phone,
            company,
            address,
            rating,
            point_lat,
            point_lon
        );
    }

    async getUserByEmail(email: string) {
        const users = await this._db.oneOrNone(`SELECT ${this.ALL_FIELDS_GET} FROM users WHERE email = $1`, [email]);
        return users;
    }

    async getUserById(id: number) {
        const users = await this._db.oneOrNone(`SELECT ${this.ALL_FIELDS_GET} FROM users WHERE id = $1`, [id]);
        return users;
    }
}
