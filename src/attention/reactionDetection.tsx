import React from 'react';
import { ConnectionContext } from '../connection/ConnectionContext';
import { type MutableRefObject, useContext } from 'react';
import type { SharedMap } from 'fluid-framework';
import { ATTENTION_KEY, type FocusProps } from '../extra';

export const Detector = (fp: FocusProps) => {
  const context = useContext(ConnectionContext);
  const container = context?.container;
  const initialObject = container?.initialObjects;
  if (initialObject === undefined) {
    return <></>;
  }
  const sharedMap: SharedMap = initialObject.sharedMap;

  setInterval(() => IsFocused(fp.focus, fp.uuid, sharedMap), 300);
  sharedMap.addListener('valueChanged', (changed, local) => {
    if (changed.key !== ATTENTION_KEY) {
      return;
    }
    if (local) {
      const itIsStillThisDevice = changed.previousValue === fp.uuid;
      // CASE 1: value changed from another to this
      if (itIsStillThisDevice) {
        return;
      }
      //console.log(`CASE 1: This (${fp.uuid}) is in focus from another (${changed.previousValue})`);
      if (!fp.multiUserSharing?.receivingFunction) return;
      fp.multiUserSharing.receivingFunction();
      return;
    } else {
      const itIsAnotherDeviceToAnotherDevice =
        changed.previousValue !== fp.uuid;
      if (itIsAnotherDeviceToAnotherDevice) {
        return;
      }
      // CASE 2: value changed from this to another
      //console.log(`CASE 2: value changed from this (${fp.uuid}) to another (${context?.get(ATTENTION_KEY)})`);
      if (!fp.multiUserSharing?.sendingFunction) return;
      fp.multiUserSharing.sendingFunction();
      return;
    }
  });
  return <></>;
};

const IsFocused = async (
  focus: MutableRefObject<boolean>,
  uuid: any,
  attention: SharedMap
) => {
  let docFocus = document.hasFocus(); // TODO a better name for this file could be documentDetection, documentFocusDetection, browserDetection, or browserFocusDetection
  if (focus.current !== docFocus) {
    focus.current = docFocus;
    if (focus.current) {
      attention.set(ATTENTION_KEY, uuid);
    }
    //console.log(`Focus changed to: ${focus.current}, with ${uuid}.`);
  }
};
