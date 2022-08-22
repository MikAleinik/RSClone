import View from "../view";
import Observer from "../../../controller/observer";
import { loadCargo } from "./cargo/cargo-view";
import { loadCompany } from "./company/company-view";
import { loadMap, applyCurrentPosition, getPointCoordinates } from "./map/map-view";
import { routeStart } from "./map/map-routes";
import { loadNews } from "./news/news-view";
import { loadTruck } from "./truck/truck-view";
import { loadOverview } from "./overview/overview-view";
import { userRoleActions } from "../user-adapter";

export default class ContentView extends View {
    private _rootContainer = document.body;

    private readonly ASIDE_CONTAINER = 'aside';
    private readonly ASIDE_LIST = 'ul';
    private readonly ASIDE_LIST_ITEM = 'li';
    private _asideElement = document.createElement(this.ASIDE_CONTAINER);

    private readonly MAIN_CONTAINER = 'main';
    private _contentElement = document.createElement(this.MAIN_CONTAINER);

    constructor(observer: Observer) {
        super(observer);
        this.createAboutContent();
    }
    
    getCurrentElement(): HTMLElement {
        return this._rootContainer;
    }
    private createAboutContent(): void {
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
            if (li !== null) {
                switch (li.dataset.link) {
                    case 'cargo':
                        loadCargo(this._contentElement);
                        break;
                    case 'company':
                        loadCompany(this._contentElement);
                        break;
                    case 'map':
                        loadMap('auto', 'auto', this.MAIN_CONTAINER, 'replace')
                        applyCurrentPosition();
                        getPointCoordinates();
                        routeStart();
                        break;
                    case 'news':
                        loadNews();
                        break;
                    case 'overview':
                        loadOverview(this._contentElement)
                        break;
                    case 'truck':
                        loadTruck(this._contentElement);
                        break;
                }
            }
        })
    }
}