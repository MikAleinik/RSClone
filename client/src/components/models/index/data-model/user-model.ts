import user from "../../../../types/user";
import IModel from "../../../interfaces/i-model";
import DataMapper from "../../common/sender/data-mapper";

export default class UserModel implements IModel {
    private _dataMapper = new DataMapper();

    constructor() {

    }
    isRegister(param: user): boolean {
        //TODO заглушка
        return true;
    }
    isLogIn(name: string, pass: string): boolean {
        //TODO заглушка
        return true;
    }
    isLogOut(): boolean {
        //TODO заглушка
        return true;
    }
}