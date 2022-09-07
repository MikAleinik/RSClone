import CargoToCar from "../../../types/cargotocar";
import INotify from "../../interfaces/i-notify";
import CargoToCarModel from "../../models/main/cargo-to-car-model";
import View from "../../view/index/view";
import ExchangeTruckView from "../../view/main/content/exchange-truck/exchange-truck-view";
import { AppEvents } from "../app-events";

export default class CargoToCarController implements INotify {
    private _cargoToCarModel: CargoToCarModel;

    constructor(cargoToCarModel: CargoToCarModel) {
        this._cargoToCarModel = cargoToCarModel;
    }
    notify(nameEvent: AppEvents, sender: View, param: CargoToCar | Map<string, string>): AppEvents | void {
        switch (nameEvent) {
            case AppEvents.CARGO_TO_CAR_CREATE: {
                this.createCargoToCarHandler(nameEvent, sender, param as CargoToCar);
                break;
            }
            case AppEvents.CARGO_TO_CAR_DELETE: {
                this.deleteCargoToCarHandler(nameEvent, sender, param as CargoToCar);
                break;
            }
            case AppEvents.CARGO_TO_CAR_CHANGE: {
                this.changeCargoToCarHandler(nameEvent, sender, param as CargoToCar);
                break;
            }
            case AppEvents.CARGO_TO_CAR_GET_ALL: {
                this.getAllCargoToCarHandler(nameEvent, sender);
                break;
            }
            // case AppEvents.MAIN_CARGO_GET_BY_ID: {
            //     this.getByIdCargoToCarHandler(nameEvent, sender, param as CargoToCar);
            //     break;
            // }
            default: {
                break;
            }
        }
    }
    private createCargoToCarHandler(nameEvent: AppEvents, sender: View, cargoToCar: CargoToCar): void {
        this._cargoToCarModel.createCargoToCar(nameEvent, cargoToCar)
            .then((result) => {
                let verifySender = sender as ExchangeTruckView;
                verifySender.createCargoToCarSuccess(result);
            })
            .catch((result) => {
                let verifySender = sender as ExchangeTruckView;
                verifySender.createCargoToCarFail(result);
            });
    }
    private deleteCargoToCarHandler(nameEvent: AppEvents, sender: View, cargoToCar: CargoToCar): void {
        this._cargoToCarModel.deleteCargoToCar(nameEvent, cargoToCar)
            .then((result) => {
                let verifySender = sender as ExchangeTruckView;
                verifySender.deleteCargoToCarSuccess(result);
            })
            .catch((result) => {
                let verifySender = sender as ExchangeTruckView;
                verifySender.deleteCargoToCarFail(result);
            });
    }
    private changeCargoToCarHandler(nameEvent: AppEvents, sender: View, cargoToCar: CargoToCar): void {
        this._cargoToCarModel.changeCargo(nameEvent, cargoToCar)
            .then((result) => {
                let verifySender = sender as ExchangeTruckView;
                verifySender.changeCargoToCarSuccess(result);
            })
            .catch((result) => {
                let verifySender = sender as ExchangeTruckView;
                verifySender.changeCargoToCarSuccess(result);
            });
    }
    private getAllCargoToCarHandler(nameEvent: AppEvents, sender: View): void {
        this._cargoToCarModel.getAllCargoToCar(nameEvent)
            .then((result) => {
                let verifySender = sender as ExchangeTruckView;
                verifySender.setAllCargoToCar(result);
            })
            .catch((result) => {
                let verifySender = sender as ExchangeTruckView;
                verifySender.setAllCargoToCar(result);
            });
    }
    // private getByIdCargoToCarHandler(nameEvent: AppEvents, sender: View, cargo: Cargo): void {
    //     this._cargoModel.getCargoById(nameEvent, cargo)
    //         .then((result) => {
    //             console.log(result);
    //         })
    //         .catch((result) => {
    //             //TODO окно сообщения (?)
    //             console.log(result);
    //         });
    //     // let verifySender = sender as AuthView;
    //     // verifySender.setRegisterButtonState(result);
    // }
}
