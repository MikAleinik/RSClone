import './content.scss';
import NewsView from "./news/news-view";
import View from "../view";
import Observer from "../../../controller/observer";
import INotify from '../../../interfaces/i-notify';
import ILocale from '../../../interfaces/i-locale';
import { AppEvents } from '../../../controller/app-events';
import LocaleModel from '../../../models/common/localization/locale-model';
import { LocaleKeys } from '../../../models/common/localization/locale-keys';

export default class ContentView extends View implements INotify, ILocale {
    private readonly TAG_CONTAINER = 'main';
    private readonly TAG_PROMO = 'div';
    private readonly TAG_HEADER = 'h3';
    private readonly TAG_LIST = 'ul';
    private readonly TAG_LIST_ITEM = 'li';
    private readonly CLASS_PROMO = 'promo';

    private _contentElement = document.createElement(this.TAG_CONTAINER);
    private _headerListElement = document.createElement(this.TAG_HEADER);
    private _listItemFirstElement = document.createElement(this.TAG_LIST_ITEM);
    private _listItemSecondElement = document.createElement(this.TAG_LIST_ITEM);
    private _listItemThirdElement = document.createElement(this.TAG_LIST_ITEM);

    constructor(observer: Observer) {
        super(observer);
        this.createContentElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
    }
    getCurrentElement(): HTMLElement {
        return this._contentElement;
    }
    notify(nameEvent: AppEvents): AppEvents | void {
        switch (nameEvent) {
            case AppEvents.LOCALE_SET: {
                this._observer.notify(AppEvents.LOCALE_GET, this);
                break;
            }
            default: {
                break;
            }
        }
    }
    setLocale(locale: LocaleModel): void {
        this._headerListElement.textContent = locale.getPhrase(LocaleKeys.PROMO_HEADER);
        this._listItemFirstElement.textContent = locale.getPhrase(LocaleKeys.PROMO_FIRST);
        this._listItemSecondElement.textContent = locale.getPhrase(LocaleKeys.PROMO_SECOND);
        this._listItemThirdElement.textContent = locale.getPhrase(LocaleKeys.PROMO_THIRD);
    }
    private createContentElement(): void {
        let promoElement = document.createElement(this.TAG_PROMO);
        promoElement.classList.add(this.CLASS_PROMO);

        let listElement = document.createElement(this.TAG_LIST);
        listElement.insertAdjacentElement('beforeend', this._listItemFirstElement);
        listElement.insertAdjacentElement('beforeend', this._listItemSecondElement);
        listElement.insertAdjacentElement('beforeend', this._listItemThirdElement);

        promoElement.insertAdjacentElement('beforeend', this._headerListElement);
        promoElement.insertAdjacentElement('beforeend', listElement);

        let newsElement = new NewsView(this._observer);
        this._contentElement.insertAdjacentElement('beforeend', promoElement);
        this._contentElement.insertAdjacentElement('beforeend', newsElement.getCurrentElement());
    }
}