import './content.scss';
import View from "../view";
import Observer from "../../../controller/observer";
import INotify from '../../../interfaces/i-notify';
import ILocale from '../../../interfaces/i-locale';
import { AppEvents } from '../../../controller/app-events';
import LocaleModel from '../../../models/common/localization/locale-model';
import { LocaleKeys } from '../../../models/common/localization/locale-keys';

export default class ContentView extends View implements INotify, ILocale {
    private readonly TAG_ARTICLE_HEADER = 'h3';
    private readonly TAG_ARTICLE_BODY = 'p';
    private readonly TAG_ARTICLE_BODY_LIST = 'ul';
    private readonly TAG_ARTICLE_BODY_LIST_ITEM = 'li';
    private readonly TAG_ARTICLE_BODY_IMG = 'img';
    private readonly TAG_ARTICLE_BODY_TEAM = 'div';
    private readonly TAG_ARTICLE_BODY_TEAM_HEADER = 'h3';
    private readonly TAG_ARTICLE_BODY_TEAM_TEXT = 'p';
    private readonly CLASS_ARTICLE_TEAM_ROW = 'team__container';
    private readonly CLASS_ARTICLE_TEAM_IMAGE = 'team__image';
    private readonly CLASS_ARTICLE_TEAM_INFO = 'team__info';

    private readonly ID_FIRST_ARTICLE = '0';
    private readonly ID_SECOND_ARTICLE = '1';
    private readonly ID_THIRD_ARTICLE = '2';

    private _rootContainer = document.body;

    private readonly ASIDE_CONTAINER = 'aside';
    private readonly ASIDE_LIST = 'ul';
    private readonly ASIDE_LIST_ITEM = 'li';
    private _asideElement = document.createElement(this.ASIDE_CONTAINER);

    private readonly MAIN_CONTAINER = 'main';
    private readonly ARTICLE_CONTAINER = 'article';
    private _contentElement = document.createElement(this.MAIN_CONTAINER);

    private _listItemFirstElement = document.createElement(this.ASIDE_LIST_ITEM);
    private _listItemSecondElement = document.createElement(this.ASIDE_LIST_ITEM);
    private _listItemThirdElement = document.createElement(this.ASIDE_LIST_ITEM);
    private _headerFirstElement = document.createElement(this.TAG_ARTICLE_HEADER);
    private _headerSecondElement = document.createElement(this.TAG_ARTICLE_HEADER);
    private _headerThirdElement = document.createElement(this.TAG_ARTICLE_HEADER);
    private _articleFirstP1Element = document.createElement(this.TAG_ARTICLE_BODY);
    private _articleFirstP2Element = document.createElement(this.TAG_ARTICLE_BODY);
    private _articleFirstP3Element = document.createElement(this.TAG_ARTICLE_BODY_LIST_ITEM);
    private _articleFirstP4Element = document.createElement(this.TAG_ARTICLE_BODY_LIST_ITEM);
    private _articleFirstP5Element = document.createElement(this.TAG_ARTICLE_BODY_LIST_ITEM);
    private _articleFirstP6Element = document.createElement(this.TAG_ARTICLE_BODY_LIST_ITEM);
    private _articleFirstP7Element = document.createElement(this.TAG_ARTICLE_BODY_LIST_ITEM);
    private _articleFirstP8Element = document.createElement(this.TAG_ARTICLE_BODY_LIST_ITEM);
    private _articleFirstP9Element = document.createElement(this.TAG_ARTICLE_BODY_LIST_ITEM);
    private _articleFirstP10Element = document.createElement(this.TAG_ARTICLE_BODY_LIST_ITEM);
    private _articleSecondP1Element = document.createElement(this.TAG_ARTICLE_BODY);
    private _articleSecondP2Element = document.createElement(this.TAG_ARTICLE_BODY_LIST_ITEM);
    private _articleSecondP3Element = document.createElement(this.TAG_ARTICLE_BODY_LIST_ITEM);
    private _articleSecondP4Element = document.createElement(this.TAG_ARTICLE_BODY);
    private _articleSecondP5Element = document.createElement(this.TAG_ARTICLE_BODY);
    private _articleSecondP6Element = document.createElement(this.TAG_ARTICLE_BODY);
    private _articleSecondP7Element = document.createElement(this.TAG_ARTICLE_BODY);
    private _articleSecondP8Element = document.createElement(this.TAG_ARTICLE_BODY);
    private _articleSecondP9Element = document.createElement(this.TAG_ARTICLE_BODY);
    private _articleSecondP10Element = document.createElement(this.TAG_ARTICLE_BODY);
    private _teamHeaderElementP1 = document.createElement(this.TAG_ARTICLE_BODY_TEAM_HEADER);
    private _teamHeaderElementP2 = document.createElement(this.TAG_ARTICLE_BODY_TEAM_HEADER);
    private _teamHeaderElementP3 = document.createElement(this.TAG_ARTICLE_BODY_TEAM_HEADER);
    private _teamBodyElementP1 = document.createElement(this.TAG_ARTICLE_BODY_TEAM_TEXT);
    private _teamBodyElementP2 = document.createElement(this.TAG_ARTICLE_BODY_TEAM_TEXT);
    private _teamBodyElementP3 = document.createElement(this.TAG_ARTICLE_BODY_TEAM_TEXT);

