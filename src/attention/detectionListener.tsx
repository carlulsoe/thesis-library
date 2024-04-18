import type { IValueChanged } from 'fluid-framework';
import { type FocusProps, ATTENTION_KEY } from '../extra';
import type { Context } from '/workspaces/thesis-library/src/connection/ConnectionContext';

export function detectorListener(fp: FocusProps, context: Context | null) {
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
      console.log(
        `CASE 1: This (${fp.uuid}) is in focus from another (${changed.previousValue})`
      );
      if (!fp.dp.receivingFunction) return;
      if (context === null) return;
      fp.dp.receivingFunction(context);
      return;
    } else {
      const itIsAnotherDeviceToAnotherDevice =
        changed.previousValue !== fp.uuid;
      if (itIsAnotherDeviceToAnotherDevice) {
        return;
      }
      // CASE 2: value changed from this to another
      console.log(
        `CASE 2: value changed from this (${fp.uuid}) to another (${context?.get(ATTENTION_KEY)})`
      );
      if (!fp.dp.sendingFunction) return;
      if (context === null) return;
      fp.dp.sendingFunction(context);
      // @ts-ignore TODO fix later
      fp.multiUserSharing?.sendingFunction();
      return;
    }
  };
}
