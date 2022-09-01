import Car from "../../types/car";
import Cargo from "../../types/cargo";
import User from "../../types/user";
import { AppEvents } from "../controller/app-events";
import View from "../view/index/view";

export default interface INotify {
    notify(nameEvent: AppEvents, sender: View | INotify, params?: Map<string, string> | Cargo | Array<Cargo> | Car | Array<Car> | User): void;
}
