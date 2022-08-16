import news from "../../../../types/news";
import { AppEvents } from "../../../controller/app-events";
import DataMapper from "../../common/sender/data-mapper";

export default class NewsModel {
    private _dataMapper = new DataMapper();
    constructor() {

    }
    getNews(nameEvent: AppEvents): Promise<Array<news>> {
        return new Promise((resolve, reject) => {
            this._dataMapper.send(nameEvent)
                .then((data) => {
                    resolve(data as Array<news>);
                })
                .catch((data) => {
                    reject(data as Array<news>);
                });
        });
    }
}