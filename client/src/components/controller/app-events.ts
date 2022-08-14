/**
 * Содержит все события приложения
 * Название состоит из:
 * AUTH_ - краткое название компонента
 * CHANGE_ - описание действия события
 * VISIBILTY - описание изменяемого свойства
 */
export const enum AppEvents {
    //Index page
    AUTH_CLICK_BUTTON = 'clickAuthButton',
    AUTH_CHANGE_STATE_WINDOW = 'changeStateAuthWindow',
    REGISTER_CLICK_BUTTON = 'clickRegisterButton',
    REGISTER_CHANGE_STATE_WINDOW = 'changeStateRegisterWindow',
}
