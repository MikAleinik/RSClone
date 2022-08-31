import localeModel from '../../../../models/common/localization/locale-model';
import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import view from "../../view";
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';
import AsideItemView from '../aside-item-view';
import MapLeaflet from '../map/map-leaflet';
import './overview.scss';
import user from '../../../../../types/user';

export default class OverviewView extends AsideItemView {
    private readonly TAG_USER_DATA = 'div';
    private readonly CLASS_USER_CONTAINER = 'user__container';
    private readonly CLASS_USER_DATA = 'user__data';

    private _map!: MapLeaflet;

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
        this._observer.notify(AppEvents.AUTH_GET_AUTH_USER, this);
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
        this._asideItemSpan.textContent = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_OVERVIEW);
    }
    setMap(map: MapLeaflet) {
        this._map = map;
        this._mainElement.appendChild(this._map.getMap());
    }
    setAuthorizedUser(authUser: user | false){
        console.log(authUser);
    }
    protected itemClickedHandler(): void {
        this._mainContainer.firstElementChild?.remove();
        this._mainContainer.appendChild(this._mainElement);
        this._map.createMap();
    }
    protected createMainElement(): void {
        this._mainElement.classList.add(this.CLASS_USER_CONTAINER);

        const userElement = document.createElement(this.TAG_USER_DATA);
        userElement.classList.add(this.CLASS_USER_DATA);
        userElement.textContent = 'OverviewView';

        this._mainElement.appendChild(userElement);
    }
}