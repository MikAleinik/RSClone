import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { CreateCargoSchemaType } from '../../routes/v1/cargo.router';
import { createColumnSet } from '../util/pg.helper';
import { Cargo } from '../vo/cargo';

export interface CargoData {
    id: number;
    type_id: number;
    user_id: number;
    car_id: number;
    point_start_lat: number;
    point_start_lon: number;
    point_start_name: string;
    point_end_lat: number;
    point_end_lon: number;
    point_end_name: string;
    weigth: number;
    point_lat: number;
    point_lon: number;
    price: number;
    currency_id: number;
    volume: number;
}

export class CargoMapper {
    private TABLE_NAME = 'cargos';
    private ALL_FIELDS_GET =
        'id, date_change, type_id, user_id, car_id, point_start_lat, point_start_lon, point_start_name, point_end_name, weigth, price, currency_id, volume';

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
            ['point_start_name', 'point_end_name'],
            [
                'type_id',
                'car_id',
                'point_start_lat',
                'point_start_lon',
                'point_end_lat',
                'point_end_lon',
                'weigth',
                'price',
                'currency_id',
                'volume',
            ]
        );
    }

    async createCargo(
        type_id = 0,
        user_id = 0,
        point_start_lat = 0,
        point_start_lon = 0,
        point_start_name = '',
        point_end_lat = 0,
        point_end_lon = 0,
        point_end_name = '',
        weigth = 0,
        price = 0,
        currency_id = 0,
        volume = 0
    ) {
        const { id } = await this._db.one(
            `INSERT INTO ${this.TABLE_NAME} (type_id,
                user_id,
                point_start_lat,
                point_start_lon,
                point_start_name,
                point_end_lat,
                point_end_lon,
                point_end_name,
                weigth,
                price,
                volume, date_change) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
            [
                type_id,
                user_id,
                point_start_lat,
                point_start_lon,
                point_start_name,
                point_end_lat,
                point_end_lon,
                point_end_name,
                weigth,
                price,
                volume,
                new Date(),
            ]
        );
        return new Cargo(
            id,
            type_id,
            user_id,
            0,
            point_start_lat,
            point_start_lon,
            point_start_name,
            point_end_lat,
            point_end_lon,
            point_end_name,
            weigth,
            price,
            currency_id,
            volume
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

    async getByPropValue<T>(prop: string, value: T) {
        const items = await this._db.manyOrNone(
            `SELECT ${this.ALL_FIELDS_GET} FROM ${this.TABLE_NAME} WHERE ${prop} = $1`,
            [value]
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
            type_id,
            user_id,
            car_id,
            point_start_lat,
            point_start_lon,
            point_start_name,
            point_end_lat,
            point_end_lon,
            point_end_name,
            weigth,
            price,
            currency_id,
            volume,
        } = data;

        return new Cargo(
            id,
            type_id,
            user_id,
            car_id,
            point_start_lat,
            point_start_lon,
            point_start_name,
            point_end_lat,
            point_end_lon,
            point_end_name,
            weigth,
            price,
            currency_id,
            volume
        );
    }
}
