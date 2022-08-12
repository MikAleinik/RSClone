import { AppModels } from "../models/index/AppModels";
import IModel from "./i-model";

export default interface IView {
    getCurrentElement(): HTMLElement;
}