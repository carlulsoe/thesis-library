import * as React from 'react';
import { Platform } from 'react-native';
import { NativeFD } from './nativeFaceDetect';

export function FD() {
  if (Platform.OS === 'web') {
    return <></>;
  } else {
    return NativeFD();
  }
}
