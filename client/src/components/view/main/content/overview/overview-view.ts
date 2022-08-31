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

export default class OverviewView extends AsideItemView {
    private readonly TAG_USER_DATA = 'div';
    private readonly TAG_USER_HEADER = 'h3';
    private readonly TAG_FIELD_ROW = 'div';
    private readonly TAG_FIELD_LABEL = 'label';
    private readonly TAG_FIELD_INPUT = 'input';
    private readonly TAG_FIELD_IMG = 'img';
    private readonly TAG_BUTTON = 'button';
    // private readonly TAG_FIELD_INPUT = 'input';


    private readonly CLASS_USER_CONTAINER = 'user__container';
    private readonly CLASS_USER_DATA = 'user__data';
    private readonly CLASS_USER_HEADER = 'user__header';
    private readonly CLASS_USER_FIELD = 'user__row_name';
    private readonly CLASS_USER_FIELD_STAR = 'user__star';
    private readonly CLASS_USER_STAR = 'user__star-item';
    private readonly CLASS_BUTTON = 'big__button';

    private readonly PATH_IMAGE_STAR = './assets/icons/star-empty.png'

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

    private _firstNameInput = document.createElement(this.TAG_FIELD_INPUT);
    private _lastNameInput = document.createElement(this.TAG_FIELD_INPUT);
    private _phoneInput = document.createElement(this.TAG_FIELD_INPUT);
    private _emailInput = document.createElement(this.TAG_FIELD_INPUT);
    private _passwordInput = document.createElement(this.TAG_FIELD_INPUT);
    private _companyNameInput = document.createElement(this.TAG_FIELD_INPUT);
    private _companyAddressInput = document.createElement(this.TAG_FIELD_INPUT);
    private _buttonAccept = document.createElement(this.TAG_BUTTON);

    private _map!: MapLeaflet;
    private _user!: User;

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer, mainElement, iconPath);

        this.createMainElement();
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
        this._observer.notify(AppEvents.AUTH_GET_AUTH_USER, this);
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
    }
    setMap(map: MapLeaflet) {
        this._map = map;
        this._mainElement.appendChild(this._map.getMap());
        this._map.setRouteMode(false);
    }
    setAuthorizedUser(authUser: User | false){
        if(authUser !== false) {
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
        } else {
            //TODO error message
        }
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
        userElement.appendChild(nameRow);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._lastNameLabel);        
        nameRow.appendChild(this._lastNameInput);
        userElement.appendChild(nameRow);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._phoneLabel);        
        nameRow.appendChild(this._phoneInput);
        userElement.appendChild(nameRow);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._emailLabel);        
        nameRow.appendChild(this._emailInput);
        userElement.appendChild(nameRow);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._passwordLabel);
        nameRow.appendChild(this._passwordInput);
        this._passwordInput.setAttribute('type', 'password');
        this._passwordInput.setAttribute('autocomplete', 'off');
        this._passwordInput.style.userSelect = 'none';
        userElement.appendChild(nameRow);

        this._headerCompany.classList.add(this.CLASS_USER_HEADER);
        userElement.appendChild(this._headerCompany);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._companyNameLabel);        
        nameRow.appendChild(this._companyNameInput);
        userElement.appendChild(nameRow);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._companyAddressLabel);        
        nameRow.appendChild(this._companyAddressInput);
        userElement.appendChild(nameRow);

        nameRow = document.createElement(this.TAG_FIELD_ROW);
        nameRow.classList.add(this.CLASS_USER_FIELD);
        nameRow.appendChild(this._companyRatingLabel);        
        this._starContainer = document.createElement(this.TAG_FIELD_ROW);
        this._starContainer.classList.add(this.CLASS_USER_FIELD_STAR);
        for(let i = 0; i < 5; i += 1){
            const starElement = document.createElement(this.TAG_FIELD_IMG);
            starElement.classList.add(this.CLASS_USER_STAR);
            starElement.src = this.PATH_IMAGE_STAR;
            this._starContainer.appendChild(starElement);
        }
        nameRow.appendChild(this._starContainer);
        userElement.appendChild(nameRow);

        this._buttonAccept.classList.add(this.CLASS_BUTTON);
        this._buttonAccept.addEventListener('click', this.buttonAcceptClickHandler.bind(this));
        userElement.appendChild(this._buttonAccept);
    }
    private buttonAcceptClickHandler() {
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