import * as React from 'react';
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
} from 'react-native-vision-camera';
import { Text, StyleSheet } from 'react-native';

export function NativeFD() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { hasPermission, requestPermission } = useCameraPermission();
    if (hasPermission === false) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const device = useCameraDevice('back');

    if (device == null) return <Text>No device</Text>;
    return (
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
    );
  } catch (e) {
    console.log(e);
    return <></>;
  }
}
