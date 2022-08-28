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
    // private readonly LINK_ABOUT = 'about.html'
    private readonly LINK_INDEX_PAGE = '/';
    private readonly LINK_MAIN_PAGE = '/main.html';
    private readonly LINK_ABOUT_PAGE = '/about.html';

    private _navElement = document.createElement(this.TAG_CONTAINER);
    private _linkContactElement = document.createElement(this.TAG_LINK);
    private _linkPageElement = document.createElement(this.TAG_LINK);
    private _pageLink = this.LINK_ABOUT_PAGE;

    constructor(observer: Observer, link: string = '#') {
        super(observer);
        this.createHeaderElement(link);
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.addSender(AppEvents.AUTH_LOGOUT_USER, this);
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
                if (document.location.pathname === this.LINK_INDEX_PAGE) {
                    this._pageLink = this.LINK_ABOUT_PAGE;
                    this._linkPageElement.setAttribute('href', this.LINK_ABOUT_PAGE);
                } else {
                    this._pageLink = this.LINK_INDEX_PAGE;
                    this._linkPageElement.setAttribute('href', this.LINK_INDEX_PAGE);
                }
                this._observer.notify(AppEvents.LOCALE_GET, this);
                break;
            }
            case AppEvents.REGISTER_USER_SUCCESS: {
                if (document.location.pathname === this.LINK_ABOUT_PAGE) {
                    this._pageLink = this.LINK_MAIN_PAGE;
                    this._linkPageElement.setAttribute('href', this.LINK_MAIN_PAGE);
                }
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
        switch(this._pageLink) {
            case this.LINK_INDEX_PAGE: {
                this._linkPageElement.textContent = locale.getPhrase(LocaleKeys.PAGE_LINK_INDEX);
                break;
            }
            case this.LINK_MAIN_PAGE: {
                this._linkPageElement.textContent = locale.getPhrase(LocaleKeys.PAGE_LINK_MAIN);
                break;
            }
            case this.LINK_ABOUT_PAGE: {
                this._linkPageElement.textContent = locale.getPhrase(LocaleKeys.PAGE_LINK_ABOUT);
                break;
            }
        }
    }
    setAuthorizedUser(authUser: user) {
        if (authUser.login === '') {
            if (document.location.pathname === this.LINK_INDEX_PAGE) {
                this._pageLink = this.LINK_ABOUT_PAGE;
                this._linkPageElement.setAttribute('href', this.LINK_ABOUT_PAGE);
            } else {
                this._pageLink = this.LINK_INDEX_PAGE;
                this._linkPageElement.setAttribute('href', this.LINK_INDEX_PAGE);
            }
        } else {
            if (document.location.pathname === this.LINK_MAIN_PAGE) {
                this._pageLink = this.LINK_ABOUT_PAGE;
                this._linkPageElement.setAttribute('href', this.LINK_ABOUT_PAGE);
            } else {
                this._pageLink = this.LINK_MAIN_PAGE;
                this._linkPageElement.setAttribute('href', this.LINK_MAIN_PAGE);
            }
        }
        this._observer.notify(AppEvents.LOCALE_GET, this);
    }
    private createHeaderElement(link: string): void {
        let listElement = document.createElement(this.TAG_LIST);

        this._linkPageElement.setAttribute('href', this._pageLink);
        let listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.insertAdjacentElement('beforeend', this._linkPageElement);
        listElement.insertAdjacentElement('beforeend', listItemElement);

        this._linkContactElement.setAttribute('href', this.LINK_FOOTER);
        listItemElement = document.createElement(this.TAG_LIST_ITEM);
        listItemElement.insertAdjacentElement('beforeend', this._linkContactElement);
        listElement.insertAdjacentElement('beforeend', listItemElement);

        this._navElement.insertAdjacentElement('beforeend', listElement);
    }
}