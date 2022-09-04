import localeModel from '../../../../models/common/localization/locale-model';
import { AppEvents } from "../../../../controller/app-events";
import Observer from "../../../../controller/observer";
import INotify from "../../../../interfaces/i-notify";
import view from "../../view";
import { LocaleKeys } from '../../../../models/common/localization/locale-keys';
import AsideItemView from '../aside-item-view';
import User from '../../../../../types/user';
import './company.scss';

export default class CompanyView extends AsideItemView {
    private readonly TAG_FIELDSET = 'fieldset';
    private readonly TAG_FIELDSET_ITEM = 'div';
    private readonly TAG_LEGEND = 'legend';
    private readonly TAG_FIELDSET_INPUT = 'input';
    private readonly TAG_FIELDSET_LABEL = 'label';

    private readonly TAG_TABLE_CONTAINER = 'div';
    private readonly TAG_TABLE_ROW = 'div';
    private readonly TAG_TABLE_ROW_DATA = 'span';

    private readonly CLASS_FIELDSET = 'item_form';
    private readonly CLASS_FIELDSET_ITEM = 'field__container';
    private readonly CLASS_TABLE_WRAPPER = 'table__wrapper';
    private readonly CLASS_TABLE_CONTAINER = 'table__container';
    private readonly CLASS_TABLE_HEADER = 'table__header';
    private readonly CLASS_TABLE_ROW = 'table__row';
    private readonly CLASS_TABLE_DATA = 'table__data';

    private readonly TAG_FIELD_ROW = 'div';
    private readonly TAG_FIELD_IMG = 'img';
    private readonly CLASS_USER_FIELD_STAR = 'user__star';
    private readonly CLASS_USER_STAR = 'user__star-item';

    private readonly PATH_IMAGE_STAR = './assets/icons/star-empty.png'
    private readonly PATH_IMAGE_STAR_COLOR = './assets/icons/star-empty-color.png'
    private readonly MAX_RATING = 5;

    private _formFilterLegend = document.createElement(this.TAG_LEGEND);
    private _formItemSearch = document.createElement(this.TAG_FIELDSET_INPUT);
    private _formItemSearchLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemRatingLabel = document.createElement(this.TAG_FIELDSET_LABEL);
    private _formItemRatingSelect = document.createElement(this.TAG_FIELDSET_ITEM);

    private _tableHeaderCompany = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderAddress = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderUserName = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderPhone = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableHeaderRating = document.createElement(this.TAG_TABLE_ROW_DATA);
    private _tableContainer = document.createElement(this.TAG_TABLE_CONTAINER);

    private _users = new Map<HTMLElement, User>();

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
        this._observer.notify(AppEvents.USER_GET_ALL, this);
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
        this._asideItemSpan.textContent = localeModel.getPhrase(LocaleKeys.MAIN_ASIDE_COMPANIES);

        this._tableHeaderCompany.textContent = localeModel.getPhrase(LocaleKeys.MAIN_COMPANY_NAME);
        this._tableHeaderAddress.textContent = localeModel.getPhrase(LocaleKeys.MAIN_COMPANY_ADDRESS);
        this._tableHeaderUserName.textContent = localeModel.getPhrase(LocaleKeys.MAIN_COMPANY_OWNER);
        this._tableHeaderPhone.textContent = localeModel.getPhrase(LocaleKeys.MAIN_COMPANY_PHONE);
        this._tableHeaderRating.textContent = localeModel.getPhrase(LocaleKeys.MAIN_COMPANY_RATING);

