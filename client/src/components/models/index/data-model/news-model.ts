import news from "../../../../types/news";
import { AppEvents } from "../../../controller/app-events";
import DataMapper from "../../common/sender/data-mapper";

export default class NewsModel {
    private _dataMapper = new DataMapper();
    constructor() {

    }
    getNews(nameEvent: AppEvents, params: Map<string, string> = new Map<string, string>()): Promise<Array<news>> {
        return new Promise((resolve, reject) => {
            this._dataMapper.read(nameEvent, params)
                .then((data) => {
                    resolve(data as Array<news>);
                })
                .catch((data) => {
                    reject(data as Array<news>);
                });
        });
    }
}