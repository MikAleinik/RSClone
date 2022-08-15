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
    AUTH_ENABLE_BUTTON = 'enableAuthButton',
    AUTH_DISABLE_BUTTON = 'disableAuthButton',
    AUTH_SHOW_WINDOW = 'showAuthWindow',
    AUTH_HIDE_WINDOW = 'hideAuthWindow',
    AUTH_GET_AUTH_USER = 'getAuthUser',
    REGISTER_CLICK_BUTTON = 'clickRegisterButton',
    REGISTER_ENABLE_BUTTON = 'enableRegisterButton',
    REGISTER_DISABLE_BUTTON = 'disableRegisterButton',
    REGISTER_HIDE_BUTTON = 'hideRegisterButton',
    REGISTER_SHOW_BUTTON = 'showRegisterButton',
    REGISTER_SHOW_WINDOW = 'showRegisterWindow',
    REGISTER_HIDE_WINDOW = 'hideRegisterWindow',
    REGISTER_USER = 'registerUser',
    REGISTER_USER_SUCCESS = 'registerUserSuccess',
    REGISTER_USER_FAIL = 'registerUserFail',
}
