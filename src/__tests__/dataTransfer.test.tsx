import { DataHandler } from '../connection/dataHandler';
import type { FocusProps } from '../extra';

test('noChangeDataHandler', () => {
  const uuid = 'thisisarandomuuid';
  const focus = 'thisisafocus';

  let fp: FocusProps = {
    receivingFunction: () => {},
    sendingFunction: () => {},
    uuid: uuid,
    focus: focus,
  };
  expect(fp).toBe(fp);
  expect(DataHandler(fp)).toBe(fp);
});
