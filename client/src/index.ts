import IModel from "./components/interfaces/i-model";
import { AppModels } from "./components/models/index/AppModels";
import UserModel from "./components/models/index/data-model/user-model";
import AuthModel from "./components/models/index/state-model/auth-model";
import RegisterModel from "./components/models/index/state-model/register-model";
import IndexView from "./components/view/index/index-view";

let models = new Map<AppModels, IModel>();
models.set(AppModels.AUTH, new AuthModel());
models.set(AppModels.REGISTER, new RegisterModel());
models.set(AppModels.USER, new UserModel());

let app = new IndexView(models);
