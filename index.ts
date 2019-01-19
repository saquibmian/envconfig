import { envconfig, IOptions } from './envconfig';

const envConfigOptions: IOptions = {
    ignoreCase: true,
};

const config = envconfig({
    user: {
        name: 'Saquib',
        email: 'saquib.mian@gmail.com',
        accounts: {
            github: true,
            npmjs: false,
        },
    },
    npm: {
        package: {
            name: null,
            main: null,
            version: 'something crazy',
        },
    },
}, envConfigOptions);

// tslint:disable-next-line:no-console
console.log(config);

export * from './envconfig';
