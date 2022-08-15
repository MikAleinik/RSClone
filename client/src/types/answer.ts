/**
 * Тип данных содержащий минимальный ответ сервера
 */
type answer = {
    code: number;
    status: string;
    message: string;
    body?: Map<string, string>
};

export default answer;