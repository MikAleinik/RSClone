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
    private readonly TAG_FIELDSET_ITEM = 'div';
    private readonly TAG_FIELDSET_INPUT = 'input';
    private readonly TAG_FIELDSET_LABEL = 'label';

    private readonly TAG_TABLE_CONTAINER = 'div';
    private readonly TAG_TABLE_ROW = 'div';
    private readonly TAG_TABLE_ROW_DATA = 'span';
    private readonly TAG_WAIT_IMAGE = 'img';

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

    private _minPrice = 0;
    private _minVolume = 0;
    private _minWeight = 0;
    private _maxPrice = 20000;
    private _maxVolume = 100;
    private _maxWeight = 30;

    private _formFilterLegend = document.createElement(this.TAG_LEGEND);
    private _formItemSearch = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemSearchLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemPrice = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemPriceRange = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemPriceLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemWeight = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemWeightRange = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemWeightLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemVolume = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemVolumeRange = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemVolumeLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemButtonClear = document.createElement(this.TAG_FIELDSET_BUTTON);

    private _tableHeaderPrice = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderWeight = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderVolume = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderDescription = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderCompany = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderContact = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderPointStart = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderPointEnd = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableContainer = document.createElement(this.TAG_TABLE_CONTAINER);

    private _cargoes = new Map<HTMLElement, Cargo>();
    // private _cargoes = new Array<Cargo>();

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.addSender(AppEvents.MAIN_CARGO_CREATE_SUCCESS, this);
        this._observer.addSender(AppEvents.MAIN_CARGO_DELETE_SUCCESS, this);
        this._observer.addSender(AppEvents.MAIN_CARGO_CHANGE_SUCCESS, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
        this._observer.notify(AppEvents.MAIN_CARGO_GET_ALL, this);
    }
    notify(nameEvent: AppEvents, sender: INotify | view, params?: Map<string, string> | Cargo): void {
        switch (nameEvent) {
            case AppEvents.LOCALE_SET: {
                this._observer.notify(AppEvents.LOCALE_GET, this);
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
    cargoCreatedHandler(cargo: Cargo) {
        const rowElement = this.createRow(cargo);
        this._cargoes.set(rowElement, cargo);
        this._tableContainer.appendChild(rowElement);
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
            }
        });
    }
    setLocale(localeModel: localeModel): void {
        this._asideItemSpan.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_EXCHANGE_CARGO);
        this._formFilterLegend.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_HEADER);
        this._formItemSearchLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_SEARCH);
        this._formItemPriceLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_PRICE);
        this._formItemWeightLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_WEIGHT);
        this._formItemVolumeLabel.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_VOLUME);
        this._tableHeaderPointStart.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_LOCATION_FROM);
        this._tableHeaderPointEnd.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_LOCATION_TO);
        this._tableHeaderCompany.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_COMPANY);
        this._tableHeaderContact.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_USER);
        this._tableHeaderPrice.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_PRICE);
        this._tableHeaderVolume.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_VOLUME);
        this._tableHeaderWeight.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_Weight);
        this._tableHeaderDescription.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_EXCHANGE_CARGO_DESCRIPTION);
        this._formItemButtonClear.innerHTML = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_CLEAR);
    }
    setAllCargo(cargoes: Array<Cargo>): void {
        this._observer.notify(AppEvents.MAIN_CARGO_BY_USER_RECEIVED, this, cargoes);
        this.clearTable();
        this._cargoes.clear();
        for (let i = 0; i < cargoes.length; i += 1) {
            const rowElement = this.createRow(cargoes[i])
            this._tableContainer.appendChild(rowElement);
            this._cargoes.set(rowElement, cargoes[i]);
        }
    }
    showErrorMessage(message: Map<string, string> | false) {
        //TODO
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
        rowItem.textContent = (cargo.user_company !== undefined ? cargo.user_company : '');
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_company');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        const firstname = (cargo.user_firstname !== undefined ? cargo.user_firstname : '');
        const lasttname = (cargo.user_lastname !== undefined ? cargo.user_lastname : '');
        const phone = (cargo.user_phone !== undefined ? cargo.user_phone : '');
        rowItem.textContent = firstname + ' ' + lasttname + ' ' + phone;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_contacts');
        rowElement.appendChild(rowItem);
        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = `${cargo.price.toString()} ${cargo.currency}`;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_price');
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
        tableHeader.appendChild(this._tableHeaderCompany);
        this._tableHeaderCompany.className = this.CLASS_TABLE_DATA;
        this._tableHeaderCompany.classList.add('table__data_company');
        tableHeader.appendChild(this._tableHeaderContact);
        this._tableHeaderContact.className = this.CLASS_TABLE_DATA;
        this._tableHeaderContact.classList.add('table__data_contacts');
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
        this._formItemPrice.value = this._maxPrice.toString()
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
        containerItem.appendChild(this._formItemWeightLabel)
        containerItem.appendChild(this._formItemWeight);
        this._formItemWeight.setAttribute('type', 'number')
        this._formItemWeight.id = 'weight'
        this._formItemWeight.value = this._maxWeight.toString();
        formElement.appendChild(containerItem);
        this._formItemWeightRange.setAttribute('type', 'range')
        this._formItemWeightRange.min = this._minWeight.toString();
        this._formItemWeightRange.max = this._formItemWeight.value;
        this._formItemWeightRange.value = this._formItemWeight.value;
        containerItem.appendChild(this._formItemWeightRange);
        formElement.appendChild(containerItem);
        
        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_BUTTON_CONTAINER);
        this._formItemButtonClear.classList.add('big__button');
        containerItem.appendChild(this._formItemButtonClear);
        formElement.appendChild(containerItem);

        this._formItemButtonClear.addEventListener('click', (e) => {
            this._formItemSearch.value = '';
            this._formItemPrice.value = this._maxPrice.toString();
            this._formItemWeight.value = this._maxVolume.toString();
            this._formItemVolume.value = this._maxWeight.toString();
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

            const search = inputField.id === 'search' ? inputField.value : '';
            const price = inputField.id === 'price' ? inputField.value : this._formItemPrice.value;
            const weight = inputField.id === 'weight' ? inputField.value : this._formItemWeight.value;
            const volume = inputField.id === 'volume' ? inputField.value : this._formItemVolume.value;
            
            for (const r of allRows){
                const textData = [
                    r.childNodes[0].textContent?.toLocaleLowerCase(),
                    r.childNodes[1].textContent?.toLocaleLowerCase(),
                    r.childNodes[2].textContent?.toLocaleLowerCase(),
                    r.childNodes[3].textContent?.toLocaleLowerCase(),
                    r.childNodes[7].textContent?.toLocaleLowerCase()
                ].toString().includes(search.toLocaleLowerCase());
                const priceData = Number(r.childNodes[4].textContent?.slice(0, r.childNodes[4].textContent.length-4)) <= Number(price);
                const volumeData = Number(r.childNodes[5].textContent) <= Number(volume);
                const weightData = Number(r.childNodes[6].textContent) <= Number(weight);
                if (textData && priceData && volumeData && weightData){
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