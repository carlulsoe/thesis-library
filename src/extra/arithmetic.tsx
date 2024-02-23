/**
 * Adds two numbers
 *
 * @param a Left hand side number of the addition
 * @param b Right hand side number of the addition
 * @return A Promise of the resulting addition
 */
export function add(a: number, b: number): Promise<number> {
  return Promise.resolve(a + b);
}

/**
 * Multiplies two numbers
 *
 * @param a Left hand side number of the multiplication
 * @param b Right hand side number of the multiplication
 * @return A Promise of the resulting multiplication
 */
export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

/**
 * Divides two numbers
 *
 * @param a Left hand side number of the division
 * @param b Right hand side number of the division
 * @return A Promise of the resulting division or an EvalError if `b = 0`
 */
export function divide(a: number, b: number): Promise<number> {
  if (b === 0) {
    throw new EvalError('No dividing by 0!');
  }
  return Promise.resolve(a / b);
}
