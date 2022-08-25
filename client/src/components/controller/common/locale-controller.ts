import ILocale from "../../interfaces/i-locale";
import INotify from "../../interfaces/i-notify";
import LocaleModel from "../../models/common/localization/locale-model";
import AuthView from "../../view/common/auth/auth-view";
import View from "../../view/index/view";
import { AppEvents } from "../app-events";

export default class LocaleController implements INotify {
    private _localeModel: LocaleModel;

    constructor(localeModel: LocaleModel) {
        this._localeModel = localeModel;
    }
    notify(nameEvent: AppEvents, sender: View): void {
        switch (nameEvent) {
            case AppEvents.LOCALE_CHANGE: {
                this.changeLocaleHandler(sender);
                break;
            }
            case AppEvents.LOCALE_GET:
            case AppEvents.LOCALE_SET: {
                this.getLocaleHandler(sender);
                break;
            }
            default: {
                break;
            }
        }
    }
    private changeLocaleHandler(sender: View): void {
        this._localeModel.changeLocale();
        let verifySender = sender as AuthView;
        verifySender.localeChanged();
    }
    private getLocaleHandler(sender: View): void {
        let verifySender = (sender as unknown) as ILocale;
        verifySender.setLocale(this._localeModel);
    }
}
