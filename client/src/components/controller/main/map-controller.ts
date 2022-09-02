import INotify from "../../interfaces/i-notify";
import MapModel from "../../models/main/map-model";
import View from "../../view/index/view";
import { AppEvents } from "../app-events";

export default class MapController implements INotify {
    private _mapModel: MapModel;

    constructor(mapModel: MapModel) {
        this._mapModel = mapModel;
    }
    notify(nameEvent: AppEvents, sender: View, param: Map<string, string>): void {
        switch (nameEvent) {
            case AppEvents.MAP_GET_NAME: {
                this._mapModel.setNameByLatLon(param);
                break;
            }
            default: {
                break;
            }
        }
    }

}
