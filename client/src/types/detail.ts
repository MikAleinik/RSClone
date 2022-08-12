import event from './event';
/**
 * Расширение тип данных содержащий детализацию события приложения
 * Для объектов IView
 */
type detail = event & {
    state: boolean | null;
};

export default detail;