import type { IValueChanged } from 'fluid-framework';
import { type FocusProps, ATTENTION_KEY } from '../extra';
import { type ConnectionContext } from '../extra';

export function detectionListener(fp: FocusProps, context: ConnectionContext) {
  return (changed: IValueChanged, local: boolean) => {
    if (!context || !fp.receivingFunction || !fp.sendingFunction) return;
    if (changed.key !== ATTENTION_KEY) return;
    if (local) {
      // CASE 1a: Nothing happened
      const itIsStillThisDevice = changed.previousValue === fp.uuid.current;
      if (itIsStillThisDevice) return;

      // CASE 1b: value changed from another to this
      fp.receivingFunction(context);
    } else {
      // CASE 2a: Thing happened on other devices
      const itIsAnotherDeviceToAnotherDevice =
        changed.previousValue !== fp.uuid.current;
      if (itIsAnotherDeviceToAnotherDevice) return;

      // CASE 2b: value changed from this to another
      try {
        fp.sendingFunction(context);
      } catch (error) {
        console.error(error);
      }
    }
  };
}
