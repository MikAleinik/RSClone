import localeModel from '../../../../models/common/localization/locale-model';
import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import view from "../../view";
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';
import AsideItemView from '../aside-item-view';
import Cargo from '../../../../../types/cargo';

export default class ExchangeCargoView extends AsideItemView {
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
    private _tableHeaderPrice = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderCurrency = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderWeight = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderVolume = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderDescription = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderCompany = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderContact = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderPointStart = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderPointEnd = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    // private _tableHeaderDate = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableBody = document.createElement(this.TAG_TABLE_BODY);

    private _cargoes = new Array<Cargo>();

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
        this._observer.notify(AppEvents.MAIN_CARGO_GET_ALL, this);
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
        this._asideItemSpan.textContent = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_EXCHANGE_CARGO);

        this._formFilterLegend.textContent = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_HEADER);
        this._tableHeaderPointStart.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_LOCATION_FROM);
        this._tableHeaderPointEnd.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_LOCATION_TO);
        this._tableHeaderCompany.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_COMPANY);
        this._tableHeaderContact.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_USER);
        this._tableHeaderPrice.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_PRICE);
        this._tableHeaderCurrency.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_CURRENCY);
        this._tableHeaderVolume.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_VOLUME);
        this._tableHeaderWeight.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_Weight);
        this._tableHeaderDescription.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_DESCRIPTION);
        // this._tableHeaderDate.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_DATE);

    }
    setAllCargo(cargoes: Array<Cargo>): void {
        this._cargoes = cargoes;
        this.clearTable();
        for (let i = 0; i < this._cargoes.length; i += 1) {
            this._tableBody.appendChild(this.createRow(this._cargoes[i]));
        }
    }
    showErrorMessage(message: Map<string, string> | false) {
        if (!message) {
            console.log('TODO Ошибка получения всех грузов');
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
    private createRow(cargo: Cargo): HTMLElement {
        const rowElement = document.createElement(this.TAG_TABLE_ROW);
        let rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = cargo.point_start_lat + ', ' + cargo.point_start_lon;
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = cargo.point_end_lat + ', ' + cargo.point_end_lon;
        rowElement.appendChild(rowItem);
        // rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        // rowItem.textContent = cargo.date_from.getDate().toString() + '-' + (cargo.date_from.getMonth() + 1).toString() + '-' + cargo.date_from.getFullYear().toString();
        // rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);//TODO запрос на название компании
        rowItem.textContent = cargo.user_id.toString();
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);//TODO запрос на название контакта
        rowItem.textContent = cargo.user_id.toString();
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = cargo.price.toString();
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = cargo.currency;
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = cargo.volume.toString();
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = cargo.weigth.toString();
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_BODY_ITEM);
        rowItem.textContent = cargo.description;
        rowElement.appendChild(rowItem);
        return rowElement;
    }
    private createTable(): HTMLElement {
        const tableWrapper = document.createElement(this.TAG_TABLE_CONTAINER);
        tableWrapper.classList.add(this.CLASS_TABLE_CONTAINER);

        const tableHeaderContainer = document.createElement(this.TAG_TABLE);
        const tableHeader = document.createElement(this.TAG_TABLE_HEADER);
        const tableHeaderRow = document.createElement(this.TAG_TABLE_ROW);
        tableHeaderRow.appendChild(this._tableHeaderPointStart);
        tableHeaderRow.appendChild(this._tableHeaderPointEnd);
        // tableHeaderRow.appendChild(this._tableHeaderDate);
        tableHeaderRow.appendChild(this._tableHeaderCompany);
        tableHeaderRow.appendChild(this._tableHeaderContact);
        tableHeaderRow.appendChild(this._tableHeaderPrice);
        tableHeaderRow.appendChild(this._tableHeaderCurrency);
        tableHeaderRow.appendChild(this._tableHeaderVolume);
        tableHeaderRow.appendChild(this._tableHeaderWeight);
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