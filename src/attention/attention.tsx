import React, { type PropsWithChildren, useRef } from 'react';
import { View, Text } from 'react-native';
import {
  Connect,
  Detector,
  ATTENTION_KEY,
  type DetectorProps,
  type MultiUserSharingProps,
} from 'thesis-library';
import { useAutoUpdater } from '../connection/useAutoUpdater';

export function MultiDeviceAttention({
  children,
  receivingFunction,
  sendingFunction,
  initialMap,
}: PropsWithChildren<DetectorProps>) {
  const detectorProp = {
    receivingFunction: receivingFunction,
    sendingFunction: sendingFunction,
    initialMap: initialMap,
  };
  const uuid = self.crypto.randomUUID();
  const focus = useRef(true);

  React.useEffect(() => {
    if (!initialMap) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      initialMap = { ATTENTION_KEY: null };
    } else if (!(ATTENTION_KEY in initialMap)) {
      // @ts-ignore
      initialMap[ATTENTION_KEY] = null;
    }
  }, []);

  const [timestamp, setTimestamp] = useAutoUpdater('time');

  const sending = () => {
    setTimestamp(Date.now().toString());
  };

  const receiving = () => {
    console.log(timestamp);
    return timestamp;
  };
  const MultiUserSharing: MultiUserSharingProps = {
    sendingFunction: sending,
    receivingFunction: receiving,
  };
  return (
    //@ts-ignore
    <View className="Attention">
      <Text>Own</Text>
      <Connect containerSchema={initialMap}>
        {children}
        {/*<FaceDetection
          uuid={uuid}
          focus={focus}
          dp={detectorProp}
          multiUserSharing={MultiUserSharing}
        />*/}
        <Detector
          uuid={uuid}
          focus={focus}
          dp={detectorProp}
          multiUserSharing={MultiUserSharing}
        />
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
