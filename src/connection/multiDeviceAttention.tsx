import React, { type PropsWithChildren, useRef } from 'react';
import { View, Text } from 'react-native';
import { Connect, type DetectorProps } from 'thesis-library';
import { GetDetector } from '../attention/GetDetector';

export function MultiDeviceAttention({
  children,
  receivingFunction,
  sendingFunction,
}: PropsWithChildren<DetectorProps>) {
  const uuid = self.crypto.randomUUID();
  const focus = useRef(true);

  const detector = GetDetector({
    detectorProps: {
      receivingFunction: receivingFunction,
      sendingFunction: sendingFunction,
    },
    multiUserSharing: {
      sendingFunction: () => {},
      receivingFunction: () => {},
    },
    focus: focus,
    uuid: uuid,
  });
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
