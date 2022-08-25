import { AppEvents } from "./components/controller/app-events";
import AuthController from "./components/controller/common/auth-controller";
import LocaleController from "./components/controller/common/locale-controller";
import RegisterController from "./components/controller/index/register-controller";
import Observer from "./components/controller/observer";
import LocaleModel from "./components/models/common/localization/locale-model";
import UserModel from "./components/models/index/data-model/user-model";
import AuthModel from "./components/models/index/state-model/auth-model";
import RegisterModel from "./components/models/index/state-model/register-model";
import AboutView from "./components/view/about/about-view";

const observer = new Observer();

const authModel = new AuthModel();
const registerModel = new RegisterModel();
const userModel = new UserModel();
const localeModel = new LocaleModel();

const authController = new AuthController(userModel, authModel);
const registerController = new RegisterController(userModel, registerModel);
const localeController = new LocaleController(localeModel);

observer.addListener(AppEvents.AUTH_CLICK_BUTTON, authController)
    .addListener(AppEvents.AUTH_CLICK_LOGOUT_BUTTON, authController)
    .addListener(AppEvents.AUTH_LOGOUT_USER, authController)
    .addListener(AppEvents.AUTH_LOGIN_USER, authController)
    .addListener(AppEvents.AUTH_LOGIN_USER_SUCCESS, authController)
    .addListener(AppEvents.AUTH_LOGIN_USER_FAIL, authController)
    .addListener(AppEvents.AUTH_ENABLE_BUTTON, authController)
    .addListener(AppEvents.AUTH_DISABLE_BUTTON, authController)
    .addListener(AppEvents.AUTH_SHOW_BUTTON, authController)
    .addListener(AppEvents.AUTH_HIDE_BUTTON, authController)
    .addListener(AppEvents.AUTH_SHOW_WINDOW, authController)
    .addListener(AppEvents.AUTH_HIDE_WINDOW, authController)
    .addListener(AppEvents.AUTH_GET_AUTH_USER, authController)
    .addListener(AppEvents.REGISTER_CLICK_BUTTON, registerController)
    .addListener(AppEvents.REGISTER_ENABLE_BUTTON, registerController)
    .addListener(AppEvents.REGISTER_DISABLE_BUTTON, registerController)
    .addListener(AppEvents.REGISTER_HIDE_BUTTON, registerController)
    .addListener(AppEvents.REGISTER_SHOW_BUTTON, registerController)
    .addListener(AppEvents.REGISTER_SHOW_WINDOW, registerController)
    .addListener(AppEvents.REGISTER_HIDE_WINDOW, registerController)
    .addListener(AppEvents.REGISTER_USER, registerController)
    .addListener(AppEvents.REGISTER_USER_SUCCESS, registerController)
    .addListener(AppEvents.LOCALE_CHANGE, localeController)
    .addListener(AppEvents.LOCALE_SET, localeController)
    .addListener(AppEvents.LOCALE_GET, localeController)
const app = new AboutView(observer);
