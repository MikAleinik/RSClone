import { AppEvents } from '../../../controller/app-events';
import Observer from '../../../controller/observer';
import ILocale from '../../../interfaces/i-locale';
import INotify from '../../../interfaces/i-notify';
import { LocaleKeys } from '../../../models/common/localization/locale-keys';
import LocaleModel from '../../../models/common/localization/locale-model';
import View from '../../index/view';
import './page-navigation.scss';

export default class PageNavigationView extends View implements INotify, ILocale {
    private readonly TAG_CONTAINER = 'nav';
    private readonly TAG_LIST = 'ul';
    private readonly TAG_LIST_ITEM = 'li';
    private readonly TAG_LINK = 'a';

    private readonly LINK_FOOTER = '#footer';
    // private readonly TEXT_CONTACT = 'Contact';//TODO (local) выносится в локализацию
    private readonly LINK_ABOUT = 'about.html'
    // private readonly TEXT_ABOUT = 'About';//TODO (local) выносится в локализацию

    private _navElement = document.createElement(this.TAG_CONTAINER);
    private _linkContactElement = document.createElement(this.TAG_LINK);
    private _linkAboutElement = document.createElement(this.TAG_LINK);

    constructor(observer: Observer, link: string = '#') {
        super(observer);
        this.createHeaderElement(link);
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
    }
    getCurrentElement(): HTMLElement {
        return this._navElement;
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
        this._linkContactElement.textContent = locale.getPhrase(LocaleKeys.PAGE_LINK_CONTACT);
        this._linkAboutElement.textContent = locale.getPhrase(LocaleKeys.PAGE_LINK_ABOUT);
    }
    private createHeaderElement(link: string): void {
        let listElement = document.createElement(this.TAG_LIST);

        this._linkAboutElement.setAttribute('href', this.LINK_ABOUT);
        let listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.insertAdjacentElement('beforeend', this._linkAboutElement);
        listElement.insertAdjacentElement('beforeend', listItemElement);

        this._linkContactElement.setAttribute('href', this.LINK_FOOTER);
        listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.insertAdjacentElement('beforeend', this._linkContactElement);
        listElement.insertAdjacentElement('beforeend', listItemElement);

        this._navElement.insertAdjacentElement('beforeend', listElement);
    }
}