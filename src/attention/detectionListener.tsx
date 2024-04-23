import type { IValueChanged } from 'fluid-framework';
import { type FocusProps, ATTENTION_KEY } from '../extra';
import { type ConnectionContext } from '../extra';

export function detectorListener(fp: FocusProps, context: ConnectionContext) {
  return (changed: IValueChanged, local: boolean) => {
    if (changed.key !== ATTENTION_KEY) {
      return;
    }
    if (local) {
      const itIsStillThisDevice = changed.previousValue === fp.uuid;
      // CASE 1: value changed from another to this
      if (itIsStillThisDevice) {
        return;
      }
      if (!fp.receivingFunction || !context) return;
      //fp.receivingFunction(context);
      return;
    } else {
      const itIsAnotherDeviceToAnotherDevice =
        changed.previousValue !== fp.uuid;
      if (itIsAnotherDeviceToAnotherDevice) {
        return;
      }
      // CASE 2: value changed from this to another
      if (!fp.sendingFunction || !context) return;
      fp.sendingFunction(context);
      fp.multiUserSharing?.sendingFunction();
      return;
    }
  };
}
