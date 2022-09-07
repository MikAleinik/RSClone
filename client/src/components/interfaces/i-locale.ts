import LocaleModel from "../models/common/localization/locale-model";

export default interface ILocale {
    setLocale(localeModel: LocaleModel): void;
}