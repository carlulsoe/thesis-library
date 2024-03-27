import { objContains, objEq, uniqueMerge } from '../extra/tools';

test('test_uniqueMerge', () => {
  let a = [
    { a: 'sup', b: 'wassup' },
    { a: 'hello', b: 'hallo' },
  ];
  let b = [
    { a: 'sup', b: 'wassup' },
    { a: 'hello', b: 'hallo2' },
  ];
  let a2 = [
    { a: 'sup', b: 'wassup' },
    { a: 'sup', b: 'wassup' },
    { a: 'hello', b: 'hallo' },
  ];
  let res = [
    { a: 'sup', b: 'wassup' },
    { a: 'hello', b: 'hallo' },
    { a: 'hello', b: 'hallo2' },
  ];
  expect(uniqueMerge(a, [])).toEqual(a);
  expect(uniqueMerge([], b)).toEqual(b);
  expect(uniqueMerge([], [])).toEqual([]);
  expect(uniqueMerge(a, b)).toEqual(res);
  expect(uniqueMerge(a, a)).toEqual(a);
  expect(uniqueMerge(a, a2)).toEqual(a);
});

test('test_object_equality', () => {
  let a = { a: 'sup', b: 'wassup' };
  let b = { a: 'sup', b: 'wassup' };
  let c = { a: 'sup', b: 'hello' };
  let d = { a: 'hello', b: 'wassup' };
  expect(objEq(a, b)).toEqual(true);
  expect(objEq(a, c)).toEqual(false);
  expect(objEq(a, d)).toEqual(false);
});

test('test_list_contains', () => {
  let a = [
    { a: 'sup', b: 'wassup' },
    { a: 'hello', b: 'hallo2' },
  ];
  let isIn = { a: 'sup', b: 'wassup' };
  let isNotIn = { a: 'sup', b: 'hello' };

  expect(objContains(a, isIn)).toEqual(true);
  expect(objContains(a, isNotIn)).toEqual(false);
});
