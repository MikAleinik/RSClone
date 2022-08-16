import { AppEvents } from "./components/controller/app-events";
import AuthController from "./components/controller/index/auth-controller";
import NewsController from "./components/controller/index/news-controller";
import RegisterController from "./components/controller/index/register-controller";
import Observer from "./components/controller/observer";
import NewsModel from "./components/models/index/data-model/news-model";
import UserModel from "./components/models/index/data-model/user-model";
import AuthModel from "./components/models/index/state-model/auth-model";
import RegisterModel from "./components/models/index/state-model/register-model";
import IndexView from "./components/view/index/index-view";

let observer = new Observer();

let authModel = new AuthModel();
let registerModel = new RegisterModel();
let userModel = new UserModel();
let newsModel = new NewsModel();

let authController = new AuthController(userModel, authModel);
let registerController = new RegisterController(userModel, registerModel);
let newsController = new NewsController(newsModel);

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
    .addListener(AppEvents.NEWS_GET_DATA, newsController)
// .addListener(AppEvents.REGISTER_USER_FAIL, registerController);
let app = new IndexView(observer);
