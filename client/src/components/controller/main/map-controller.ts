import INotify from "../../interfaces/i-notify";
import MapModel from "../../models/main/map-model";
import View from "../../view/index/view";
import CargoView from "../../view/main/content/cargo/cargo-view";
import { AppEvents } from "../app-events";

export default class MapController implements INotify {
    private _mapModel: MapModel;

    constructor(mapModel: MapModel) {
        this._mapModel = mapModel;
    }
    notify(nameEvent: AppEvents, sender: View, param: Map<string, string>): void {
        switch (nameEvent) {
            case AppEvents.MAP_GET_NAME: {
                this._mapModel.getNameByLatLon(param);
                break;
            }
            case AppEvents.MAP_GET_LATLON: {
                this._mapModel.getLatLonByName(param)
                    .then((result) => {
                        let verifySender = sender as CargoView;
                        verifySender.setNamePoint(result);
                    })
                    .catch((result) => {
                        let verifySender = sender as CargoView;
                        verifySender.setNamePoint(result);
                    });
                break;
            }
            case AppEvents.MAP_CHECK_NAME: {
                this._mapModel.checkName(param)
                    .then((result) => {
                        let verifySender = sender as CargoView;
                        verifySender.checkNameResult(result);
                    });
                break;
            }
            default: {
                break;
            }
        }
    }

}
