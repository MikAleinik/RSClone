import localeModel from '../../../../models/common/localization/locale-model';
import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import view from "../../view";
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';
import AsideItemView from '../aside-item-view';
import MapLeaflet from '../map/map-leaflet';
import './overview.scss';
import User from '../../../../../types/user';
import Cargo from '../../../../../types/cargo';
import Car from '../../../../../types/car';

export default class OverviewView extends AsideItemView {
    private readonly TAG_USER_DATA = 'div';
    private readonly TAG_USER_HEADER = 'h3';
    private readonly TAG_FIELD_ROW = 'div';
    private readonly TAG_FIELD_LABEL = 'label';
    private readonly TAG_FIELD_INPUT = 'input';
    private readonly TAG_FIELD_IMG = 'img';
    private readonly TAG_BUTTON = 'button';
    private readonly TAG_TABLE_CONTAINER = 'div';
    private readonly TAG_TABLE_ROW = 'div';
    private readonly TAG_TABLE_ROW_DATA = 'span';
    // private readonly TAG_FIELD_INPUT = 'input';

    private readonly CLASS_USER_CONTAINER = 'user__container';
    private readonly CLASS_USER_DATA = 'user__data';
    private readonly CLASS_USER_HEADER = 'user__header';
    private readonly CLASS_USER_FIELD = 'user__row_name';
    private readonly CLASS_USER_FIELD_STAR = 'user__star';
    private readonly CLASS_USER_STAR = 'user__star-item';
    private readonly CLASS_BUTTON = 'big__button';
    private readonly CLASS_BUTTON_WIDE = 'wide__button';
    private readonly CLASS_TABLE = 'user__table';
    private readonly CLASS_TABLE_ROW = 'table__row';
    private readonly CLASS_TABLE_DATA = 'table__data';
    private readonly CLASS_HIDDEN = 'user__hidden';
    private readonly CLASS_UNVISIBLE = 'user__unvisible';

    private readonly PATH_IMAGE_STAR = './assets/icons/star-empty.png'

    private readonly ID_ROLE_CUSTOMER = '1';
    private readonly ID_ROLE_CARRIER = '2';

    private _headerUser = document.createElement(this.TAG_USER_HEADER);
    private _firstNameLabel = document.createElement(this.TAG_FIELD_LABEL);
    private _lastNameLabel = document.createElement(this.TAG_FIELD_LABEL);
    private _phoneLabel = document.createElement(this.TAG_FIELD_LABEL);
    private _emailLabel = document.createElement(this.TAG_FIELD_LABEL);
    private _passwordLabel = document.createElement(this.TAG_FIELD_LABEL);
    private _headerCompany = document.createElement(this.TAG_USER_HEADER);
    private _companyNameLabel = document.createElement(this.TAG_FIELD_LABEL);
    private _companyAddressLabel = document.createElement(this.TAG_FIELD_LABEL);
    private _companyRatingLabel = document.createElement(this.TAG_FIELD_LABEL);
    private _starContainer = document.createElement(this.TAG_FIELD_ROW);
    private _headerStatisticCar = document.createElement(this.TAG_USER_HEADER);
    private _headerStatisticCargo = document.createElement(this.TAG_USER_HEADER);

    private _firstNameInput = document.createElement(this.TAG_FIELD_INPUT);
    private _lastNameInput = document.createElement(this.TAG_FIELD_INPUT);
    private _phoneInput = document.createElement(this.TAG_FIELD_INPUT);
    private _emailInput = document.createElement(this.TAG_FIELD_INPUT);
    private _passwordInput = document.createElement(this.TAG_FIELD_INPUT);
    private _companyNameInput = document.createElement(this.TAG_FIELD_INPUT);
    private _companyAddressInput = document.createElement(this.TAG_FIELD_INPUT);
    private _buttonAccept = document.createElement(this.TAG_BUTTON);
    private _tableContainerCar = document.createElement(this.TAG_TABLE_CONTAINER);
    private _tableContainerCargo = document.createElement(this.TAG_TABLE_CONTAINER);

    private _map!: MapLeaflet;
    private _user!: User;
    private _cargoes = new Map<HTMLElement, Cargo>();
    private _cars = new Map<HTMLElement, Car>();

    private _errorMessage = '';

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.addSender(AppEvents.MAIN_CARGO_BY_USER_RECEIVED, this);
        this._observer.addSender(AppEvents.MAIN_CAR_BY_USER_RECEIVED, this);

        this._observer.addSender(AppEvents.MAIN_CARGO_CREATE_SUCCESS, this);
        this._observer.addSender(AppEvents.MAIN_CARGO_DELETE_SUCCESS, this);
        this._observer.addSender(AppEvents.MAIN_CARGO_CHANGE_SUCCESS, this);

