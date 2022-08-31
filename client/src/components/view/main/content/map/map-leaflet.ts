import Leaflet, { LatLng, LatLngTuple, LeafletEventHandlerFn, Marker } from 'leaflet';
import * as GeoSearch from 'leaflet-geosearch';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet/dist/leaflet.css';
import './map-leaflet.scss';
import ILocale from '../../../../interfaces/i-locale';
import localeModel from '../../../../models/common/localization/locale-model';
import Observer from '../../../../controller/observer';
import { AppEvents } from '../../../../controller/app-events';
import INotify from '../../../../interfaces/i-notify';
import Car from '../../../../../types/car';
import Cargo from '../../../../../types/cargo';
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';

export default class MapLeaflet implements INotify, ILocale {
    private readonly TAG_MAP_WRAPPER = 'div';
    private readonly TAG_MAP_POPUP = 'div';
    private readonly TAG_MAP_POPUP_BUTTON_CONTAINER = 'div';
    private readonly TAG_MAP_POPUP_BUTTON = 'button';

    private readonly CLASS_MAP_WRAPPER = 'map__wrapper';
    private readonly CLASS_MAP_POPUP = 'map__popup_title';
    private readonly CLASS_MAP_POPUP_BUTTON_CONTAINER = 'map__popup_buttons';
    private readonly CLASS_MAP_POPUP_BUTTON = 'map__popup_small-button';

    private readonly MAP_BOX_KEY = 'pk.eyJ1IjoiaXZhbmZlZG9yb3YiLCJhIjoiY2w2bWV0d2gyMGZpNTNlbXJvdjQ2c2pvNyJ9.JsbGZNi2e7pBwvSQze-cYQ'
    private readonly URL_OSM = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    private readonly URL_OSM_DE = 'https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png';
    private readonly DEFAULT_LAT = 53.90332;
    private readonly DEFAULT_LON = 27.608643;
    private readonly DEFAULT_ZOOM = 7;

    private _observer: Observer;
    private _localeModel!: localeModel;
    private _map!: Leaflet.Map;
    private _mapContainer = document.createElement(this.TAG_MAP_WRAPPER);
    private _marker = new Map<Leaflet.Marker, Car | Cargo | string>();
    private _markerRouteFrom: Leaflet.Marker | null = null;
    private _markerRouteTo: Leaflet.Marker | null = null;
    private _popup = Leaflet.popup();
    private _search = GeoSearch.GeoSearchControl({ provider: new GeoSearch.OpenStreetMapProvider() });
    private _route: Leaflet.Routing.Control | null = null;
    private _routeMode = true;

