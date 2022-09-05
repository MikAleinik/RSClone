import localeModel from '../../../../models/common/localization/locale-model';
import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import view from "../../view";
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';
import AsideItemView from '../aside-item-view';
import Car from '../../../../../types/car';
import User from '../../../../../types/user';
import Geopoint from '../../../../../types/geopoint';
import '../search.scss';
import CargoToCar from '../../../../../types/cargotocar';
import Cargo from '../../../../../types/cargo';

export default class TruckView extends AsideItemView {
    private readonly TAG_FIELDSET = 'fieldset';
    private readonly TAG_FIELDSET_ITEM = 'div';
    private readonly TAG_LEGEND = 'legend';
    private readonly TAG_FIELDSET_INPUT = 'input';
    private readonly TAG_FIELDSET_LABEL = 'label';
    private readonly TAG_FIELDSET_SELECT = 'select';
    private readonly TAG_FIELDSET_OPTION = 'option';
    private readonly TAG_FIELDSET_BUTTON = 'button';
    private readonly TAG_IMAGE = 'img';

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
    private readonly CLASS_WAIT_IMAGE = 'table__wait';
    private readonly CLASS_FIELDSET_SEARCH = 'search';
    private readonly CLASS_FIELDSET_SEARCH_FIELD = 'search__field';
    private readonly CLASS_FIELDSET_SEARCH_RESULT = 'search__result';
    private readonly CLASS_FIELDSET_INVALID = 'field__invalid';
    private readonly CLASS_MENU = 'menu__context';
    private readonly CLASS_MENU_HIDDEN = 'menu__context_hidden';
    private readonly CLASS_MENU_BUTTON = 'button__image';

    private readonly CURRENCY = new Array('USD', 'EUR', 'BYN', 'RUB');
    private readonly ID_ROLE_CUSTOMER = '1';
    private readonly ID_ROLE_CARRIER = '2';
    private readonly STATUS_CANCEL = 'Cancelled';
    private readonly STATUS_SUBMIT = 'Submitted';
    private readonly STATUS_PENDING = 'Pending';

    private _formFilterLegend = document.createElement(this.TAG_LEGEND);
    private _formItemSearch = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemSearchLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _tableHeaderModel = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderPrice = document.createElement(this.TAG_TABLE_ROW_DATA);
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
    private _formItemPointResultSearch = document.createElement(this.TAG_FIELDSET_ITEM);

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
    private _formItemButtonPointShow = document.createElement(this.TAG_FIELDSET_INPUT);

    private _menuElement = document.createElement(this.TAG_DIV);
    private _headerContextMenu = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableContextMenu = document.createElement(this.TAG_TABLE_CONTAINER);

    private _messageError = '';
    private _messageSended = '';
    private _messageRemoved = '';
    private _textRefuse = '';
    private _textApprove = '';

    private _cargoToCarInMenu = new Map<HTMLElement, CargoToCar>();
    private _cargoes: Array<Cargo> | undefined = undefined;
    private _selectedCar: Car | undefined = undefined;
    private _cargoToCar: Array<CargoToCar> | undefined = undefined;
    private _cars = new Map<HTMLElement, Car>();
    private _createCar = false;
    private _changeCar = false;
    private _user!: User;

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.AUTH_GET_AUTH_USER, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
        this._observer.notify(AppEvents.MAIN_CAR_GET_BY_USER, this);
        this._observer.notify(AppEvents.CARGO_TO_CAR_GET_ALL, this);
        this._observer.notify(AppEvents.MAIN_CARGO_GET_ALL, this);
        this._selectedCar = undefined;

