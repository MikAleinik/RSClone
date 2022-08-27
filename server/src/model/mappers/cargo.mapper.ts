import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { CreateCargoSchemaType } from '../../routes/v1/cargo.router';
import { createColumnSet } from '../util/pg.helper';
import { Cargo } from '../vo/cargo';

export interface CargoData {
    id: number;
    user_id: number;
    point_start_lat: number;
    point_start_lon: number;
    point_end_lat: number;
    point_end_lon: number;
    price: number;
    currency: string;
    volume: number;
    weigth: number;
    finished: string;
    description: string;
}

export class CargoMapper {
    private TABLE_NAME = 'cargos';
    private ALL_FIELDS_GET =
        'id, date_change, user_id, point_start_lat, point_start_lon, point_end_lat, point_end_lon, weigth, price, currency, volume, finished, description';

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
            ['currency', 'finished', 'description'],
            [
                'point_start_lat',
                'point_start_lon',
                'point_end_lat',
                'point_end_lon',
                'volume',
                'weigth',
                'price',
            ]
        );
    }

    async createCargo(
        user_id = 0,
        point_start_lat = 0,
        point_start_lon = 0,
        point_end_lat = 0,
        point_end_lon = 0,
        price = 0,
        currency = 'USD',
        volume = 0,
        weigth = 0,
        finished = 'false',
        description = ''
    ) {
        const { id } = await this._db.one(
            `INSERT INTO ${this.TABLE_NAME} (
                user_id,
                point_start_lat,
                point_start_lon,
                point_end_lat,
                point_end_lon,
                price,
                currency,
                volume,
                weigth,
                finished,
                description,
                date_change) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
            [
                user_id,
                point_start_lat,
                point_start_lon,
                point_end_lat,
                point_end_lon,
                price,
                currency,
                volume,
                weigth,
                finished,
                description,
                new Date(),
            ]
        );
        return new Cargo(
            id,
            user_id,
            point_start_lat,
            point_start_lon,
            point_end_lat,
            point_end_lon,
            price,
            currency,
            volume,
            weigth,
            finished,
            description,
        );
    }

    async changeCargo(cargoId: number, body: CreateCargoSchemaType) {
        const update = `${this._pgp.helpers.update(body, this._columnSet)}, "date_change" = ${this._pgp.as.date(
            new Date()
        )} WHERE id = ${cargoId}`;
        try {
            await this._db.none(update);
            return this.getById(cargoId);
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }

    async deleteCargo(cargoId: number) {
        await this._db.none(`DELETE FROM ${this.TABLE_NAME} WHERE id = ${cargoId};`);
    }

    async getById(idNum: number) {
        const item = await this._db.oneOrNone(`SELECT ${this.ALL_FIELDS_GET} FROM ${this.TABLE_NAME} WHERE id = $1`, [
            idNum,
        ]);
        if (!item) return null;
        return this.dataToVO(item);
    }

    // async getByPropValue<T>(prop: string, value: T) {
    //     const items = await this._db.manyOrNone(
    //         `SELECT ${this.ALL_FIELDS_GET} FROM ${this.TABLE_NAME} WHERE ${prop} = $1`,
    //         [value]
    //     );
    //     if (!items) {
    //         return null;
    //     }
    //     return items.map((item) => this.dataToVO(item));
    // }

    async getAllCargo() {
        const items = await this._db.manyOrNone(
            `SELECT ${this.ALL_FIELDS_GET} FROM ${this.TABLE_NAME} WHERE finished = 'false'`
        );
        if (!items) {
            return null;
        }
        return items.map((item) => this.dataToVO(item));
    }

    dataToVO(data: CargoData) {
        if (!data) return null;
        const {
            id,
            user_id,
            point_start_lat,
            point_start_lon,
            point_end_lat,
            point_end_lon,
            price,
            currency,
            volume,
            weigth,
            finished,
            description,
        } = data;
        return new Cargo(
            id,
            user_id,
            point_start_lat,
            point_start_lon,
            point_end_lat,
            point_end_lon,
            price,
            currency,
            volume,
            weigth,
            finished,
            description,
        );
    }
}
