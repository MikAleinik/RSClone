import Cargo from '../../../../types/cargo';
import user from '../../../../types/user';
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

    private readonly LINK_INDEX_PAGE = '/';
    private readonly LINK_MAIN_PAGE = '/main.html';
    private readonly LINK_ABOUT_PAGE = '/about.html';

    private _navElement = document.createElement(this.TAG_CONTAINER);
    private _linkContactElement = document.createElement(this.TAG_LINK);
    private _linkIndexElement = document.createElement(this.TAG_LINK);
    private _linkMainElement = document.createElement(this.TAG_LINK);
    private _linkAboutElement = document.createElement(this.TAG_LINK);

    constructor(observer: Observer, link: string = '#') {
        super(observer);
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.addSender(AppEvents.AUTH_LOGOUT_USER, this);
        this._observer.addSender(AppEvents.AUTH_LOGIN_USER_SUCCESS, this);
        this._observer.addSender(AppEvents.REGISTER_USER_SUCCESS, this);
        this._observer.notify(AppEvents.AUTH_GET_AUTH_USER, this);
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
            case AppEvents.AUTH_LOGOUT_USER: {
                this._observer.notify(AppEvents.AUTH_GET_AUTH_USER, this);
                break;
            }
            case AppEvents.AUTH_LOGIN_USER_SUCCESS:
            case AppEvents.REGISTER_USER_SUCCESS: {
                this._observer.notify(AppEvents.AUTH_GET_AUTH_USER, this);
                break;
            }
            default: {
                break;
            }
        }
    }
    setLocale(locale: LocaleModel): void {
        this._linkContactElement.textContent = locale.getPhrase(LocaleKeys.PAGE_LINK_CONTACT);
        this._linkIndexElement.textContent = locale.getPhrase(LocaleKeys.PAGE_LINK_INDEX);
        this._linkMainElement.textContent = locale.getPhrase(LocaleKeys.PAGE_LINK_MAIN);
        this._linkAboutElement.textContent = locale.getPhrase(LocaleKeys.PAGE_LINK_ABOUT);
    }
    setAuthorizedUser(authUser: user | false) {
        while (this._navElement.firstChild) {
            if (this._navElement.lastChild !== null) {
                this._navElement.removeChild(this._navElement.lastChild);
            }
        }
        if (authUser === false) {
            this.createWithoutMainElement();
        } else {
            this.createWithMainElement();
        }
        this._observer.notify(AppEvents.LOCALE_GET, this);
    }
    private createWithMainElement(): void {
        let listElement = document.createElement(this.TAG_LIST);

        this._linkIndexElement.setAttribute('href', this.LINK_INDEX_PAGE);
        let listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.insertAdjacentElement('beforeend', this._linkIndexElement);
        if (document.location.pathname !== this.LINK_INDEX_PAGE) {
            listElement.insertAdjacentElement('beforeend', listItemElement);
        }

        this._linkMainElement.setAttribute('href', this.LINK_MAIN_PAGE);
        listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.insertAdjacentElement('beforeend', this._linkMainElement);
        if (document.location.pathname !== this.LINK_MAIN_PAGE) {
            listElement.insertAdjacentElement('beforeend', listItemElement);
        }

        this._linkAboutElement.setAttribute('href', this.LINK_ABOUT_PAGE);
        listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.insertAdjacentElement('beforeend', this._linkAboutElement);
        if (document.location.pathname !== this.LINK_ABOUT_PAGE) {
            listElement.insertAdjacentElement('beforeend', listItemElement);
        }

        this._linkContactElement.setAttribute('href', this.LINK_FOOTER);
        listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.insertAdjacentElement('beforeend', this._linkContactElement);
        listElement.insertAdjacentElement('beforeend', listItemElement);

        this._navElement.insertAdjacentElement('beforeend', listElement);
    }
    private createWithoutMainElement(): void {
        let listElement = document.createElement(this.TAG_LIST);

        this._linkIndexElement.setAttribute('href', this.LINK_INDEX_PAGE);
        let listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.insertAdjacentElement('beforeend', this._linkIndexElement);
        if (document.location.pathname !== this.LINK_INDEX_PAGE) {
            listElement.insertAdjacentElement('beforeend', listItemElement);
        }

        this._linkAboutElement.setAttribute('href', this.LINK_ABOUT_PAGE);
        listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.insertAdjacentElement('beforeend', this._linkAboutElement);
        if (document.location.pathname !== this.LINK_ABOUT_PAGE) {
            listElement.insertAdjacentElement('beforeend', listItemElement);
        }

        this._linkContactElement.setAttribute('href', this.LINK_FOOTER);
        listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.insertAdjacentElement('beforeend', this._linkContactElement);
        listElement.insertAdjacentElement('beforeend', listItemElement);

        this._navElement.insertAdjacentElement('beforeend', listElement);
    }
}