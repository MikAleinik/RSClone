import localeModel from '../../../../models/common/localization/locale-model';
import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import view from "../../view";
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';
import AsideItemView from '../aside-item-view';
import Car from '../../../../../types/car';
import '../../../common/table.scss';

export default class ExchangeTruckView extends AsideItemView {
    private readonly TAG_FIELDSET = 'fieldset';
    private readonly TAG_LEGEND = 'legend';
    private readonly TAG_FIELDSET_INPUT = 'input';
    private readonly TAG_FIELDSET_LABEL = 'label';

    private readonly TAG_TABLE_CONTAINER = 'div';
    private readonly TAG_TABLE = 'table';
    private readonly TAG_TABLE_HEADER = 'thead';
    private readonly TAG_TABLE_BODY = 'tbody';
    private readonly TAG_TABLE_ROW = 'tr';
    private readonly TAG_TABLE_ROW_HEADER_ITEM = 'th';
    private readonly TAG_TABLE_ROW_BODY_ITEM = 'td';

    private readonly CLASS_FIELDSET = 'item_form';
    private readonly CLASS_TABLE_CONTAINER = 'scroll-table';
    private readonly CLASS_TABLE_BODY = 'scroll-table__body';

    private _formFilterLegend = document.createElement(this.TAG_LEGEND);
    private _tableHeaderModel = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderPrice = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderCurrency = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderWeight = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderVolume = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    // private _tableHeaderStatus = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderDescription = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderCompany = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderUser = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderPoint = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableBody = document.createElement(this.TAG_TABLE_BODY);

    private _cars = new Array<Car>();

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
        this._observer.notify(AppEvents.MAIN_CAR_GET_ALL, this);
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
        this._asideItemSpan.textContent = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_EXCHANGE_TRANSPORT);
        this._formFilterLegend.textContent = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_HEADER);
        this._tableHeaderModel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_NUMBER);
        this._tableHeaderPoint.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_LOCATION);
        this._tableHeaderCompany.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_COMPANY);
        this._tableHeaderUser.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_USER);
        this._tableHeaderPrice.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_PRICE);
        this._tableHeaderCurrency.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_CURRENCY);
        this._tableHeaderVolume.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_VOLUME);
        this._tableHeaderWeight.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_Weight);
        // this._tableHeaderStatus.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_STATUS);
        this._tableHeaderDescription.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_DESCRIPTION);
    }
    setAllCar(cars: Array<Car>): void {
        this._cars = cars;
        this.clearTable();
        for (let i = 0; i < this._cars.length; i += 1) {
            this._tableBody.appendChild(this.createRow(this._cars[i]));
        }
    }
    showErrorMessage(message: Map<string, string> | false) {
        if (!message) {
            console.log('TODO Ошибка получения всех машин');
        } else {
            console.log(message.get('message'));
        }
    }
    protected createMainElement(): void {
        this._mainElement.appendChild(this.createFilterForm());
        this._mainElement.appendChild(this.createTable());
    }
    private clearTable(): void {
        while (this._tableBody.firstElementChild) {
            this._tableBody.firstElementChild.remove();
        }
    }
    private createRow(car: Car): HTMLElement {
        const rowElement = document.createElement(this.TAG_TABLE_ROW);
        let rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = car.model;
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = car.point_current_lat + ' ' + car.point_current_lon;
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = (car.user_company !== undefined ? car.user_company : '');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        const firstname = (car.user_firstname !== undefined ? car.user_firstname : '');
        const lasttname = (car.user_lastname !== undefined ? car.user_lastname : '');
        const phone = (car.user_phone !== undefined ? car.user_phone : '');
        rowItem.textContent = firstname + ' ' + lasttname + ' ' + phone;
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = car.price.toString();
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = car.currency;
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = car.volume_max.toString();
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = (car.weigth_max !== undefined ? car.weigth_max.toString() : '');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = car.description;
        rowElement.appendChild(rowItem);

        return rowElement;
    }
    private createTable(): HTMLElement {
        const tableWrapper = document.createElement(this.TAG_TABLE_CONTAINER);
        tableWrapper.classList.add(this.CLASS_TABLE_CONTAINER);

        const tableHeaderContainer = document.createElement(this.TAG_TABLE);
        const tableHeader = document.createElement(this.TAG_TABLE_HEADER);
        const tableHeaderRow = document.createElement(this.TAG_TABLE_ROW);
        tableHeaderRow.appendChild(this._tableHeaderModel);
        tableHeaderRow.appendChild(this._tableHeaderPoint);
        tableHeaderRow.appendChild(this._tableHeaderCompany);
        tableHeaderRow.appendChild(this._tableHeaderUser);
        tableHeaderRow.appendChild(this._tableHeaderPrice);
        tableHeaderRow.appendChild(this._tableHeaderCurrency);
        tableHeaderRow.appendChild(this._tableHeaderVolume);
        tableHeaderRow.appendChild(this._tableHeaderWeight);
        // tableHeaderRow.appendChild(this._tableHeaderStatus);
        tableHeaderRow.appendChild(this._tableHeaderDescription);
        tableHeader.appendChild(tableHeaderRow);
        tableHeaderContainer.appendChild(tableHeader);

        const tableBodyContainer = document.createElement(this.TAG_TABLE_CONTAINER);
        tableBodyContainer.classList.add(this.CLASS_TABLE_BODY);
        const tableContainer = document.createElement(this.TAG_TABLE);
        tableContainer.appendChild(this._tableBody);
        tableBodyContainer.appendChild(tableContainer);

        tableWrapper.appendChild(tableHeaderContainer);
        tableWrapper.appendChild(tableBodyContainer);
        return tableWrapper;
    }
    private createFilterForm(): HTMLElement {
        const formElement = document.createElement(this.TAG_FIELDSET);
        formElement.classList.add(this.CLASS_FIELDSET);

        formElement.appendChild(this._formFilterLegend);

        return formElement;
    }
}