    constructor(observer: Observer) {
        this._observer = observer;
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
    }
    notify(nameEvent: AppEvents, sender: INotify): void {
        switch (nameEvent) {
            case AppEvents.LOCALE_SET: {
                this._observer.notify(AppEvents.LOCALE_GET, this);
                break;
            }
        }
    }
    setLocale(localeModel: localeModel): void {
        this._localeModel = localeModel;
        this._popup.closeTooltip();

        this._search.searchElement.input.placeholder = this._localeModel.getPhrase(LocaleKeys.MAIN_MAP_SEARCH_FIELD);
    }
    getMap(): HTMLDivElement {
        return this._mapContainer;
    }
    clearMap() {
        this._marker = new Map<Leaflet.Marker, Car | Cargo | string>();
        this._popup.closePopup();
    }
    setRouteMode(mode: boolean) {
        this._routeMode = mode;
    }
    createMap() {
        this._mapContainer.classList.add(this.CLASS_MAP_WRAPPER);
        Leaflet.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });

        this._map = Leaflet.map(<HTMLElement>this._mapContainer);
        const tiles = Leaflet.tileLayer(this.URL_OSM_DE);
        this._map.setView(<Leaflet.LatLngTuple>[this.DEFAULT_LAT, this.DEFAULT_LON], this.DEFAULT_ZOOM)
        tiles.addTo(this._map);

        this._map.addEventListener('click', this.mapClickHandler.bind(this));

        if (this._routeMode) {
            this.createMapSearch();
        }
    }
    private mapClickHandler(event: Leaflet.LeafletMouseEvent) {
        this.getPointInfo(event.latlng.lat, event.latlng.lng)
            .then((result) => {
                const content = document.createElement(this.TAG_MAP_POPUP);
                content.classList.add(this.CLASS_MAP_POPUP);
                content.textContent = result;

                if (this._routeMode) {
                    const buttonContainer = document.createElement(this.TAG_MAP_POPUP_BUTTON_CONTAINER);
                    buttonContainer.classList.add(this.CLASS_MAP_POPUP_BUTTON_CONTAINER);
                    const buttonFrom = document.createElement(this.TAG_MAP_POPUP_BUTTON);
                    buttonFrom.classList.add(this.CLASS_MAP_POPUP_BUTTON);
                    buttonFrom.textContent = this._localeModel.getPhrase(LocaleKeys.MAIN_MAP_POINT_FROM);
                    const buttonTo = document.createElement(this.TAG_MAP_POPUP_BUTTON);
                    buttonTo.classList.add(this.CLASS_MAP_POPUP_BUTTON);
                    buttonTo.textContent = this._localeModel.getPhrase(LocaleKeys.MAIN_MAP_POINT_TO);
                    buttonContainer.appendChild(buttonFrom);
                    buttonContainer.appendChild(buttonTo);

                    content.appendChild(buttonContainer);

                    buttonFrom.addEventListener('click', () => {
                        this._popup.removeFrom(this._map);
                        this._markerRouteFrom?.remove();
                        this._markerRouteFrom = this.addMarkerToMap(event.latlng.lat, event.latlng.lng, LocaleKeys.MAIN_MAP_POINT_FROM);
                        if (this._markerRouteTo !== null) {
                            this.createRoute([this._markerRouteFrom, this._markerRouteTo]);
                        }
                    });
                    buttonTo.addEventListener('click', () => {
                        this._popup.removeFrom(this._map);
                        this._markerRouteTo?.remove();
                        this._markerRouteTo = this.addMarkerToMap(event.latlng.lat, event.latlng.lng, LocaleKeys.MAIN_MAP_POINT_TO);
                        if (this._markerRouteFrom !== null) {
                            this.createRoute([this._markerRouteFrom, this._markerRouteTo]);
                        }
                    });
                }

                this._popup.setLatLng(event.latlng)
                    .setContent(content)
                    .openOn(this._map);
            });
    }
    private addMarkerToMap(lat: number, lon: number, item: Car | Cargo | string): Leaflet.Marker {
        const marker = Leaflet.marker(<Leaflet.LatLngTuple>[lat, lon]);
        this._marker.set(marker, item);
        marker.addTo(this._map);
        marker.addEventListener('click', () => {
            console.log(this._marker.get(marker));
        });
        return marker;
    }
    private createRoute(items: Array<Leaflet.Marker>) {
        if (this._route !== null) {
            this._route.remove();
        }
        const points = new Array<Leaflet.LatLng>();
        for(let i = 0; i < items.length; i += 1) {
            points.push(items[i].getLatLng());
        }
        this._route = Leaflet.Routing.control({
            waypoints: points,
            router: Leaflet.Routing.mapbox(this.MAP_BOX_KEY, { timeout: 3000 }),
            routeWhileDragging: true,
        });
        this._route.addTo(this._map);
    }
    private getPointInfo(latitude: number, longitude: number): Promise<string> {
        return new Promise((resolve, reject) => {
            const infoUrl = 'https://nominatim.openstreetmap.org/reverse?';
            const infoFormat = 'format=json';
            const infoCoordinates = `lat=${latitude}&lon=${longitude}`
            const currentLanguage = this._localeModel.getPhrase(LocaleKeys.LOCALE);
            const infoLanguage = `accept-language="${currentLanguage}"`;
            fetch(`${infoUrl}${infoFormat}&${infoCoordinates}&${infoLanguage}`)
                .then((response) => response.json())
                .then((data) => {
                    if (this._localeModel.getPhrase(LocaleKeys.LOCALE) === 'ru') {
                        resolve(data.display_name);
                    } else {
                        resolve(this.convertTextToEn(data.display_name));
                    }
                })
                .catch((error) => reject(error));
        });
    }
    private convertTextToEn(text: string): string {
        let result = '';
        const SYMBOL_RU = new Array('а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я');
        const SYMBOL_EN = new Array('a', 'b', 'v', 'g', 'd', 'е', 'e', 'j', 'z', 'i', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh', 'sch', '', '', '', 'e', 'yu', 'ya');
        const SYMBOL_RU_UPPER = new Array('А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я');
        const SYMBOL_EN_UPPER = new Array('A', 'B', 'C', 'G', 'D', 'E', 'E', 'J', 'Z', 'I', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'H', 'C', 'Ch', 'Sh', 'Sch', '', '', '', 'E', 'Yu', 'Ya');
        for (let i = 0; i < text.length; i += 1) {
            const index = SYMBOL_RU.indexOf(text[i]);
            const indexUpper = SYMBOL_RU_UPPER.indexOf(text[i]);
            if (index !== -1) {
                result += SYMBOL_EN[index];
            } else if (indexUpper !== -1) {
                result += SYMBOL_EN_UPPER[indexUpper];
            } else {
                result += text[i];
            }
        }
        return result;
    }
    createMapSearch(): void {
        this._search = GeoSearch.GeoSearchControl({
            provider: new GeoSearch.OpenStreetMapProvider(),
            notFoundMessage: '',
            style: 'bar'
        });
        this._map.addControl(this._search);
        this._search.searchElement.input.placeholder = this._localeModel.getPhrase(LocaleKeys.MAIN_MAP_SEARCH_FIELD);
    }
}