        document.addEventListener('click', this.tableContainerClickHandler.bind(this));
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
        if (authUser !== false) {
            this._user = authUser;
            if (authUser.role_id !== this.ID_ROLE_CARRIER) {
                this._itemElement.style.display = 'none';
            }
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
                this._observer.notify(AppEvents.MAIN_CAR_DELETE_SUCCESS, this, car);
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
                key.children[1].textContent = this._formItemPoint.value;
                key.children[4].textContent = car.price.toString();
                key.children[5].textContent = car.currency;
                key.children[6].textContent = car.volume_max.toString();
                key.children[7].textContent = car.weight_max.toString();
                key.children[8].textContent = car.description;
                this.clearCarHandler();
                this._observer.notify(AppEvents.MAIN_CAR_CHANGE_SUCCESS, this, car);
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
        this._observer.notify(AppEvents.MAIN_CAR_CREATE_SUCCESS, this, car);
    }
    createCarFail(car: Car) {
        this.clearCarHandler();
    }
    setAllCargoToCar(cargoToCars: Array<CargoToCar>): void {
        this._cargoToCar = cargoToCars;
    }
    deleteCargoToCarSuccess(cargoToCar: CargoToCar) {
        alert(this._messageRemoved);
        this._observer.notify(AppEvents.CARGO_TO_CAR_DELETE_SUCCESS, this, cargoToCar);
    }
    deleteCargoToCarFail(cargoToCar: CargoToCar) {
        alert(this._messageError);
    }
    changeCargoToCarSuccess(cargoToCar: CargoToCar) {
        console.log('changeCargoToCarSuccess');
    }
    createCargoToCarSuccess(cargoToCar: CargoToCar) {
        console.log('createCargoToCarSuccess');
    }
    setAllCargo(cargoes: Array<Cargo>): void {
        this._cargoes = cargoes;
    }
    showErrorMessage(message: Map<string, string> | false) {
        if (!message) {
            console.log('TODO Ошибка получения транспорта пользователя');
        } else {
            console.log(message.get('message'));
        }
    }
    setLocale(localeModel: localeModel): void {
        this._asideItemSpan.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_TRANSPORT);

