import { merge } from 'webpack-merge';

export type AppConfigType = {
    COOKIE_OPTIONS: Record<string, string>;
    POSTGRES_URI: string;
    PORT: number;
};

export class AppConfig {
    private static _config: AppConfigType;
    private static _isInit = false;

    private static baseConfig = {
        COOKIE_OPTIONS: {
            path: '/',
            httpOnly: true,
            // domain: '185.68.21.238',
            // secure: true,
            // sameSite: <boolean>(<unknown>'none'),
        },
    };

    private static localDevConfig = {
        POSTGRES_URI: 'postgres://ofpofexk:m-80U-8RJaQjdmqeObQkJkwJ7Xcn6BCf@185.68.21.238/ofpofexk',
        PORT: 3000,
    };

    private static deployTestConfig = {
        POSTGRES_URI: 'postgres://ofpofexk:m-80U-8RJaQjdmqeObQkJkwJ7Xcn6BCf@localhost/ofpofexk',
        PORT: 4000,
    };

    private static deployDevConfig = {
        POSTGRES_URI: 'postgres://ofpofexk:m-80U-8RJaQjdmqeObQkJkwJ7Xcn6BCf@localhost/ofpofexk',
        PORT: 3000,
        COOKIE_OPTIONS: {
            path: '/',
            // httpOnly: true,
            domain: '185.68.21.238',
            // secure: true,
            // sameSite: <boolean>(<unknown>'none'),
        },
    };

    private static deployProdConfig = {
        POSTGRES_URI: 'postgres://ofpofexk:m-80U-8RJaQjdmqeObQkJkwJ7Xcn6BCf@localhost/ofpofexk',
        PORT: 3000,
        COOKIE_OPTIONS: {
            path: '/',
            // httpOnly: true,
            domain: '185.68.21.238',
            // secure: true,
            // sameSite: <boolean>(<unknown>'none'),
        },
    };

    static init() {
        if (AppConfig._isInit) {
            return;
        }
        AppConfig._isInit = true;

        const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'local_dev';
        let conf: Record<string, unknown>;
        switch (env) {
            case 'local_dev':
                conf = AppConfig.localDevConfig;
                break;
            case 'deploy_test':
                conf = AppConfig.deployTestConfig;
                break;
            case 'deploy_dev':
                conf = AppConfig.deployDevConfig;
                break;
            case 'deploy_prod':
                conf = AppConfig.deployProdConfig;
                break;
            default:
                throw Error('No config specified');
        }
        AppConfig._config = merge(AppConfig.baseConfig, conf) as AppConfigType;
    }

    static get config() {
        return AppConfig._config;
    }
}
