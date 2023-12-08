import localeModel from '../../../models/common/localization/locale-model';
import { AppEvents } from "../../../controller/app-events";
import Observer from "../../../controller/observer";
import ILocale from "../../../interfaces/i-locale";
import INotify from "../../../interfaces/i-notify";
import view from "../view";
import View from "../view";

export default abstract class AsideItemView extends View implements INotify, ILocale {
    protected readonly TAG_ASIDE_LIST_ITEM = 'li';
    protected readonly TAG_ASIDE_LIST_ITEM_IMAGE = 'img';
    protected readonly TAG_ASIDE_LIST_ITEM_TEXT = 'span';
    protected readonly TAG_DIV = 'div';

    protected _itemElement = document.createElement(this.TAG_ASIDE_LIST_ITEM);
    protected _asideItemSpan = document.createElement(this.TAG_ASIDE_LIST_ITEM_TEXT);
    protected _mainElement = document.createElement(this.TAG_DIV);
    protected _mainContainer: HTMLElement;

    constructor(observer: Observer, mainElement: HTMLElement, iconPath: string) {
        super(observer);
        this._mainContainer = mainElement;
        this.createAsideItemElement(iconPath);
    }
    abstract notify(nameEvent: AppEvents, sender: INotify | view): void;
    abstract setLocale(localeModel: localeModel): void;
    selectElement(): void {
        this.itemClickedHandler();
    }
    getCurrentElement(): HTMLElement {
        return this._itemElement;
    }
    protected itemClickedHandler(): void {
        this._mainContainer.firstElementChild?.remove();
        this._mainContainer.appendChild(this._mainElement);
    }
    protected createAsideItemElement(iconPath: string): void {
        const asideItemImg = document.createElement(this.TAG_ASIDE_LIST_ITEM_IMAGE);
        asideItemImg.src = iconPath;
        this._itemElement.appendChild(asideItemImg);
        this._itemElement.appendChild(this._asideItemSpan);

        this._itemElement.addEventListener('click', this.itemClickedHandler.bind(this));
        
        this._itemElement.addEventListener('click', (e) => {
            const el = e.target as HTMLInputElement;
            const list = document.querySelectorAll('aside li') as NodeListOf<HTMLElement>;
            for (const l of list){
                l.classList.remove('active')
            }
            el.closest('li')?.classList.add('active');
        });
    }
    protected abstract createMainElement(): void;
}