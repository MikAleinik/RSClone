const loadEnvironmentalVar = (keyName: string) => {
    const val = process.env[keyName];

    if (!val) {
        throw new Error(`No env val :: ${keyName}`);
    }

    return val;
};

export const appConfig = {
    postgresURI: loadEnvironmentalVar('POSTGRES_URI'),
};
