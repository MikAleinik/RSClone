import { AppEvents } from "./components/controller/app-events";
import AuthController from "./components/controller/common/auth-controller";
import Observer from "./components/controller/observer";
import UserModel from "./components/models/index/data-model/user-model";
import AuthModel from "./components/models/index/state-model/auth-model";
import MainView from "./components/view/main/main-view";

let observer = new Observer();

let authModel = new AuthModel();
let userModel = new UserModel();

let authController = new AuthController(userModel, authModel);

observer.addListener(AppEvents.AUTH_CLICK_LOGOUT_BUTTON, authController)
    .addListener(AppEvents.AUTH_LOGOUT_USER, authController)
let app = new MainView(observer);
