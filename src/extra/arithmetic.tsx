export function add(a: number, b: number): Promise<number> {
  return Promise.resolve(a + b);
}

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

export function divide(a: number, b: number): Promise<number> {
  if (b === 0) {
    throw new EvalError('No dividing by 0!');
  }
  return Promise.resolve(a / b);
}
