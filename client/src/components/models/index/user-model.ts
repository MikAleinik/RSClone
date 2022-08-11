import user from "../../../types/user";
import Observer from "../../controller/observer";
import DataMapper from "../common/sender/data-mapper";

export default class UserModel extends Observer {
    private _dataMapper = new DataMapper();

    super() {

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