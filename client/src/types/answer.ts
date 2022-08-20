/**
 * Тип данных содержащий минимальный ответ сервера
 */
type answer = {
    code: number;
    statusCode?: number;
    error: string;
    message: string;
    body?: Map<string, string>
};

export default answer;