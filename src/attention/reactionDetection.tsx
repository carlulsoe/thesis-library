import React from 'react';
import { ConnectionContext } from '../connection/ConnectionContext';
import { type MutableRefObject, useContext } from 'react';
import type { SharedMap } from 'fluid-framework';
import { ATTENTION_KEY, type FocusProps } from '../extra';
import { detectorListener } from './detectionListener';

export const BrowserDetection = (fp: FocusProps) => {
  const context = useContext(ConnectionContext);
  const sharedMap = context?.sharedMap;
  if (!sharedMap) return <></>;

  setInterval(() => IsFocused(fp.focus, fp.uuid, sharedMap), 300);
  sharedMap.addListener('valueChanged', detectorListener(fp, context));
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
