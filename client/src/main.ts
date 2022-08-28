import { AppEvents } from "./components/controller/app-events";
import AuthController from "./components/controller/common/auth-controller";
import LocaleController from "./components/controller/common/locale-controller";
import RegisterController from "./components/controller/index/register-controller";
import CarController from "./components/controller/main/car-controller";
import CargoController from "./components/controller/main/cargo-controller";
import Observer from "./components/controller/observer";
import LocaleModel from "./components/models/common/localization/locale-model";
import UserModel from "./components/models/index/data-model/user-model";
import AuthModel from "./components/models/index/state-model/auth-model";
import RegisterModel from "./components/models/index/state-model/register-model";
import CarModel from "./components/models/main/car-model";
import CargoModel from "./components/models/main/cargo-model";
import MainView from "./components/view/main/main-view";

const observer = new Observer();

const authModel = new AuthModel();
const userModel = new UserModel();
const localeModel = new LocaleModel();
const registerModel = new RegisterModel();
const cargoModel = new CargoModel();
const carModel = new CarModel();

const authController = new AuthController(userModel, authModel);
const localeController = new LocaleController(localeModel);
const registerController = new RegisterController(userModel, registerModel);
const cargoController = new CargoController(userModel, cargoModel);
const carController = new CarController(userModel, carModel);

observer.addListener(AppEvents.AUTH_CLICK_LOGOUT_BUTTON, authController)
    .addListener(AppEvents.AUTH_GET_AUTH_USER, authController)
    .addListener(AppEvents.AUTH_LOGOUT_USER, authController)
    .addListener(AppEvents.AUTH_HIDE_BUTTON, authController)
    .addListener(AppEvents.REGISTER_HIDE_BUTTON, registerController)
    .addListener(AppEvents.LOCALE_CHANGE, localeController)
    .addListener(AppEvents.LOCALE_SET, localeController)
    .addListener(AppEvents.LOCALE_GET, localeController)
    .addListener(AppEvents.MAIN_CARGO_CREATE, cargoController)
    .addListener(AppEvents.MAIN_CARGO_DELETE, cargoController)
    .addListener(AppEvents.MAIN_CARGO_CHANGE, cargoController)
    .addListener(AppEvents.MAIN_CARGO_GET_ALL, cargoController)
    .addListener(AppEvents.MAIN_CARGO_GET_BY_ID, cargoController)
    .addListener(AppEvents.MAIN_CARGO_GET_BY_USER, cargoController)
    .addListener(AppEvents.MAIN_CARGO_GET_BY_CAR, cargoController)
    .addListener(AppEvents.MAIN_CAR_CREATE, carController)
    .addListener(AppEvents.MAIN_CAR_DELETE, carController)
    .addListener(AppEvents.MAIN_CAR_CHANGE, carController)
    .addListener(AppEvents.MAIN_CAR_GET_ALL, carController)
    .addListener(AppEvents.MAIN_CAR_GET_BY_ID, carController);

const app = new MainView(observer);
