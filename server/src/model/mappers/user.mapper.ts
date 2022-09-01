import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { RegisterUserSchemaType } from '../../routes/v1/user.router';
import { RecordStringUnknown } from '../../types/types';
import { hashPassword } from '../util/password.manager';
import { createColumnSet } from '../util/pg.helper';
import { DBDataVO } from '../vo/db.data';
import { User } from '../vo/user';

export class UsersMapper {
    private ALL_FIELDS_GET =
        'id, date_change, login, email, password, phone, first_name, last_name, role_id, company, address, rating, rating_count, point_lat, point_lon';
    private TABLE_NAME = 'users';

    // eslint-disable-next-line @typescript-eslint/ban-types
    private _db: pgPromise.IDatabase<{}, pg.IClient>;
    private _columnSet: pgPromise.ColumnSet<unknown>;
    // eslint-disable-next-line @typescript-eslint/ban-types
    private _pgp: pgPromise.IMain<{}, pg.IClient>;

    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor(db: pgPromise.IDatabase<{}, pg.IClient>) {
        this._db = db;
        this._pgp = pgPromise();
        this._columnSet = createColumnSet(
            this.TABLE_NAME,
            ['login', 'email', 'password', 'phone', 'first_name', 'last_name', 'company', 'address'],
            ['role_id', 'rating', 'rating_count', 'point_lat', 'point_lon']
        );
    }

    async createUser<T extends RecordStringUnknown>(userData: T) {
        const dbData = new DBDataVO(User, userData);
        const dataUser = dbData.getData();
        dbData.setProp('password', hashPassword(dataUser.password));
        dbData.setProp('date_change', new Date());
        const {
            id,
        } = await this._db.one(
            'INSERT INTO users (login, password, email, first_name, last_name, role_id, company, address, rating, point_lat, point_lon, phone, date_change, rating_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id',
            [
                dataUser.login,
                dataUser.password,
                dataUser.email,
                dataUser.first_name,
                dataUser.last_name,
                dataUser.role_id,
                dataUser.company,
                dataUser.address,
                dataUser.rating,
                dataUser.point_lat,
                dataUser.point_lon,
                dataUser.phone,
                dataUser.date_change,
                dataUser.rating_count,
            ]
        );
        dbData.setProp('id', id);
        return dbData;
    }

    async getUserByEmail(emailStr: string) {
        const user = await this._db.oneOrNone(`SELECT ${this.ALL_FIELDS_GET} FROM users WHERE email = $1`, [emailStr]);
        if (!user) return null;
        return new DBDataVO(User, user);
    }

    async getById(id: number) {
        const user = await this._db.oneOrNone(`SELECT ${this.ALL_FIELDS_GET} FROM users WHERE id = $1`, [id]);
        if (!user) {
            return null;
        }
        return new DBDataVO(User, user);
    }

    async getAllUsers() {
        const items = await this._db.manyOrNone(`SELECT ${this.ALL_FIELDS_GET} FROM ${this.TABLE_NAME}`);
        if (!items) {
            return null;
        }
        return (items as RecordStringUnknown[]).map((item) => new DBDataVO(User, item));
    }

    async changeUser(userId: number, body: RegisterUserSchemaType) {
        const dataCopy = { ...body };
        const user = await this.getById(userId);
        if (!user) {
            throw new Error(`User ${userId} not found!`);
        }
        dataCopy.password =
            dataCopy.password && dataCopy.password !== '' ? hashPassword(dataCopy.password) : user.getData().password;
        const update = `${this._pgp.helpers.update(body, this._columnSet)}, "date_change" = ${this._pgp.as.date(
            new Date()
        )} WHERE id = ${userId}`;
        try {
            await this._db.none(update);
            return this.getById(userId);
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }
}
