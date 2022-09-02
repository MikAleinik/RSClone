import localeModel from '../../../../models/common/localization/locale-model';
import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import view from "../../view";
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';
import AsideItemView from '../aside-item-view';
import Car from '../../../../../types/car';
import User from '../../../../../types/user';

export default class TruckView extends AsideItemView {
    private readonly TAG_FIELDSET = 'fieldset';
    private readonly TAG_FIELDSET_ITEM = 'div';
    private readonly TAG_LEGEND = 'legend';
    private readonly TAG_FIELDSET_INPUT = 'input';
    private readonly TAG_FIELDSET_LABEL = 'label';
    private readonly TAG_FIELDSET_SELECT = 'select';
    private readonly TAG_FIELDSET_OPTION = 'option';
    private readonly TAG_FIELDSET_BUTTON = 'button';

    private readonly TAG_TABLE_CONTAINER = 'div';
    private readonly TAG_TABLE_ROW = 'div';
    private readonly TAG_TABLE_ROW_DATA = 'span';

    private readonly CLASS_FIELDSET = 'item_form';
    private readonly CLASS_FIELDSET_ITEM = 'field__container';
    private readonly CLASS_FIELDSET_BUTTON_CONTAINER = 'field__button_container';
    private readonly CLASS_FIELDSET_BUTTON_HIDDEN = 'invisible';
    private readonly CLASS_TABLE_WRAPPER = 'table__wrapper';
    private readonly CLASS_TABLE_CONTAINER = 'table__container';
    private readonly CLASS_TABLE_HEADER = 'table__header';
    private readonly CLASS_TABLE_ROW = 'table__row';
    private readonly CLASS_TABLE_DATA = 'table__data';

    private readonly CURRENCY = new Array('USD', 'EUR', 'BYN', 'RUB');
    private readonly ID_ROLE_CUSTOMER = '1';
    private readonly ID_ROLE_CARRIER = '2';

    private _formFilterLegend = document.createElement(this.TAG_LEGEND);
    private _tableHeaderModel = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderPrice = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderCurrency = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderWeight = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderVolume = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderDescription = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderPoint = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableContainer = document.createElement(this.TAG_TABLE_CONTAINER);

    private _formItemModel = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemPrice = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemCurrency = document.createElement(this.TAG_FIELDSET_SELECT);
    private _formItemWeight = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemVolume = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemDescription = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemPoint = document.createElement(this.TAG_FIELDSET_INPUT);

    private _formItemModelLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemPriceLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemCurrencyLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemWeightLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemVolumeLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemDescriptionLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemPointLabel = document.createElement(this.TAG_FIELDSET_LABEL);

    private _formItemButtonCreate = document.createElement(this.TAG_FIELDSET_BUTTON);
    private _formItemButtonSave = document.createElement(this.TAG_FIELDSET_BUTTON);
    private _formItemButtonDelete = document.createElement(this.TAG_FIELDSET_BUTTON);
    private _formItemButtonClear = document.createElement(this.TAG_FIELDSET_BUTTON);

