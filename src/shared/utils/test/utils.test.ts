import { insertIntoSortedArray, findInsertPointNaive, findInsertPointBinarySearch } from "../utils";

test("simple array test", () => {
    const array = [5, 10, 15, 20, 25];
    let insertionPoint: number;

    insertionPoint = insertIntoSortedArray(array, 12, shouldComeLaterInArrayNumbers);
    expect(insertionPoint).toBe(2);
    expect(array).toEqual([5, 10, 12, 15, 20, 25]);

    insertionPoint = insertIntoSortedArray(array, -3, shouldComeLaterInArrayNumbers);
    expect(insertionPoint).toBe(0);
    expect(array).toEqual([-3, 5, 10, 12, 15, 20, 25]);

    insertionPoint = insertIntoSortedArray(array, 26, shouldComeLaterInArrayNumbers);
    expect(insertionPoint).toBe(7);
    expect(array).toEqual([-3, 5, 10, 12, 15, 20, 25, 26]);

    insertionPoint = insertIntoSortedArray(array, 5, shouldComeLaterInArrayNumbers);
    expect(insertionPoint).toBe(2);
    expect(array).toEqual([-3, 5, 5, 10, 12, 15, 20, 25, 26]);
});

test("findInsertPointBinarySearch equals findInsertPointNaive", () => {
    const arrays = [
        [5, 10, 15, 20, 25],
        [5, 10, 15, 20, 25, 26]
    ];
    for (const array of arrays) {
        for (let i = -5; i < 100; i++) {
            expect(findInsertPointNaive(array, i, shouldComeLaterInArrayNumbers)).toBe(findInsertPointBinarySearch(array, i, shouldComeLaterInArrayNumbers));
        }
    }
});

function shouldComeLaterInArrayNumbers(comparedElement, newElement) {
    return comparedElement <= newElement;
}