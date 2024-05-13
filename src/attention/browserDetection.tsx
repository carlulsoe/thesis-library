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
  if (sharedMap.listeners('valueChanged').length >= 1) {
    //console.log(sharedMap.listeners('valueChanged').length);
    sharedMap.removeAllListeners('valueChanged');
    sharedMap.addListener('valueChanged', detectionListener(fp, context));

    return <></>;
  }

  setInterval(() => IsFocused(fp.focus, fp.uuid, sharedMap), 10);
  sharedMap.addListener('valueChanged', detectionListener(fp, context));
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
