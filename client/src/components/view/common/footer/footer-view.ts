import Observer from '../../../controller/observer';
import View from '../../index/view';
import './footer.scss';

export default class FooterView extends View {
    private readonly TAG_CONTAINER = 'footer';
    private readonly TAG_LINK = 'a';
    private readonly TAG_TEXT = 'span';
    private readonly TAG_IMAGE = 'img';
    private readonly CLASS_CONTAINER = 'footer';
    private readonly CLASS_LINK = 'footer__item';

    private readonly IMAGE_PATH_GIT = './assets/icons/github.png';
    private readonly IMAGE_PATH_RS = './assets/icons/rsschool.png';
    private readonly IMAGE_ALT_TEXT_DEVELOP = 'github';
    private readonly IMAGE_ALT_TEXT_RS = 'RS School';

    private readonly LINK_ALEINIK = 'https://github.com/MikAleinik';
    private readonly LINK_YURKOVSKY = 'https://github.com/emp74ark';
    private readonly LINK_BORUSHKO = 'https://github.com/freemandb';
    private readonly LINK_SCHOOL = 'https://rs.school/';
    private readonly NAME_ALEINIK = 'Mik Aleinik';
    private readonly NAME_YURKOVSKY = 'Andrei Yurkouski';
    private readonly NAME_BORUSHKO = 'Dan Freeman';
    private readonly NAME_SCHOOL = 'RS-School';

    private _footerElement = document.createElement(this.TAG_CONTAINER);

    constructor(observer: Observer) {
        super(observer);
        this.createFooterElement();
    }
    getCurrentElement(): HTMLElement {
        return this._footerElement;
    }
    private createFooterElement(): void {
        this._footerElement.classList.add(this.CLASS_CONTAINER);
        this._footerElement.setAttribute('id', this.TAG_CONTAINER);

        let linkElement = this.createLinkElement(this.LINK_ALEINIK)
        linkElement.insertAdjacentElement('beforeend', this.createImageElement(this.IMAGE_PATH_GIT, this.IMAGE_ALT_TEXT_DEVELOP));
        linkElement.insertAdjacentElement('beforeend', this.createTextElement(this.NAME_ALEINIK));
        this._footerElement.insertAdjacentElement('beforeend', linkElement);

        linkElement = this.createLinkElement(this.LINK_YURKOVSKY)
        linkElement.insertAdjacentElement('beforeend', this.createImageElement(this.IMAGE_PATH_GIT, this.IMAGE_ALT_TEXT_DEVELOP));
        linkElement.insertAdjacentElement('beforeend', this.createTextElement(this.NAME_YURKOVSKY));
        this._footerElement.insertAdjacentElement('beforeend', linkElement);

        linkElement = this.createLinkElement(this.LINK_BORUSHKO)
        linkElement.insertAdjacentElement('beforeend', this.createImageElement(this.IMAGE_PATH_GIT, this.IMAGE_ALT_TEXT_DEVELOP));
        linkElement.insertAdjacentElement('beforeend', this.createTextElement(this.NAME_BORUSHKO));
        this._footerElement.insertAdjacentElement('beforeend', linkElement);

        linkElement = this.createLinkElement(this.LINK_SCHOOL)
        linkElement.insertAdjacentElement('beforeend', this.createImageElement(this.IMAGE_PATH_RS, this.IMAGE_ALT_TEXT_RS));
        linkElement.insertAdjacentElement('beforeend', this.createTextElement(this.NAME_SCHOOL));
        this._footerElement.insertAdjacentElement('beforeend', linkElement);
    }
    private createLinkElement(link: string): HTMLElement {
        let linkElement = document.createElement(this.TAG_LINK);
        linkElement.classList.add(this.CLASS_LINK);
        linkElement.setAttribute('href', link);
        linkElement.setAttribute('target', '_blank');
        return linkElement;
    }
    private createImageElement(urlImage: string, alt: string): HTMLImageElement {
        let imageElement = document.createElement(this.TAG_IMAGE);
        imageElement.src = urlImage;
        imageElement.setAttribute('alt', alt);
        return imageElement;
    }
    private createTextElement(text: string): HTMLElement {
        let textElement = document.createElement(this.TAG_TEXT);
        textElement.textContent = text;
        return textElement;
    }
}