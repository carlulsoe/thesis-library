import { attention, setAttention } from '../extra/attention';
import { Guid } from 'guid-typescript';

test('can set attention', async () => {
  setAttention('this id');
  await expect(attention()).resolves.toBe('this id');
});

test('can set attetion to guid', async () => {
  const uid = Guid.create().toString();
  setAttention(uid);
  await expect(attention()).resolves.toBe(uid);
});
