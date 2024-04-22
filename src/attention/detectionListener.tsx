import type { IValueChanged } from 'fluid-framework';
import { type FocusProps, ATTENTION_KEY } from '../extra';
import { type Context } from '../extra';

export function detectorListener(fp: FocusProps, context: Context) {
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
      if (!fp.detectorProps.receivingFunction || !context) return;
      fp.detectorProps.receivingFunction(context);
      return;
    } else {
      const itIsAnotherDeviceToAnotherDevice =
        changed.previousValue !== fp.uuid;
      if (itIsAnotherDeviceToAnotherDevice) {
        return;
      }
      // CASE 2: value changed from this to another
      if (!fp.detectorProps.sendingFunction || !context) return;
      fp.detectorProps.sendingFunction(context);
      // @ts-ignore TODO fix later
      fp.multiUserSharing?.sendingFunction();
      return;
    }
  };
}
