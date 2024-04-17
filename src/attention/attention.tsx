import React, {
  type MutableRefObject,
  type PropsWithChildren,
  useRef,
} from 'react';
import { View } from 'react-native';
import { Connect, type DetectorProps } from 'thesis-library';
import { Detector, faceDetect } from './detector';
import { ATTENTION_KEY } from '../extra/props';

export function MultiDeviceAttention({
  children,
  receivingFunction,
  sendingFunction,
  initialMap,
}: PropsWithChildren<DetectorProps>) {
  const dp = {
    receivingFunction: receivingFunction,
    sendingFunction: sendingFunction,
    initialMap: initialMap,
  };
  const uuid = self.crypto.randomUUID();
  const focus = useRef(true);
  const loadedModel: MutableRefObject<boolean> = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureImage = () => {
    if (!videoRef.current) {
      console.log('Video element does not exist.');
      return;
    }

    const video: HTMLVideoElement = videoRef.current;

    // Check if the video element exists
    // Create a canvas element to capture the image
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Draw the current frame from the video onto the canvas
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a data URL representing the image
    //const imageDataUrl = canvas.toDataURL('image/jpeg');
    return faceDetect(canvas, loadedModel)
      .then((value) => {
        if (undefined === value) {
          return 0;
        }
        return value.score;
      })
      .catch((error) => {
        console.error(error);
        return 0;
      });
  };

  // Get access to the webcam stream when the component mounts
  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // Set the video stream as the source for the video element
        // @ts-ignore
        videoRef.current.srcObject = stream;
        console.log('Accessed webcam');
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
      });
  }, []);

  React.useEffect(() => {
    if (!initialMap) {
      initialMap = { ATTENTION_KEY: null };
    } else if (!(ATTENTION_KEY in initialMap)) {
      // @ts-ignore
      initialMap[ATTENTION_KEY] = null;
    }
  }, []);

  return (
    //@ts-ignore
    <View className="Attention">
      {/* Own stuff */}
      <Connect containerSchema={initialMap}>
        {children}
        <Detector
          dp={dp}
          uuid={uuid}
          focus={focus}
          captureImage={captureImage}
        />
      </Connect>
      {/* Shared stuff */}
      {/* <Connect containerSchema={initialMap} /> */}
      <div>
        {/*@ts-ignore*/}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={styles.notVisible}
        />
      </div>
    </View>
  );
}

const styles = {
  notVisible: { display: 'none' },
};
