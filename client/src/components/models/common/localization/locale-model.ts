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
    private createDictionary() {
        this._localeDictionary.set(LocaleKeys.BUTTON_LOCALE, new Array('En', 'Ru'));
        this._localeDictionary.set(LocaleKeys.BUTTON_LOGIN, new Array('LogIn', 'Вход'));
        this._localeDictionary.set(LocaleKeys.BUTTON_LOGOUT, new Array('LogOut', 'Выход'));
        this._localeDictionary.set(LocaleKeys.BUTTON_REGISTER, new Array('Register', 'Регистрация'));
        this._localeDictionary.set(LocaleKeys.BUTTON_CANCEL, new Array('Cancel', 'Отмена'));
        this._localeDictionary.set(LocaleKeys.AUTH_HEADER, new Array('User authorization', 'Авторизация пользователя'));
        this._localeDictionary.set(LocaleKeys.AUTH_EMAIL, new Array('Email', 'Эл.почта'));
        this._localeDictionary.set(LocaleKeys.AUTH_PASSWORD, new Array('Password', 'Пароль'));
        this._localeDictionary.set(LocaleKeys.REGISTER_HEADER, new Array('Registration new user', 'Регистрация пользователя'));
        this._localeDictionary.set(LocaleKeys.REGISTER_LOGIN, new Array('Login', 'Логин'));
        this._localeDictionary.set(LocaleKeys.REGISTER_EMAIL, new Array('Email', 'Эл.почта'));
        this._localeDictionary.set(LocaleKeys.REGISTER_PASSWORD, new Array('Password', 'Пароль'));
        this._localeDictionary.set(LocaleKeys.PAGE_LINK_CONTACT, new Array('Contact', 'Контакты'));
        this._localeDictionary.set(LocaleKeys.PAGE_LINK_ABOUT, new Array('About', 'О проекте'));
        this._localeDictionary.set(LocaleKeys.PROMO_HEADER, new Array('Freight exchange', 'Биржа грузоперевозок'));
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
    }
}