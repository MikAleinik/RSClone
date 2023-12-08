import news from "../../../../../../types/news";
import Handler from "../handler";

export default class ReadNewsHandler extends Handler {
    private readonly NEWS_URL_RU = 'https://saurav.tech/NewsAPI/top-headlines/category/business/ru.json';
    private readonly NEWS_URL_EN = 'https://saurav.tech/NewsAPI/top-headlines/category/business/us.json';
    private readonly LOCALE_KEY = 'locale';
    private readonly LOCALE_VALUE_RU = 'ru';

    constructor(params: Map<string, string> = new Map()) {
        super(params);
    }

    send <T>(): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            let newsUrl = this.NEWS_URL_RU;
            if (this._params.has(this.LOCALE_KEY) && this._params.get(this.LOCALE_KEY) !== this.LOCALE_VALUE_RU) {
                newsUrl = this.NEWS_URL_EN;
            }
            fetch(newsUrl, { method: 'GET' })
                .then((response) => response.json())
                .then((data) => {
                    const answer = (data.articles as unknown) as Array<news>;
                    const result = new Array<news>;
                    for (let i = 0; i < answer.length; i += 1) {
                        result.push({
                            title: answer[i].title,
                            author: answer[i].author,
                            urlToImage: answer[i].urlToImage,
                            description: answer[i].description,
                            url: answer[i].url,
                        });
                    }
                    resolve((result as unknown) as Array<T>);
                })
                .catch((data) => {
                    reject(data);
                });
        });
    }
}