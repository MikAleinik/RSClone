import Car from "../../../types/car";
import { AppEvents } from "../../controller/app-events";
import DataMapper from "../common/sender/data-mapper";

export default class CarModel {
    private _dataMapper = new DataMapper();
    private _car = new Array<Car>();

    constructor() {

    }
    createCar(nameEvent: AppEvents, car: Car): Promise<Car> {
        return new Promise((resolve, reject) => {
            this._dataMapper.create(nameEvent, this.setCarToMap(car))
                .then((result) => {
                    this._car.push(result as Car);
                    resolve(result as Car);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }
    deleteCar(nameEvent: AppEvents, car: Car): Promise<Car> {
        return new Promise((resolve, reject) => {
            this._dataMapper.delete(nameEvent, this.setCarToMap(car))
                .then(() => {
                    for(let i = 0; i < this._car.length; i += 1) {
                        if (this._car[i].id === car.id) {
                            this._car.splice(i, 1);
                            break;
                        }
                    }
                    resolve(car);
                })
                .catch((result) => {
                    reject(car);
                });
        });
    }
    changeCar(nameEvent: AppEvents, car: Car): Promise<Car> {
        return new Promise((resolve, reject) => {
            this._dataMapper.update(nameEvent, this.setCarToMap(car))
                .then((result) => {
                    let changedCar = this.setMapToCar(result as Map<string, string>);
                    for(let i = 0; i < this._car.length; i += 1) {
                        if (this._car[i].id === changedCar.id) {
                            this._car[i] = changedCar;
                            break;
                        }
                    }
                    resolve(changedCar);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }
    getAllCar(nameEvent: AppEvents): Promise<Array<Car>> {
        return new Promise((resolve, reject) => {
            this._dataMapper.read(nameEvent)
                .then((result) => {
                    this._car = result as Array<Car>;
                    resolve(this._car);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }
    getCarById(nameEvent: AppEvents, car: Car): Promise<Car> {
        return new Promise((resolve, reject) => {
            this._dataMapper.read(nameEvent, this.setCarToMap(car))
                .then((result) => {
                    let readedCar = this.setMapToCar(result as Map<string, string>);
                    for(let i = 0; i < this._car.length; i += 1) {
                        if (this._car[i].id === readedCar.id) {
                            this._car[i] = readedCar;
                            break;
                        }
                    }
                    resolve(readedCar);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }
    getCarByUser(nameEvent: AppEvents, param: Map<string, string>): Promise<Array<Car>> {
        return new Promise((resolve, reject) => {
            this._dataMapper.read(nameEvent, param)
                .then((result) => {
                    resolve(result as Array<Car>);
                })
                .catch((result) => {
                    reject(false);
                });
        });
    }
    private setMapToCar(result: Map<string, string>): Car {
        return {
            id: Number(result.get('id')!),
            user_id: Number(result.get('user_id')!),
            model: result.get('model')!,
            point_current_lat: Number(result.get('point_current_lat')!),
            point_current_lon: Number(result.get('point_current_lon')!),
            date_start: new Date(result.get('date_start')!),
            price: Number(result.get('price')!),
            currency: result.get('currency')!,
            volume_max: Number(result.get('volume_max')!),
            weight_max: Number(result.get('weight_max')!),
            speed: Number(result.get('speed')!),
            drived: (result.get('drived')! === 'true' ? true : false),
            description: result.get('description')!
        };
    }
    private setCarToMap(car: Car): Map<string, string> {
        const result = new Map();
        result.set('id', car.id);
        result.set('user_id', car.user_id);
        result.set('model', car.model);
        result.set('point_current_lat', car.point_current_lat);
        result.set('point_current_lon', car.point_current_lon);
        result.set('date_start', car.date_start);
        result.set('price', car.price);
        result.set('currency', car.currency);
        result.set('volume_max', car.volume_max);
        result.set('weight_max', car.weight_max);
        result.set('speed', car.speed);
        result.set('drived', car.drived);
        result.set('description', car.description);
        return result;
    }
}