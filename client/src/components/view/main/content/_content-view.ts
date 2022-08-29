import './content.scss'
import View from "../view";
import Observer from "../../../controller/observer";
import INotify from "../../../interfaces/i-notify";
import { loadCargo } from "./cargo/_cargo-view";
import { loadCompany } from "./company/_company-view";
import { loadMap, applyCurrentPosition, getPointCoordinates } from "./map/_map-view";
import { routeStart } from "./map/_map-routes";
import { loadNews } from "./news/_news-view";
import { loadTruck } from "./truck/_truck-view";
import { loadOverview } from "./overview/_overview-view";
import { userRoleActions } from "../_user-adapter";
import ILocale from "../../../interfaces/i-locale";
import { AppEvents } from "../../../controller/app-events";
import LocaleModel from "../../../models/common/localization/locale-model";
import { LocaleKeys } from "../../../models/common/localization/locale-keys";

export default class ContentView extends View implements INotify, ILocale {
    private _rootContainer = document.body;

    private readonly ASIDE_CONTAINER = 'aside';
    private readonly ASIDE_LIST = 'ul';
    private readonly ASIDE_LIST_ITEM = 'li';
    private _asideElement = document.createElement(this.ASIDE_CONTAINER);

    private readonly MAIN_CONTAINER = 'main';
    private _contentElement = document.createElement(this.MAIN_CONTAINER);

    constructor(observer: Observer) {
        super(observer);
        this.createMainContent();
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
        }
    }
    private createMainContent(): void {
        this._rootContainer.appendChild(this._asideElement);
        this._rootContainer.appendChild(this._contentElement);
        const asideList = document.createElement(this.ASIDE_LIST);
        for (const el in userRoleActions){
            const asideItem = document.createElement(this.ASIDE_LIST_ITEM);
            const asideItemImg = document.createElement('img');
            asideItemImg.src = `./assets/icons/${el}.png`
            const asideItemSpan = document.createElement('span');
            asideItemSpan.textContent = userRoleActions[el];
            asideItem.dataset.link = el;
            asideItem.appendChild(asideItemImg);
            asideItem.appendChild(asideItemSpan);
            asideList.appendChild(asideItem);
        }
        this._asideElement.appendChild(asideList);
        loadOverview(this._contentElement)

        asideList.addEventListener('click', (event) => {
            const tag = event.target as HTMLElement;
            const li = tag.closest('li');
            
            function switchActive(target: HTMLElement){
                const list = asideList.querySelectorAll('li') as NodeListOf<HTMLElement>;
                for (const l of list){
                    l.classList.remove('active')
                }
                target.classList.add('active')
            }
            
            if (li !== null) {
                switch (li.dataset.link) {
                    case 'mainAsideCargo':
                        switchActive(li);
                        loadCargo(this._contentElement);
                        break;
                    case 'mainAsideCompanies':
                        switchActive(li)
                        li.classList.add('active')
                        loadCompany(this._contentElement);
                        break;
                    case 'mainAsideRoutes':
                        switchActive(li)
                        loadMap('auto', 'auto', this.MAIN_CONTAINER, 'replace')
                        applyCurrentPosition();
                        getPointCoordinates();
                        routeStart();
                        break;
                    case 'mainAsideNews':
                        switchActive(li)
                        loadNews();
                        break;
                    case 'mainAsideOverview':
                        switchActive(li)
                        loadOverview(this._contentElement)
                        break;
                    case 'mainAsideTransport':
                        switchActive(li)
                        loadTruck(this._contentElement);
                        // const trucks = new TruckContentView(this._observer)
                        break;
                }
            }
        })
    }
    setLocale(locale: LocaleModel): void {
        const asideList = this._asideElement.querySelectorAll('li') as NodeListOf<HTMLElement>;
        for (const i of asideList){
            i.textContent = locale.getPhrase(i.dataset.link as LocaleKeys)
        }
        
        const mainList = this._contentElement.querySelectorAll('[data-ln]') as NodeListOf<HTMLElement>;
        for (const ln of mainList){
            ln.textContent = locale.getPhrase(ln.dataset.ln as LocaleKeys);
        }
    }
}