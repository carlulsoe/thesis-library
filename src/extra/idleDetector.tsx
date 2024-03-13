import { changeHandler } from './changeHandler';
import { useRef, type MutableRefObject } from 'react';

const Detector = async () => {
  const focus = useRef(true);
  setInterval(() => IsFocused(focus), 300);
};

const IsFocused = async (focus: MutableRefObject<boolean>) => {
  let docFocus = document.hasFocus();
  if (focus.current !== docFocus) {
    focus.current = docFocus;
    changeHandler(focus);
  }
};

export default Detector;
