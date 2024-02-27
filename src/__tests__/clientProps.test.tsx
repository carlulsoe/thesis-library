import { Guid } from 'guid-typescript';
test('test', async () => {
  const user = {
    id: Guid.create().toString(),
    name: '[TEST USER NAME]',
  };
  expect(user.name).toBe('[TEST USER NAME]');
  expect(user.id).toBeDefined();
});
