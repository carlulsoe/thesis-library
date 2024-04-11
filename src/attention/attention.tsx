import { useContext, useRef, type MutableRefObject } from 'react';
import React from 'react';
import { SharedMap } from 'fluid-framework';
import { View } from 'react-native';
import { Connect } from 'thesis-library';
//import * as faceapi from 'face-api.js';
import { ConnectionContext } from '../connection/ConnectionContext';

export function AddDetector(props: DetectorProps) {
  return Connector(props);
}

interface DetectorProps {
  receivingFunction: Function;
  sendingFunction: Function;
}

const ATTENTION_KEY = 'attention';

const Connector = (dp: DetectorProps) => {
  const initialMap = { attention: String };
  const uuid = self.crypto.randomUUID();
  const focus = useRef(true);

  return (
    //@ts-ignore
    <View className="Attention">
      <Connect containerSchema={initialMap}>
        <Detector uuid={uuid} focus={focus} dp={dp} />
      </Connect>
    </View>
  );
};

interface FocusProps {
  dp: DetectorProps;
  uuid: any;
  focus: any;
}

const Detector = (fp: FocusProps) => {
  const context = useContext(ConnectionContext);
  const container = context?.container;
  const initialObject = container?.initialObjects;
  if (initialObject === undefined) {
    return <></>;
  }
  const sharedMap: SharedMap = initialObject.sharedMap;

  setInterval(() => IsFocused(fp.focus, fp.uuid, sharedMap), 300);
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
      // TODO
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
      return; //TODO change this to have functionallity
    }
  });
  return <></>;
};

const IsFocused = async (
  focus: MutableRefObject<boolean>,
  uuid: any,
  attention: SharedMap
) => {
  let docFocus = document.hasFocus();
  const facereq = async () => {
    // TODO add face dectection.
    //const detection = await faceapi.detectSingleFace();
    //console.log(detection);
  };
  facereq();
  if (focus.current !== docFocus) {
    focus.current = docFocus;
    if (focus.current) {
      attention.set(ATTENTION_KEY, uuid);
    }
    console.log(`Focus changed to: ${focus.current}, with ${uuid}.`);
  }
};
