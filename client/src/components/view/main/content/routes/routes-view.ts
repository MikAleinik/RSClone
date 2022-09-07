import localeModel from '../../../../models/common/localization/locale-model';
import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import view from "../../view";
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';
import AsideItemView from '../aside-item-view';
import './routes-view.scss';
import MapLeaflet from '../map/map-leaflet';

export default class RoutesView extends AsideItemView {
    private readonly CLASS_MAP_CONTAINER = 'map__container';

    private _map!: MapLeaflet;

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
        this._asideItemSpan.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_ROUTES);;        
    }
    setMap(map: MapLeaflet) {
        this._map = map;
        this._mainElement.appendChild(this._map.getMap());
    }
    protected itemClickedHandler(): void {
        this._mainContainer.firstElementChild?.remove();
        this._mainContainer.appendChild(this._mainElement);
        this._map.createMap();
    }
    protected createMainElement(): void {
        this._mainElement.classList.add(this.CLASS_MAP_CONTAINER);
    }
}