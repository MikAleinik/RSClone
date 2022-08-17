import View from "../view";
import Observer from "../../../controller/observer";

export default class ContentView extends View {
    private _rootContainer = document.body;

    private readonly ASIDE_CONTAINER = 'aside';
    private readonly ASIDE_LIST = 'ul';
    private readonly ASIDE_LIST_ITEM = 'li';
    private _asideElement = document.createElement(this.ASIDE_CONTAINER);

    private readonly MAIN_CONTAINER = 'main';
    private readonly CONTENT_CONTAINER = 'div';
    private _contentElement = document.createElement(this.MAIN_CONTAINER);

    constructor(observer: Observer) {
        super(observer);
        this.createAboutContent();
    }
    
    getCurrentElement(): HTMLElement {
        return this._rootContainer;
    }
    private createAboutContent(): void {
        this._rootContainer.appendChild(this._asideElement);
        this._rootContainer.appendChild(this._contentElement);
        const asideList = document.createElement(this.ASIDE_LIST);
        const content = document.createElement(this.CONTENT_CONTAINER);
        const userRoleActions: {[index: string]: string} = { // fake user role actions
            'user': 'Overview', // i use key also like an image name
            'truck': 'Transport',
            'cargo': 'Cargoes',
            'company': 'Companies',
            'map': 'Calculate routes',
            'news': 'News'
        };
        for (const el in userRoleActions){
            const asideItem = document.createElement(this.ASIDE_LIST_ITEM);
            const asideItemImg = document.createElement('img');
            asideItemImg.src = `./assets/icons/${el}.png`
            const asideItemSpan = document.createElement('span');
            asideItemSpan.textContent = userRoleActions[el];
            asideItem.dataset.link = el;
            asideItem.appendChild(asideItemImg);
            asideItem.appendChild(asideItemSpan);
            asideList.appendChild(asideItem);
        }
        content.innerHTML = '<h3>Test content</h3>'
        this._asideElement.appendChild(asideList);
        this._contentElement.appendChild(content);
        asideList.addEventListener('click', (event) => {
            const tag = event.target as HTMLElement;
            console.log(tag)
        })
    }
}