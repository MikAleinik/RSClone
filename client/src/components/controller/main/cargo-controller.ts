import Cargo from "../../../types/cargo";
import User from "../../../types/user";
import INotify from "../../interfaces/i-notify";
import UserModel from "../../models/index/data-model/user-model";
import CargoModel from "../../models/main/cargo-model";
import View from "../../view/index/view";
import CargoView from "../../view/main/content/cargo/cargo-view";
import ExchangeCargoView from "../../view/main/content/exchange-cargo/exchange-cargo-view";
import { AppEvents } from "../app-events";

export default class CargoController implements INotify {
    private _userModel: UserModel;
    private _cargoModel: CargoModel;

    constructor(userModel: UserModel, cargoModel: CargoModel) {
        this._userModel = userModel;
        this._cargoModel = cargoModel;
    }
    notify(nameEvent: AppEvents, sender: View, param: Cargo | Map<string, string>): AppEvents | void {
        switch (nameEvent) {
            case AppEvents.MAIN_CARGO_CREATE: {
                this.createCargoHandler(nameEvent, sender, param as Cargo);
                break;
            }
            case AppEvents.MAIN_CARGO_DELETE: {
                this.deleteCargoHandler(nameEvent, sender, param as Cargo);
                break;
            }
            case AppEvents.MAIN_CARGO_CHANGE: {
                this.changeCargoHandler(nameEvent, sender, param as Cargo);
                break;
            }
            case AppEvents.MAIN_CARGO_GET_ALL: {
                this.getAllCargoHandler(nameEvent, sender);
                break;
            }
            case AppEvents.MAIN_CARGO_GET_BY_ID: {
                this.getByIdCargoHandler(nameEvent, sender, param as Cargo);
                break;
            }
            case AppEvents.MAIN_CARGO_GET_BY_USER: {
                this.getByUserCargoHandler(nameEvent, sender);
                break;
            }
            case AppEvents.MAIN_CARGO_GET_BY_CAR: {
                this.getByCarCargoHandler(nameEvent, sender, param as Map<string, string>);
                break;
            }
            default: {
                break;
            }
        }
    }
    private createCargoHandler(nameEvent: AppEvents, sender: View, cargo: Cargo): void {
        this._userModel.getAuthUser()
            .then((currentUser) => {
                cargo.user_id = currentUser.id;
                this._cargoModel.createCargo(nameEvent, cargo)
                    .then((result) => {
                        let verifySender = sender as CargoView;
                        verifySender.createCargoSuccess(result);
                    })
                    .catch((result) => {
                        let verifySender = sender as CargoView;
                        verifySender.createCargoFail(result);
                    });
            });
    }
    private deleteCargoHandler(nameEvent: AppEvents, sender: View, cargo: Cargo): void {
        this._cargoModel.deleteCargo(nameEvent, cargo)
            .then((result) => {
                let verifySender = sender as CargoView;
                verifySender.deleteCargoSuccess(result);
            })
            .catch((result) => {
                let verifySender = sender as CargoView;
                verifySender.deleteCargoFail(result);
            });
    }
    private changeCargoHandler(nameEvent: AppEvents, sender: View, cargo: Cargo): void {
        this._cargoModel.changeCargo(nameEvent, cargo)
            .then((result) => {
                let verifySender = sender as CargoView;
                verifySender.changeCargoSuccess(result);
            })
            .catch((result) => {
                let verifySender = sender as CargoView;
                verifySender.changeCargoSuccess(result);
            });
    }
    private getAllCargoHandler(nameEvent: AppEvents, sender: View): void {
        this._cargoModel.getAllCargo(nameEvent)
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
                        let verifySender = sender as ExchangeCargoView;
                        verifySender.setAllCargo(result);
                    });
            })
            .catch((result) => {
                let verifySender = sender as ExchangeCargoView;
                verifySender.showErrorMessage(result);
            });
    }
    private getByIdCargoHandler(nameEvent: AppEvents, sender: View, cargo: Cargo): void {
        this._cargoModel.getCargoById(nameEvent, cargo)
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
    private getByUserCargoHandler(nameEvent: AppEvents, sender: View): void {
        this._userModel.getAuthUser()
            .then((currentUser) => {
                const param = new Map<string, string>();
                param.set('id', currentUser.id.toString());
                this._cargoModel.getCargoByUser(nameEvent, param)
                    .then((result) => {
                        // console.log(result);
                        let verifySender = sender as ExchangeCargoView;
                        verifySender.setAllCargo(result);
                    })
                    .catch((result) => {
                        // console.log(result);
                        let verifySender = sender as ExchangeCargoView;
                        verifySender.setAllCargo(result);
                    });
            });
    }
    private getByCarCargoHandler(nameEvent: AppEvents, sender: View, param: Map<string, string>): void {
        this._cargoModel.getCargoByCar(nameEvent, param)
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
