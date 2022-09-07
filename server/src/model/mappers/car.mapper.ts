import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { CreateCarSchemaType } from '../../routes/v1/car.router';
import { RecordStringUnknown } from '../../types/types';
import { createColumnSet } from '../util/pg.helper';
import { Car } from '../vo/car';
import { DBDataVO } from '../vo/db.data';

export class CarMapper {
    private TABLE_NAME = 'cars';
    private ALL_FIELDS_GET =
        'id, date_change, user_id, model, description, point_current_lat, point_current_lon, route_lat, route_lon, date_start, price, currency, volume_max, weight_max';
    private ALL_FIELDS_GET_BUT_NO_ID =
        'date_change, user_id, model, description, point_current_lat, point_current_lon, route_lat, route_lon, date_start, price, currency, volume_max, weight_max';

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
            ['model', 'currency', 'description'],
            ['point_current_lat', 'point_current_lon', 'price', 'volume_max', 'weight_max'],
            null,
            ['route_lat', 'route_lon']
        );
    }

    async createCar<T extends RecordStringUnknown>(carData: T) {
        const dbData = new DBDataVO(Car, carData);
        const dataCar = dbData.getData();
        dbData.setProp('date_changed', new Date());
        const {
            id,
        } = await this._db.one(
            `INSERT INTO ${this.TABLE_NAME} (${this.ALL_FIELDS_GET_BUT_NO_ID}) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
            [
                dataCar.date_change,
                dataCar.user_id,
                dataCar.model,
                dataCar.description,
                dataCar.point_current_lat,
                dataCar.point_current_lon,
                dataCar.route_lat,
                dataCar.route_lon,
                dataCar.date_start,
                dataCar.price,
                dataCar.currency,
                dataCar.volume_max,
                dataCar.weight_max,
            ]
        );
        dbData.setProp('id', id);
        return dbData;
    }

    async changeCar(carId: number, body: CreateCarSchemaType) {
        const update = `${this._pgp.helpers.update(body, this._columnSet)}, "date_change" = ${this._pgp.as.date(
            new Date()
        )} WHERE id = ${carId}`;
        try {
            await this._db.none(update);
            return this.getById(carId);
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }

    async deleteCar(carId: number) {
        await this._db.none(`DELETE FROM ${this.TABLE_NAME} WHERE id = ${carId};`);
    }

    async getById(idNum: number) {
        const item = await this._db.oneOrNone(`SELECT ${this.ALL_FIELDS_GET} FROM ${this.TABLE_NAME} WHERE id = $1`, [
            idNum,
        ]);
        if (!item) return null;
        return new DBDataVO(Car, item);
    }

    async getByPropValue<T>(prop: string, value: T) {
        const items = await this._db.manyOrNone(
            `SELECT ${this.ALL_FIELDS_GET} FROM ${this.TABLE_NAME} WHERE ${prop} = $1`,
            [value]
        );
        if (!items) {
            return null;
        }
        return (items as RecordStringUnknown[]).map((item) => new DBDataVO(Car, item));
    }

    async getByCargo(id: number) {
        const items = await this._db.manyOrNone(`SELECT cars.id, ${this.ALL_FIELDS_GET_BUT_NO_ID}
FROM ${this.TABLE_NAME} INNER JOIN cargos_to_cars ON cars.id = cargos_to_cars.id_cars
WHERE id_cargo = ${id};`);
        if (!items) {
            return null;
        }
        return (items as RecordStringUnknown[]).map((item) => new DBDataVO(Car, item));
    }

    async getAllCars() {
        const items = await this._db.manyOrNone(`SELECT ${this.ALL_FIELDS_GET} FROM ${this.TABLE_NAME}`);
        if (!items) {
            return null;
        }
        return (items as RecordStringUnknown[]).map((item) => new DBDataVO(Car, item));
    }
}
