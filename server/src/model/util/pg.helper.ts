import pgPromise from 'pg-promise';

const pgp = pgPromise();

type functRetBoolean<T> = (c: { value: T }) => boolean;
type HelpObjString = {
    name: string;
    skip: functRetBoolean<string>;
};
type HelpObjNum = {
    name: string;
    skip: functRetBoolean<number>;
};
type HelpObjBool = {
    name: string;
    skip: functRetBoolean<boolean>;
};

function str(column: string) {
    return {
        name: column,
        skip: (c: { value: string }) => c.value === null || c.value === undefined,
    };
}

// generic way to skip NULL/undefined values for integers,
// while parsing the type correctly:
function int(column: string) {
    return {
        name: column,
        skip: (c: { value: number }) => c.value === null || c.value === undefined,
        init: (c: { value: number }) => +c.value,
    };
}

// generic way to skip NULL/undefined values for integers,
// while parsing the type correctly:
function bool(column: string) {
    return {
        name: column,
        skip: (c: { value: boolean }) => c.value === null || c.value === undefined,
        init: (c: { value: boolean }) => c.value,
    };
}

function noValidation(column: string) {
    return {
        name: column,
        skip: (c: { value: unknown }) => {
            c;
            return false;
        },
        init: (c: { value: unknown }) => c.value,
    };
}

export const createColumnSet = (
    tableName: string,
    strIds: Array<string> | null = null,
    numIds: Array<string> | null = null,
    boolIds: Array<string> | null = null,
    otherIds: Array<string> | null = null
) => {
    let resArr: (HelpObjString | HelpObjNum | HelpObjBool)[] = [];
    if (strIds !== null) {
        resArr = strIds.map((id) => str(id));
    }
    if (numIds !== null) {
        resArr = resArr.concat(numIds.map((nId) => int(nId)));
    }
    if (boolIds !== null) {
        resArr = resArr.concat(boolIds.map((nId) => bool(nId)));
    }
    if (otherIds !== null) {
        resArr = resArr.concat(otherIds.map((nId) => noValidation(nId)));
    }

    return new pgp.helpers.ColumnSet(resArr, { table: tableName });
};
