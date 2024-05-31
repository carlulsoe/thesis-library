import React, { type PropsWithChildren, useRef } from 'react';
import { View } from 'react-native';
import {
  Connect,
  FaceDetection,
  type ConnectionContext,
  type DetectorProps,
  type FocusProps,
} from 'thesis-library';
import { GetDetector } from '../attention/GetDetector';

export function MultiDeviceAttention({
  children,
  receivingFunction,
  sendingFunction,
  useFaceDetection,
}: PropsWithChildren<DetectorProps>) {
  const uuidRef = useRef(self.crypto.randomUUID());
  const focus = useRef(true);
  const fp: FocusProps = {
    receivingFunction: async (context: ConnectionContext) => {
      await new Promise((f) => setTimeout(f, 50));
      receivingFunction(context);
    },
    sendingFunction: sendingFunction,
    uuid: uuidRef,
    focus: focus,
  };

  const detector = useFaceDetection
    ? GetDetector(fp, FaceDetection)
    : GetDetector(fp);
  return (
    <View>
      <Connect toOtherUsers={false} focusProp={fp}>
        {children}
        {detector}
      </Connect>
    </View>
  );
}