    private _articleThirdElement = document.createElement(this.TAG_ARTICLE_BODY);

    constructor(observer: Observer) {
        super(observer);
        this.createAboutContent();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
    }
    getCurrentElement(): HTMLElement {
        return this._rootContainer;
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
        this._listItemFirstElement.textContent = locale.getPhrase(LocaleKeys.ABOUT_FIRST_HEADER);
        this._listItemSecondElement.textContent = locale.getPhrase(LocaleKeys.ABOUT_SECOND_HEADER);
        this._listItemThirdElement.textContent = locale.getPhrase(LocaleKeys.ABOUT_THIRD_HEADER);
        this._headerFirstElement.textContent = locale.getPhrase(LocaleKeys.ABOUT_FIRST_HEADER);
        this._headerSecondElement.textContent = locale.getPhrase(LocaleKeys.ABOUT_SECOND_HEADER);
        this._headerThirdElement.textContent = locale.getPhrase(LocaleKeys.ABOUT_THIRD_HEADER);
        this._articleFirstP1Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_FIRST_BODY_P1);
        this._articleFirstP2Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_FIRST_BODY_P2);
        this._articleFirstP3Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_FIRST_BODY_P3);
        this._articleFirstP4Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_FIRST_BODY_P4);
        this._articleFirstP5Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_FIRST_BODY_P5);
        this._articleFirstP6Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_FIRST_BODY_P6);
        this._articleFirstP7Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_FIRST_BODY_P7);
        this._articleFirstP8Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_FIRST_BODY_P8);
        this._articleFirstP9Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_FIRST_BODY_P9);
        this._articleFirstP10Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_FIRST_BODY_P10);
        this._articleSecondP1Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_SECOND_BODY_P1);
        this._articleSecondP2Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_SECOND_BODY_P2);
        this._articleSecondP3Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_SECOND_BODY_P3);
        this._articleSecondP4Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_SECOND_BODY_P4);
        this._articleSecondP5Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_SECOND_BODY_P5);
        this._articleSecondP6Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_SECOND_BODY_P6);
        this._articleSecondP7Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_SECOND_BODY_P7);
        this._articleSecondP8Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_SECOND_BODY_P8);
        this._articleSecondP9Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_SECOND_BODY_P9);
        this._articleSecondP10Element.textContent = locale.getPhrase(LocaleKeys.ABOUT_SECOND_BODY_P10);
        this._articleThirdElement.textContent = locale.getPhrase(LocaleKeys.ABOUT_THIRD_BODY);
        this._teamHeaderElementP1.textContent = locale.getPhrase(LocaleKeys.ABOUT_THIRD_HEADER_P1);
        this._teamHeaderElementP2.textContent = locale.getPhrase(LocaleKeys.ABOUT_THIRD_HEADER_P2);
        this._teamHeaderElementP3.textContent = locale.getPhrase(LocaleKeys.ABOUT_THIRD_HEADER_P3);
        this._teamBodyElementP1.textContent = locale.getPhrase(LocaleKeys.ABOUT_THIRD_INFO_P1);
        this._teamBodyElementP2.textContent = locale.getPhrase(LocaleKeys.ABOUT_THIRD_INFO_P2);
        this._teamBodyElementP3.textContent = locale.getPhrase(LocaleKeys.ABOUT_THIRD_INFO_P3);
    }
    private createAboutContent(): void {
        this._rootContainer.appendChild(this._asideElement);
        this._rootContainer.appendChild(this._contentElement)
        const asideList = document.createElement(this.ASIDE_LIST);
        this._listItemFirstElement.dataset.link = this.ID_FIRST_ARTICLE;
        this._listItemSecondElement.dataset.link = this.ID_SECOND_ARTICLE;
        this._listItemThirdElement.dataset.link = this.ID_THIRD_ARTICLE;
        asideList.appendChild(this._listItemFirstElement);
        asideList.appendChild(this._listItemSecondElement);
        asideList.appendChild(this._listItemThirdElement);

        const article = document.createElement(this.ARTICLE_CONTAINER);
        this._headerFirstElement.id = this.ID_FIRST_ARTICLE;
        this._headerSecondElement.id = this.ID_SECOND_ARTICLE;
        this._headerThirdElement.id = this.ID_THIRD_ARTICLE;

        article.appendChild(this._headerFirstElement);
        article.appendChild(this._articleFirstP1Element);
        article.appendChild(this._articleFirstP2Element);
        const appСapabilitiesList = document.createElement(this.TAG_ARTICLE_BODY_LIST);
        appСapabilitiesList.appendChild(this._articleFirstP3Element);
        appСapabilitiesList.appendChild(this._articleFirstP4Element);
        appСapabilitiesList.appendChild(this._articleFirstP5Element);
        appСapabilitiesList.appendChild(this._articleFirstP6Element);
        appСapabilitiesList.appendChild(this._articleFirstP7Element);
        appСapabilitiesList.appendChild(this._articleFirstP8Element);
        appСapabilitiesList.appendChild(this._articleFirstP9Element);
        appСapabilitiesList.appendChild(this._articleFirstP10Element);
        article.appendChild(appСapabilitiesList);

        article.appendChild(this._headerSecondElement);
        article.appendChild(this._articleSecondP1Element);
        const appStructureList = document.createElement(this.TAG_ARTICLE_BODY_LIST);
        appStructureList.appendChild(this._articleSecondP2Element);
        appStructureList.appendChild(this._articleSecondP3Element);
        article.appendChild(appStructureList);
        article.appendChild(this._articleSecondP4Element);
        article.appendChild(this._articleSecondP5Element);
        article.appendChild(this._articleSecondP6Element);
        article.appendChild(this._articleSecondP7Element);
        article.appendChild(this._articleSecondP8Element);
        article.appendChild(this._articleSecondP9Element);
        article.appendChild(this._articleSecondP10Element);

        article.appendChild(this._headerThirdElement);
        article.appendChild(this._articleThirdElement);

        let teamContainer = document.createElement(this.TAG_ARTICLE_BODY_TEAM);
        teamContainer.classList.add(this.CLASS_ARTICLE_TEAM_ROW);
        let imgElement = document.createElement(this.TAG_ARTICLE_BODY_IMG);
        imgElement.classList.add(this.CLASS_ARTICLE_TEAM_IMAGE);
        imgElement.src = './assets/images/andrey.png';
        let  teamInfoContainer = document.createElement(this.TAG_ARTICLE_BODY_TEAM_TEXT);
        teamInfoContainer.classList.add(this.CLASS_ARTICLE_TEAM_INFO);
        teamInfoContainer.appendChild(this._teamHeaderElementP1);
        teamInfoContainer.appendChild(this._teamBodyElementP1);
        teamContainer.appendChild(imgElement);
        teamContainer.appendChild(teamInfoContainer);
        article.appendChild(teamContainer);

        teamContainer = document.createElement(this.TAG_ARTICLE_BODY_TEAM);
        teamContainer.classList.add(this.CLASS_ARTICLE_TEAM_ROW);
        imgElement = document.createElement(this.TAG_ARTICLE_BODY_IMG);
        imgElement.classList.add(this.CLASS_ARTICLE_TEAM_IMAGE);
        imgElement.src = './assets/images/denis.png';
        teamInfoContainer = document.createElement(this.TAG_ARTICLE_BODY_TEAM_TEXT);
        teamInfoContainer.classList.add(this.CLASS_ARTICLE_TEAM_INFO);
        teamInfoContainer.appendChild(this._teamHeaderElementP2);
        teamInfoContainer.appendChild(this._teamBodyElementP2);
        teamContainer.appendChild(imgElement);
        teamContainer.appendChild(teamInfoContainer);
        article.appendChild(teamContainer);

        teamContainer = document.createElement(this.TAG_ARTICLE_BODY_TEAM);
        teamContainer.classList.add(this.CLASS_ARTICLE_TEAM_ROW);
        imgElement = document.createElement(this.TAG_ARTICLE_BODY_IMG);
        imgElement.classList.add(this.CLASS_ARTICLE_TEAM_IMAGE);
        imgElement.src = './assets/images/mik.png';
        teamInfoContainer = document.createElement(this.TAG_ARTICLE_BODY_TEAM_TEXT);
        teamInfoContainer.classList.add(this.CLASS_ARTICLE_TEAM_INFO);
        teamInfoContainer.appendChild(this._teamHeaderElementP3);
        teamInfoContainer.appendChild(this._teamBodyElementP3);
        teamContainer.appendChild(imgElement);
        teamContainer.appendChild(teamInfoContainer);
        article.appendChild(teamContainer);

        this._asideElement.appendChild(asideList);
        this._contentElement.appendChild(article);
        asideList.addEventListener('click', (event) => {
            const tag = event.target as HTMLElement;
            window.open(`#${tag.dataset.link}`, '_top')
        })
    }
}