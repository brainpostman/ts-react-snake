export function deepCopy<T>(array: Array<T>): Array<T> {
    return JSON.parse(JSON.stringify(array));
}
