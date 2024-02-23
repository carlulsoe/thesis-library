import { add } from '../extra/add';

test('add', async () => {
  await expect(add(1, 1)).resolves.toEqual(2);
});
