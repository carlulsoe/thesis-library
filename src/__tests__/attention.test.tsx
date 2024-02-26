import { attention, setAttention } from '../extra/attention';

test('can set attention', async () => {
  setAttention('this id');
  await expect(attention()).resolves.toBe('this id');
});
