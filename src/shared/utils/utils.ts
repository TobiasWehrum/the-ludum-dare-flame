import * as deepmerge from "deepmerge";

export function getVersion(): string {
    return "1.0.0";
}

export function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function mapReverse(array: any[], fn) {
    return array.reduceRight((result, element, index) => {
        result.push(fn(element, index));
        return result;
    }, []);
}

const emptyTarget = value => Array.isArray(value) ? [] : {};
const clone = (value, options) => deepmerge(emptyTarget(value), value, options);

export function arrayCombineMerge(target, source, options) {
    const destination = target.slice();

    source.forEach((e, i) => {
        if (typeof destination[i] === "undefined") {
            const cloneRequested = options.clone !== false;
            const shouldClone = cloneRequested && options.isMergeableObject(e);
            destination[i] = shouldClone ? clone(e, options) : e;
        } else if (options.isMergeableObject(e)) {
            destination[i] = deepmerge(target[i], e, options);
        } else if (target.indexOf(e) === -1) {
            destination.push(e);
        }
    });
    return destination;
}

export function populateDefaultsForFields<TValue>(targetContainer: { [key: string]: Partial<TValue> }, defaults: Partial<TValue>): { [key: string]: TValue } {
    Object.keys(targetContainer).forEach(elementKey => {
        const element = targetContainer[elementKey];
        Object.keys(defaults).forEach(key => {
            if (element[key] === undefined)
                element[key] = defaults[key];
        });
    });
    return targetContainer as any;
}

export function insertIntoSortedArray<T>(array: T[], newElement: T, shouldComeLaterInArray: (comparedElement: T, newElement: T) => boolean): number {
    const insertPoint = findInsertPointBinarySearch(array, newElement, shouldComeLaterInArray);
    array.splice(insertPoint, 0, newElement);
    return insertPoint;
}

export function findInsertPointNaive<T>(array: T[], newElement: T, shouldComeLaterInArray: (comparedElement: T, newElement: T) => boolean): number {
    let insertPoint: number;
    for (insertPoint = 0; insertPoint < array.length; insertPoint++) {
        const comparedElement = array[insertPoint];
        if (!shouldComeLaterInArray(comparedElement, newElement))
            break;
    }
    return insertPoint;
}

export function findInsertPointBinarySearch<T>(array: T[], newElement: T, shouldComeLaterInArray: (comparedElement: T, newElement: T) => boolean): number {
    if (array.length === 0)
        return 0;

    if (!shouldComeLaterInArray(array[0], newElement))
        return 0;

    let low = 1;
    let high = array.length;

    while (low < high) {
        const pivot = Math.trunc(high / 2 + low / 2);
        const shouldComeAfterPrevious = shouldComeLaterInArray(array[pivot - 1], newElement);
        const shouldComeAfterCurrent = shouldComeLaterInArray(array[pivot], newElement);

        if (shouldComeAfterPrevious && !shouldComeAfterCurrent) {
            return pivot;
        }

        if (!shouldComeAfterPrevious) {
            // Element should be even before the element before the pivot
            high = pivot - 1;
        } else {
            // Element should be after the current pivot
            low = pivot + 1;
        }
    }

    return low;
}

export function removeFirstItemFromArray<T>(array: T[], itemToBeRemoved: T): boolean {
    const index = array.indexOf(itemToBeRemoved);
    if (index === -1)
        return false;

    array.splice(index, 1);
    return true;
}

export function msToTimeString(ms: number) {
    let s = Math.floor(ms / 1000);
    let m = Math.floor(s / 60);
    s %= 60;
    let h = Math.floor(m / 60);
    m %= 60;
    let d = Math.floor(h / 24);
    h %= 24;

    let result = "";

    if (d > 0) {
        result += d + " days, ";
    }

    if ((result.length > 0) || (h > 0)) {
        result += h + " hours, ";
    }

    if ((result.length > 0) || (m > 0)) {
        result += m + " minutes and ";
    }

    result += s + " seconds";

    return result;
}