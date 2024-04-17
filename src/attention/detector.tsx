import type { FocusProps } from '../extra';
import React, { type MutableRefObject, useContext } from 'react';
import { ConnectionContext } from '../connection/ConnectionContext';
import { SharedMap } from 'fluid-framework';
import * as faceapi from 'face-api.js';
import { ATTENTION_KEY } from '../extra/props';

export const Detector = (fp: FocusProps) => {
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
      if (!fp.dp.receivingFunction) return;
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
      if (!fp.dp.sendingFunction) return;
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

export async function faceDetect(
  img: any,
  loadedModel: MutableRefObject<boolean>
) {
  if (!loadedModel.current) {
    console.log('loading model.');
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    loadedModel.current = true;
  }
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
