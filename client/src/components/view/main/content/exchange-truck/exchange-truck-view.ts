import localeModel from '../../../../models/common/localization/locale-model';
import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import view from "../../view";
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';
import AsideItemView from '../aside-item-view';
import Car from '../../../../../types/car';
import CargoToCar from '../../../../../types/cargotocar';
import Cargo from '../../../../../types/cargo';
import User from '../../../../../types/user';
import '../context-menu.scss';
export default class ExchangeTruckView extends AsideItemView {
    private readonly TAG_FIELDSET = 'fieldset';
    private readonly TAG_LEGEND = 'legend';
    private readonly TAG_FIELDSET_ITEM = 'div';
    private readonly TAG_FIELDSET_INPUT = 'input';
    private readonly TAG_FIELDSET_LABEL = 'label';

    private readonly TAG_TABLE_CONTAINER = 'div';
    private readonly TAG_TABLE_ROW = 'div';
    private readonly TAG_TABLE_ROW_DATA = 'span';
    private readonly TAG_WAIT_IMAGE = 'img';
    private readonly TAG_IMAGE = 'img';

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
    private readonly CLASS_WAIT_IMAGE = 'table__wait';
    private readonly CLASS_MENU = 'menu__context';
    private readonly CLASS_MENU_HIDDEN = 'menu__context_hidden';

    private readonly ID_ROLE_CUSTOMER = '1';
    private readonly ID_ROLE_CARRIER = '2';

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
    private _tableHeaderWeight = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderVolume = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderDescription = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderCompany = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderUser = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderPoint = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableContainer = document.createElement(this.TAG_TABLE_CONTAINER);

    private _menuElement = document.createElement(this.TAG_DIV);
    private _headerContextMenu = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableContextMenu = document.createElement(this.TAG_TABLE_CONTAINER);

    private _minPrice = 0;
    private _minVolume = 0;
    private _minWeight = 0;
    private _maxPrice = 20000;
    private _maxVolume = 100;
    private _maxWeight = 50;

    private _messageError = '';
    private _messageSended = '';
    private _messageRemoved = '';

    private _cars = new Map<HTMLElement, Car>();
    private _carSelected: Car | undefined = undefined;
    private _cargoes = new Map<HTMLElement, Cargo>();
    private _user!: User;

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.addSender(AppEvents.MAIN_CAR_CREATE_SUCCESS, this);
        this._observer.addSender(AppEvents.MAIN_CAR_DELETE_SUCCESS, this);
        this._observer.addSender(AppEvents.MAIN_CAR_CHANGE_SUCCESS, this);

        this._observer.addSender(AppEvents.MAIN_CARGO_CREATE_SUCCESS, this);
        this._observer.addSender(AppEvents.MAIN_CARGO_DELETE_SUCCESS, this);
        this._observer.addSender(AppEvents.MAIN_CARGO_CHANGE_SUCCESS, this);

