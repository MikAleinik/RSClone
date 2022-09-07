import Car from "./car";
import Cargo from "./cargo";

/**
 * Тип данных содержащий минимальный ответ сервера
 */
type answer<T> = {
    code: number;
    statusCode?: number;
    error: string;
    message: string;
    body?: Map<string, string>;
    items?: Array<T>;
    users?: Array<T>;
};

export default answer;