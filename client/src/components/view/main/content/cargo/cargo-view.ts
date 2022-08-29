import localeModel from '../../../../models/common/localization/locale-model';
import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import view from "../../view";
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';
import AsideItemView from '../aside-item-view';

export default class CargoView extends AsideItemView {
    private readonly TAG_FIELDSET = 'legend';
    private readonly TAG_FIELDSET_INPUT = 'input';
    private readonly TAG_FIELDSET_LABEL = 'label';

    private _formItemModel = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemPrice = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemCurrency = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemWeight = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemVolume = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemDescription = document.createElement(this.TAG_FIELDSET_INPUT);

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
    }
    notify(nameEvent: AppEvents, sender: INotify | view): void {
        switch (nameEvent) {
            case AppEvents.LOCALE_SET: {
                this._observer.notify(AppEvents.LOCALE_GET, this);
                break;
            }
        }
    }
    setLocale(localeModel: localeModel): void {
        this._asideItemSpan.textContent = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_CARGO);
    }
    protected createMainElement(): void {
        this._mainElement.textContent = 'CargoView';
    }
}