        this._observer.notify(AppEvents.AUTH_GET_AUTH_USER, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
        this._observer.notify(AppEvents.MAIN_CAR_GET_ALL, this);
        this._observer.notify(AppEvents.MAIN_CARGO_GET_ALL, this);

        document.addEventListener('click', this.tableContainerClickHandler.bind(this));
    }
    notify(nameEvent: AppEvents, sender: INotify | view, params?: Map<string, string> | Car | Cargo | Array<Cargo>): void {
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
            case AppEvents.MAIN_CARGO_BY_USER_RECEIVED: {
                this.setAllCargo(params as Array<Cargo>);
                break;
            }
            case AppEvents.MAIN_CARGO_CREATE_SUCCESS: {
                this.cargoCreatedHandler(params as Cargo);
                break;
            }
            case AppEvents.MAIN_CARGO_DELETE_SUCCESS: {
                this.cargoDeletedHandler(params as Cargo);
                break;
            }
            case AppEvents.MAIN_CARGO_CHANGE_SUCCESS: {
                this.cargoChangedHandler(params as Cargo);
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
    setAuthorizedUser(authUser: User | false) {
        if (authUser !== false) {
            this._user = authUser;
        } else {
            // alert(this._errorMessage);
        }
    }
    setAllCargo(cargoes: Array<Cargo>): void {
        if (this._user !== undefined) {
            this.clearContextTable();
            for (let i = 0; i < cargoes.length; i += 1) {
                if (this._user.id === cargoes[i].user_id) {
                    const rowElement = this.createRowContextMenu(cargoes[i])
                    this._tableContextMenu.appendChild(rowElement);
                    this._cargoes.set(rowElement, cargoes[i]);
                }
            }
        } else {
            this._observer.notify(AppEvents.MAIN_CARGO_GET_ALL, this);
        }
    }
    cargoCreatedHandler(cargo: Cargo) {
        const rowElement = this.createRowContextMenu(cargo)
        this._cargoes.set(rowElement, cargo);
        this._tableContextMenu.appendChild(rowElement);
    }
    cargoDeletedHandler(cargo: Cargo) {
        this._cargoes.forEach((value, key) => {
            if (value.id === cargo.id) {
                key.remove();
            }
        });     
    }
    cargoChangedHandler(cargo: Cargo) {
        this._cargoes.forEach((value, key) => {
            if (value.id === cargo.id) {
                value = cargo;
                key.children[0].textContent = cargo.description;
            }
        });
    }
    private clearContextTable(): void {
        while (this._tableContextMenu.firstElementChild) {
            this._tableContextMenu.firstElementChild.remove();
        }
    }
    setLocale(localeModel: localeModel): void {
        this._asideItemSpan.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_EXCHANGE_TRANSPORT);
        this._formFilterLegend.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_HEADER);
        this._formItemSearchLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_SEARCH);
        this._formItemPriceLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_PRICE);
        this._formItemLoadLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_LOAD);
        this._formItemVolumeLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_VOLUME);
        this._tableHeaderModel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_NUMBER);
        this._tableHeaderPoint.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_LOCATION);
        this._tableHeaderCompany.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_COMPANY);
        this._tableHeaderUser.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_USER);
        this._tableHeaderPrice.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_PRICE);
        this._tableHeaderVolume.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_VOLUME);
        this._tableHeaderWeight.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_Weight);
        this._tableHeaderDescription.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_TRANSPORT_DESCRIPTION);
        this._formItemButtonClear.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_CLEAR);
        this._headerContextMenu.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_CONTEXT_HEADER);
        this._messageError = localeModel.getPhrase(LocaleKeys.COMMON_ERROR_SAVE);
        this._messageSended = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_TO_CAR_ADD_SENDED);
        this._messageRemoved = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_TO_CAR_REMOVE_SENDED);
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
        //TODO
    }
    setAllCargoToCar(cargoToCars: Array<CargoToCar>): void {
        //TODO
    }
    deleteCargoToCarSuccess(cargoToCar: CargoToCar) {
        alert(this._messageRemoved);
        this._observer.notify(AppEvents.CARGO_TO_CAR_DELETE_SUCCESS, this, cargoToCar);
    }
    deleteCargoToCarFail(cargoToCar: CargoToCar) {
        alert(this._messageError);
    }
    changeCargoToCarSuccess(cargoToCar: CargoToCar) {
        alert(this._messageSended);
        this._observer.notify(AppEvents.CARGO_TO_CAR_CHANGE_SUCCESS, this, cargoToCar);
    }
    changeCargoToCarFail(cargoToCar: CargoToCar) {
        alert(this._messageError);
    }
    createCargoToCarSuccess(cargoToCar: CargoToCar) {
        alert(this._messageSended);
        this._observer.notify(AppEvents.CARGO_TO_CAR_CREATE_SUCCESS, this, cargoToCar);
    }
    createCargoToCarFail(cargoToCar: CargoToCar) {
        alert(this._messageError);
    }
    protected createMainElement(): void {
        this._mainElement.appendChild(this.createFilterForm());
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
        rowItem.textContent = car.model;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_model');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        const waitElement = document.createElement(this.TAG_WAIT_IMAGE);
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
        rowItem.textContent = `${car.price.toString()} ${car.currency}`;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_price');
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
        this._tableHeaderModel.classList.add('table__data_model');
        tableHeader.appendChild(this._tableHeaderPoint);
        this._tableHeaderPoint.className = this.CLASS_TABLE_DATA;
        this._tableHeaderPoint.classList.add('table__data_to');
        tableHeader.appendChild(this._tableHeaderCompany);
        this._tableHeaderCompany.className = this.CLASS_TABLE_DATA;
        this._tableHeaderCompany.classList.add('table__data_company');
        tableHeader.appendChild(this._tableHeaderUser);
        this._tableHeaderUser.className = this.CLASS_TABLE_DATA;
        this._tableHeaderUser.classList.add('table__data_contacts');
        tableHeader.appendChild(this._tableHeaderPrice);
        this._tableHeaderPrice.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderVolume);
        this._tableHeaderVolume.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderWeight);
        this._tableHeaderWeight.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderDescription);
        this._tableHeaderDescription.className = this.CLASS_TABLE_DATA;
        this._tableHeaderDescription.classList.add('table__data_description');

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
        this._formItemPrice.value = this._maxPrice.toString();
        formElement.appendChild(containerItem);
        this._formItemPriceRange.setAttribute('type', 'range');
        this._formItemPriceRange.min = this._minPrice.toString();
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
        this._formItemVolume.value = this._maxVolume.toString();
        formElement.appendChild(containerItem);
        this._formItemVolumeRange.setAttribute('type', 'range')
        this._formItemVolumeRange.min = this._minVolume.toString();
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
        this._formItemLoad.value = this._maxWeight.toString();
        formElement.appendChild(containerItem);
        this._formItemLoadRange.setAttribute('type', 'range')
        this._formItemLoadRange.min = this._minWeight.toString();
        this._formItemLoadRange.max = this._formItemLoad.value;
        this._formItemLoadRange.value = this._formItemLoad.value;
        containerItem.appendChild(this._formItemLoadRange);
        formElement.appendChild(containerItem);

        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_BUTTON_CONTAINER);
        this._formItemButtonClear.classList.add('big__button');
        containerItem.appendChild(this._formItemButtonClear);
        formElement.appendChild(containerItem);

        this._formItemButtonClear.addEventListener('click', (e) => {
            this._formItemSearch.value = '';
            this._formItemPrice.value = this._maxPrice.toString();
            this._formItemLoad.value = this._maxWeight.toString();
            this._formItemVolume.value = this._maxVolume.toString();
            const allRows = document.querySelectorAll('.table__row') as NodeListOf<HTMLElement>;
            for (const r of allRows) {
                r.style.display = 'flex'
            }
        })

        formElement.addEventListener('input', (e) => {
            const inputField = e.target as HTMLInputElement;
            const allRows = document.querySelectorAll('.table__row') as NodeListOf<HTMLElement>;

            if (inputField.type === 'range') {
                const field = inputField.previousSibling as HTMLInputElement;
                field.value = inputField.value;
            }

            const search = inputField.id === 'search' ? inputField.value : '';
            const price = inputField.id === 'price' ? inputField.value : this._formItemPrice.value;
            const volume = inputField.id === 'volume' ? inputField.value : this._formItemVolume.value;
            const load = inputField.id === 'load' ? inputField.value : this._formItemLoad.value;

            for (const r of allRows) {
                const textData = [
                    r.childNodes[0].textContent?.toLocaleLowerCase(),
                    r.childNodes[1].textContent?.toLocaleLowerCase(),
                    r.childNodes[2].textContent?.toLocaleLowerCase(),
                    r.childNodes[3].textContent?.toLocaleLowerCase(),
                    r.childNodes[7].textContent?.toLocaleLowerCase()
                ].toString().includes(search?.toLocaleLowerCase());
                const priceData = Number(r.childNodes[4].textContent?.slice(0, r.childNodes[4].textContent.length-4)) <= Number(price);
                const volumeData = Number(r.childNodes[5].textContent) <= Number(volume);
                const loadData = Number(r.childNodes[6].textContent) <= Number(load);
                if (textData && priceData && volumeData && loadData) {
                    r.style.display = 'flex'
                } else {
                    r.style.display = 'none'
                }
            }
        })

        // this._formItemButtonClear.addEventListener('click', this.clearCargoHandler.bind(this));

        return formElement;
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
        });

        this._menuElement.appendChild(this._headerContextMenu);
        this._menuElement.appendChild(buttonClose);
        this._menuElement.appendChild(this._tableContextMenu);

        return this._menuElement;
    }
    private createRowContextMenu(cargo: Cargo): HTMLElement {
        const rowElement = document.createElement(this.TAG_TABLE_ROW);
        rowElement.className = this.CLASS_TABLE_ROW

        let rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = cargo.description;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowElement.appendChild(rowItem);
        rowElement.addEventListener('click', this.tableContextClickItemHandler.bind(this));

        return rowElement;
    }
    private tableContextClickItemHandler(event: Event) {
        const targetElement = <HTMLElement>event.target;
        const contextItem = this._cargoes.get(<HTMLElement>targetElement.closest('.' + this.CLASS_TABLE_ROW));
        const newCargoToCar: CargoToCar = {
            id: 0,
            id_cargo: Number(contextItem?.id),
            id_cars: Number(this._carSelected?.id),
            agree: ''
        }
        this._observer.notify(AppEvents.CARGO_TO_CAR_CREATE, this, newCargoToCar);
    }
    private tableContainerClickHandler(event: Event) {
        if(this._user !== undefined && this._user.role_id === this.ID_ROLE_CUSTOMER) {
            this._menuElement.classList.add(this.CLASS_MENU_HIDDEN);
            const targetElement = <HTMLElement>event.target;
            if (targetElement.closest('.' + this.CLASS_TABLE_CONTAINER)) {
                this._carSelected = this._cars.get(<HTMLElement>targetElement.closest('.' + this.CLASS_TABLE_ROW));
    
                const eventCurrent = event as MouseEvent;
                this._menuElement.style.top = `${eventCurrent.pageY - 160}px`;
                this._menuElement.style.left = `${eventCurrent.pageX}px`;
    
                this._menuElement.classList.remove(this.CLASS_MENU_HIDDEN);
            } else {
                this._carSelected = undefined;
            }
        }
    }
}