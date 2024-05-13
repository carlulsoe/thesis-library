import React from 'react';
import {
  OptionalConnectionContext,
  ATTENTION_KEY,
  type FocusProps,
} from '../extra';
import { type MutableRefObject, useContext } from 'react';
import type { SharedMap } from 'fluid-framework';
import { detectionListener } from './detectionListener';

export const BrowserDetection = (fp: FocusProps) => {
  const context = useContext(OptionalConnectionContext);
  const sharedMap = context?.sharedMap;
  if (!sharedMap) return <></>;
  const detectionListener1 = detectionListener(fp, context);
  if (sharedMap.listeners('valueChanged').length >= 1) {
    console.log(sharedMap.listeners('valueChanged'));
    //sharedMap.removeAllListeners('valueChanged');

    const listeners: Function[] = sharedMap.listeners('valueChanged');
    // @ts-ignore
    const shutUpAndTakeMyFunction: (args: any[]) => any = listeners.filter(
      (func) => func.name === detectionListener1.name
    )[0];
    if (!shutUpAndTakeMyFunction) return <></>;
    sharedMap.removeListener('valueChanged', shutUpAndTakeMyFunction);
    sharedMap.addListener('valueChanged', detectionListener1);
    return <></>;
  }
  setInterval(() => IsFocused(fp.focus, fp.uuid, sharedMap), 10);
  sharedMap.on('valueChanged', detectionListener1);
  return <></>;
};

const IsFocused = async (
  focus: MutableRefObject<boolean>,
  uuid: any,
  attention: SharedMap
) => {
  let docFocus = document.hasFocus();
  if (focus.current !== docFocus) {
    focus.current = docFocus;
    if (focus.current) {
      attention.set(ATTENTION_KEY, uuid.current);
    }
    //console.log(`Focus changed to: ${focus.current}, with ${uuid}.`);
  }
};
