import { add, multiply, divide } from '../index';

test('add 1 and 1', async () => {
  await expect(add(1, 1)).resolves.toEqual(1);
});

test('multiply 0 and 5', () => {
  multiply(0, 5).then((res) => expect(res).not.toBe(5));
  multiply(0, 5).then((res) => expect(res).toBe(0));
});

test('multiply 3 and 5', async () => {
  await expect(multiply(3, 5)).resolves.toBe(15);
});

test('divide 3 and 0', async () => {
  expect(() => divide(3, 0)).toThrow('No dividing by 0!');
  expect(() => divide(3, 0)).toThrow(EvalError);
  expect(() => divide(3, 0)).toThrow(EvalError('No dividing by 0!'));
  expect(() => divide(3, 0)).not.toThrow(EvalError('Blah'));
});
