import Car from "../../../types/car";
import INotify from "../../interfaces/i-notify";
import UserModel from "../../models/index/data-model/user-model";
import CarModel from "../../models/main/car-model";
import View from "../../view/index/view";
import { AppEvents } from "../app-events";

export default class CarController implements INotify {
    private _userModel: UserModel;
    private _carModel: CarModel;

    constructor(userModel: UserModel, carModel: CarModel) {
        this._userModel = userModel;
        this._carModel = carModel;
    }
    notify(nameEvent: AppEvents, sender: View, car: Car): AppEvents | void {
        switch (nameEvent) {
            case AppEvents.MAIN_CAR_CREATE: {
                this.createCarHandler(nameEvent, sender, car);
                break;
            }
            case AppEvents.MAIN_CAR_DELETE: {
                this.deleteCarHandler(nameEvent, sender, car);
                break;
            }
            case AppEvents.MAIN_CAR_CHANGE: {
                this.changeCarHandler(nameEvent, sender, car);
                break;
            }
            case AppEvents.MAIN_CAR_GET_ALL: {
                this.getAllCarHandler(nameEvent, sender);
                break;
            }
            case AppEvents.MAIN_CAR_GET_BY_ID: {
                this.getByIdCarHandler(nameEvent, sender, car);
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
                console.log(result);
            })
            .catch((result) => {
                //TODO окно сообщения (?)
                console.log(result);
            });
        // let verifySender = sender as AuthView;
        // verifySender.setRegisterButtonState(result);
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
