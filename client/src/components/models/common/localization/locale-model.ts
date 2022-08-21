import { LocaleKeys } from "./locale-keys";

export default class LocaleModel {
    private readonly STORAGE_LOCALE_KEY = 'rsTransLocale';

    private _currentLocaleIndex = 0;
    private _localeDictionary = new Map<string, Array<string>>();

    constructor() {
        this.createDictionary();
        if (localStorage.getItem(this.STORAGE_LOCALE_KEY) === null) {
            localStorage.setItem(this.STORAGE_LOCALE_KEY, this._currentLocaleIndex.toString());
        } else {
            this._currentLocaleIndex = Number(localStorage.getItem(this.STORAGE_LOCALE_KEY));
        }
    }
    changeLocale(): void {
        this._currentLocaleIndex += 1;
        if (this._currentLocaleIndex >= this._localeDictionary.get(LocaleKeys.BUTTON_LOCALE)!.length) {
            this._currentLocaleIndex = 0;
        }
        localStorage.setItem(this.STORAGE_LOCALE_KEY, this._currentLocaleIndex.toString());
    }
    getPhrase(key: LocaleKeys): string {
        if (this._localeDictionary.get(key) !== undefined) {
            return this._localeDictionary.get(key)![this._currentLocaleIndex];
        }
        return '';
    }
    private createDictionary() {
        this._localeDictionary.set(LocaleKeys.BUTTON_LOCALE, new Array('En', 'Ru'));
        this._localeDictionary.set(LocaleKeys.BUTTON_LOGIN, new Array('LogIn', 'Вход'));
        this._localeDictionary.set(LocaleKeys.BUTTON_LOGOUT, new Array('LogOut', 'Выход'));
        this._localeDictionary.set(LocaleKeys.BUTTON_REGISTER, new Array('Register', 'Регистрация'));
        this._localeDictionary.set(LocaleKeys.BUTTON_CANCEL, new Array('Cancel', 'Отмена'));
        this._localeDictionary.set(LocaleKeys.AUTH_HEADER, new Array('User authorization', 'Авторизация пользователя'));
        this._localeDictionary.set(LocaleKeys.AUTH_EMAIL, new Array('Email', 'Эл.почта'));
        this._localeDictionary.set(LocaleKeys.AUTH_PASSWORD, new Array('Password', 'Пароль'));
        this._localeDictionary.set(LocaleKeys.REGISTER_HEADER, new Array('Registration new user', 'Регистрация пользователя'));
        this._localeDictionary.set(LocaleKeys.REGISTER_LOGIN, new Array('Login', 'Логин'));
        this._localeDictionary.set(LocaleKeys.REGISTER_EMAIL, new Array('Email', 'Эл.почта'));
        this._localeDictionary.set(LocaleKeys.REGISTER_PASSWORD, new Array('Password', 'Пароль'));
        this._localeDictionary.set(LocaleKeys.PAGE_LINK_CONTACT, new Array('Contact', 'Контакты'));
        this._localeDictionary.set(LocaleKeys.PAGE_LINK_ABOUT, new Array('About', 'О проекте'));
        this._localeDictionary.set(LocaleKeys.PROMO_HEADER, new Array('Freight exchange', 'Биржа грузоперевозок'));
        this._localeDictionary.set(LocaleKeys.PROMO_FIRST, new Array('unite carriers and cargo owners', 'объединяем перевозчиков и грузовладельцев'));
        this._localeDictionary.set(LocaleKeys.PROMO_SECOND, new Array('show the position of transport and cargo', 'показываем положение транспорта и груза'));
        this._localeDictionary.set(LocaleKeys.PROMO_THIRD, new Array('provide a platform for communication', 'предоставляем площадку для общения'));
    }
}