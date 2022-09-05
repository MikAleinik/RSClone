import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { ChangeCargoToCarsSchemaType } from '../../routes/v1/cargotocar.router';
import { RecordStringUnknown } from '../../types/types';
import { createColumnSet } from '../util/pg.helper';
import { Cargo } from '../vo/cargo';
import { CargoToCars } from '../vo/cargotocar';
import { DBDataVO } from '../vo/db.data';

export class CargoToCarsMapper {
    private TABLE_NAME = 'cargos_to_cars';
    private ALL_FIELDS_GET = 'id, id_cargo, id_cars, agree';
    private ALL_FIELDS_GET_BUT_NO_ID = 'id_cargo, id_cars, agree';

    // eslint-disable-next-line @typescript-eslint/ban-types
    private _db: pgPromise.IDatabase<{}, pg.IClient>;
    private _columnSet: pgPromise.ColumnSet<unknown>;
    // eslint-disable-next-line @typescript-eslint/ban-types
    private _pgp: pgPromise.IMain<{}, pg.IClient>;

    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor(db: pgPromise.IDatabase<{}, pg.IClient>) {
        this._db = db;
        this._pgp = pgPromise();

        this._columnSet = createColumnSet(this.TABLE_NAME, ['agree'], ['id_cargo', 'id_cars']);
    }

    async createCargoToCar<T extends RecordStringUnknown>(cargoData: T) {
        const dbData = new DBDataVO(CargoToCars, cargoData);
        const dataCargo = dbData.getData();
        const { id } = await this._db.one(
            `INSERT INTO ${this.TABLE_NAME} (
                id_cargo,
                id_cars,
                agree) VALUES ($1, $2, $3) RETURNING id`,
            [dataCargo.id_cargo, dataCargo.id_cars, dataCargo.agree]
        );
        dbData.setProp('id', id);
        return dbData;
    }

    async changeCargoToCar(cargoToCarId: number, body: ChangeCargoToCarsSchemaType) {
        const update = `${this._pgp.helpers.update(body, this._columnSet)} WHERE id = ${cargoToCarId}`;
        try {
            await this._db.none(update);
            return this.getById(cargoToCarId);
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }

    async deleteCargoToCars(id: number) {
        await this._db.none(`DELETE FROM ${this.TABLE_NAME} WHERE id = ${id};`);
    }

    async getById(idNum: number) {
        const item = await this._db.oneOrNone(`SELECT ${this.ALL_FIELDS_GET} FROM ${this.TABLE_NAME} WHERE id = $1`, [
            idNum,
        ]);
        if (!item) return null;
        return new DBDataVO(CargoToCars, item);
    }

    async getByPropValue<T>(prop: string, value: T) {
        const items = await this._db.manyOrNone(
            `SELECT ${this.ALL_FIELDS_GET} FROM ${this.TABLE_NAME} WHERE ${prop} = $1`,
            [value]
        );
        if (!items) {
            return null;
        }
        return (items as RecordStringUnknown[]).map((item) => new DBDataVO(Cargo, item));
    }

    async getByCar(id: number) {
        const items = await this._db.manyOrNone(`SELECT cargos.id, ${this.ALL_FIELDS_GET_BUT_NO_ID}
FROM ${this.TABLE_NAME} INNER JOIN cargos_to_cars ON cargos.id = cargos_to_cars.id_cargo
WHERE id_cars = ${id};`);
        if (!items) {
            return null;
        }
        return (items as RecordStringUnknown[]).map((item) => new DBDataVO(Cargo, item));
    }

    async getAllCargoToCars() {
        const items = await this._db.manyOrNone(`SELECT ${this.ALL_FIELDS_GET} FROM ${this.TABLE_NAME}`);
        if (!items) {
            return null;
        }
        return (items as RecordStringUnknown[]).map((item) => new DBDataVO(CargoToCars, item));
    }

    async getAllCargoByAgree() {
        const items = await this._db.manyOrNone(
            `SELECT ${this.ALL_FIELDS_GET} FROM ${this.TABLE_NAME} WHERE finished = 'false'`
        );
        if (!items) {
            return null;
        }
        return (items as RecordStringUnknown[]).map((item) => new DBDataVO(Cargo, item));
    }
}
