import localeModel from '../../../../models/common/localization/locale-model';
import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import view from "../../view";
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';
import AsideItemView from '../aside-item-view';
import Cargo from '../../../../../types/cargo';
import User from '../../../../../types/user';
import Geopoint from '../../../../../types/geopoint';
import '../search.scss';
import Car from '../../../../../types/car';
import CargoToCar from '../../../../../types/cargotocar';
import '../context-menu.scss';
export default class CargoView extends AsideItemView {
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
    private readonly TAG_WAIT_IMAGE = 'img';

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

    private readonly CURRENCY = new Array('USD', 'EUR', 'BYN', 'RUB');
    private readonly ID_ROLE_CUSTOMER = '1';
    private readonly ID_ROLE_CARRIER = '2';
    private readonly STATUS_CANCEL = 'Cancelled';
    private readonly STATUS_SUBMIT = 'Submitted';
    private readonly STATUS_PENDING = 'Pending';

    private _formFilterLegend = document.createElement(this.TAG_LEGEND);
    private _formItemSearch = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemSearchLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _tableHeaderPrice = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderCurrency = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderWeight = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderVolume = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderDescription = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderPointStart = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderPointEnd = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableContainer = document.createElement(this.TAG_TABLE_CONTAINER);

    private _formItemPrice = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemCurrency = document.createElement(this.TAG_FIELDSET_SELECT);
    private _formItemWeight = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemVolume = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemDescription = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemPointStart = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemPointEnd = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemPointStartResultSearch = document.createElement(this.TAG_FIELDSET_ITEM);
    private _formItemPointEndResultSearch = document.createElement(this.TAG_FIELDSET_ITEM);

    private _formItemPriceLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemCurrencyLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemWeightLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemVolumeLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemDescriptionLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemPointStartLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemPointEndLabel = document.createElement(this.TAG_FIELDSET_LABEL);

    private _formItemButtonCreate = document.createElement(this.TAG_FIELDSET_BUTTON);
    private _formItemButtonSave = document.createElement(this.TAG_FIELDSET_BUTTON);
    private _formItemButtonDelete = document.createElement(this.TAG_FIELDSET_BUTTON);
    private _formItemButtonClear = document.createElement(this.TAG_FIELDSET_BUTTON);
    private _formItemButtonPointFromShow = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemButtonPointToShow = document.createElement(this.TAG_FIELDSET_INPUT);

    private _menuElement = document.createElement(this.TAG_DIV);
    private _headerContextMenu = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableContextMenu = document.createElement(this.TAG_TABLE_CONTAINER);

    private _messageError = '';
    private _messageSended = '';
    private _messageRemoved = '';
    private _statusPending = '';
    private _statusSubmitted = '';
    private _statusCanceled = '';
    