        this._observer.addSender(AppEvents.MAIN_CAR_CREATE_SUCCESS, this);
        this._observer.addSender(AppEvents.MAIN_CAR_DELETE_SUCCESS, this);
        this._observer.addSender(AppEvents.MAIN_CAR_CHANGE_SUCCESS, this);

        this._observer.notify(AppEvents.LOCALE_GET, this);
        this._observer.notify(AppEvents.AUTH_GET_AUTH_USER, this);
    }
    notify(nameEvent: AppEvents, sender: INotify | view, params?: Map<string, string> | Cargo | Array<Cargo> | Car | Array<Car>): void {
        switch (nameEvent) {
            case AppEvents.LOCALE_SET: {
                this._observer.notify(AppEvents.LOCALE_GET, this);
                break;
            }
            case AppEvents.MAIN_CARGO_BY_USER_RECEIVED: {
                //TODO данные могут придти до получения текущего юзера
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
            case AppEvents.MAIN_CAR_BY_USER_RECEIVED: {
                //TODO данные могут придти до получения текущего юзера
                this.setAllCar(params as Array<Car>);
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
    setLocale(localeModel: localeModel): void {
        this._asideItemSpan.textContent = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_OVERVIEW);
        this._headerUser.textContent = localeModel.getPhrase(LocaleKeys.MAIN_OVERVIEW_HEADER_PERSONAL);
        this._firstNameLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_OVERVIEW_USER_NAME);
        this._lastNameLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_OVERVIEW_USER_FAMILY);
        this._phoneLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_OVERVIEW_COMPANY_PHONE);
        this._emailLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_OVERVIEW_EMAIL);
        this._passwordLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_OVERVIEW_PASSWORD);
        this._headerCompany.textContent = localeModel.getPhrase(LocaleKeys.MAIN_OVERVIEW_HEADER_COMPANY);
        this._companyNameLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_OVERVIEW_COMPANY_NAME);
        this._companyAddressLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_OVERVIEW_COMPANY_ADDRESS);
        this._companyRatingLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_OVERVIEW_HEADER_RATING);
        this._buttonAccept.textContent = localeModel.getPhrase(LocaleKeys.MAIN_OVERVIEW_ACCEPT);
        this._headerStatisticCar.textContent = localeModel.getPhrase(LocaleKeys.MAIN_OVERVIEW_HEADER_TRANSPORT);
        this._headerStatisticCargo.textContent = localeModel.getPhrase(LocaleKeys.MAIN_OVERVIEW_HEADER_CARGO);
        this._errorMessage = localeModel.getPhrase(LocaleKeys.COMMON_ERROR_SAVE);;
    }
    setMap(map: MapLeaflet) {
        this._map = map;
        this._mainElement.appendChild(this._map.getMap());
        this._map.setRouteMode(false);
    }
    setAuthorizedUser(authUser: User | false) {
        if (authUser !== false) {
            this._user = authUser;
            this._firstNameInput.value = authUser.first_name;
            this._lastNameInput.value = authUser.last_name;
            this._phoneInput.value = authUser.phone;
            this._emailInput.value = authUser.email;
            this._passwordInput.value = '';
            this._companyNameInput.value = authUser.company;
            this._companyAddressInput.value = authUser.address;
            const rating = authUser.rating / authUser.rating_count;
            this._starContainer.style.background = `linear-gradient(to right, #4c577abd ${rating * 2 * 10}%, white ${100 - rating * 2 * 10}%)`;

            if (this._user.role_id === this.ID_ROLE_CUSTOMER) {
                this._headerStatisticCar.classList.add(this.CLASS_UNVISIBLE);
                this._tableContainerCar.classList.add(this.CLASS_UNVISIBLE);
                this._headerStatisticCargo.classList.remove(this.CLASS_HIDDEN);
                this._tableContainerCargo.classList.remove(this.CLASS_HIDDEN);
            } else {
                this._headerStatisticCargo.classList.add(this.CLASS_UNVISIBLE);
                this._tableContainerCargo.classList.add(this.CLASS_UNVISIBLE);
                this._headerStatisticCar.classList.remove(this.CLASS_HIDDEN);
                this._tableContainerCar.classList.remove(this.CLASS_HIDDEN);
            }
    
        } else {
            alert(this._errorMessage);
        }
    }
    setAllCargo(cargoes: Array<Cargo>): void {
        this.clearTableCargo();
        for (let i = 0; i < cargoes.length; i += 1) {
            if (this._user.id === cargoes[i].user_id) {
                const rowElement = this.createRowCargo(cargoes[i])
                this._tableContainerCargo.appendChild(rowElement);
                this._cargoes.set(rowElement, cargoes[i]);
                this.addItemToMap(cargoes[i]);
            }
        }
    }
    cargoCreatedHandler(cargo: Cargo) {
        if (cargo !== undefined) {
            const rowElement = this.createRowCargo(cargo);
            this._cargoes.set(rowElement, cargo);
            this._tableContainerCargo.appendChild(rowElement);
            this.addItemToMap(cargo);
        }
    }
    cargoDeletedHandler(cargo: Cargo) {
        this._cargoes.forEach((value, key) => {
            if (value.id === cargo.id) {
                key.remove();
                this.removeItemFromMap(cargo);
            }
        });
    }
    cargoChangedHandler(cargo: Cargo) {
        this._cargoes.forEach((value, key) => {
            if (value.id === cargo.id) {
                value = cargo;
                key.children[0].textContent = cargo.point_start_lat + ', ' + cargo.point_start_lon;
                key.children[1].textContent = cargo.point_end_lat + ', ' + cargo.point_end_lon;
                key.children[2].textContent = (cargo.user_company !== undefined ? cargo.user_company : '');
                const firstname = (cargo.user_firstname !== undefined ? cargo.user_firstname : '');
                const lasttname = (cargo.user_lastname !== undefined ? cargo.user_lastname : '');
                const phone = (cargo.user_phone !== undefined ? cargo.user_phone : '');
                key.children[3].textContent = firstname + ' ' + lasttname + ' ' + phone;
                key.children[4].textContent = cargo.price.toString();
                key.children[5].textContent = cargo.currency;
                key.children[6].textContent = cargo.volume.toString();
                key.children[7].textContent = cargo.weigth.toString();
                key.children[8].textContent = cargo.description;
                this.changeItemOnMap(cargo);
            }
        });
    }
    setAllCar(cars: Array<Car>): void {
        this.clearTableCar();
        for (let i = 0; i < cars.length; i += 1) {
            if (this._user.id === cars[i].user_id) {
                const rowElement = this.createRowCar(cars[i])
                this._tableContainerCar.appendChild(rowElement);
                this._cars.set(rowElement, cars[i]);
                this.addItemToMap(cars[i]);
            }
        }
    }
    carCreatedHandler(car: Car) {
        if (car !== undefined) {
            const rowElement = this.createRowCar(car);
            this._cars.set(rowElement, car);
            this._tableContainerCar.appendChild(rowElement);
            this.addItemToMap(car);
        }
    }
    carDeletedHandler(car: Car) {
        this._cars.forEach((value, key) => {
            if (value.id === car.id) {
                key.remove();
                this.removeItemFromMap(car);
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
                this.changeItemOnMap(car);
            }
        });
    }
    private clearTableCargo(): void {
        this._cargoes.forEach((cargo) => {
            this.removeItemFromMap(cargo);
        });
        this._cargoes.clear();
        while (this._tableContainerCargo.firstElementChild) {
            this._tableContainerCargo.firstElementChild.remove();
        }
    }
    private clearTableCar(): void {
        this._cars.forEach((car) => {
            this.removeItemFromMap(car);
        });
        this._cars.clear();
        while (this._tableContainerCar.firstElementChild) {
            this._tableContainerCar.firstElementChild.remove();
        }
    }
    private addItemToMap(item: Cargo | Car): void {
        this._map.addItemToMap(item);
    }
    private removeItemFromMap(item: Cargo | Car): void {

    }
    private changeItemOnMap(item: Cargo | Car): void {

    }
    private createRowCar(car: Car): HTMLElement {
        const rowElement = document.createElement(this.TAG_TABLE_ROW);
        rowElement.className = this.CLASS_TABLE_ROW
        let rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = car.model;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowElement.appendChild(rowItem);
        rowElement.addEventListener('click', (event) => {
            const clickedElement = <HTMLDivElement>event.target;
            const rowElement = clickedElement.closest(this.TAG_TABLE_ROW);
            if (rowElement !== null) {
                this._map.openItemOnMap(this._cars.get(rowElement) as Car);
            }
        });
        return rowElement;
    }
    private createRowCargo(cargo: Cargo): HTMLElement {
        const rowElement = document.createElement(this.TAG_TABLE_ROW);
        rowElement.className = this.CLASS_TABLE_ROW
        let rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = cargo.description;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowElement.appendChild(rowItem);
        rowElement.addEventListener('click', (event) => {
            const clickedElement = <HTMLDivElement>event.target;
            const rowElement = clickedElement.closest(this.TAG_TABLE_ROW);
            if (rowElement !== null) {
                this._map.openItemOnMap(this._cargoes.get(rowElement) as Cargo);
            }
        });
        return rowElement;
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
        this._mainElement.appendChild(userElement);

        this._headerUser.classList.add(this.CLASS_USER_HEADER);
        userElement.appendChild(this._headerUser);

        let nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._firstNameLabel);
        nameRow.appendChild(this._firstNameInput);
        this._firstNameInput.addEventListener('keydown', () => {
            this._buttonAccept.removeAttribute('disabled');
        });
        userElement.appendChild(nameRow);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._lastNameLabel);
        nameRow.appendChild(this._lastNameInput);
        this._lastNameInput.addEventListener('keydown', () => {
            this._buttonAccept.removeAttribute('disabled');
        });
        userElement.appendChild(nameRow);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._phoneLabel);
        nameRow.appendChild(this._phoneInput);
        this._phoneInput.addEventListener('keydown', () => {
            this._buttonAccept.removeAttribute('disabled');
        });
        userElement.appendChild(nameRow);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._emailLabel);
        nameRow.appendChild(this._emailInput);
        this._emailInput.addEventListener('keydown', () => {
            this._buttonAccept.removeAttribute('disabled');
        });
        userElement.appendChild(nameRow);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._passwordLabel);
        nameRow.appendChild(this._passwordInput);
        this._passwordInput.setAttribute('type', 'password');
        this._passwordInput.setAttribute('autocomplete', 'off');
        this._passwordInput.style.userSelect = 'none';
        this._passwordInput.addEventListener('keydown', () => {
            this._buttonAccept.removeAttribute('disabled');
        });
        userElement.appendChild(nameRow);

        this._headerCompany.classList.add(this.CLASS_USER_HEADER);
        userElement.appendChild(this._headerCompany);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._companyNameLabel);
        nameRow.appendChild(this._companyNameInput);
        this._companyNameInput.addEventListener('keydown', () => {
            this._buttonAccept.removeAttribute('disabled');
        });
        userElement.appendChild(nameRow);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._companyAddressLabel);
        nameRow.appendChild(this._companyAddressInput);
        this._companyAddressInput.addEventListener('keydown', () => {
            this._buttonAccept.removeAttribute('disabled');
        });
        userElement.appendChild(nameRow);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._companyRatingLabel);
        this._starContainer = document.createElement(this.TAG_FIELD_ROW);
        this._starContainer.classList.add(this.CLASS_USER_FIELD_STAR);
        for (let i = 0; i < 5; i += 1) {
            const starElement = document.createElement(this.TAG_FIELD_IMG);
            starElement.classList.add(this.CLASS_USER_STAR);
            starElement.src = this.PATH_IMAGE_STAR;
            this._starContainer.appendChild(starElement);
        }
        nameRow.appendChild(this._starContainer);
        userElement.appendChild(nameRow);

        this._buttonAccept.classList.add(this.CLASS_BUTTON);
        this._buttonAccept.classList.add(this.CLASS_BUTTON_WIDE);
        this._buttonAccept.addEventListener('click', this.buttonAcceptClickHandler.bind(this));
        this._buttonAccept.setAttribute('disabled', 'true');
        userElement.appendChild(this._buttonAccept);

        this._headerStatisticCargo.classList.add(this.CLASS_USER_HEADER);
        this._headerStatisticCargo.classList.add(this.CLASS_HIDDEN);
        userElement.appendChild(this._headerStatisticCargo);
        this._tableContainerCargo.classList.add(this.CLASS_TABLE);
        this._tableContainerCargo.classList.add(this.CLASS_HIDDEN);
        userElement.appendChild(this._tableContainerCargo);

        this._headerStatisticCar.classList.add(this.CLASS_USER_HEADER);
        this._headerStatisticCar.classList.add(this.CLASS_HIDDEN);
        userElement.appendChild(this._headerStatisticCar);
        this._tableContainerCar.classList.add(this.CLASS_TABLE);
        this._tableContainerCar.classList.add(this.CLASS_HIDDEN);
        userElement.appendChild(this._tableContainerCar);
    }
    private buttonAcceptClickHandler() {
        this._buttonAccept.setAttribute('disabled', 'true');
        const user: User = {
            id: this._user.id,
            login: this._user.login,
            email: this._emailInput.value,
            password: (this._passwordInput.value !== '' ? this._passwordInput.value : ''),
            role_id: this._user.role_id,
            first_name: this._firstNameInput.value,
            last_name: this._lastNameInput.value,
            phone: this._phoneInput.value,
            company: this._companyNameInput.value,
            address: this._companyAddressInput.value,
            rating: this._user.rating,
            rating_count: this._user.rating_count,
            point_lat: 0,
            point_lon: 0,
        }
        this._observer.notify(AppEvents.MAIN_USER_SAVE_INFO, this, user as User);
    }
}