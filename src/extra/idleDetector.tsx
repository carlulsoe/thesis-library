import { useRef, type MutableRefObject } from 'react';
import React from 'react';

export function AddDetector() {
  const uuid = self.crypto.randomUUID();
  console.log(uuid);
  Detector(uuid).then().catch();
  return <></>;
}

const Detector = async (uuid: any) => {
  const focus = useRef(true);
  setInterval(() => IsFocused(focus, uuid), 300);
};

const IsFocused = async (focus: MutableRefObject<boolean>, uuid: any) => {
  let docFocus = document.hasFocus();
  if (focus.current !== docFocus) {
    focus.current = docFocus;
    changeHandler(focus, uuid);
  }
};

const changeHandler = (focus: any, uuid: any) => {
  console.log(`Focus changed to: ${focus.current}, with ${uuid}.`);
};
