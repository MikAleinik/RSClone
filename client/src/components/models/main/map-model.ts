import { AppEvents } from "../../controller/app-events";
import Observer from "../../controller/observer";
import ILocale from "../../interfaces/i-locale";
import INotify from "../../interfaces/i-notify";
import view from "../../view/index/view";
import { LocaleKeys } from "../common/localization/locale-keys";
import localeModel from "../common/localization/locale-model";

export default class MapModel implements INotify, ILocale {
    private readonly EVENT_NAME_BY_LAT_LON_SETTED = 'eventNameByLatLonSetted';
    private readonly EVENT_NAME_BY_LAT_LON_ADDED = 'eventNameByLatLonAdded';

    private _observer;
    private _currentLanguage = '';
    private _queueNameByLatLon = new Array<Map<string, string | HTMLElement>>();
    private _statusWorkNameByLatLon = false;

    constructor(observer: Observer) {
        this._observer = observer;
        this._observer.addSender(AppEvents.LOCALE_SET, this);
        this._observer.notify(AppEvents.LOCALE_GET, this);
    }
    notify(nameEvent: AppEvents, sender: INotify | view): void {
        switch (nameEvent) {
            case AppEvents.LOCALE_SET: {
                this._observer.notify(AppEvents.LOCALE_GET, this);
                break;
            }
            default: {
                break;
            }
        }
    }
    setLocale(localeModel: localeModel): void {
        this._currentLanguage = localeModel.getPhrase(LocaleKeys.LOCALE);
        this.start();
    }
    setNameByLatLon(param: Map<string, string | HTMLElement>) {
        this._queueNameByLatLon.push(param);
        document.dispatchEvent(new CustomEvent(this.EVENT_NAME_BY_LAT_LON_ADDED));
    }
    private start() {
        document.addEventListener(this.EVENT_NAME_BY_LAT_LON_SETTED, () => {
            if (this._queueNameByLatLon.length > 0) {
                const lat = <string>this._queueNameByLatLon[0].get('lat');
                const lon = <string>this._queueNameByLatLon[0].get('lon');
                const element: HTMLElement = <HTMLElement>this._queueNameByLatLon[0].get('element');
                this._queueNameByLatLon.shift();
                this.getPointInfo(lat, lon, element);
            }
        });
        document.addEventListener(this.EVENT_NAME_BY_LAT_LON_ADDED, () => {
            if (!this._statusWorkNameByLatLon) {
                const lat = <string>this._queueNameByLatLon[0].get('lat');
                const lon = <string>this._queueNameByLatLon[0].get('lon');
                const element: HTMLElement = <HTMLElement>this._queueNameByLatLon[0].get('element');
                this._queueNameByLatLon.shift();
                this.getPointInfo(lat, lon, element);
            }
        });
    }
    // private testFunc(lat: string, lon: string, element: HTMLElement) {
    //     this._statusWorkNameByLatLon = true;
    //     setTimeout(() => {
    //         console.log(`${lat}, ${lon}`);
    //         this._statusWorkNameByLatLon = false;
    //         document.dispatchEvent(new CustomEvent(this.EVENT_NAME_BY_LAT_LON_SETTED));
    //     }, 1000);
    // }
    private getPointInfo(lat: string, lon: string, element: HTMLElement) {
        this._statusWorkNameByLatLon = true;
        const infoUrl = 'https://nominatim.openstreetmap.org/reverse?';
        const infoFormat = 'format=json';
        const infoCoordinates = `lat=${lat}&lon=${lon}`
        const infoLanguage = `accept-language="${this._currentLanguage}"`;
        fetch(`${infoUrl}${infoFormat}&${infoCoordinates}&${infoLanguage}`)
            .then((response) => response.json())
            .then((data) => {
                if (this._currentLanguage === 'ru') {
                    element.textContent = data.display_name;
                    this._statusWorkNameByLatLon = false;
                    document.dispatchEvent(new CustomEvent(this.EVENT_NAME_BY_LAT_LON_SETTED));
                } else {
                    element.textContent = this.convertTextToEn(data.display_name);
                    this._statusWorkNameByLatLon = false;
                    document.dispatchEvent(new CustomEvent(this.EVENT_NAME_BY_LAT_LON_SETTED));
                }
            })
            .catch((error) => {
                element.textContent = `${lat}, ${lon}`;
                this._statusWorkNameByLatLon = false;
                document.dispatchEvent(new CustomEvent(this.EVENT_NAME_BY_LAT_LON_SETTED));
            });
    }
    private convertTextToEn(text: string): string {
        let result = '';
        const SYMBOL_RU = new Array('а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я');
        const SYMBOL_EN = new Array('a', 'b', 'v', 'g', 'd', 'е', 'e', 'j', 'z', 'i', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh', 'sch', '', '', '', 'e', 'yu', 'ya');
        const SYMBOL_RU_UPPER = new Array('А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я');
        const SYMBOL_EN_UPPER = new Array('A', 'B', 'C', 'G', 'D', 'E', 'E', 'J', 'Z', 'I', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'H', 'C', 'Ch', 'Sh', 'Sch', '', '', '', 'E', 'Yu', 'Ya');
        for (let i = 0; i < text.length; i += 1) {
            const index = SYMBOL_RU.indexOf(text[i]);
            const indexUpper = SYMBOL_RU_UPPER.indexOf(text[i]);
            if (index !== -1) {
                result += SYMBOL_EN[index];
            } else if (indexUpper !== -1) {
                result += SYMBOL_EN_UPPER[indexUpper];
            } else {
                result += text[i];
            }
        }
        return result;
    }
}