        this._formFilterLegend.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_PANEL_HEADER);
        this._formItemSearchLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_SEARCH);
        this._formItemModelLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_NUMBER);
        this._formItemPriceLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_PRICE);
        this._formItemCurrencyLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_CURRENCY);
        this._formItemWeightLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_Weight);
        this._formItemVolumeLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_VOLUME);
        this._formItemDescriptionLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_DESCRIPTION);
        this._formItemPointLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_LOCATION);

        this._tableHeaderModel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_NUMBER);
        this._tableHeaderPrice.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_PRICE);
        this._tableHeaderWeight.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_Weight);
        this._tableHeaderVolume.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_VOLUME);
        this._tableHeaderDescription.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_DESCRIPTION);
        this._tableHeaderPoint.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_LOCATION);

        this._formItemButtonCreate.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_ADD_NEW);
        this._formItemButtonSave.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_SAVE);
        this._formItemButtonDelete.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_DELETE);
        this._formItemButtonClear.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_CLEAR);
        this._headerContextMenu.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_CONTEXT_HEADER);

        this._messageError = localeModel.getPhrase(LocaleKeys.COMMON_ERROR_SAVE);
        this._messageSended = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_TO_CAR_ADD_SENDED);
        this._messageRemoved = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_TO_CAR_REMOVE_SENDED);
        this._textRefuse = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_TO_CAR_REFUSE);
        this._textApprove = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_TO_CAR_CONFIRM);
    }
    setNamePoint(result: Map<string, Array<Geopoint> | HTMLElement>) {
        const element: HTMLElement = <HTMLElement>result.get('element')!;
        const points: Array<Geopoint> = <Array<Geopoint>>result.get('points')!;
        for (let i = 0; i < points.length; i += 1) {
            const itemSearch = document.createElement('option');
            itemSearch.innerText = points[i].name;
            itemSearch.addEventListener('click', (event: Event) => {
                const selectedItem = <HTMLElement>event.target;
                const inputField = <HTMLInputElement>selectedItem.parentElement?.parentElement?.firstElementChild;
                inputField.value = <string>selectedItem.textContent;
                this.closeAllSearchResult();
            });
            element.appendChild(itemSearch);
        }
    }
    checkNameResult(result: Map<string, Array<Geopoint> | HTMLElement>) {
        let checkStart = true;
        const pointsStart: Array<Geopoint> = <Array<Geopoint>>result.get('points_start')!;
        const elementInputStart: HTMLInputElement = <HTMLInputElement>result.get('element_start')!
        if (pointsStart.length === 0) {
            elementInputStart.classList.add(this.CLASS_FIELDSET_INVALID);
            checkStart = false;
        } else {
            elementInputStart.classList.remove(this.CLASS_FIELDSET_INVALID);
        }
        if (checkStart) {
            if (this._changeCar) {
                const selectedCar = <Car>this._selectedCar;
                const car = {
                    id: selectedCar.id,
                    user_id: selectedCar.user_id,
                    point_current_lat: Number(pointsStart[0].lat),
                    point_current_lon: Number(pointsStart[0].lon),
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
                this._changeCar = false;
            }
            if (this._createCar) {
                const car = {
                    id: 0,
                    user_id: 0,
                    point_current_lat: Number(pointsStart[0].lat),
                    point_current_lon: Number(pointsStart[0].lon),
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

                this._createCar = false;
            }
        }
    }
    protected createMainElement(): void {
        this._mainElement.appendChild(this.createForm());
        this._mainElement.appendChild(this.createTable());
        this._mainElement.appendChild(this.createContextMenu());
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
        rowItem.classList.add('table__data_from');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        const waitElement = document.createElement(this.TAG_IMAGE);
        waitElement.classList.add(this.CLASS_WAIT_IMAGE);
        waitElement.src = './assets/icons/loading.gif';
        rowItem.appendChild(waitElement);
        const params = new Map();
        params.set('lat', car.point_current_lat);
        params.set('lon', car.point_current_lon);
        params.set('element', rowItem);
        this._observer.notify(AppEvents.MAP_GET_NAME, this, params);
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_to');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = (car.price !== undefined ? `${car.price.toString()} ${car.currency}` : '');
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_price');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = (car.volume_max !== undefined ? car.volume_max.toString() : '');
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_volume');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = (car.weight_max !== undefined ? car.weight_max.toString() : '');
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_weight');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = (car.description !== undefined ? car.description : '');
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
        this._tableHeaderModel.classList.add('table__data_from');
        tableHeader.appendChild(this._tableHeaderPoint);
        this._tableHeaderPoint.className = this.CLASS_TABLE_DATA;
        this._tableHeaderPoint.classList.add('table__data_from');
        tableHeader.appendChild(this._tableHeaderPrice);
        this._tableHeaderPrice.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderVolume);
        this._tableHeaderVolume.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderWeight);
        this._tableHeaderWeight.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderDescription);
        this._tableHeaderDescription.className = this.CLASS_TABLE_DATA;
        this._tableHeaderDescription.classList.add('table__data_from');

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
        this._formItemSearch.setAttribute('type', 'search')
        this._formItemSearch.id = 'search';
        containerItem.appendChild(this._formItemSearchLabel);
        containerItem.appendChild(this._formItemSearch);
        formElement.appendChild(containerItem);

        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
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
        containerItem.appendChild(this._formItemPointLabel);
        let searchContainer = document.createElement(this.TAG_FIELDSET_ITEM);
        searchContainer.classList.add(this.CLASS_FIELDSET_SEARCH);
        let searchItem = document.createElement(this.TAG_FIELDSET_ITEM);
        searchItem.classList.add(this.CLASS_FIELDSET_SEARCH_FIELD);
        searchItem.appendChild(this._formItemPoint);
        this._formItemPointResultSearch.classList.add(this.CLASS_FIELDSET_SEARCH_RESULT);
        searchItem.appendChild(this._formItemPointResultSearch);
        searchContainer.appendChild(searchItem);
        searchContainer.appendChild(this._formItemButtonPointShow);
        this._formItemButtonPointShow.type = 'image';
        this._formItemButtonPointShow.src = './assets/icons/search.png';
        this._formItemButtonPointShow.addEventListener('click', this.clickButtonPointShowHandler.bind(this));
        containerItem.appendChild(searchContainer);
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
        this._formItemButtonCreate.classList.add('big__button');
        this._formItemButtonDelete.classList.add('big__button');
        this._formItemButtonClear.classList.add('big__button');
        this._formItemButtonSave.classList.add('big__button');
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

        formElement.addEventListener('input', (e) => {
            const inputField = e.target as HTMLInputElement;
            const allRows = document.querySelectorAll('.table__row') as NodeListOf<HTMLElement>;

            const search = inputField.id === 'search' ? inputField.value : '';

            for (const r of allRows) {
                const textData = [
                    r.childNodes[0].textContent?.toLocaleLowerCase(),
                    r.childNodes[1].textContent?.toLocaleLowerCase(),
                    r.childNodes[5].textContent?.toLocaleLowerCase()
                ].toString().includes(search.toLocaleLowerCase());
                if (textData) {
                    r.style.display = 'flex'
                } else {
                    r.style.display = 'none'
                }
            }
        })

        return formElement;
    }
    private closeAllSearchResult() {
        const allResultElement = document.getElementsByClassName(this.CLASS_FIELDSET_SEARCH_RESULT);
        for (let i = 0; i < allResultElement.length; i += 1) {
            allResultElement[i].innerHTML = '';
        }
    }
    private clickButtonPointShowHandler() {
        const params = new Map();
        params.set('name', this._formItemPoint.value);
        params.set('element', this._formItemPointResultSearch);
        this._observer.notify(AppEvents.MAP_GET_LATLON, this, params);
    }
    private createNewCarHandler() {
        if (this.checkCarFields()) {
            this._createCar = true;
            const params = new Map();
            params.set('name_start', this._formItemPoint.value);
            params.set('element_start', this._formItemPoint);
            this._observer.notify(AppEvents.MAP_CHECK_NAME, this, params);
        }
    }
    private saveCarHandler() {
        if (this.checkCarFields()) {
            this._changeCar = true;
            const params = new Map();
            params.set('name_start', this._formItemPoint.value);
            params.set('element_start', this._formItemPoint);
            this._observer.notify(AppEvents.MAP_CHECK_NAME, this, params);
        }
    }
    private checkCarFields(): boolean {
        let result = new Array<boolean>();
        if (this._formItemModel.value === '') {
            this._formItemModel.classList.add(this.CLASS_FIELDSET_INVALID);
            result.push(false);
        } else {
            this._formItemModel.classList.remove(this.CLASS_FIELDSET_INVALID);
            result.push(true);
        }
        if (this._formItemPrice.value === '' || !this.isNumber(this._formItemPrice.value)) {
            this._formItemPrice.classList.add(this.CLASS_FIELDSET_INVALID);
            result.push(false);
        } else {
            this._formItemPrice.classList.remove(this.CLASS_FIELDSET_INVALID);
            result.push(true);
        }
        if (this._formItemVolume.value === '' || !this.isNumber(this._formItemVolume.value)) {
            this._formItemVolume.classList.add(this.CLASS_FIELDSET_INVALID);
            result.push(false);
        } else {
            this._formItemVolume.classList.remove(this.CLASS_FIELDSET_INVALID);
            result.push(true);
        }
        if (this._formItemWeight.value === '' || !this.isNumber(this._formItemWeight.value)) {
            this._formItemWeight.classList.add(this.CLASS_FIELDSET_INVALID);
            result.push(false);
        } else {
            this._formItemWeight.classList.remove(this.CLASS_FIELDSET_INVALID);
            result.push(true);
        }
        if (this._formItemDescription.value === '') {
            this._formItemDescription.classList.add(this.CLASS_FIELDSET_INVALID);
            result.push(false);
        } else {
            this._formItemDescription.classList.remove(this.CLASS_FIELDSET_INVALID);
            result.push(true);
        }
        return !result.includes(false);
    }
    private isNumber(value: string): boolean {
        return /^[-]?\d+$/.test(value);
    }
    private deleteCarHandler() {
        this._observer.notify(AppEvents.MAIN_CAR_DELETE, this, <Car>this._selectedCar);
    }
    private clearCarHandler() {
        this._formItemButtonCreate.classList.remove(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonSave.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonClear.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonDelete.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._selectedCar = undefined;
        this._formItemModel.value = '';
        this._formItemPrice.value = '';
        this._formItemCurrency.value = '';
        this._formItemWeight.value = '';
        this._formItemVolume.value = '';
        this._formItemDescription.value = '';
        this._formItemPoint.value = '';
        this._formItemModel.classList.remove(this.CLASS_FIELDSET_INVALID);
        this._formItemPrice.classList.remove(this.CLASS_FIELDSET_INVALID);
        this._formItemVolume.classList.remove(this.CLASS_FIELDSET_INVALID);
        this._formItemWeight.classList.remove(this.CLASS_FIELDSET_INVALID);
        this._formItemDescription.classList.remove(this.CLASS_FIELDSET_INVALID);
        this._formItemPoint.classList.remove(this.CLASS_FIELDSET_INVALID);
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
            this._formItemPoint.value = <string>parent.children[1].textContent;
            this._formItemModel.value = car.model.toString();
        }

        const cargoToCar = (this._cargoToCar !== undefined ? this._cargoToCar : new Array<CargoToCar>());
        const cargoes = (this._cargoes !== undefined ? this._cargoes : new Array<Cargo>());
        while (this._tableContextMenu.firstElementChild) {
            this._tableContextMenu.firstElementChild.remove();
        }
        this._cargoToCarInMenu.clear();
        for (let i = 0; i < cargoToCar.length; i += 1) {
            if (cargoToCar[i].id_cars === this._selectedCar?.id) {
                for (let j = 0; j < cargoes.length; j += 1) {
                    if (cargoToCar[i].id_cargo === cargoes[j].id && cargoToCar[i].agree !== this.STATUS_CANCEL) {
                        const row = this.createRowContextMenu(cargoToCar[i], cargoes[j]);
                        this._tableContextMenu.appendChild(row);
                        this._cargoToCarInMenu.set(row, cargoToCar[i]);
                    }
                }
            }
        }
    }
    private createContextMenu(): HTMLElement {
        this._menuElement = document.createElement(this.TAG_DIV);
        this._menuElement.classList.add(this.CLASS_MENU);
        this._menuElement.classList.add(this.CLASS_MENU_HIDDEN);

        this._headerContextMenu.classList.add(this.CLASS_TABLE_HEADER);
        this._tableContextMenu.classList.add(this.CLASS_TABLE_WRAPPER);

        const buttonClose = document.createElement(this.TAG_IMAGE);
        buttonClose.classList.add('button__image');
        buttonClose.classList.add('button__close');
        buttonClose.src = './assets/icons/cancel.png';
        buttonClose.addEventListener('click', ()=> {
            this._menuElement.classList.add(this.CLASS_MENU_HIDDEN);
            document.body.style.overflow = 'auto';
        });

        this._menuElement.appendChild(this._headerContextMenu);
        this._menuElement.appendChild(buttonClose);
        this._menuElement.appendChild(this._tableContextMenu);

        return this._menuElement;
    }
    private createRowContextMenu(cargoToCar: CargoToCar, cargo: Cargo): HTMLElement {
        const rowElement = document.createElement(this.TAG_TABLE_ROW);
        rowElement.className = this.CLASS_TABLE_ROW

        let rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = `${cargo.description}`;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowElement.appendChild(rowItem);
        
        if(cargoToCar.agree !== this.STATUS_SUBMIT) {
            const buttonConfirm = document.createElement(this.TAG_IMAGE);
            buttonConfirm.classList.add(this.CLASS_MENU_BUTTON);
            buttonConfirm.src = './assets/icons/confirm.png';
            buttonConfirm.addEventListener('click', this.tableContextConfirmClickItemHandler.bind(this));
            rowElement.appendChild(buttonConfirm);
        }

        const buttonRefuse = document.createElement(this.TAG_IMAGE);
        buttonRefuse.classList.add(this.CLASS_MENU_BUTTON);
        buttonRefuse.src = './assets/icons/cancel.png';
        buttonRefuse.addEventListener('click', this.tableContextCancelClickItemHandler.bind(this));

        rowElement.appendChild(buttonRefuse);

        return rowElement;
    }
    private tableContextConfirmClickItemHandler(event: Event) {
        const targetElement = <HTMLElement>event.target;
        const contextItem = this._cargoToCarInMenu.get(<HTMLElement>targetElement.closest('.' + this.CLASS_TABLE_ROW));
        const newCargoToCar: CargoToCar = {
            id: Number(contextItem?.id),
            id_cargo: 0,
            id_cars: 0,
            agree: this.STATUS_SUBMIT
        }
        this._observer.notify(AppEvents.CARGO_TO_CAR_CHANGE, this, newCargoToCar);
    }
    private tableContextCancelClickItemHandler(event: Event) {
        const targetElement = <HTMLElement>event.target;
        const contextItem = this._cargoToCarInMenu.get(<HTMLElement>targetElement.closest('.' + this.CLASS_TABLE_ROW));
        const newCargoToCar: CargoToCar = {
            id: Number(contextItem?.id),
            id_cargo: 0,
            id_cars: 0,
            agree: this.STATUS_CANCEL
        }
        this._observer.notify(AppEvents.CARGO_TO_CAR_CHANGE, this, newCargoToCar);
    }
    private tableContainerClickHandler(event: Event) {
        this._menuElement.classList.add(this.CLASS_MENU_HIDDEN);
        const targetElement = <HTMLElement>event.target;
        if (targetElement.closest('.' + this.CLASS_TABLE_CONTAINER)) {
            this._selectedCar = this._cars.get(<HTMLElement>targetElement.closest('.' + this.CLASS_TABLE_ROW));

            const eventCurrent = event as MouseEvent;
            this._menuElement.style.top = `${eventCurrent.pageY}px`;
            this._menuElement.style.left = `${eventCurrent.pageX}px`;

            this._menuElement.classList.remove(this.CLASS_MENU_HIDDEN);
            document.body.style.overflow = 'hidden';
        } else {
            this._selectedCar = undefined;
        }
    }
}