/**
 * Содержит все события приложения
 * Название состоит из:
 * AUTH_ - краткое название компонента
 * CHANGE_ - описание действия события
 * VISIBILTY - описание изменяемого свойства
 */
export const enum AppEvents {
    //Common events
    LOCALE_CHANGE = 'localeChange',//изменить язык локализации
    LOCALE_SET = 'localeSet',//установлен язык локализации
    LOCALE_GET = 'localeGet',//получить язык локализации
    LOCALE_GET_NAME = 'localeGetName',//получить название языка локализации
    USER_GET_ALL = 'userGetAll',//получить всех пользователей
    USER_GET_BY_ID = 'userGetById',//получить пользователя по id
    //Index page events
    AUTH_CLICK_BUTTON = 'clickAuthButton',//клик кнопки LogIn
    AUTH_CLICK_LOGOUT_BUTTON = 'clickLogOutButton',//клик кнопки LogOut
    AUTH_ENABLE_BUTTON = 'enableAuthButton',//enable кнопки LogIn
    AUTH_DISABLE_BUTTON = 'disableAuthButton',//disable кнопки LogIn
    AUTH_HIDE_BUTTON = 'hideAuthButton',//скрыть кнопку авторизации
    AUTH_SHOW_BUTTON = 'showAuthButton',//показать кнопку авторизации
    AUTH_SHOW_WINDOW = 'showAuthWindow',//показать окно авторизации
    AUTH_HIDE_WINDOW = 'hideAuthWindow',//скрыть окно авторизации
    AUTH_GET_AUTH_USER = 'getAuthUser',//получить текущего авторизованного пользователя
    AUTH_LOGIN_USER = 'userLogIn',//пользователь входит в приложение
    AUTH_LOGIN_USER_SUCCESS = 'userLogInSuccess',//пользователь успешно вошел в приложение
    AUTH_LOGIN_USER_FAIL = 'userLogInFail',//пользователь не успешно вошел в приложение
    AUTH_LOGOUT_USER = 'userLogOut',//пользователь вышел из приложения
    REGISTER_CLICK_BUTTON = 'clickRegisterButton',//клик кнопки регистрации
    REGISTER_ENABLE_BUTTON = 'enableRegisterButton',//enable кнопки регистрации
    REGISTER_DISABLE_BUTTON = 'disableRegisterButton',//disable кнопки регистрации
    REGISTER_HIDE_BUTTON = 'hideRegisterButton',//скрыть кнопку регистрации
    REGISTER_SHOW_BUTTON = 'showRegisterButton',//показать кнопку регистрации
    REGISTER_SHOW_WINDOW = 'showRegisterWindow',//показать окно регистрации
    REGISTER_HIDE_WINDOW = 'hideRegisterWindow',//скрыть окно регистрации
    REGISTER_USER = 'registerUser',//пользователь регистрируется
    REGISTER_USER_SUCCESS = 'registerUserSuccess',//пользователь успешно зарегистрировался
    REGISTER_USER_FAIL = 'registerUserFail',//пользователь не зарегистрировался
    NEWS_GET_DATA = 'newsGetData',//получить данные новостной ленты
    //Main page events
    MAIN_CARGO_CREATE = 'mainCargoCreate',//создать груз
    MAIN_CARGO_CREATE_SUCCESS = 'mainCargoCreateSuccess',//груз создан успешно
    MAIN_CARGO_DELETE = 'mainCargoDelete',//удалить груз
    MAIN_CARGO_DELETE_SUCCESS = 'mainCargoDeleteSuccess',//груз удален успешно
    MAIN_CARGO_CHANGE = 'mainCargoChange',//редактировать груз
    MAIN_CARGO_CHANGE_SUCCESS = 'mainCargoChangeSuccess',//груз отредактирован успешно
    MAIN_CARGO_GET_ALL = 'mainCargoGetAll',//получить все доступные грузы
    MAIN_CARGO_GET_BY_USER = 'mainCargoGetByUser',//получить все доступные грузы пользователя
    MAIN_CARGO_GET_BY_CAR = 'mainCargoGetByCar',//получить все доступные грузы в машине
    MAIN_CARGO_GET_BY_ID = 'mainCargoGetById',//получить груз по ID груза
    // MAIN_CARGO_UPDATE = 'mainCargoUpdate',//обновить список грузов

    MAIN_CAR_CREATE = 'mainCarCreate',//создать машину
    MAIN_CAR_DELETE = 'mainCarDelete',//удалить машину
    MAIN_CAR_CHANGE = 'mainCarChange',//редактировать машину
    MAIN_CAR_GET_ALL = 'mainCarGetAll',//получить все доступные машину
    MAIN_CAR_GET_BY_USER = 'mainCarGetByUser',//получить все доступные машины пользователя
    MAIN_CAR_GET_BY_ID = 'mainCarGetById',//получить машину по ID машины
    // MAIN_CAR_UPDATE = 'mainCarUpdate',//обновить список машин

}
