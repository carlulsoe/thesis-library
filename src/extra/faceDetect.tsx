import * as React from 'react';
import { Platform } from 'react-native';
//import { Camera } from 'expo-camera';
//import * as VisionCamera from 'react-native-vision-camera';
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
} from 'react-native-vision-camera';
import { Text, StyleSheet } from 'react-native';

export function FD() {
  if (Platform.OS === 'web') {
    return <></>;
  }
  const { hasPermission, requestPermission } = useCameraPermission();
  if (hasPermission === false) {
    requestPermission();
  }
  const device = useCameraDevice('back');

  if (device == null) return <Text>No device</Text>;
  return (
    <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
  );
}
