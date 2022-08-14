import user from "../../../../types/user";
import DataMapper from "../../common/sender/data-mapper";

export default class UserModel {
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