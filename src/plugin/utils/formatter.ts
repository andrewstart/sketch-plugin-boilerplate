export function toArray<T>(object:T[]|NSArray<T>):T[] {
    if (Array.isArray(object)) {
        return object;
    }
    const arr:T[] = [];
    for (let j = 0; j < object.count(); j++) {
        arr.push(object.objectAtIndex(j));
    }
    return arr;
}
