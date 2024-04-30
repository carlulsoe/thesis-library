import React, { type PropsWithChildren, useRef } from 'react';
import { View } from 'react-native';
import {
  Connect,
  type ConnectionContext,
  type DetectorProps,
  FaceDetection,
  type FocusProps,
} from 'thesis-library';
import { GetDetector } from '../attention/GetDetector';
import { DataHandler } from './dataHandler';

export function MultiDeviceAttention({
  children,
  receivingFunction,
  sendingFunction,
  transferMethod,
}: PropsWithChildren<DetectorProps>) {
  const uuid = self.crypto.randomUUID();
  const focus = useRef(true);
  const fp: FocusProps = {
    receivingFunction: async (context: ConnectionContext) => {
      await new Promise((f) => setTimeout(f, 50));
      receivingFunction(context);
    },
    sendingFunction: sendingFunction,
    uuid: uuid,
    focus: focus,
  };
  /*const uuid2other = self.crypto.randomUUID();
  const focus2other = useRef(true);
  const fp2other: FocusProps = {
    receivingFunction: async (context: ConnectionContext) => {
      await new Promise((f) => setTimeout(f, 50));
      receivingFunction(context);
    },
    sendingFunction: sendingFunction,
    uuid: uuid2other,
    focus: focus2other,
  };*/
  const detector = transferMethod
    ? GetDetector(DataHandler(fp, transferMethod))
    : GetDetector(fp, FaceDetection);
  return (
    <View>
      <Connect toOtherUsers={false} focusProp={fp}>
        {children}
        {detector}
      </Connect>
    </View>
  );
}
