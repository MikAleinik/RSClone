import Cargo from "../../../types/cargo";
import { AppEvents } from "../../controller/app-events";
import DataMapper from "../common/sender/data-mapper";

export default class CargoModel {
    private _dataMapper = new DataMapper();
    private _cargo = new Array<Cargo>();

    constructor() {

    }
    createCargo(nameEvent: AppEvents, cargo: Cargo): Promise<Cargo> {
        return new Promise((resolve, reject) => {
            this._dataMapper.create(nameEvent, this.setCargoToMap(cargo))
                .then((result) => {
                    this._cargo.push(result as Cargo);
                    resolve(result as Cargo);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }
    deleteCargo(nameEvent: AppEvents, cargo: Cargo): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._dataMapper.delete(nameEvent, this.setCargoToMap(cargo))
                .then(() => {
                    for(let i = 0; i < this._cargo.length; i += 1) {
                        if (this._cargo[i].id === cargo.id) {
                            this._cargo.splice(i, 1);
                            break;
                        }
                    }
                    resolve(true);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }
    changeCargo(nameEvent: AppEvents, cargo: Cargo): Promise<Cargo> {
        return new Promise((resolve, reject) => {
            this._dataMapper.update(nameEvent, this.setCargoToMap(cargo))
                .then((result) => {
                    let changedCargo = this.setMapToCagro(result as Map<string, string>);
                    for(let i = 0; i < this._cargo.length; i += 1) {
                        if (this._cargo[i].id === changedCargo.id) {
                            this._cargo[i] = changedCargo;
                            break;
                        }
                    }
                    resolve(changedCargo);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }
    getAllCargo(nameEvent: AppEvents): Promise<Array<Cargo>> {
        return new Promise((resolve, reject) => {
            this._dataMapper.read(nameEvent)
                .then((result) => {
                    this._cargo = result as Array<Cargo>;
                    resolve(this._cargo);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }
    getCargoById(nameEvent: AppEvents, cargo: Cargo): Promise<Cargo> {
        return new Promise((resolve, reject) => {
            this._dataMapper.read(nameEvent, this.setCargoToMap(cargo))
                .then((result) => {
                    let readedCargo = this.setMapToCagro(result as Map<string, string>);
                    for(let i = 0; i < this._cargo.length; i += 1) {
                        if (this._cargo[i].id === readedCargo.id) {
                            this._cargo[i] = readedCargo;
                            break;
                        }
                    }
                    resolve(readedCargo);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }

    private setMapToCagro(result: Map<string, string>): Cargo {
        return {
            id: Number(result.get('id')!),
            user_id: Number(result.get('user_id')!),
            point_start_lat: Number(result.get('point_start_lat')!),
            point_start_lon: Number(result.get('point_start_lon')!),
            point_end_lat: Number(result.get('point_end_lat')!),
            point_end_lon: Number(result.get('point_end_lon')!),
            price: Number(result.get('price')!),
            currency: result.get('currency')!,
            date_from: new Date(result.get('date_from')!),
            volume: Number(result.get('volume')!),
            weigth: Number(result.get('weigth')!),
            finished: (result.get('finished')! === 'true' ? true : false),
            description: result.get('description')!
        };
    }
    private setCargoToMap(cargo: Cargo): Map<string, string> {
        const result = new Map();
        result.set('id', cargo.id);
        result.set('user_id', cargo.user_id);
        result.set('point_start_lat', cargo.point_start_lat);
        result.set('point_start_lon', cargo.point_start_lon);
        result.set('point_end_lat', cargo.point_end_lat);
        result.set('point_end_lon', cargo.point_end_lon);
        result.set('price', cargo.price);
        result.set('currency', cargo.currency);
        result.set('date_from', cargo.date_from);
        result.set('volume', cargo.volume);
        result.set('weigth', cargo.weigth);
        result.set('finished', cargo.finished);
        result.set('description', cargo.description);
        return result;
    }
}