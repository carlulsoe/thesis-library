import React, { type PropsWithChildren, useRef } from 'react';
import { View, Text } from 'react-native';
import {
  Connect,
  type DetectorProps,
  type MultiUserSharingProps,
} from 'thesis-library';
import { GetDetector } from './GetDetector';

export function MultiDeviceAttention({
  children,
  receivingFunction,
  sendingFunction,
}: PropsWithChildren<DetectorProps>) {
  const uuid = self.crypto.randomUUID();
  const focus = useRef(true);

  const detectorProp: DetectorProps = {
    receivingFunction: receivingFunction,
    sendingFunction: sendingFunction,
  };

  const MultiUserSharing: MultiUserSharingProps = {
    sendingFunction: () => {},
    receivingFunction: () => {},
  };

  const detector = GetDetector(uuid, focus, detectorProp, MultiUserSharing);
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
