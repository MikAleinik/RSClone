import localeModel from '../../../../models/common/localization/locale-model';
import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import view from "../../view";
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';
import AsideItemView from '../aside-item-view';
import Car from '../../../../../types/car';

export default class ExchangeTruckView extends AsideItemView {
    private readonly TAG_FIELDSET = 'fieldset';
    private readonly TAG_LEGEND = 'legend';
    private readonly TAG_FIELDSET_ITEM = 'div';
    private readonly TAG_FIELDSET_INPUT = 'input';
    private readonly TAG_FIELDSET_LABEL = 'label';

    private readonly TAG_TABLE_CONTAINER = 'div';
    private readonly TAG_TABLE_ROW = 'div';
    private readonly TAG_TABLE_ROW_DATA = 'span';


    private readonly CLASS_FIELDSET = 'item_form';
    private readonly CLASS_FIELDSET_ITEM = 'field__container';
    private readonly CLASS_FIELDSET_RANGE = 'field__range';
    private readonly CLASS_FIELDSET_BUTTON_CONTAINER = 'field__button_container';
    private readonly TAG_FIELDSET_BUTTON = 'button';
    private readonly CLASS_TABLE_WRAPPER = 'table__wrapper';
    private readonly CLASS_TABLE_CONTAINER = 'table__container';
    private readonly CLASS_TABLE_HEADER = 'table__header';
    private readonly CLASS_TABLE_ROW = 'table__row';
    private readonly CLASS_TABLE_DATA = 'table__data';

    private _formFilterLegend = document.createElement(this.TAG_LEGEND);
    private _formItemSearch = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemSearchLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemPrice = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemPriceRange = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemPriceLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemLoad = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemLoadRange = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemLoadLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemVolume = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemVolumeRange = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemVolumeLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemButtonClear = document.createElement(this.TAG_FIELDSET_BUTTON);

    private _tableHeaderModel = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderPrice = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderCurrency = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderWeight = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderVolume = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderDescription = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderCompany = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderUser = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderPoint = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableContainer = document.createElement(this.TAG_TABLE_CONTAINER);

    private _cars = new Map<HTMLElement, Car>();

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.addSender(AppEvents.MAIN_CAR_CREATE_SUCCESS, this);
        this._observer.addSender(AppEvents.MAIN_CAR_DELETE_SUCCESS, this);
        this._observer.addSender(AppEvents.MAIN_CAR_CHANGE_SUCCESS, this);