    private _cargoToCarInMenu = new Map<HTMLElement, CargoToCar>();
    private _cargoes = new Map<HTMLElement, Cargo>();
    private _selectedCargo: Cargo | undefined = undefined;
    private _cargoToCar: Array<CargoToCar> | undefined = undefined;
    private _cars: Array<Car> | undefined = undefined;
    private _createCargo = false;
    private _changeCargo = false;
    private _user!: User;

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.AUTH_GET_AUTH_USER, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
        this._observer.notify(AppEvents.MAIN_CARGO_GET_BY_USER, this);
        this._observer.notify(AppEvents.CARGO_TO_CAR_GET_ALL, this);
        this._observer.notify(AppEvents.MAIN_CAR_GET_ALL, this);
        this._selectedCargo = undefined;

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
            if (authUser.role_id !== this.ID_ROLE_CUSTOMER) {
                this._itemElement.style.display = 'none';
            }
        } else {
            //TODO
        }
    }
    setAllCargo(cargoes: Array<Cargo>): void {
        this.clearTable();
        this._cargoes.clear();
        for (let i = 0; i < cargoes.length; i += 1) {
            const rowElement = this.createRow(cargoes[i]);
            rowElement.addEventListener('click', this.rowClickHandler.bind(this));
            this._cargoes.set(rowElement, cargoes[i]);
            this._tableContainer.appendChild(rowElement);
        }
    }
    deleteCargoSuccess(cargo: Cargo) {
        this._cargoes.forEach((value, key) => {
            if (value.id === cargo.id) {
                key.remove();
                this.clearCargoHandler();
                this._observer.notify(AppEvents.MAIN_CARGO_DELETE_SUCCESS, this, cargo);
            }
        });
    }
    deleteCargoFail(cargo: Cargo) {
        this.clearCargoHandler();
    }
    changeCargoSuccess(cargo: Cargo) {
        this._cargoes.forEach((value, key) => {
            if (value.id === cargo.id) {
                value = cargo;
                key.children[0].textContent = this._formItemPointStart.value;
                key.children[1].textContent = this._formItemPointEnd.value;
                key.children[2].textContent = cargo.price.toString();
                key.children[3].textContent = cargo.currency;
                key.children[4].textContent = cargo.volume.toString();
                key.children[5].textContent = cargo.weigth.toString();
                key.children[6].textContent = cargo.description;
                this.clearCargoHandler();
                this._observer.notify(AppEvents.MAIN_CARGO_CHANGE_SUCCESS, this, cargo);
            }
        });
    }
    changeCargoFail(cargo: Cargo) {
        this.clearCargoHandler();
    }
    createCargoSuccess(cargo: Cargo) {
        const rowElement = this.createRow(cargo);
        rowElement.addEventListener('click', this.rowClickHandler.bind(this));
        this._cargoes.set(rowElement, cargo);
        this._tableContainer.appendChild(rowElement);
        this.clearCargoHandler();
        this._observer.notify(AppEvents.MAIN_CARGO_CREATE_SUCCESS, this, cargo);
    }
    createCargoFail(cargo: Cargo) {
        this.clearCargoHandler();
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
    setAllCar(cars: Array<Car>): void {
        this._cars = cars;
    }
    showErrorMessage(message: Map<string, string> | false) {
        if (!message) {
            console.log('TODO Ошибка получения грузов пользователя');
        } else {
            console.log(message.get('message'));
        }
    }
    setLocale(localeModel: localeModel): void {
        this._asideItemSpan.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_CARGO);

        this._formFilterLegend.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_PANEL_HEADER);
        this._formItemSearchLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_SEARCH);
        this._formItemPriceLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_PRICE);
        this._formItemCurrencyLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_CURRENCY);
        this._formItemWeightLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_Weight);
        this._formItemVolumeLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_VOLUME);
        this._formItemDescriptionLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_DESCRIPTION);
        this._formItemPointStartLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_LOCATION_FROM);
        this._formItemPointEndLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_LOCATION_TO);

        this._tableHeaderPointStart.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_LOCATION_FROM);
        this._tableHeaderPointEnd.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_LOCATION_TO);
        this._tableHeaderPrice.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_PRICE);
        this._tableHeaderVolume.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_VOLUME);
        this._tableHeaderWeight.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_Weight);
        this._tableHeaderDescription.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_DESCRIPTION);

        this._formItemButtonCreate.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_ADD_NEW);
        this._formItemButtonSave.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_SAVE);
        this._formItemButtonDelete.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_DELETE);
        this._formItemButtonClear.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_CLEAR);

        this._formItemButtonPointFromShow.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_MAP_SEARCH_BUTTON);
        this._formItemButtonPointToShow.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_MAP_SEARCH_BUTTON);
        this._headerContextMenu.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_CONTEXT_HEADER);

        this._messageError = localeModel.getPhrase(LocaleKeys.COMMON_ERROR_SAVE);
        this._messageSended = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_TO_CAR_ADD_SENDED);
        this._messageRemoved = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_TO_CAR_REMOVE_SENDED);
        this._statusCanceled = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_TO_CAR_CANCELED);
        this._statusPending = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_TO_CAR_PENDING);
        this._statusSubmitted = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_TO_CAR_SUBMITTED);
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
        let checkEnd = true;
        const pointsStart: Array<Geopoint> = <Array<Geopoint>>result.get('points_start')!;
        const elementInputStart: HTMLInputElement = <HTMLInputElement>result.get('element_start')!
        const pointsEnd: Array<Geopoint> = <Array<Geopoint>>result.get('points_end')!;
        const elementInputEnd: HTMLInputElement = <HTMLInputElement>result.get('element_end')!
        if (pointsStart.length === 0) {
            elementInputStart.classList.add(this.CLASS_FIELDSET_INVALID);
            checkStart = false;
        } else {
            elementInputStart.classList.remove(this.CLASS_FIELDSET_INVALID);
        }
        if (pointsEnd.length === 0) {
            elementInputEnd.classList.add(this.CLASS_FIELDSET_INVALID);
            checkEnd = false;
        } else {
            elementInputEnd.classList.remove(this.CLASS_FIELDSET_INVALID);
        }
        if (checkStart && checkEnd) {
            if (this._changeCargo) {
                const selectedCargo = <Cargo>this._selectedCargo;
                const cargo = {
                    id: selectedCargo.id,
                    user_id: selectedCargo.user_id,
                    point_start_lat: Number(pointsStart[0].lat),
                    point_start_lon: Number(pointsStart[0].lon),
                    point_end_lat: Number(pointsEnd[0].lat),
                    point_end_lon: Number(pointsEnd[0].lon),
                    price: Number(this._formItemPrice.value),
                    currency: this._formItemCurrency.value,
                    volume: Number(this._formItemVolume.value),
                    weigth: Number(this._formItemWeight.value),
                    finished: false,
                    description: this._formItemDescription.value
                }
                this._observer.notify(AppEvents.MAIN_CARGO_CHANGE, this, cargo);
                this._changeCargo = false;
            }
            if (this._createCargo) {
                const cargo = {
                    id: 0,
                    user_id: 0,
                    point_start_lat: Number(pointsStart[0].lat),
                    point_start_lon: Number(pointsStart[0].lon),
                    point_end_lat: Number(pointsEnd[0].lat),
                    point_end_lon: Number(pointsEnd[0].lon),
                    price: Number(this._formItemPrice.value),
                    currency: this._formItemCurrency.value,
                    volume: Number(this._formItemVolume.value),
                    weigth: Number(this._formItemWeight.value),
                    finished: false,
                    description: this._formItemDescription.value
                }
                this._observer.notify(AppEvents.MAIN_CARGO_CREATE, this, cargo);

                this._createCargo = false;
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
    private createRow(cargo: Cargo): HTMLElement {
        const rowElement = document.createElement(this.TAG_TABLE_ROW);
        rowElement.className = this.CLASS_TABLE_ROW
        let rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        let waitElement = document.createElement(this.TAG_WAIT_IMAGE);
        waitElement.classList.add(this.CLASS_WAIT_IMAGE);
        waitElement.src = './assets/icons/loading.gif';
        rowItem.appendChild(waitElement);
        let params = new Map();
        params.set('lat', cargo.point_start_lat);
        params.set('lon', cargo.point_start_lon);
        params.set('element', rowItem);
        this._observer.notify(AppEvents.MAP_GET_NAME, this, params);
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_from');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        waitElement = document.createElement(this.TAG_WAIT_IMAGE);
        waitElement.classList.add(this.CLASS_WAIT_IMAGE);
        waitElement.src = './assets/icons/loading.gif';
        rowItem.appendChild(waitElement);
        params = new Map();
        params.set('lat', cargo.point_end_lat);
        params.set('lon', cargo.point_end_lon);
        params.set('element', rowItem);
        this._observer.notify(AppEvents.MAP_GET_NAME, this, params);
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_to');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = `${cargo.price.toString()} ${cargo.currency}`;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_price');
        rowElement.appendChild(rowItem);
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = cargo.volume.toString();
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_volume');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = cargo.weigth.toString();
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_weight');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = cargo.description;
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
        tableHeader.appendChild(this._tableHeaderPointStart);
        this._tableHeaderPointStart.className = this.CLASS_TABLE_DATA;
        this._tableHeaderPointStart.classList.add('table__data_from');
        tableHeader.appendChild(this._tableHeaderPointEnd);
        this._tableHeaderPointEnd.className = this.CLASS_TABLE_DATA;
        this._tableHeaderPointEnd.classList.add('table__data_to');
        tableHeader.appendChild(this._tableHeaderPrice);
        this._tableHeaderPrice.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderVolume);
        this._tableHeaderVolume.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderWeight);
        this._tableHeaderWeight.className = this.CLASS_TABLE_DATA;
        tableHeader.appendChild(this._tableHeaderDescription);
        this._tableHeaderDescription.className = this.CLASS_TABLE_DATA;
        this._tableHeaderDescription.classList.add('table__data_description')

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
        containerItem.appendChild(this._formItemPointStartLabel);
        let searchContainer = document.createElement(this.TAG_FIELDSET_ITEM);
        searchContainer.classList.add(this.CLASS_FIELDSET_SEARCH);
        let searchItem = document.createElement(this.TAG_FIELDSET_ITEM);
        searchItem.classList.add(this.CLASS_FIELDSET_SEARCH_FIELD);
        searchItem.appendChild(this._formItemPointStart);
        this._formItemPointStartResultSearch.classList.add(this.CLASS_FIELDSET_SEARCH_RESULT);
        searchItem.appendChild(this._formItemPointStartResultSearch);
        searchContainer.appendChild(searchItem);
        this._formItemButtonPointFromShow.type = 'image';
        this._formItemButtonPointFromShow.src = './assets/icons/search.png';
        searchContainer.appendChild(this._formItemButtonPointFromShow);
        this._formItemButtonPointFromShow.addEventListener('click', this.clickButtonPointFromShowHandler.bind(this));
        containerItem.appendChild(searchContainer);
        formElement.appendChild(containerItem);

        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        containerItem.appendChild(this._formItemPointEndLabel);
        searchContainer = document.createElement(this.TAG_FIELDSET_ITEM);
        searchContainer.classList.add(this.CLASS_FIELDSET_SEARCH);
        searchItem = document.createElement(this.TAG_FIELDSET_ITEM);
        searchItem.classList.add(this.CLASS_FIELDSET_SEARCH_FIELD);
        searchItem.appendChild(this._formItemPointEnd);
        this._formItemPointEndResultSearch.classList.add(this.CLASS_FIELDSET_SEARCH_RESULT);
        
        searchItem.appendChild(this._formItemPointEndResultSearch);
        searchContainer.appendChild(searchItem);
        searchContainer.appendChild(this._formItemButtonPointToShow);
        this._formItemButtonPointToShow.type = 'image';
        this._formItemButtonPointToShow.src = './assets/icons/search.png';
        this._formItemButtonPointToShow.addEventListener('click', this.clickButtonPointToShowHandler.bind(this));
        containerItem.appendChild(searchContainer);
        formElement.appendChild(containerItem);

        document.addEventListener('click', this.closeAllSearchResult.bind(this));

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
        this._formItemButtonCreate.addEventListener('click', this.createNewCargoHandler.bind(this));
        this._formItemButtonSave.addEventListener('click', this.saveCargoHandler.bind(this));
        this._formItemButtonDelete.addEventListener('click', this.deleteCargoHandler.bind(this));
        this._formItemButtonClear.addEventListener('click', this.clearCargoHandler.bind(this));

        formElement.addEventListener('input', (e) => {
            const inputField = e.target as HTMLInputElement;
            const allRows = document.querySelectorAll('.table__row') as NodeListOf<HTMLElement>;

            const search = inputField.id === 'search' ? inputField.value : '';

            for (const r of allRows) {
                const textData = [
                    r.childNodes[0].textContent?.toLocaleLowerCase(),
                    r.childNodes[1].textContent?.toLocaleLowerCase(),
                    r.childNodes[6].textContent?.toLocaleLowerCase()
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
    private clickButtonPointFromShowHandler() {
        const params = new Map();
        params.set('name', this._formItemPointStart.value);
        params.set('element', this._formItemPointStartResultSearch);
        this._observer.notify(AppEvents.MAP_GET_LATLON, this, params);
    }
    private clickButtonPointToShowHandler() {
        const params = new Map();
        params.set('name', this._formItemPointEnd.value);
        params.set('element', this._formItemPointEndResultSearch);
        this._observer.notify(AppEvents.MAP_GET_LATLON, this, params);
    }
    private createNewCargoHandler() {
        if (this.checkCargoFields()) {
            this._createCargo = true;
            const params = new Map();
            params.set('name_start', this._formItemPointStart.value);
            params.set('name_end', this._formItemPointEnd.value);
            params.set('element_start', this._formItemPointStart);
            params.set('element_end', this._formItemPointEnd);
            this._observer.notify(AppEvents.MAP_CHECK_NAME, this, params);
        }
    }
    private saveCargoHandler() {
        if (this.checkCargoFields()) {
            this._changeCargo = true;
            const params = new Map();
            params.set('name_start', this._formItemPointStart.value);
            params.set('name_end', this._formItemPointEnd.value);
            params.set('element_start', this._formItemPointStart);
            params.set('element_end', this._formItemPointEnd);
            this._observer.notify(AppEvents.MAP_CHECK_NAME, this, params);
        }
    }
    private checkCargoFields(): boolean {
        let result = new Array<boolean>();
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
    private deleteCargoHandler() {
        this._observer.notify(AppEvents.MAIN_CARGO_DELETE, this, <Cargo>this._selectedCargo);
    }
    private clearCargoHandler() {
        this._formItemButtonCreate.classList.remove(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonSave.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonClear.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonDelete.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._selectedCargo = undefined;
        this._formItemPrice.value = '';
        this._formItemCurrency.value = '';
        this._formItemWeight.value = '';
        this._formItemVolume.value = '';
        this._formItemDescription.value = '';
        this._formItemPointStart.value = '';
        this._formItemPointEnd.value = '';
        this._changeCargo = false;
        this._createCargo = false;
        this._formItemPrice.classList.remove(this.CLASS_FIELDSET_INVALID);
        this._formItemVolume.classList.remove(this.CLASS_FIELDSET_INVALID);
        this._formItemWeight.classList.remove(this.CLASS_FIELDSET_INVALID);
        this._formItemDescription.classList.remove(this.CLASS_FIELDSET_INVALID);
        this._formItemPointStart.classList.remove(this.CLASS_FIELDSET_INVALID);
        this._formItemPointEnd.classList.remove(this.CLASS_FIELDSET_INVALID);
    }
    private rowClickHandler(event: Event) {
        const element: HTMLElement = <HTMLElement>event.target;
        const parent = element.closest(this.TAG_TABLE_ROW);
        if (parent !== null) {
            this._formItemButtonCreate.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
            this._formItemButtonSave.classList.remove(this.CLASS_FIELDSET_BUTTON_HIDDEN);
            this._formItemButtonClear.classList.remove(this.CLASS_FIELDSET_BUTTON_HIDDEN);
            this._formItemButtonDelete.classList.remove(this.CLASS_FIELDSET_BUTTON_HIDDEN);
            const cargo = <Cargo>this._cargoes.get(parent);
            this._selectedCargo = cargo;
            this._formItemPrice.value = cargo.price.toString();
            this._formItemCurrency.value = cargo.currency;
            this._formItemWeight.value = cargo.weigth.toString();
            this._formItemVolume.value = cargo.volume.toString();
            this._formItemDescription.value = cargo.description;
            this._formItemPointStart.value = <string>parent.children[0].textContent;
            this._formItemPointEnd.value = <string>parent.children[1].textContent;

            const cargoToCar = (this._cargoToCar !== undefined ? this._cargoToCar : new Array<CargoToCar>());
            const cars = (this._cars !== undefined ? this._cars : new Array<Car>());
            while (this._tableContextMenu.firstElementChild) {
                this._tableContextMenu.firstElementChild.remove();
            }
            this._cargoToCarInMenu.clear();
            for (let i = 0; i < cargoToCar.length; i += 1) {
                if (cargoToCar[i].id_cargo === this._selectedCargo.id) {
                    for (let j = 0; j < cars.length; j += 1) {
                        if (cargoToCar[i].id_cars === cars[j].id) {
                            const row = this.createRowContextMenu(cargoToCar[i], cars[j]);
                            this._tableContextMenu.appendChild(row);
                            this._cargoToCarInMenu.set(row, cargoToCar[i]);
                        }
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

        this._menuElement.appendChild(this._headerContextMenu);
        this._menuElement.appendChild(this._tableContextMenu);

        return this._menuElement;
    }
    private createRowContextMenu(cargoToCar: CargoToCar, car: Car): HTMLElement {
        const rowElement = document.createElement(this.TAG_TABLE_ROW);
        rowElement.className = this.CLASS_TABLE_ROW

        let status = '';
        switch (cargoToCar.agree) {
            case this.STATUS_CANCEL: {
                status = this._statusCanceled;
                break;
            }
            case this.STATUS_PENDING: {
                status = this._statusPending;
                break;
            }
            case this.STATUS_SUBMIT: {
                status = this._statusSubmitted;
                break;
            }
        }

        let rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = `${car.model} ${status}`;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowElement.appendChild(rowItem);
        rowElement.addEventListener('click', this.tableContextClickItemHandler.bind(this));

        return rowElement;
    }
    private tableContextClickItemHandler(event: Event) {
        const targetElement = <HTMLElement>event.target;
        const contextItem = this._cargoToCarInMenu.get(<HTMLElement>targetElement.closest('.' + this.CLASS_TABLE_ROW));
        const newCargoToCar: CargoToCar = {
            id: Number(contextItem?.id),
            id_cargo: 0,
            id_cars: 0,
            agree: ''
        }
        this._observer.notify(AppEvents.CARGO_TO_CAR_DELETE, this, newCargoToCar);
    }
    private tableContainerClickHandler(event: Event) {
        this._menuElement.classList.add(this.CLASS_MENU_HIDDEN);
        const targetElement = <HTMLElement>event.target;
        if (targetElement.closest('.' + this.CLASS_TABLE_CONTAINER)) {
            this._selectedCargo = this._cargoes.get(<HTMLElement>targetElement.closest('.' + this.CLASS_TABLE_ROW));

            const eventCurrent = event as MouseEvent;
            this._menuElement.style.top = `${eventCurrent.pageY}px`;
            this._menuElement.style.left = `${eventCurrent.pageX}px`;

            this._menuElement.classList.remove(this.CLASS_MENU_HIDDEN);
        } else {
            this._selectedCargo = undefined;
        }
    }
}