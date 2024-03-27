import _ from 'lodash';

export function mapBetweenRanges(
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
  n: number
) {
  return (n / (fromMax - fromMin)) * (toMax - toMin);
}

export function uniqueMerge<T extends object>(a: T[], b: T[]): T[] {
  return a.concat(b.filter((item) => !objContains(a, item)));
}

export function objContains<T extends object>(ls: T[], it: T) {
  return ls.some((i) => objEq(i, it));
}

export const objEq = (a: object, b: object) => _.isEqual(a, b);
