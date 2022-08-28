import Cargo from "../../../types/cargo";
import INotify from "../../interfaces/i-notify";
import UserModel from "../../models/index/data-model/user-model";
import CargoModel from "../../models/main/cargo-model";
import View from "../../view/index/view";
import { AppEvents } from "../app-events";

export default class CargoController implements INotify {
    private _userModel: UserModel;
    private _cargoModel: CargoModel;

    constructor(userModel: UserModel, cargoModel: CargoModel) {
        this._userModel = userModel;
        this._cargoModel = cargoModel;
    }
    notify(nameEvent: AppEvents, sender: View, cargo: Cargo): AppEvents | void {
        switch (nameEvent) {
            case AppEvents.MAIN_CARGO_CREATE: {
                this.createCargoHandler(nameEvent, sender, cargo);
                break;
            }
            case AppEvents.MAIN_CARGO_DELETE: {
                this.deleteCargoHandler(nameEvent, sender, cargo);
                break;
            }
            case AppEvents.MAIN_CARGO_CHANGE: {
                this.changeCargoHandler(nameEvent, sender, cargo);
                break;
            }
            case AppEvents.MAIN_CARGO_GET_ALL: {
                this.getAllCargoHandler(nameEvent, sender);
                break;
            }
            case AppEvents.MAIN_CARGO_GET_BY_ID: {
                this.getByIdCargoHandler(nameEvent, sender, cargo);
                break;
            }
            default: {
                break;
            }
        }
    }
    private createCargoHandler(nameEvent: AppEvents, sender: View, cargo: Cargo): void {
        this._cargoModel.createCargo(nameEvent, cargo)
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
    private deleteCargoHandler(nameEvent: AppEvents, sender: View, cargo: Cargo): void {
        this._cargoModel.deleteCargo(nameEvent, cargo)
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
    private changeCargoHandler(nameEvent: AppEvents, sender: View, cargo: Cargo): void {
        this._cargoModel.changeCargo(nameEvent, cargo)
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
    private getAllCargoHandler(nameEvent: AppEvents, sender: View): void {
        this._cargoModel.getAllCargo(nameEvent)
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
}
