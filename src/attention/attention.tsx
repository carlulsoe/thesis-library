import React, {
  type MutableRefObject,
  type PropsWithChildren,
  useContext,
  useRef,
} from 'react';
import { SharedMap } from 'fluid-framework';
import { View } from 'react-native';
import { Connect } from 'thesis-library';
import * as faceapi from 'face-api.js';
import { ConnectionContext } from '../connection/ConnectionContext';

interface DetectorProps {
  receivingFunction: Function;
  sendingFunction: Function;
}

const ATTENTION_KEY = 'attention';

export function AddDetector({
  children,
  receivingFunction,
  sendingFunction,
}: PropsWithChildren<DetectorProps>) {
  const dp = {
    receivingFunction: receivingFunction,
    sendingFunction: sendingFunction,
  };
  const initialMap = { attention: String };
  const uuid = self.crypto.randomUUID();
  const focus = useRef(true);
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
    //console.log(detection);
    return faceDetect(canvas)
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

  return (
    //@ts-ignore
    <View className="Attention">
      <Connect containerSchema={initialMap}>
        {children}
        <Detector
          uuid={uuid}
          focus={focus}
          dp={dp}
          captureImage={captureImage}
        />
      </Connect>
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

interface FocusProps {
  dp: DetectorProps;
  uuid: any;
  focus: any;
  captureImage: () => Promise<number> | undefined;
}

const Detector = (fp: FocusProps) => {
  const context = useContext(ConnectionContext);
  const container = context?.container;
  const initialObject = container?.initialObjects;
  if (initialObject === undefined) {
    console.log('initial Object is undefined');
    return <></>;
  }
  const sharedMap: SharedMap = initialObject.sharedMap;

  setInterval(
    () => IsFocused(fp.focus, fp.uuid, sharedMap, fp.captureImage),
    300
  );
  sharedMap.addListener('valueChanged', (changed, local) => {
    if (changed.key !== ATTENTION_KEY) {
      return;
    }
    if (local) {
      const itIsStillThisDevice = changed.previousValue === fp.uuid;
      // CASE 1: value changed from another to this
      if (itIsStillThisDevice) {
        return;
      }
      console.log(
        `CASE 1: This (${fp.uuid}) is in focus from another (${changed.previousValue})`
      );
      fp.dp.receivingFunction();
      return;
    } else {
      const itIsAnotherDeviceToAnotherDevice =
        changed.previousValue !== fp.uuid;
      if (itIsAnotherDeviceToAnotherDevice) {
        return;
      }
      // CASE 2: value changed from this to another
      console.log(
        `CASE 2: value changed from this (${fp.uuid}) to another (${context?.get(ATTENTION_KEY)})`
      );
      fp.dp.sendingFunction();
      return;
    }
  });
  return <></>;
};

const IsFocused = async (
  focus: MutableRefObject<boolean>,
  uuid: any,
  attention: SharedMap,
  captureImage: () => Promise<number> | undefined
) => {
  let docFocus = document.hasFocus();

  // TODO add face dectection.IsFocused
  const detection = captureImage();
  let docFocusPlusFaceDetectFocus;
  if (detection !== undefined) {
    docFocusPlusFaceDetectFocus = docFocus && (await detection) >= 0.8;
  } else {
    docFocusPlusFaceDetectFocus = docFocus;
  }
  if (focus.current !== docFocusPlusFaceDetectFocus) {
    focus.current = docFocusPlusFaceDetectFocus;
    if (focus.current) {
      attention.set(ATTENTION_KEY, uuid);
    }
    console.log(`Focus changed to: ${focus.current}, with ${uuid}.`);
  }
};

async function faceDetect(img: any) {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
  const inputSize = 384;
  const scoreThreshold = 0.5;
  const detection = await faceapi.detectSingleFace(
    img,
    new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
  );
  if (detection === undefined) {
    console.log('no detection');
  }
  return detection;
}

const styles = {
  notVisible: { display: 'none' },
};