    private _cars = new Map<HTMLElement, Car>();
    private _selectedCar: Car | false;

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.AUTH_GET_AUTH_USER, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
        this._observer.notify(AppEvents.MAIN_CAR_GET_BY_USER, this);
        this._selectedCar = false;
    }
    notify(nameEvent: AppEvents, sender: INotify | view): void {
        switch (nameEvent) {
            case AppEvents.LOCALE_SET: {
                this._observer.notify(AppEvents.LOCALE_GET, this);
                break;
            }
        }
    }
    setAuthorizedUser(authUser: User | false) {
        if (authUser !== false && authUser.role_id !== this.ID_ROLE_CARRIER) {
            this._itemElement.style.display = 'none';
        } else {
            //TODO
        }
    }
    setAllCar(cars: Array<Car>): void {
        this.clearTable();
        this._cars.clear();
        for (let i = 0; i < cars.length; i += 1) {
            const rowElement = this.createRow(cars[i]);
            rowElement.addEventListener('click', this.rowClickHandler.bind(this));
            this._cars.set(rowElement, cars[i]);
            this._tableContainer.appendChild(rowElement);
        }
    }
    deleteCarSuccess(car: Car) {
        this._cars.forEach((value, key) => {
            if (value.id === car.id) {
                key.remove();
                this.clearCarHandler();
                this._observer.notify(AppEvents.MAIN_CARGO_DELETE_SUCCESS, this, car);
            }
        });
    }
    deleteCarFail(car: Car) {
        this.clearCarHandler();
    }
    changeCarSuccess(car: Car) {
        this._cars.forEach((value, key) => {
            if (value.id === car.id) {
                value = car;
                key.children[0].textContent = car.model;
                key.children[1].textContent = car.point_current_lat + ' ' + car.point_current_lon;
                key.children[4].textContent = car.price.toString();
                key.children[5].textContent = car.currency;
                key.children[6].textContent = car.volume_max.toString();
                key.children[7].textContent = car.weight_max.toString();
                key.children[8].textContent = car.description;
                this.clearCarHandler();
                this._observer.notify(AppEvents.MAIN_CARGO_CHANGE_SUCCESS, this, car);
            }
        });
    }
    changeCarFail(car: Car) {
        this.clearCarHandler();
    }
    createCarSuccess(car: Car) {
        const rowElement = this.createRow(car);
        rowElement.addEventListener('click', this.rowClickHandler.bind(this));
        this._cars.set(rowElement, car);
        this._tableContainer.appendChild(rowElement);
        this.clearCarHandler();
        this._observer.notify(AppEvents.MAIN_CARGO_CREATE_SUCCESS, this, car);
    }
    createCarFail(car: Car) {
        this.clearCarHandler();
    }
    showErrorMessage(message: Map<string, string> | false) {
        if (!message) {
            console.log('TODO Ошибка получения транспорта пользователя');
        } else {
            console.log(message.get('message'));
        }
    }
    setLocale(localeModel: localeModel): void {
        this._asideItemSpan.textContent = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_TRANSPORT);
        
        this._formFilterLegend.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_PANEL_HEADER);

        this._formItemModelLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_NUMBER);
        this._formItemPriceLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_PRICE);
        this._formItemCurrencyLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_CURRENCY);
        this._formItemWeightLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_Weight);
        this._formItemVolumeLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_VOLUME);
        this._formItemDescriptionLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_DESCRIPTION);
        this._formItemPointLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_LOCATION);

        this._tableHeaderModel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_NUMBER);
        this._tableHeaderPrice.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_PRICE);
        this._tableHeaderCurrency.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_CURRENCY);
        this._tableHeaderWeight.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_Weight);
        this._tableHeaderVolume.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_VOLUME);
        this._tableHeaderDescription.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_DESCRIPTION);
        this._tableHeaderPoint.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_LOCATION);

        this._formItemButtonCreate.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_ADD_NEW);
        this._formItemButtonSave.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_SAVE);
        this._formItemButtonDelete.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_DELETE);
        this._formItemButtonClear.textContent = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_CLEAR);
    }
    protected createMainElement(): void {
        this._mainElement.appendChild(this.createForm());
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
        rowItem.textContent = (car.model !== undefined ? car.model : '');
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.className = 'table__data_from';
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = (car.point_current_lat !== undefined && car.point_current_lon !== undefined ? car.point_current_lat + ', ' + car.point_current_lon : '');
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.className = 'table__data_to';
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = (car.price !== undefined ? car.price.toString() : '');
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.className = 'table__data_price';
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = (car.currency !== undefined ? car.currency : '');
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.className = 'table__data_currency';
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = (car.volume_max !== undefined ? car.volume_max.toString() : '');
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.className = 'table__data_volume';
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = (car.weight_max !== undefined ? car.weight_max.toString() : '');
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.className = 'table__data_weight';
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = (car.description !== undefined ? car.description : '');
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.className = 'table__data_description';
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
    private createForm(): HTMLElement {
        const formElement = document.createElement(this.TAG_FIELDSET);
        formElement.classList.add(this.CLASS_FIELDSET);
        formElement.appendChild(this._formFilterLegend);

        let containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        containerItem.appendChild(this._formItemModelLabel);
        containerItem.appendChild(this._formItemModel);
        formElement.appendChild(containerItem);

        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        containerItem.appendChild(this._formItemPointLabel);
        containerItem.appendChild(this._formItemPoint);
        formElement.appendChild(containerItem);

        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        containerItem.appendChild(this._formItemPriceLabel);
        containerItem.appendChild(this._formItemPrice);
        formElement.appendChild(containerItem);

        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        containerItem.appendChild(this._formItemCurrencyLabel);
        containerItem.appendChild(this._formItemCurrency);
        for (let i = 0; i < this.CURRENCY.length; i += 1) {
            const option = document.createElement(this.TAG_FIELDSET_OPTION);
            option.textContent = this.CURRENCY[i];
            this._formItemCurrency.appendChild(option);
        }
        formElement.appendChild(containerItem);

        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        containerItem.appendChild(this._formItemVolumeLabel);
        containerItem.appendChild(this._formItemVolume);
        formElement.appendChild(containerItem);

        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        containerItem.appendChild(this._formItemWeightLabel);
        containerItem.appendChild(this._formItemWeight);
        formElement.appendChild(containerItem);

        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        containerItem.appendChild(this._formItemDescriptionLabel);
        containerItem.appendChild(this._formItemDescription);
        formElement.appendChild(containerItem);

        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_BUTTON_CONTAINER);
        containerItem.appendChild(this._formItemButtonCreate);
        containerItem.appendChild(this._formItemButtonDelete);
        containerItem.appendChild(this._formItemButtonClear);
        containerItem.appendChild(this._formItemButtonSave);
        formElement.appendChild(containerItem);
        this._formItemButtonSave.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonDelete.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonClear.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonCreate.addEventListener('click', this.createNewCarHandler.bind(this));
        this._formItemButtonSave.addEventListener('click', this.saveCarHandler.bind(this));
        this._formItemButtonDelete.addEventListener('click', this.deleteCarHandler.bind(this));
        this._formItemButtonClear.addEventListener('click', this.clearCarHandler.bind(this));

        return formElement;
    }
    private createNewCarHandler() {
        const car = {
            id: 0,
            user_id: 0,
            point_current_lat: Number(this._formItemPoint.value),
            point_current_lon: Number(this._formItemPoint.value),
            model: this._formItemModel.value,
            price: Number(this._formItemPrice.value),
            currency: this._formItemCurrency.value,
            volume_max: Number(this._formItemVolume.value),
            weight_max: Number(this._formItemWeight.value),
            date_start: new Date,
            speed: 80,
            drived: false,
            description: this._formItemDescription.value
        }
        this._observer.notify(AppEvents.MAIN_CAR_CREATE, this, car);
    }
    private saveCarHandler() {
        const selectedCar = <Car>this._selectedCar;
        const car = {
            id: selectedCar.id,
            user_id: selectedCar.user_id,
            point_current_lat: Number(this._formItemPoint.value),
            point_current_lon: Number(this._formItemPoint.value),
            model: this._formItemModel.value,
            price: Number(this._formItemPrice.value),
            currency: this._formItemCurrency.value,
            volume_max: Number(this._formItemVolume.value),
            weight_max: Number(this._formItemWeight.value),
            date_start: new Date,
            speed: 80,
            drived: false,
            description: this._formItemDescription.value
        }
        this._observer.notify(AppEvents.MAIN_CAR_CHANGE, this, car);
    }
    private deleteCarHandler() {
        this._observer.notify(AppEvents.MAIN_CAR_DELETE, this, <Car>this._selectedCar);
    }
    private clearCarHandler() {
        this._formItemButtonCreate.classList.remove(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonSave.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonClear.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonDelete.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._selectedCar = false;
        this._formItemModel.value = '';
        this._formItemPrice.value = '';
        this._formItemCurrency.value = '';
        this._formItemWeight.value = '';
        this._formItemVolume.value = '';
        this._formItemDescription.value = '';
        this._formItemPoint.value = '';
    }
    private rowClickHandler(event: Event) {
        const element: HTMLElement = <HTMLElement>event.target;
        const parent = element.closest(this.TAG_TABLE_ROW);
        if (parent !== null) {
            this._formItemButtonCreate.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
            this._formItemButtonSave.classList.remove(this.CLASS_FIELDSET_BUTTON_HIDDEN);
            this._formItemButtonClear.classList.remove(this.CLASS_FIELDSET_BUTTON_HIDDEN);
            this._formItemButtonDelete.classList.remove(this.CLASS_FIELDSET_BUTTON_HIDDEN);
            const car = <Car>this._cars.get(parent);
            this._selectedCar = car;
            this._formItemPrice.value = car.price.toString();
            this._formItemCurrency.value = car.currency;
            this._formItemWeight.value = car.weight_max.toString();
            this._formItemVolume.value = car.volume_max.toString();
            this._formItemDescription.value = car.description;
            this._formItemPoint.value = car.point_current_lat.toString();
            this._formItemModel.value = car.model.toString();
        }
    }
}