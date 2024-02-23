export function add(a: number, b: number): Promise<number> {
  return Promise.resolve(a + b);
}
