import CargoToCar from "../../../types/cargotocar";
import { AppEvents } from "../../controller/app-events";
import DataMapper from "../common/sender/data-mapper";

export default class CargoToCarModel {
    private readonly STATUS_CANCEL = 'Cancelled';
    private readonly STATUS_SUBMIT = 'Submitted';
    private readonly STATUS_PENDING = 'Pending';
    
    private _dataMapper = new DataMapper();
    private _cargoToCar = new Array<CargoToCar>();

    constructor() {

    }
    createCargoToCar(nameEvent: AppEvents, cargoToCar: CargoToCar): Promise<CargoToCar> {
        return new Promise((resolve, reject) => {
            this._dataMapper.create(nameEvent, this.setToMap(cargoToCar))
                .then((result) => {
                    this._cargoToCar.push(result as CargoToCar);
                    resolve(result as CargoToCar);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }
    deleteCargoToCar(nameEvent: AppEvents, cargoToCar: CargoToCar): Promise<CargoToCar> {
        return new Promise((resolve, reject) => {
            this._dataMapper.delete(nameEvent, this.setToMap(cargoToCar))
                .then(() => {
                    for(let i = 0; i < this._cargoToCar.length; i += 1) {
                        if (this._cargoToCar[i].id === cargoToCar.id) {
                            this._cargoToCar.splice(i, 1);
                            break;
                        }
                    }
                    resolve(cargoToCar);
                })
                .catch((result) => {
                    reject(cargoToCar);
                });
        });
    }
    changeCargo(nameEvent: AppEvents, cargoToCar: CargoToCar): Promise<CargoToCar> {
        return new Promise((resolve, reject) => {
            this._dataMapper.update(nameEvent, this.setToMap(cargoToCar))
                .then((result) => {
                    let changedCargoToCar = this.setToCagro(result as Map<string, string>);
                    for(let i = 0; i < this._cargoToCar.length; i += 1) {
                        if (this._cargoToCar[i].id === changedCargoToCar.id) {
                            this._cargoToCar[i] = changedCargoToCar;
                            break;
                        }
                    }
                    resolve(changedCargoToCar);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }
    getAllCargoToCar(nameEvent: AppEvents): Promise<Array<CargoToCar>> {
        return new Promise((resolve, reject) => {
            this._dataMapper.read(nameEvent)
                .then((result) => {
                    this._cargoToCar = result as Array<CargoToCar>;
                    resolve(this._cargoToCar);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }
    getCargoToCarById(nameEvent: AppEvents, cargoToCar: CargoToCar): Promise<CargoToCar> {
        return new Promise((resolve, reject) => {
            this._dataMapper.read(nameEvent, this.setToMap(cargoToCar))
                .then((result) => {
                    let readedCargoToCar = this.setToCagro(result as Map<string, string>);
                    for(let i = 0; i < this._cargoToCar.length; i += 1) {
                        if (this._cargoToCar[i].id === readedCargoToCar.id) {
                            this._cargoToCar[i] = readedCargoToCar;
                            break;
                        }
                    }
                    resolve(readedCargoToCar);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }
    private setToCagro(result: Map<string, string>): CargoToCar {
        return {
            id: Number(result.get('id')!),
            id_cars: Number(result.get('id_cars')!),
            id_cargo: Number(result.get('id_cargo')!),
            agree: result.get('agree')!,
        };
    }
    private setToMap(cargo: CargoToCar): Map<string, string> {
        const result = new Map();
        result.set('id', cargo.id);
        result.set('id_cars', cargo.id_cars);
        result.set('id_cargo', cargo.id_cargo);
        result.set('agree', cargo.agree);
        return result;
    }
}