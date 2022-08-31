import './content.scss'
import INotify from "../../../interfaces/i-notify";
import View from "../view";
import { AppEvents } from '../../../controller/app-events';
import view from '../../index/view';
import Observer from '../../../controller/observer';
import OverviewView from './overview/overview-view';
import CargoView from './cargo/cargo-view';
import CompanyView from './company/company-view';
import TruckView from './truck/truck-view';
import RoutesView from './routes/routes-view';
import ExchangeTruckView from './exchange-truck/exchange-truck-view';
import ExchangeCargoView from './exchange-cargo/exchange-cargo-view';
import MapLeaflet from './map/map-leaflet';

export default class ContentView extends View implements INotify {
    private readonly TAG_MAIN_CONTAINER = 'main';
    private readonly TAG_ASIDE_CONTAINER = 'aside';
    private readonly TAG_ASIDE_LIST = 'ul';

    private readonly PATH_IMAGE_OVERVIEW = './assets/icons/overview.png';
    private readonly PATH_IMAGE_CARGO = './assets/icons/cargo.png';
    private readonly PATH_IMAGE_TRUCK = './assets/icons/truck.png';
    private readonly PATH_IMAGE_EXCHANGE_CARGO = './assets/icons/exchange-cargo.png';
    private readonly PATH_IMAGE_EXCHANGE_TRUCK = './assets/icons/exchange-truck.png';
    private readonly PATH_IMAGE_COMPANY = './assets/icons/company.png';
    private readonly PATH_IMAGE_ROUTES = './assets/icons/map.png';

    private _mainElement = document.createElement(this.TAG_MAIN_CONTAINER);
    private _asideElement = document.createElement(this.TAG_ASIDE_CONTAINER);

    constructor(observer: Observer) {
        super(observer);
        this.createMainContent();
    }

    notify(nameEvent: AppEvents, sender: INotify | view): void {
        switch (nameEvent) {
            default: {
                break;
            }
        }
    }
    getCurrentElement(): HTMLElement {
        return this._asideElement;
    }
    private createMainContent(): void {
        const rootContainer = document.body;
        rootContainer.appendChild(this._mainElement);
        rootContainer.appendChild(this._asideElement);

        const overviewItem = new OverviewView(this._observer, this._mainElement, this.PATH_IMAGE_OVERVIEW);
        const cargoItem = new CargoView(this._observer, this._mainElement, this.PATH_IMAGE_CARGO);
        const truckItem = new TruckView(this._observer, this._mainElement, this.PATH_IMAGE_TRUCK);
        const truckExchangeItem = new ExchangeTruckView(this._observer, this._mainElement, this.PATH_IMAGE_EXCHANGE_TRUCK);
        const cargoExchangeItem = new ExchangeCargoView(this._observer, this._mainElement, this.PATH_IMAGE_EXCHANGE_CARGO);
        const companyItem = new CompanyView(this._observer, this._mainElement, this.PATH_IMAGE_COMPANY);
        const routesItem = new RoutesView(this._observer, this._mainElement, this.PATH_IMAGE_ROUTES);

        const listItemElement = document.createElement(this.TAG_ASIDE_LIST);
        listItemElement.appendChild(overviewItem.getCurrentElement());
        listItemElement.appendChild(cargoItem.getCurrentElement());
        listItemElement.appendChild(truckItem.getCurrentElement());
        listItemElement.appendChild(cargoExchangeItem.getCurrentElement());
        listItemElement.appendChild(truckExchangeItem.getCurrentElement());
        listItemElement.appendChild(companyItem.getCurrentElement());
        listItemElement.appendChild(routesItem.getCurrentElement());

        this._asideElement.appendChild(listItemElement);

        const mapOverview = new MapLeaflet(this._observer);
        overviewItem.setMap(mapOverview);

        const mapRoute = new MapLeaflet(this._observer);
        routesItem.setMap(mapRoute);

        overviewItem.selectElement();
    }
}