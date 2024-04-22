import type { FocusProps } from '../extra';
import React, {
  type MutableRefObject,
  type RefObject,
  useContext,
  useRef,
} from 'react';
import { SharedMap } from 'fluid-framework';
import * as faceapi from 'face-api.js';
import { ConnectionContext, ATTENTION_KEY } from '../extra';
import { detectorListener } from './detectionListener';

export const FaceDetection = (fp: FocusProps) => {
  const context = useContext(ConnectionContext);
  const sharedMap: SharedMap = context?.sharedMap!;
  const videoRef = useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // Set the video stream as the source for the video element
        // @ts-ignore
        videoRef.current.srcObject = stream;
        console.log('Accessed webcam');
        faceapi.nets.tinyFaceDetector.loadFromUri('/').then(() => {});
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
      });
  }, []);

  if (!context || context.sharedMap) {
    console.log('initial Object is undefined');
    return <></>;
  }

  // Get access to the webcam stream when the component mounts

  setInterval(
    () => IsFocused(fp.focus, fp.uuid, sharedMap, () => captureImage(videoRef)),
    300
  );
  sharedMap.addListener('valueChanged', detectorListener(fp, context));
  return <></>;
};
const IsFocused = async (
  focus: MutableRefObject<boolean>,
  uuid: any,
  attention: SharedMap,
  captureImage: () => Promise<number> | undefined
) => {
  let docFocus = document.hasFocus();

  // TODO add face detection.IsFocused
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

const captureImage = (videoRef: RefObject<HTMLVideoElement>) => {
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

async function faceDetect(img: any) {
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