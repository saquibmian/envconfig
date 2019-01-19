import { deepFreeze } from './deepFreeze';
import { Property } from './Property';

function variables(blacklist: string[]): Array<{ name: string, value: string }> {
    return Object.getOwnPropertyNames(process.env)
        .filter((key) => blacklist.indexOf(key) === -1)
        .sort()
        .map((name) => ({ name, value: process.env[name]! }));
}

function parsePath(envVar: string): string[] {
    return envVar.split('_');
}

export const defaultBlacklist = deepFreeze([
    'HOME',
    'PATH',
    'COLOR*',
    'ITERM*',
    'LESS',
    'LSCOLORS',
    'SHELL',
    'TERM',
    'USER',
    'USERNAME',
    'GOPATH',
]);

export interface IOptions {
    prefix?: string;
    blacklist?: string[];
    ignoreCase?: boolean;
}

export const defaultOptions: IOptions = {
    blacklist: defaultBlacklist,
    ignoreCase: false,
};

export function envconfig<T extends object>(config: T, options?: IOptions): T {
    options = {
        ...defaultOptions,
        ...options,
    };

    for (const { name, value } of variables(options.blacklist || [])) {
        const prop = Property.from(parsePath(name), options.ignoreCase || false);

        if (prop.set(config, value)) {
            // tslint:disable-next-line:no-console
            console.info(`envconfig: applied environment variable ${name} to config`);
        } else {
            // tslint:disable-next-line:no-console
            console.debug(`envconfig: environment variable ${name} did not match a known property and was ignored`);
        }
    }

    return config;
}
