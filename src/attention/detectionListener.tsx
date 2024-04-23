import type { IValueChanged } from 'fluid-framework';
import { type FocusProps, ATTENTION_KEY } from '../extra';
import { type ConnectionContext } from '../extra';

export function detectionListener(fp: FocusProps, context: ConnectionContext) {
  if (!context || !fp.receivingFunction || !fp.sendingFunction) return;

  return (changed: IValueChanged, local: boolean) => {
    if (changed.key !== ATTENTION_KEY) return;
    if (local) {
      // CASE 1a: Nothing happened
      const itIsStillThisDevice = changed.previousValue === fp.uuid;
      if (itIsStillThisDevice) return;

      // CASE 1b: value changed from another to this
      fp.receivingFunction(context);
      fp.multiUserSharing?.receivingFunction();
    } else {
      // CASE 2a: Thing happened on other devices
      const itIsAnotherDeviceToAnotherDevice =
        changed.previousValue !== fp.uuid;
      if (itIsAnotherDeviceToAnotherDevice) return;

      // CASE 2b: value changed from this to another
      try {
        fp.sendingFunction(context);
        fp.multiUserSharing?.sendingFunction();
      } catch (error) {
        console.error(error);
      }
    }
  };
}