        this._formItemSearchLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_SEARCH);
        this._formItemRatingLabel.textContent = localeModel.getPhrase(LocaleKeys.MAIN_FILTER_PANEL_RATING);
    }
    setAllUser(users: Array<User> | false) {
        this.clearTable();
        this._users.clear();
        if (users !== false) {
            for (let i = 0; i < users.length; i += 1) {
                const rowElement = this.createRow(users[i], i + 1);
                this._users.set(rowElement, users[i]);
                this._tableContainer.appendChild(rowElement);
            }
        }
    }
    private clearTable(): void {
        while (this._tableContainer.firstElementChild) {
            this._tableContainer.firstElementChild.remove();
        }
    }
    protected createMainElement(): void {
        this._mainElement.appendChild(this.createForm());
        this._mainElement.appendChild(this.createTable());
    }
    private createRow(user: User, numberRow: number): HTMLElement {
        const rowElement = document.createElement(this.TAG_TABLE_ROW);
        rowElement.className = this.CLASS_TABLE_ROW

        let rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = user.company;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_company');
        rowElement.appendChild(rowItem);

        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = user.address;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_to');
        rowElement.appendChild(rowItem);

        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = `${user.first_name} ${user.last_name}`;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_user');
        rowElement.appendChild(rowItem);

        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        rowItem.textContent = user.phone;
        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_contacts');
        rowElement.appendChild(rowItem);

        rowItem = document.createElement(this.TAG_TABLE_ROW_DATA);
        let rating = Math.floor((user.rating / user.rating_count) * 100) / 100;
        if (Number.isNaN(rating)) {
            rating = 0;
        }
        if (rating > this.MAX_RATING) {
            rating = this.MAX_RATING;
        }
        const starContainer = document.createElement(this.TAG_FIELD_ROW);
        starContainer.classList.add(this.CLASS_USER_FIELD_STAR);
        for (let i = 0; i < 5; i += 1) {
            const starElement = document.createElement(this.TAG_FIELD_IMG);
            starElement.classList.add(this.CLASS_USER_STAR);
            if (numberRow % 2 === 0) {
                starElement.src = this.PATH_IMAGE_STAR_COLOR;
            } else {
                starElement.src = this.PATH_IMAGE_STAR;
            }
            starContainer.appendChild(starElement);
        }
        starContainer.style.background = `linear-gradient(to right, #4c577abd 0%, #4c577abd ${rating * 2 * 10}%, white ${rating * 2 * 10}%, white 100%)`;
        rowItem.appendChild(starContainer);

        rowItem.className = this.CLASS_TABLE_DATA;
        rowItem.classList.add('table__data_rating');
        rowItem.dataset.rating = rating.toString();
        rowElement.appendChild(rowItem);

        return rowElement;
    }
    private createTable(): HTMLElement {
        const tableWrapper = document.createElement(this.TAG_TABLE_CONTAINER);
        tableWrapper.classList.add(this.CLASS_TABLE_WRAPPER);

        const tableHeader = document.createElement(this.TAG_TABLE_ROW);
        tableHeader.className = this.CLASS_TABLE_HEADER;
        tableHeader.appendChild(this._tableHeaderCompany);
        this._tableHeaderCompany.className = this.CLASS_TABLE_DATA;
        this._tableHeaderCompany.classList.add('table__data_company');
        tableHeader.appendChild(this._tableHeaderAddress);
        this._tableHeaderAddress.className = this.CLASS_TABLE_DATA;
        this._tableHeaderAddress.classList.add('table__data_to');
        tableHeader.appendChild(this._tableHeaderUserName);
        this._tableHeaderUserName.className = this.CLASS_TABLE_DATA;
        this._tableHeaderUserName.classList.add('table__data_user');
        tableHeader.appendChild(this._tableHeaderPhone);
        this._tableHeaderPhone.className = this.CLASS_TABLE_DATA;
        this._tableHeaderPhone.classList.add('table__data_contacts');

        tableHeader.appendChild(this._tableHeaderRating);
        this._tableHeaderRating.className = this.CLASS_TABLE_DATA;

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
        containerItem.appendChild(this._formItemRatingLabel)
        for (let i = 0; i < 5; i++){
            const star = document.createElement(this.TAG_FIELD_IMG);
            star.src = this.PATH_IMAGE_STAR;
            star.classList.add('star_active')
            this._formItemRatingSelect.appendChild(star);
        }
        containerItem.appendChild(this._formItemRatingSelect);
        formElement.appendChild(containerItem);
        
        const stars = this._formItemRatingSelect.querySelectorAll(this.TAG_FIELD_IMG);
        let currentRating = 5;
        
        for (let s = 0; s < 5; s++){
            stars[s].addEventListener('click', (e)=>{
                for (let a = 0; a <= s; a++){
                    stars[a].classList.add('star_active')
                    for (let u = a + 1; u < 5; u++){
                        stars[u].classList.remove('star_active')
                    }
                    currentRating = a + 1;
                }
                const allRows = document.querySelectorAll('.table__row') as NodeListOf<HTMLElement>;
                const inputField = e.target as HTMLInputElement;
                const search = inputField.id === 'search' ? inputField.value : '';
                        
                for (const r of allRows){
                    const textData = [
                        r.childNodes[0].textContent?.toLocaleLowerCase(),
                        r.childNodes[1].textContent?.toLocaleLowerCase(),
                        r.childNodes[2].textContent?.toLocaleLowerCase(),
                        r.childNodes[3].textContent?.toLocaleLowerCase()
                    ].toString().includes(search.toLocaleLowerCase());
                    const rRating = r.lastChild as HTMLElement;
                    const ratingData = Number(rRating.dataset.rating) <= currentRating;
                    if (textData && ratingData){
                        r.style.display = 'flex'
                    } else {
                        r.style.display = 'none'
                    }
                }
            })
        }
        function companySearch(){
            
        }
        
        formElement.addEventListener('input', (e) => {
            const allRows = document.querySelectorAll('.table__row') as NodeListOf<HTMLElement>;
            const inputField = e.target as HTMLInputElement;

            const search = inputField.id === 'search' ? inputField.value : '';

            for (const r of allRows){
                const textData = [
                    r.childNodes[0].textContent?.toLocaleLowerCase(),
                    r.childNodes[1].textContent?.toLocaleLowerCase(),
                    r.childNodes[2].textContent?.toLocaleLowerCase(),
                    r.childNodes[3].textContent?.toLocaleLowerCase()
                ].toString().includes(search.toLocaleLowerCase());
                const rRating = r.lastChild as HTMLElement;
                const ratingData = Number(rRating.dataset.rating) <= currentRating;
                if (textData && ratingData){
                    r.style.display = 'flex'
                } else {
                    r.style.display = 'none'
                }
            }
        })

        return formElement;
    }
}