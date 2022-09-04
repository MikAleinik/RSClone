import { LocaleKeys } from "./locale-keys";

export default class LocaleModel {
    private readonly STORAGE_LOCALE_KEY = 'rsTransLocale';

    private _currentLocaleIndex = 0;
    private _localeDictionary = new Map<string, Array<string>>();

    constructor() {
        this.createDictionary();
        if (localStorage.getItem(this.STORAGE_LOCALE_KEY) === null) {
            localStorage.setItem(this.STORAGE_LOCALE_KEY, this._currentLocaleIndex.toString());
        } else {
            this._currentLocaleIndex = Number(localStorage.getItem(this.STORAGE_LOCALE_KEY));
        }
    }
    changeLocale(): void {
        this._currentLocaleIndex += 1;
        if (this._currentLocaleIndex >= this._localeDictionary.get(LocaleKeys.BUTTON_LOCALE)!.length) {
            this._currentLocaleIndex = 0;
        }
        localStorage.setItem(this.STORAGE_LOCALE_KEY, this._currentLocaleIndex.toString());
    }
    getPhrase(key: LocaleKeys): string {
        if (this._localeDictionary.get(key) !== undefined) {
            return this._localeDictionary.get(key)![this._currentLocaleIndex];
        }
        return '';
    }
    getLocaleName() {
        return this._localeDictionary.get(LocaleKeys.BUTTON_LOCALE)![this._currentLocaleIndex];
    }
    private createDictionary() {
        this._localeDictionary.set(LocaleKeys.LOCALE, new Array('en', 'ru'));

        this._localeDictionary.set(LocaleKeys.COMMON_ERROR_SAVE, new Array('An error occurred while saving data. Please try again later.', 'Произошла ошибка сохранения данных. Попробуйте еще раз позже.'));
        this._localeDictionary.set(LocaleKeys.COMMON_ERROR_ROUTE, new Array('There was an error getting route data. Please try again later.', 'Произошла ошибка получения данных маршрута. Попробуйте еще раз позже.'));

        this._localeDictionary.set(LocaleKeys.BUTTON_LOCALE, new Array('En', 'Ru'));
        this._localeDictionary.set(LocaleKeys.BUTTON_LOGIN, new Array('LogIn', 'Вход'));
        this._localeDictionary.set(LocaleKeys.BUTTON_LOGOUT, new Array('LogOut', 'Выход'));
        this._localeDictionary.set(LocaleKeys.BUTTON_REGISTER, new Array('Register', 'Регистрация'));
        this._localeDictionary.set(LocaleKeys.BUTTON_CANCEL, new Array('Cancel', 'Отмена'));
        this._localeDictionary.set(LocaleKeys.AUTH_HEADER, new Array('User authorization', 'Авторизация пользователя'));
        this._localeDictionary.set(LocaleKeys.AUTH_EMAIL, new Array('Email', 'Эл.почта'));
        this._localeDictionary.set(LocaleKeys.AUTH_PASSWORD, new Array('Password', 'Пароль'));
        this._localeDictionary.set(LocaleKeys.AUTH_ERROR, new Array('Check if your email and password are correct.', 'Проверьте правильность эл.почты и пароля.'));
        this._localeDictionary.set(LocaleKeys.REGISTER_HEADER, new Array('Registration new user', 'Регистрация пользователя'));
        this._localeDictionary.set(LocaleKeys.REGISTER_LOGIN, new Array('Login', 'Логин'));
        this._localeDictionary.set(LocaleKeys.REGISTER_EMAIL, new Array('Email', 'Эл.почта'));
        this._localeDictionary.set(LocaleKeys.REGISTER_PASSWORD, new Array('Password', 'Пароль'));
        this._localeDictionary.set(LocaleKeys.REGISTER_ROLE, new Array('Role', 'Роль'));
        this._localeDictionary.set(LocaleKeys.ROLE_CARRIER, new Array('Carrier', 'Перевозчик'));
        this._localeDictionary.set(LocaleKeys.ROLE_CUSTOMER, new Array('Customer', 'Заказчик'));
        this._localeDictionary.set(LocaleKeys.PAGE_LINK_CONTACT, new Array('Contact', 'Контакты'));
        this._localeDictionary.set(LocaleKeys.PAGE_LINK_ABOUT, new Array('About', 'О проекте'));
        this._localeDictionary.set(LocaleKeys.PAGE_LINK_MAIN, new Array('Personal area', 'Личный кабинет'));
        this._localeDictionary.set(LocaleKeys.PAGE_LINK_INDEX, new Array('Main', 'Главная'));
        this._localeDictionary.set(LocaleKeys.PROMO_HEADER, new Array('Freight exchange', 'Портал грузоперевозок'));
        this._localeDictionary.set(LocaleKeys.PROMO_FIRST, new Array('unite carriers and cargo owners', 'объединяем перевозчиков и грузовладельцев'));
        this._localeDictionary.set(LocaleKeys.PROMO_SECOND, new Array('show the position of transport and cargo', 'показываем положение транспорта и груза'));
        this._localeDictionary.set(LocaleKeys.PROMO_THIRD, new Array('provide a platform for communication', 'предоставляем площадку для общения'));
        this._localeDictionary.set(LocaleKeys.ABOUT_FIRST_HEADER, new Array('About the project', 'О проекте'));
        this._localeDictionary.set(LocaleKeys.ABOUT_SECOND_HEADER, new Array('Technical description', 'Техническое описание'));
        this._localeDictionary.set(LocaleKeys.ABOUT_THIRD_HEADER, new Array('Team', 'Команда'));
        this._localeDictionary.set(LocaleKeys.ABOUT_FIRST_BODY_P1, new Array(
            'This application is the final draft of the RSSchool Frontend 2022Q1 course.',
            'Данное приложение является итоговым проектом курса обучения RSSchool Frontend 2022Q1.'
        ));
        this._localeDictionary.set(LocaleKeys.ABOUT_FIRST_BODY_P2, new Array(
            'RS-Trans is a clone of the Trans.ru cargo transportation portal, which allows interaction between customers and cargo carriers online. Application features allow you to:',
            'RS-Trans – является клоном портала грузоперевозок Trans.ru, на котором возможно взаимодействие заказчиков и грузоперевозчиков в режиме онлайн. Возможности приложения позволяют:'
        ));
        this._localeDictionary.set(LocaleKeys.ABOUT_FIRST_BODY_P3, new Array('perform registration and authorization of users with certain roles in the application;', 'выполнять регистрацию и авторизацию пользователей с определенными ролями в приложении;'));
        this._localeDictionary.set(LocaleKeys.ABOUT_FIRST_BODY_P4, new Array('use an interactive map to view the location of transport, locations of logistics centers, customers, carriers;', 'использовать интерактивную карту для просмотра местоположения транспорта, мест расположения логистических центров, заказчиков, перевозчиков;'));
        this._localeDictionary.set(LocaleKeys.ABOUT_FIRST_BODY_P5, new Array('place orders for the carriage of goods;', 'размещать заказы на перевозку грузов;'));
        this._localeDictionary.set(LocaleKeys.ABOUT_FIRST_BODY_P6, new Array('place vehicles for the carriage of goods;', 'размещать транспорт для перевозки грузов;'));
        this._localeDictionary.set(LocaleKeys.ABOUT_FIRST_BODY_P7, new Array('form an online exchange of orders for the transportation of goods;', 'формировать онлайн биржу заказов на перевозку грузов;'));
        this._localeDictionary.set(LocaleKeys.ABOUT_FIRST_BODY_P8, new Array('keep a rating of customers and carriers;', 'вести рейтинг заказчиков и перевозчиков;'));
        this._localeDictionary.set(LocaleKeys.ABOUT_FIRST_BODY_P9, new Array('view a thematic news feed;', 'просматривать тематическую новостную ленту;'));
        this._localeDictionary.set(LocaleKeys.ABOUT_FIRST_BODY_P10, new Array('communicate between users;', 'осуществлять общение между пользователям;'));
        this._localeDictionary.set(LocaleKeys.ABOUT_SECOND_BODY_P1, new Array(
            'The application was developed in the JS / TS + NodeJS (Fastify) + PostgreSQL technology stack. The basic structure of the application was developed in accordance with the MVC pattern:',
            'Приложение разработано в стеке технологий JS/TS + NodeJS (Fastify) + PostgreSQL. Принципиальная структура приложения разработана в соответствии с паттерном MVC:'
        ));
        this._localeDictionary.set(LocaleKeys.ABOUT_SECOND_BODY_P2, new Array('the View component is formed on the client side;', 'компонент View формируется на клиентской части;'));
        this._localeDictionary.set(LocaleKeys.ABOUT_SECOND_BODY_P3, new Array('the Controller and Model components are formed on the server side;', 'компоненты Controller и Model формируются на серверной части;'));
        this._localeDictionary.set(LocaleKeys.ABOUT_SECOND_BODY_P4, new Array(
            'The View component is implemented in MPA format. The structure of the component is based on the MVC pattern and the Observer pattern.',
            'Компонент View реализован в формате MPA. Структура компонента выполнена на основании паттерна MVC и паттерна Observer.'
        ));
        this._localeDictionary.set(LocaleKeys.ABOUT_SECOND_BODY_P5, new Array(
            'The Controller component is implemented using the Fastify framework. The Swagger library was used to document the API.',
            'Компонент Controller реализован с использованием фреймворка Fastify. Для документирования API применена библиотека Swagger.'
        ));
        this._localeDictionary.set(LocaleKeys.ABOUT_SECOND_BODY_P6, new Array(
            'The Model component implements the main entities of the subject area. Access to the database is implemented using the DataMapper pattern.',
            'Компонент Model реализовывает основные сущности предметной области. Доступ в базу данных реализован с использованием паттерна DataMapper.'
        ));
        this._localeDictionary.set(LocaleKeys.ABOUT_SECOND_BODY_P7, new Array(
            'The database was created using PostgreSQL DBMS. Tables were normalized to 3rd normal form.',
            'База данных создана с использованием СУБД PostgreSQL. Выполнена нормализация таблиц до 3 нормальной формы.'
        ));
        this._localeDictionary.set(LocaleKeys.ABOUT_SECOND_BODY_P8, new Array(
            'The OpenStreetMap API and the Leaflet library are used to display an interactive map and its elements, as well as to calculate movement paths.',
            'Для отображения интерактивной карты и ее элементов, а также для расчетов путей движения применяется API OpenStreetMap и библиотека Leaflet.'
        ));
        this._localeDictionary.set(LocaleKeys.ABOUT_SECOND_BODY_P9, new Array('The application implements RU/EN localization.', 'В приложении реализуется локализация RU/EN.'));
        this._localeDictionary.set(LocaleKeys.ABOUT_SECOND_BODY_P10, new Array('The term of the project is 3 calendar weeks.', 'Срок выполнения проекта - 3 календарные недели.'));
        this._localeDictionary.set(LocaleKeys.ABOUT_THIRD_HEADER_P1, new Array('Andrei Yurkouski', 'Андрей Юрковский'));
        this._localeDictionary.set(LocaleKeys.ABOUT_THIRD_HEADER_P2, new Array('Denis Borushko', 'Денис Борушко'));
        this._localeDictionary.set(LocaleKeys.ABOUT_THIRD_HEADER_P3, new Array('Mik Aleinik', 'Михаил Олейник'));
        this._localeDictionary.set(LocaleKeys.ABOUT_THIRD_INFO_P1, new Array('Frontend development, layout, map.', 'Фронтенд разработка, макет, карта.'));
        this._localeDictionary.set(LocaleKeys.ABOUT_THIRD_INFO_P2, new Array('Backend development, database.', 'Бекенд разработка, база данных.'));
        this._localeDictionary.set(LocaleKeys.ABOUT_THIRD_INFO_P3, new Array('Frontend development, database, teamlead.', 'Фронтенд разработка, база данных, тимлид'));

        this._localeDictionary.set(LocaleKeys.MAIN_ASIDE_OVERVIEW, new Array('Overview', 'Обзор'));
        this._localeDictionary.set(LocaleKeys.MAIN_ASIDE_TRANSPORT, new Array('Transport', 'Транспорт'));
        this._localeDictionary.set(LocaleKeys.MAIN_ASIDE_CARGO, new Array('Cargo', 'Грузы'));
        this._localeDictionary.set(LocaleKeys.MAIN_ASIDE_EXCHANGE_TRANSPORT, new Array('Carrier exchange', 'Биржа транспорта'));
        this._localeDictionary.set(LocaleKeys.MAIN_ASIDE_EXCHANGE_CARGO, new Array('Cargo exchange', 'Биржа грузов'));
        this._localeDictionary.set(LocaleKeys.MAIN_ASIDE_COMPANIES, new Array('Companies', 'Компании'));
        this._localeDictionary.set(LocaleKeys.MAIN_ASIDE_ROUTES, new Array('Routes', 'Маршруты'));
        this._localeDictionary.set(LocaleKeys.MAIN_ASIDE_CHAT, new Array('Message', 'Сообщения'));
        this._localeDictionary.set(LocaleKeys.MAIN_ASIDE_NEWS, new Array('News', 'Новости'));

        this._localeDictionary.set(LocaleKeys.MAIN_FILTER_PANEL_HEADER, new Array('Filter items', 'Панель фильтрации'));
        this._localeDictionary.set(LocaleKeys.MAIN_FILTER_PANEL_SEARCH, new Array('Search', 'Поиск'));
        this._localeDictionary.set(LocaleKeys.MAIN_FILTER_PANEL_PRICE, new Array('Max price', 'Макс. стоимость'));
        this._localeDictionary.set(LocaleKeys.MAIN_FILTER_PANEL_WEIGHT, new Array('Max wieght', 'Макс. вес'));
        this._localeDictionary.set(LocaleKeys.MAIN_FILTER_PANEL_VOLUME, new Array('Max volume', 'Макс. объем'));
        this._localeDictionary.set(LocaleKeys.MAIN_FILTER_PANEL_LOAD, new Array('Max load', 'Макс. загрузка'));
        this._localeDictionary.set(LocaleKeys.MAIN_FILTER_PANEL_RATING, new Array('Rating', 'Рейтинг'));

        this._localeDictionary.set(LocaleKeys.MAIN_OVERVIEW_HEADER_PERSONAL, new Array('Personal info', 'Личные данные'));
        this._localeDictionary.set(LocaleKeys.MAIN_OVERVIEW_HEADER_RATING, new Array('Rating', 'Рейтинг'));
        this._localeDictionary.set(LocaleKeys.MAIN_OVERVIEW_HEADER_CARGO, new Array('Your cargoes', 'Ваши грузы'));
        this._localeDictionary.set(LocaleKeys.MAIN_OVERVIEW_HEADER_TRANSPORT, new Array('Your transports', 'Ваш транспорт'));
        this._localeDictionary.set(LocaleKeys.MAIN_OVERVIEW_HEADER_COMPANY, new Array('Your company', 'Ваша компания'));
        this._localeDictionary.set(LocaleKeys.MAIN_OVERVIEW_USER_NAME, new Array('Name', 'Имя'));
        this._localeDictionary.set(LocaleKeys.MAIN_OVERVIEW_USER_FAMILY, new Array('Surname', 'Фамилия'));
        this._localeDictionary.set(LocaleKeys.MAIN_OVERVIEW_COMPANY_NAME, new Array('Name', 'Название'));
        this._localeDictionary.set(LocaleKeys.MAIN_OVERVIEW_COMPANY_ADDRESS, new Array('Address', 'Адрес'));
        this._localeDictionary.set(LocaleKeys.MAIN_OVERVIEW_COMPANY_PHONE, new Array('Phone', 'Телефон'));
        this._localeDictionary.set(LocaleKeys.MAIN_OVERVIEW_EMAIL, new Array('Email', 'Эл.почта'));
        this._localeDictionary.set(LocaleKeys.MAIN_OVERVIEW_PASSWORD, new Array('Password', 'Пароль'));
        this._localeDictionary.set(LocaleKeys.MAIN_OVERVIEW_ACCEPT, new Array('Save', 'Сохранить'));

        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_PANEL_HEADER, new Array('Car panel', 'Панель транспорта'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_COMPANY, new Array('Car owner', 'Владелец'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_NUMBER, new Array('Plate number', 'Номерной знак'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_VOLUME, new Array('Volume capacity', 'Объем кузова'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_Weight, new Array('Load capacity', 'Грузо&shy;подьем&shy;ность'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_PRICE, new Array('Price', 'Цена'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_CURRENCY, new Array('Currency', 'Валюта'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_DESCRIPTION, new Array('Description', 'Описание'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_LOCATION, new Array('Location', 'Место&shy;положение'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_STATUS, new Array('Status', 'Состояние'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_STATUS_DRIVED, new Array('On the way', 'В пути'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_STATUS_STOPPED, new Array('Waiting', 'Ожидает загрузки'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_FILLING, new Array('Filling', 'Заполнение'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_ADD_NEW, new Array('Create', 'Создать'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_DELETE, new Array('Delete', 'Удалить'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_SAVE, new Array('Save', 'Сохранить'));
        this._localeDictionary.set(LocaleKeys.MAIN_TRANSPORT_CLEAR, new Array('Clear', 'Очистить'));

        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_PANEL_HEADER, new Array('Cargo panel', 'Панель груза'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_NAME, new Array('Name', 'Название'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_COMPANY, new Array('Cargo owner', 'Владелец'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_Weight, new Array('Weight', 'Вес'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_VOLUME, new Array('Volume', 'Объем'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_PRICE, new Array('Price', 'Цена'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_CURRENCY, new Array('Currency', 'Валюта'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_LOCATION_FROM, new Array('From', 'Откуда'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_LOCATION_TO, new Array('To', 'Куда'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_DATE, new Array('Date', 'Дата'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_DESCRIPTION, new Array('Description', 'Описание'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_STATUS, new Array('Status', 'Состояние'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_STATUS_STOPPED, new Array('Waiting', 'Ожидает машину'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_STATUS_DRIVED, new Array('On the way', 'В пути'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_STATUS_DELIVERED, new Array('Delivered', 'Доставлен'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_ADD_NEW, new Array('Create', 'Создать'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_DELETE, new Array('Delete', 'Удалить'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_SAVE, new Array('Save', 'Сохранить'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_CLEAR, new Array('Clear', 'Очистить'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_CONTEXT_HEADER, new Array('Removing cargo from the car', 'Удаление груза из машины'));

        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_CARGO_COMPANY, new Array('Cargo owner', 'Владелец'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_CARGO_USER, new Array('Contact', 'Контакты'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_CARGO_NAME, new Array('Name', 'Название'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_CARGO_Weight, new Array('Weight', 'Вес'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_CARGO_VOLUME, new Array('Volume', 'Объем'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_CARGO_PRICE, new Array('Price', 'Цена'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_CARGO_CURRENCY, new Array('Currency', 'Валюта'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_CARGO_LOCATION_FROM, new Array('From', 'Откуда'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_CARGO_LOCATION_TO, new Array('To', 'Куда'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_CARGO_DATE, new Array('Date', 'Дата'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_CARGO_DESCRIPTION, new Array('Description', 'Описание'));

        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_COMPANY, new Array('Car owner', 'Владелец'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_USER, new Array('Contact', 'Контакты'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_NUMBER, new Array('Plate number', 'Номерной знак'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_Weight, new Array('Load capacity', 'Грузо&shy;подьем&shy;ность'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_VOLUME, new Array('Volume capacity', 'Объем кузова'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_PRICE, new Array('Price', 'Цена'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_CURRENCY, new Array('Currency', 'Валюта'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_LOCATION, new Array('Location', 'Место&shy;положение'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_DESCRIPTION, new Array('Description', 'Описание'));
        this._localeDictionary.set(LocaleKeys.MAIN_EXCHANGE_TRANSPORT_CONTEXT_HEADER, new Array('Select cargo to add', 'Выберите груз для добавления'));

        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_TO_CAR_ADD_SENDED, new Array('The request has been sent to the owner of the car, please wait for confirmation', 'Запрос владельцу машины отправлен, ожидайте подтверждения'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_TO_CAR_REMOVE_SENDED, new Array('Your cargo has been removed from the vehicle', 'Ваш груз удален из машины'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_TO_CAR_PENDING, new Array('Pending', 'Ожидает'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_TO_CAR_SUBMITTED, new Array('Submitted', 'Подтвержден'));
        this._localeDictionary.set(LocaleKeys.MAIN_CARGO_TO_CAR_CANCELED, new Array('Canceled', 'Отказано'));

        this._localeDictionary.set(LocaleKeys.MAIN_COMPANY_NAME, new Array('Company name', 'Название компании'));
        this._localeDictionary.set(LocaleKeys.MAIN_COMPANY_ADDRESS, new Array('Address', 'Адрес'));
        this._localeDictionary.set(LocaleKeys.MAIN_COMPANY_PHONE, new Array('Phone number', 'Номер телефона'));
        this._localeDictionary.set(LocaleKeys.MAIN_COMPANY_OWNER, new Array('Contact person', 'Контактное лицо'));
        this._localeDictionary.set(LocaleKeys.MAIN_COMPANY_RATING, new Array('Rating', 'Рейтинг'));

        this._localeDictionary.set(LocaleKeys.MAIN_MAP_POINT_FROM, new Array('Route from', 'Начало маршрута'));
        this._localeDictionary.set(LocaleKeys.MAIN_MAP_POINT_TO, new Array('Route to', 'Конец маршрута'));
        this._localeDictionary.set(LocaleKeys.MAIN_MAP_POINT_CLEAR, new Array('Clear route', 'Очистить маршрут'));
        this._localeDictionary.set(LocaleKeys.MAIN_MAP_SEARCH_FAILED, new Array('Sorry, that address could not be found', 'Извините, по запросу ни чего не найдено'));
        this._localeDictionary.set(LocaleKeys.MAIN_MAP_SEARCH_FIELD, new Array('Enter address...', 'Введите адрес...'));
        this._localeDictionary.set(LocaleKeys.MAIN_MAP_SEARCH_BUTTON, new Array('Search', 'Поиск'));
    }
}