/**
 * Deeply freezes an object, by calling `deepFreeze` on all properties
 * of the object, and then `Object.freeze` on itself.
 *
 * @param object the object to deepfreeze
 */
export function deepFreeze<T extends object>(object: T): T {
    const propNames = Object.getOwnPropertyNames(object);

    for (const name of propNames) {
        const value = object[name];
        if (value != null && typeof value === 'object') {
            object[name] = deepFreeze(value);
        }
    }

    return Object.freeze(object);
}
