import { changeHandler } from './changeHandler';
import { useRef, type MutableRefObject } from 'react';

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

export default Detector;
