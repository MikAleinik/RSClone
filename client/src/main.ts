import { AppEvents } from "./components/controller/app-events";
import AuthController from "./components/controller/common/auth-controller";
import LocaleController from "./components/controller/common/locale-controller";
import RegisterController from "./components/controller/index/register-controller";
import Observer from "./components/controller/observer";
import LocaleModel from "./components/models/common/localization/locale-model";
import UserModel from "./components/models/index/data-model/user-model";
import AuthModel from "./components/models/index/state-model/auth-model";
import RegisterModel from "./components/models/index/state-model/register-model";
import MainView from "./components/view/main/main-view";

let observer = new Observer();

let authModel = new AuthModel();
let userModel = new UserModel();
let localeModel = new LocaleModel();
let registerModel = new RegisterModel();

let authController = new AuthController(userModel, authModel);
let localeController = new LocaleController(localeModel);
let registerController = new RegisterController(userModel, registerModel);

observer.addListener(AppEvents.AUTH_CLICK_LOGOUT_BUTTON, authController)
    .addListener(AppEvents.AUTH_GET_AUTH_USER, authController)
    .addListener(AppEvents.AUTH_LOGOUT_USER, authController)
    .addListener(AppEvents.AUTH_HIDE_BUTTON, authController)
    .addListener(AppEvents.REGISTER_HIDE_BUTTON, registerController)
    .addListener(AppEvents.LOCALE_CHANGE, localeController)
    .addListener(AppEvents.LOCALE_SET, localeController)
    .addListener(AppEvents.LOCALE_GET, localeController);
let app = new MainView(observer);
