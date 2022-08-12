import IModel from "../../interfaces/i-model";
import { AppModels } from "../../models/index/AppModels";

export default abstract class View {
    readonly _models: Map<AppModels, IModel>;
    constructor(models: Map<AppModels, IModel>) {
        this._models = models;
    };
}
