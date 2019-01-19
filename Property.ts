import { deepFreeze } from './deepFreeze';

export class Property {

    public static from(parts: string[], ignoreCase: boolean = false): Property {
        return new Property(deepFreeze(parts), ignoreCase);
    }

    private constructor(
        private readonly _parts: string[],
        private readonly _ignoreCase: boolean,
    ) { }

    public get<T = any>(obj: any): T | undefined {
        for (const part of this._parts) {
            obj = this.traverse(obj, part);
            if (obj == null) {
                break;
            }
        }
        return obj;
    }

    public set(obj: object, value: any): boolean {
        for (const part of this._parts.slice(0, -1)) {
            const traversed = this.traverse(obj, part, {});
            if (!traversed) {
                return false;
            }
            obj = traversed;
        }

        let lastPart = this._parts[this._parts.length - 1];
        if (this._ignoreCase) {
            const found = this.findActualPropertyName(obj, lastPart);
            if (!found) {
                return false;
            }
            lastPart = found;
        }
        if (obj[lastPart] === undefined) {
            return false;
        }
        if (obj[lastPart] !== null && typeof obj[lastPart] === 'object') {
            return false;
        }

        obj[lastPart] = value;
        return true;
    }

    private traverse(obj: any, prop: string, useExisting?: any): any | null | undefined {
        if (this._ignoreCase) {
            const found = this.findActualPropertyName(obj, prop);
            if (!found) {
                return undefined;
            }
            prop = found;
        }

        if (!obj.hasOwnProperty(prop)) {
            return undefined;
        }
        if (useExisting !== undefined && !obj[prop]) {
            obj[prop] = useExisting;
        }
        return obj[prop];
    }

    private findActualPropertyName(obj: any, prop: string): string | undefined {
        if (obj.hasOwnProperty(prop)) {
            return prop;
        }
        return Object.getOwnPropertyNames(obj).find((name) => name.toLowerCase() === prop.toLowerCase());
    }

}