        this._observer.notify(AppEvents.LOCALE_GET, this);
        this._observer.notify(AppEvents.MAIN_CAR_GET_ALL, this);
    }
    notify(nameEvent: AppEvents, sender: INotify | view, params?: Map<string, string> | Car): void {
        switch (nameEvent) {
            case AppEvents.LOCALE_SET: {
                this._observer.notify(AppEvents.LOCALE_GET, this);
                break;
            }
            case AppEvents.MAIN_CAR_CREATE_SUCCESS: {
                this.carCreatedHandler(params as Car);
                break;
            }
            case AppEvents.MAIN_CAR_DELETE_SUCCESS: {
                this.carDeletedHandler(params as Car);
                break;
            }
            case AppEvents.MAIN_CAR_CHANGE_SUCCESS: {
                this.carChangedHandler(params as Car);
                break;
            }
        }
    }
    carCreatedHandler(car: Car) {
        const rowElement = this.createRow(car);
        this._cars.set(rowElement, car);
        this._tableContainer.appendChild(rowElement);
    }
    carDeletedHandler(car: Car) {
        this._cars.forEach((value, key) => {
            if (value.id === car.id) {
                key.remove();
            }
        });
    }
    carChangedHandler(car: Car) {
        this._cars.forEach((value, key) => {
            if (value.id === car.id) {
                value = car;
                key.children[0].textContent = car.model;
                key.children[1].textContent = car.point_current_lat + ' ' + car.point_current_lon;
                key.children[2].textContent = (car.user_company !== undefined ? car.user_company : '');
                const firstname = (car.user_firstname !== undefined ? car.user_firstname : '');
                const lasttname = (car.user_lastname !== undefined ? car.user_lastname : '');
                const phone = (car.user_phone !== undefined ? car.user_phone : '');
                key.children[3].textContent = firstname + ' ' + lasttname + ' ' + phone;
                key.children[4].textContent = car.price.toString();
                key.children[5].textContent = car.currency;
                key.children[6].textContent = car.volume_max.toString();
                key.children[7].textContent = car.weight_max.toString();
                key.children[8].textContent = car.description;
            }
        });
    }
    setLocale(localeModel: localeModel): void {
        this._asideItemSpan.textContent = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_EXCHANGE_TRANSPORT);
        this._formFilterLegend.textContent = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_HEADER);
        this._formItemSearchLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_SEARCH);
        this._formItemPriceLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_PRICE);
        this._formItemLoadLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_LOAD);
        this._formItemVolumeLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_VOLUME);
        this._tableHeaderModel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_NUMBER);
        this._tableHeaderPoint.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_LOCATION);
        this._tableHeaderCompany.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_COMPANY);
        this._tableHeaderUser.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_USER);
        this._tableHeaderPrice.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_PRICE);
        this._tableHeaderCurrency.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_CURRENCY);
        this._tableHeaderVolume.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_VOLUME);
        this._tableHeaderWeight.textContent = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_Weight);
        this._tableHeaderDescription.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_DESCRIPTION);
        this._formItemButtonClear.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_CLEAR);
    }
    setAllCar(cars: Array<Car>): void {
        this._observer.notify(AppEvents.MAIN_CAR_BY_USER_RECEIVED, this, cars);
        this.clearTable();
        this._cars.clear();
        for (let i = 0; i < cars.length; i += 1) {
            const rowElement = this.createRow(cars[i])
            this._tableContainer.appendChild(rowElement);
            this._cars.set(rowElement, cars[i]);
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
        while (this._tableContainer.firstElementChild) {
            this._tableContainer.firstElementChild.remove();
        }
    }
    private createRow(car: Car): HTMLElement {
        const rowElement = document.createElement(this.TAG_TABLE_ROW);
        rowElement.className = this.CLASS_TABLE_ROW
        let rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = car.model;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_model');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = car.point_current_lat + ' ' + car.point_current_lon;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_to');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = (car.user_company !== undefined ? car.user_company : '');
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_company');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        const firstname = (car.user_firstname !== undefined ? car.user_firstname : '');
        const lasttname = (car.user_lastname !== undefined ? car.user_lastname : '');
        const phone = (car.user_phone !== undefined ? car.user_phone : '');
        rowItem.textContent = firstname + ' ' + lasttname + ' ' + phone;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_contacts');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = car.price.toString();
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_price');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = car.currency;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_currency');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = car.volume_max.toString();
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_volume');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = (car.weight_max !== undefined ? car.weight_max.toString() : '');
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_weight');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = car.description;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_description');
        rowElement.appendChild(rowItem);

        return rowElement;
    }
    private createTable(): HTMLElement {
        const tableWrapper = document.createElement(this.TAG_TABLE_CONTAINER);
        tableWrapper.classList.add(this.CLASS_TABLE_WRAPPER);

        const tableHeader = document.createElement(this.TAG_TABLE_ROW);
        tableHeader.className = this.CLASS_TABLE_HEADER;

        tableHeader.appendChild(this._tableHeaderModel);
        this._tableHeaderModel.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderPoint);
        this._tableHeaderPoint.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderCompany);
        this._tableHeaderCompany.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderUser);
        this._tableHeaderUser.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderPrice);
        this._tableHeaderPrice.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderCurrency);
        this._tableHeaderCurrency.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderVolume);
        this._tableHeaderVolume.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderWeight);
        this._tableHeaderWeight.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderDescription);
        this._tableHeaderDescription.className = this.CLASS_TABLE_DATA;
        
        tableWrapper.appendChild(tableHeader);
        this._tableContainer.className = this.CLASS_TABLE_CONTAINER;
        tableWrapper.appendChild(this._tableContainer);

        return tableWrapper;
    }
    private createFilterForm(): HTMLElement {
        const formElement = document.createElement(this.TAG_FIELDSET);
        formElement.classList.add(this.CLASS_FIELDSET);
        formElement.appendChild(this._formFilterLegend);

        let containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        this._formItemSearch.setAttribute('type', 'search')
        this._formItemSearch.id = 'search';
        containerItem.appendChild(this._formItemSearchLabel);
        containerItem.appendChild(this._formItemSearch);
        formElement.appendChild(containerItem);
        
        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_RANGE);
        containerItem.appendChild(this._formItemPriceLabel)
        containerItem.appendChild(this._formItemPrice);
        this._formItemPrice.setAttribute('type', 'number')
        this._formItemPrice.id = 'price'
        this._formItemPrice.value = '20000'
        formElement.appendChild(containerItem);
        this._formItemPriceRange.setAttribute('type', 'range');
        this._formItemPriceRange.min = '0';
        this._formItemPriceRange.max = this._formItemPrice.value;
        this._formItemPriceRange.value = this._formItemPrice.value;
        containerItem.appendChild(this._formItemPriceRange);
        formElement.appendChild(containerItem);

        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_RANGE);
        containerItem.appendChild(this._formItemVolumeLabel)
        containerItem.appendChild(this._formItemVolume);
        this._formItemVolume.setAttribute('type', 'number');
        this._formItemVolume.id = 'volume';
        this._formItemVolume.value = '300';
        formElement.appendChild(containerItem);
        this._formItemVolumeRange.setAttribute('type', 'range')
        this._formItemVolumeRange.min = '0';
        this._formItemVolumeRange.max = this._formItemVolume.value;
        this._formItemVolumeRange.value = this._formItemVolume.value;
        containerItem.appendChild(this._formItemVolumeRange);
        formElement.appendChild(containerItem);
        
        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_RANGE);
        containerItem.appendChild(this._formItemLoadLabel)
        containerItem.appendChild(this._formItemLoad);
        this._formItemLoad.setAttribute('type', 'number')
        this._formItemLoad.id = 'weight'
        this._formItemLoad.value = '100'
        formElement.appendChild(containerItem);
        this._formItemLoadRange.setAttribute('type', 'range')
        this._formItemLoadRange.min = '0';
        this._formItemLoadRange.max = this._formItemLoad.value;
        this._formItemLoadRange.value = this._formItemLoad.value;
        containerItem.appendChild(this._formItemLoadRange);
        formElement.appendChild(containerItem);

        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_BUTTON_CONTAINER);
        containerItem.appendChild(this._formItemButtonClear);
        formElement.appendChild(containerItem);

        this._formItemButtonClear.addEventListener('click', (e) => {
            this._formItemSearch.value = '';
            this._formItemPrice.value = '20000';
            this._formItemLoad.value = '11000';
            this._formItemVolume.value = '3000';
            const allRows = document.querySelectorAll('.table__row') as NodeListOf<HTMLElement>;
            for (const r of allRows){
                r.style.display = 'flex'
            }
        })
        
        formElement.addEventListener('input', (e) => {
            const inputField = e.target  as HTMLInputElement;
            const allRows = document.querySelectorAll('.table__row') as NodeListOf<HTMLElement>;

            if (inputField.type === 'range'){
                const field = inputField.previousSibling as HTMLInputElement;
                field.value = inputField.value;
            }

            console.log(e.target)

            const search = inputField.id === 'search' ? inputField.value : '';
            const price = inputField.id === 'price' ? inputField.value : this._formItemPrice.value;
            const volume = inputField.id === 'volume' ? inputField.value : this._formItemVolume.value;
            const load = inputField.id === 'load' ? inputField.value : this._formItemLoad.value;
            
            for (const r of allRows){
                const textData = [
                    r.childNodes[0].textContent,
                    r.childNodes[2].textContent,
                    r.childNodes[3].textContent,
                    r.childNodes[8].textContent
                ].toString().includes(search);
                const priceData = Number(r.childNodes[4].textContent) <= Number(price);
                const volumeData = Number(r.childNodes[6].textContent) <= Number(volume);
                const loadData = Number(r.childNodes[7].textContent) <= Number(load);
                if (textData && priceData && volumeData && loadData){
                    r.style.display = 'flex'
                } else {
                    r.style.display = 'none'
                }
            }
        })

        // this._formItemButtonClear.addEventListener('click', this.clearCargoHandler.bind(this));

        return formElement;
    }
}