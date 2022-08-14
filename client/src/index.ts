import { AppEvents } from "./components/controller/app-events";
import AuthController from "./components/controller/index/auth-controller";
import RegisterController from "./components/controller/index/register-controller";
import Observer from "./components/controller/observer";
import UserModel from "./components/models/index/data-model/user-model";
import AuthModel from "./components/models/index/state-model/auth-model";
import RegisterModel from "./components/models/index/state-model/register-model";
import IndexView from "./components/view/index/index-view";

let observer = new Observer();

let authModel = new AuthModel();
let registerModel = new RegisterModel();
let userModel = new UserModel();

let authController = new AuthController(userModel, authModel);
let registerController = new RegisterController(userModel, registerModel);

observer.addListener(AppEvents.AUTH_CLICK_BUTTON, authController)
    .addListener(AppEvents.AUTH_CHANGE_STATE_WINDOW, authController)
    .addListener(AppEvents.REGISTER_CLICK_BUTTON, registerController);
let app = new IndexView(observer);
