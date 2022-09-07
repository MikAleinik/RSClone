import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import View from "../../view";
import './news.scss';
import news from "../../../../../types/news";
import INotify from "../../../../interfaces/i-notify";
import ILocale from "../../../../interfaces/i-locale";
import Car from "../../../../../types/car";
import Cargo from "../../../../../types/cargo";
import CargoToCar from "../../../../../types/cargotocar";
import User from "../../../../../types/user";
import localeModel from "../../../../models/common/localization/locale-model";
import { LocaleKeys } from "../../../../models/common/localization/locale-keys";

export default class NewsView extends View implements INotify, ILocale {
    private readonly TAG_CONTAINER = 'div';
    private readonly TAG_NEWS_ITEM = 'div';
    private readonly TAG_NEWS_ITEM_HEADER = 'h3';
    private readonly TAG_NEWS_ITEM_TEXT = 'span';
    private readonly TAG_NEWS_ITEM_IMAGE = 'img';
    private readonly TAG_NEWS_ITEM_LINK = 'a';
    private readonly CLASS_CONTAINER = 'news__list';
    private readonly CLASS_NEWS_ITEM = 'news__item';

    private readonly LOCALE_KEY = 'locale';

    private _newsElement = document.createElement(this.TAG_CONTAINER);

    constructor(observer: Observer) {
        super(observer);
        this.createNewsElement();

        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
    }
    setLocale(localeModel: localeModel): void {
        const params = new Map<string, string>();
        params.set(this.LOCALE_KEY, localeModel.getPhrase(LocaleKeys.LOCALE));
        this._observer.notify(AppEvents.NEWS_GET_DATA, this, params);
    }
    notify(nameEvent: AppEvents, sender: View | INotify): void {
        switch (nameEvent) {
            case AppEvents.LOCALE_SET: {
                this._observer.notify(AppEvents.LOCALE_GET, this);
                break;
            }
        }
    }
    getCurrentElement(): HTMLElement {
        return this._newsElement;
    }
    createNews(news: Array<news>): void {

        while (this._newsElement.firstElementChild) {
            this._newsElement.firstElementChild.remove();
        }
        news.forEach((currentNews) => {
            this._newsElement.insertAdjacentElement('beforeend', this.createNewsItemElement(currentNews));
        });
    }
    private createNewsElement(): void {
        this._newsElement.classList.add(this.CLASS_CONTAINER);
    }
    private createNewsItemElement(currentNews: news): HTMLElement {
        const newsItemElement = document.createElement(this.TAG_NEWS_ITEM);
        newsItemElement.classList.add(this.CLASS_NEWS_ITEM);

        const headerElement = document.createElement(this.TAG_NEWS_ITEM_HEADER);
        headerElement.textContent = currentNews.title;
        const authorElement = document.createElement(this.TAG_NEWS_ITEM_TEXT);
        authorElement.textContent = currentNews.author;
        const descElement = document.createElement(this.TAG_NEWS_ITEM_TEXT);
        descElement.textContent = currentNews.description;
        const linkElement = document.createElement(this.TAG_NEWS_ITEM_LINK);
        linkElement.setAttribute('target', '_blanc');
        linkElement.href = currentNews.url;
        linkElement.textContent = 'Подробнее';
        const imageElement = document.createElement(this.TAG_NEWS_ITEM_IMAGE);
        imageElement.setAttribute('loading', 'lazy');
        imageElement.src = currentNews.urlToImage;

        newsItemElement.insertAdjacentElement('beforeend', headerElement);
        newsItemElement.insertAdjacentElement('beforeend', authorElement);
        newsItemElement.insertAdjacentElement('beforeend', imageElement);
        newsItemElement.insertAdjacentElement('beforeend', descElement);
        newsItemElement.insertAdjacentElement('beforeend', linkElement);

        return newsItemElement;
    }
}