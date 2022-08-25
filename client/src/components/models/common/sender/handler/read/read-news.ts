import news from "../../../../../../types/news";
import Handler from "../handler";

export default class ReadNewsHandler extends Handler {
    private readonly NEWS_URL = 'https://saurav.tech/NewsAPI/top-headlines/category/business/ru.json';

    constructor(params: Map<string, string> = new Map()) {
        super(params);
    }

    send <T>(): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            fetch(this.NEWS_URL, { method: 'GET' })
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