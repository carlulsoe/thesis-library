import * as React from 'react';
import { Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

export function FD() {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    const handleFacesDetected = ({ faces }) => {
      console.log(faces);
    };

    return (
      <Camera
        // other props
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 100,
          tracking: true,
        }}
      />
    );
  }
}
