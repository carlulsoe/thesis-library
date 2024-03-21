import { useRef, type MutableRefObject } from 'react';
import React from 'react';
import { GetSharedAttention } from './attention';
import type { SharedMap } from 'fluid-framework';
import { View } from 'react-native';

export function AddDetector() {
  getAttention();
  return <View />;
}

const ATTENTION_KEY = 'attention';
const Detector = async (uuid: any, attention: SharedMap) => {
  const focus = useRef(true);
  setInterval(() => IsFocused(focus, uuid, attention), 300);
  attention.addListener('valueChanged', (changed, local) => {
    if (changed.key !== ATTENTION_KEY) {
      return;
    }
    if (local) {
      // CASE 1: value changed from another to this
      // TODO
      console.log('This is in focus');
      console.log(uuid);
      return;
    } else {
      const itIsAnotherDeviceToAnotherDevice = changed.previousValue !== uuid;
      if (itIsAnotherDeviceToAnotherDevice) {
        return;
      }
      // CASE 2: value changed from this to another
      console.log('CASE 2: value changed from this to another');
      return; //TODO change this to have functionallity
    }
  });
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
      attention.set(ATTENTION_KEY, uuid);
    }
    console.log(`Focus changed to: ${focus.current}, with ${uuid}.`);
  }
};

const getAttention = () => {
  const uuid = self.crypto.randomUUID();
  console.log(uuid);
  GetSharedAttention().then(
    (attention) => {
      Detector(uuid, attention).then().catch();
    },
    (e) => {
      console.log(e);
    }
  );
};
