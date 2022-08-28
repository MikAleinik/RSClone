import { GenericInterface } from '../../types/interfaces';
import { RecordStringUnknown } from '../../types/types';
import { Cargo } from './cargo';
import { User } from './user';

// eslint-disable-next-line @typescript-eslint/ban-types
export class DBDataVO<TClass extends User | Cargo, TData extends RecordStringUnknown> {
    private dbData: TClass;

    constructor(className: GenericInterface<TClass>, data: TData) {
        this.dbData = new className();
        const keys = Object.keys(data) as (keyof TData)[];
        const ownKeys = Object.keys(this.dbData) as (keyof TClass)[];
        keys.forEach((key) => {
            if ((ownKeys as string[]).includes(key as string)) {
                this.dbData[key as keyof TClass] = (data[key] as unknown) as TClass[keyof TClass];
            }
        });
        console.log(this.dbData);
    }

    toJsonResponse() {
        return { ...this.dbData } as RecordStringUnknown;
    }

    getData() {
        return this.dbData;
    }

    setProp<PropType>(propName: string, value: PropType) {
        const ownKeys = Object.keys(this.dbData) as (keyof TClass)[];
        if ((ownKeys as string[]).includes(propName)) {
            this.dbData[propName as keyof TClass] = (value as unknown) as TClass[keyof TClass];
        }
    }
}
