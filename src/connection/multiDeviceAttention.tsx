import React, { type PropsWithChildren, useRef } from 'react';
import { View, Text } from 'react-native';
import { Connect, type DetectorProps, type FocusProps } from 'thesis-library';
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
    receivingFunction: receivingFunction,
    sendingFunction: sendingFunction,
    uuid: uuid,
    focus: focus,
  };
  let newFp = DataHandler(fp, transferMethod);
  const detector = GetDetector(newFp);
  return (
    //@ts-ignore
    <View className="Attention">
      <Text>Own</Text>
      <Connect>
        {children}
        {detector}
      </Connect>
      <Text>Shared</Text>
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
