import localeModel from '../../../../models/common/localization/locale-model';
import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import view from "../../view";
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';
import AsideItemView from '../aside-item-view';
import Cargo from '../../../../../types/cargo';

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
    private readonly TAG_TABLE = 'table';
    private readonly TAG_TABLE_HEADER = 'thead';
    private readonly TAG_TABLE_BODY = 'tbody';
    private readonly TAG_TABLE_ROW = 'tr';
    private readonly TAG_TABLE_ROW_HEADER_ITEM = 'th';
    private readonly TAG_TABLE_ROW_BODY_ITEM = 'td';

    private readonly CLASS_FIELDSET = 'item_form';
    private readonly CLASS_FIELDSET_ITEM = 'field__container';
    private readonly CLASS_FIELDSET_BUTTON_HIDDEN = 'field__button_hidden';
    private readonly CLASS_TABLE_CONTAINER = 'scroll-table';
    private readonly CLASS_TABLE_BODY = 'scroll-table__body';

    private readonly CURRENCY = new Array('USD', 'EUR', 'BYN', 'RUB');

    private _formFilterLegend = document.createElement(this.TAG_LEGEND);
    private _tableHeaderPrice = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderCurrency = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderWeight = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderVolume = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderDescription = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderPointStart = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableHeaderPointEnd = document.createElement(this.TAG_TABLE_ROW_HEADER_ITEM);
    private _tableBody = document.createElement(this.TAG_TABLE_BODY);

    private _formItemPrice = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemCurrency = document.createElement(this.TAG_FIELDSET_SELECT);
    private _formItemWeight = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemVolume = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemDescription = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemPointStart = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemPointEnd = document.createElement(this.TAG_FIELDSET_INPUT);

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

    private _cargoes = new Map<HTMLElement, Cargo>();
    private _selectedCargo: Cargo | false;

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
        this._observer.notify(AppEvents.MAIN_CARGO_GET_BY_USER, this);
        this._selectedCargo = false;
    }
    notify(nameEvent: AppEvents, sender: INotify | view): void {
        switch (nameEvent) {
            case AppEvents.LOCALE_SET: {
                this._observer.notify(AppEvents.LOCALE_GET, this);
                break;
            }
        }
    }
    setAllCargo(cargoes: Array<Cargo>): void {
        this.clearTable();
        this._cargoes.clear();
        for (let i = 0; i < cargoes.length; i += 1) {
            const rowElement = this.createRow(cargoes[i]);
            rowElement.addEventListener('click', this.rowClickHandler.bind(this));
            this._cargoes.set(rowElement, cargoes[i]);
            this._tableBody.appendChild(rowElement);
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
                key.children[0].textContent = cargo.point_start_lat + ', ' + cargo.point_start_lon;
                key.children[1].textContent = cargo.point_end_lat + ', ' + cargo.point_end_lon;
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
        this._tableBody.appendChild(rowElement);
        this.clearCargoHandler();
        this._observer.notify(AppEvents.MAIN_CARGO_CREATE_SUCCESS, this, cargo);
    }
    createCargoFail(cargo: Cargo) {
        this.clearCargoHandler();
    }
    showErrorMessage(message: Map<string, string> | false) {
        if (!message) {
            console.log('TODO Ошибка получения грузов пользователя');
        } else {
            console.log(message.get('message'));
        }
    }
    setLocale(localeModel: localeModel): void {
        this._asideItemSpan.textContent = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_CARGO);

        this._formFilterLegend.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_PANEL_HEADER);

        this._formItemPriceLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_PRICE);
        this._formItemCurrencyLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_CURRENCY);
        this._formItemWeightLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_Weight);
        this._formItemVolumeLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_VOLUME);
        this._formItemDescriptionLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_DESCRIPTION);
        this._formItemPointStartLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_LOCATION_FROM);
        this._formItemPointEndLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_LOCATION_TO);

        this._tableHeaderPointStart.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_LOCATION_FROM);
        this._tableHeaderPointEnd.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_LOCATION_TO);
        this._tableHeaderPrice.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_PRICE);
        this._tableHeaderCurrency.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_CURRENCY);
        this._tableHeaderVolume.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_VOLUME);
        this._tableHeaderWeight.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_Weight);
        this._tableHeaderDescription.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_DESCRIPTION);

        this._formItemButtonCreate.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_ADD_NEW);
        this._formItemButtonSave.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_SAVE);
        this._formItemButtonDelete.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_DELETE);
        this._formItemButtonClear.textContent = localeModel.getPhrase(LocaleKeys.MAIN_CARGO_CLEAR);
    }
    protected createMainElement(): void {
        this._mainElement.appendChild(this.createForm());
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
    private createForm(): HTMLElement {
        const formElement = document.createElement(this.TAG_FIELDSET);
        formElement.classList.add(this.CLASS_FIELDSET);
        formElement.appendChild(this._formFilterLegend);

        let containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        containerItem.appendChild(this._formItemPointStartLabel);
        containerItem.appendChild(this._formItemPointStart);
        formElement.appendChild(containerItem);

        containerItem = document.createElement(this.TAG_FIELDSET_ITEM);
        containerItem.classList.add(this.CLASS_FIELDSET_ITEM);
        containerItem.appendChild(this._formItemPointEndLabel);
        containerItem.appendChild(this._formItemPointEnd);
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

        formElement.appendChild(this._formItemButtonCreate);
        formElement.appendChild(this._formItemButtonDelete);
        formElement.appendChild(this._formItemButtonClear);
        formElement.appendChild(this._formItemButtonSave);
        this._formItemButtonSave.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonDelete.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonClear.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonCreate.addEventListener('click', this.createNewCargoHandler.bind(this));
        this._formItemButtonSave.addEventListener('click', this.saveCargoHandler.bind(this));
        this._formItemButtonDelete.addEventListener('click', this.deleteCargoHandler.bind(this));
        this._formItemButtonClear.addEventListener('click', this.clearCargoHandler.bind(this));

        return formElement;
    }
    private createNewCargoHandler() {
        const cargo = {
            id: 0,
            user_id: 0,
            point_start_lat: Number(this._formItemPointStart.value),
            point_start_lon: Number(this._formItemPointStart.value),
            point_end_lat: Number(this._formItemPointEnd.value),
            point_end_lon: Number(this._formItemPointEnd.value),
            price: Number(this._formItemPrice.value),
            currency: this._formItemCurrency.value,
            volume: Number(this._formItemVolume.value),
            weigth: Number(this._formItemWeight.value),
            finished: false,
            description: this._formItemDescription.value
        }
        this._observer.notify(AppEvents.MAIN_CARGO_CREATE, this, cargo);
    }
    private saveCargoHandler() {
        this._observer.notify(AppEvents.MAIN_CARGO_CHANGE, this, <Cargo>this._selectedCargo);
    }
    private deleteCargoHandler() {
        this._observer.notify(AppEvents.MAIN_CARGO_DELETE, this, <Cargo>this._selectedCargo);
    }
    private clearCargoHandler() {
        this._formItemButtonCreate.classList.remove(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonSave.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonClear.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._formItemButtonDelete.classList.add(this.CLASS_FIELDSET_BUTTON_HIDDEN);
        this._selectedCargo = false;
        this._formItemPrice.value = '';
        this._formItemCurrency.value = '';
        this._formItemWeight.value = '';
        this._formItemVolume.value = '';
        this._formItemDescription.value = '';
        this._formItemPointStart.value = '';
        this._formItemPointEnd.value = '';
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
            this._formItemPointStart.value = cargo.point_start_lat.toString();
            this._formItemPointEnd.value = cargo.point_end_lat.toString();
        }
    }
}