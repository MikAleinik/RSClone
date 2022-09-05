import INotify from "../../interfaces/i-notify";
import NewsModel from "../../models/index/data-model/news-model";
import NewsView from "../../view/index/content/news/news-view";
import View from "../../view/index/view";
import { AppEvents } from "../app-events";

export default class NewsController implements INotify {
    private _newsModel: NewsModel;

    constructor(newsModel: NewsModel) {
        this._newsModel = newsModel;
    }
    notify(nameEvent: AppEvents, sender: View, params?: Map<string, string> | undefined): void {
        switch (nameEvent) {
            case AppEvents.NEWS_GET_DATA: {
                this.getNews(nameEvent, sender, params);
                break;
            }
            default: {
                break;
            }
        }
    }
    private getNews(nameEvent: AppEvents, sender: View, params?: Map<string, string>): void {
        this._newsModel.getNews(nameEvent, params)
            .then((data) => {
                let verifySender = sender as NewsView;
                verifySender.createNews(data);
            })
            .catch((data) => {

            });
    }
}