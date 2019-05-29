export interface Dictionary<T> {
  [x: string]: T;
}

type Accumulator<T> = [T, number];
export type Callback<T, Y = number> = (x: T) => Y;

export function cmpBy<T>(
  collection: ReadonlyArray<T>,
  cmp: (a: number, b: number) => boolean,
  callback: Callback<T>
): T {
  if (collection.length <= 1) {
    return collection[0];
  }

  return collection.reduce(
    (([minElem, minValue]: Accumulator<T>, elem: T) => {
      const value = callback(elem);
      if (cmp(value, minValue)) {
        return [elem, value];
      } else {
        return [minElem, minValue];
      }
    }) as any,
    [collection[0], callback(collection[0])] as Accumulator<T>
  )[0];
}

export function minBy<T>(
  collection: ReadonlyArray<T>,
  callback: Callback<T>
): T {
  return cmpBy(collection, (a, b) => a < b, callback);
}

export function maxBy<T>(
  collection: ReadonlyArray<T>,
  callback: Callback<T>
): T {
  return cmpBy(collection, (a, b) => a > b, callback);
}

export function count<T>(
  collection: ReadonlyArray<T>,
  callback: Callback<T, boolean> = x => !!x
): number {
  return Array.prototype.reduce.call(
    collection,
    ((acc: number, x: T) => (callback(x) ? acc + 1 : acc)) as any,
    0
  ) as any;
}
