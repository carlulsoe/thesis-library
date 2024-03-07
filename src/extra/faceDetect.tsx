import * as React from 'react';
import { Platform } from 'react-native';
import { NativeFD } from './nativeFaceDetect';

export function FD() {
  if (Platform.OS === 'web') {
    return <p>Face detection does currently not work on web</p>; // TODO fix this later
  } else {
    return NativeFD();
  }
}
