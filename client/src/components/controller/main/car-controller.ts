import Car from "../../../types/car";
import User from "../../../types/user";
import INotify from "../../interfaces/i-notify";
import UserModel from "../../models/index/data-model/user-model";
import CarModel from "../../models/main/car-model";
import View from "../../view/index/view";
import ExchangeTruckView from "../../view/main/content/exchange-truck/exchange-truck-view";
import { AppEvents } from "../app-events";

export default class CarController implements INotify {
    private _userModel: UserModel;
    private _carModel: CarModel;

    constructor(userModel: UserModel, carModel: CarModel) {
        this._userModel = userModel;
        this._carModel = carModel;
    }
    notify(nameEvent: AppEvents, sender: View, car: Car | Map<string, string>): AppEvents | void {
        switch (nameEvent) {
            case AppEvents.MAIN_CAR_CREATE: {
                this.createCarHandler(nameEvent, sender, car as Car);
                break;
            }
            case AppEvents.MAIN_CAR_DELETE: {
                this.deleteCarHandler(nameEvent, sender, car as Car);
                break;
            }
            case AppEvents.MAIN_CAR_CHANGE: {
                this.changeCarHandler(nameEvent, sender, car as Car);
                break;
            }
            case AppEvents.MAIN_CAR_GET_ALL: {
                this.getAllCarHandler(nameEvent, sender);
                break;
            }
            case AppEvents.MAIN_CAR_GET_BY_ID: {
                this.getByIdCarHandler(nameEvent, sender, car as Car);
                break;
            }
            default: {
                break;
            }
        }
    }
    private createCarHandler(nameEvent: AppEvents, sender: View, car: Car): void {
        this._carModel.createCar(nameEvent, car)
            .then((result) => {
                console.log(result);
            })
            .catch((result) => {
                //TODO окно сообщения (?)
                console.log(result);
            });
        // let verifySender = sender as AuthView;
        // verifySender.setRegisterButtonState(result);
    }
    private deleteCarHandler(nameEvent: AppEvents, sender: View, car: Car): void {
        this._carModel.deleteCar(nameEvent, car)
            .then((result) => {
                console.log(result);
            })
            .catch((result) => {
                //TODO окно сообщения (?)
                console.log(result);
            });
        // let verifySender = sender as AuthView;
        // verifySender.setRegisterButtonState(result);
    }
    private changeCarHandler(nameEvent: AppEvents, sender: View, car: Car): void {
        this._carModel.changeCar(nameEvent, car)
            .then((result) => {
                console.log(result);
            })
            .catch((result) => {
                //TODO окно сообщения (?)
                console.log(result);
            });
        // let verifySender = sender as AuthView;
        // verifySender.setRegisterButtonState(result);
    }
    private getAllCarHandler(nameEvent: AppEvents, sender: View): void {
        this._carModel.getAllCar(nameEvent)
            .then((result) => {
                const promisesUser = new Array<Promise<User>>();
                result.forEach((cargo) => {
                    const param = new Map();
                    param.set('id', cargo.user_id);
                    promisesUser.push(this._userModel.getUserById(AppEvents.USER_GET_BY_ID, param));
                });
                Promise.allSettled(promisesUser)
                    .then((resultPromise) => {
                        const response = resultPromise.filter((res) => res.status === 'fulfilled') as PromiseFulfilledResult<any>[];
                        for (let j = 0; j < result.length; j += 1) {
                            for (let i = 0; i < response.length; i += 1) {
                                if (response[i].value.id === result[j].user_id) {
                                    result[j].user_company = response[i].value.company;
                                    result[j].user_lastname = response[i].value.last_name;
                                    result[j].user_firstname = response[i].value.first_name;
                                    result[j].user_phone = response[i].value.phone;
                                    break;
                                }
                            }
                        };
                        let verifySender = sender as ExchangeTruckView;
                        verifySender.setAllCar(result);
                    });
            })
            .catch((result) => {
                let verifySender = sender as ExchangeTruckView;
                verifySender.showErrorMessage(result);
            });
    }
    private getByIdCarHandler(nameEvent: AppEvents, sender: View, car: Car): void {
        this._carModel.getCarById(nameEvent, car)
            .then((result) => {
                console.log(result);
            })
            .catch((result) => {
                //TODO окно сообщения (?)
                console.log(result);
            });
        // let result = this._registerModel.isChangeStateButton();
        // let verifySender = sender as AuthView;
        // verifySender.setRegisterButtonState(result);
    }
}
