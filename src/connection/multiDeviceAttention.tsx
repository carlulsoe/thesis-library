import React, { type PropsWithChildren, useRef } from 'react';
import { View } from 'react-native';
import {
  Connect,
  type ConnectionContext,
  type DetectorProps,
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
  let newFp = DataHandler(fp, transferMethod);
  const detector = GetDetector(newFp);
  return (
    //@ts-ignore
    <View className="Attention">
      <Connect>
        {children}
        {detector}
      </Connect>
      {/* <Connect containerSchema={initialMap} /> */}
      <div>
        {/*@ts-ignore*/}
        <video autoPlay playsInline muted style={styles.notVisible} />
      </div>
    </View>
  );
}

const styles = {
  notVisible: { display: 'none' },
};
