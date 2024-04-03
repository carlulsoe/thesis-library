import { useRef, type MutableRefObject } from 'react';
import React, { useEffect, useState } from 'react';
import { SharedMap } from 'fluid-framework';
import { View } from 'react-native';
import { Connect } from 'thesis-library';

export function AddDetector() {
  let dp = { receivingFunction: receive, sendingFunction: sending };
  return Connector(dp);
}

interface DetectorProps {
  receivingFunction: Function;
  sendingFunction: Function;
}

function receive() {
  console.log('received');
}

function sending() {
  console.log('sending');
}

const ATTENTION_KEY = 'attention';

const Connector = (dp: DetectorProps) => {
  const [fluidSharedObjects, setFluidSharedObjects] = useState(null);
  const initialObjects = { attention: SharedMap };
  const uuid = self.crypto.randomUUID();
  const focus = useRef(true);
  console.log(uuid);
  useEffect(() => {
    if (fluidSharedObjects) {
      //@ts-ignore
      const { attention } = fluidSharedObjects.initialObjects;
      Detector(uuid, attention, focus, dp);
    }
  }, [uuid, fluidSharedObjects, dp]);

  return (
    //@ts-ignore
    <View className="Attention">
      <Connect
        containerSchema={initialObjects}
        setObjects={setFluidSharedObjects}
      />
    </View>
  );
};

const Detector = (
  uuid: any,
  attention: SharedMap,
  focus: any,
  dp: DetectorProps
) => {
  setInterval(() => IsFocused(focus, uuid, attention), 300);
  attention.addListener('valueChanged', (changed, local) => {
    if (changed.key !== ATTENTION_KEY) {
      return;
    }
    if (local) {
      const itIsStillThisDevice = changed.previousValue === uuid;
      // CASE 1: value changed from another to this
      if (itIsStillThisDevice) {
        return;
      }
      // TODO
      console.log(
        `CASE 1: This (${uuid}) is in focus from another (${changed.previousValue})`
      );
      dp.receivingFunction();
      return;
    } else {
      const itIsAnotherDeviceToAnotherDevice = changed.previousValue !== uuid;
      if (itIsAnotherDeviceToAnotherDevice) {
        return;
      }
      // CASE 2: value changed from this to another
      console.log(
        `CASE 2: value changed from this (${uuid}) to another (${attention.get(ATTENTION_KEY)})`
      );
      dp.sendingFunction();
      return; //TODO change this to have functionallity
    }
  });
};

const IsFocused = async (
  focus: MutableRefObject<boolean>,
  uuid: any,
  attention: SharedMap
) => {
  let docFocus = document.hasFocus();
  if (focus.current !== docFocus) {
    focus.current = docFocus;
    if (focus.current) {
      attention.set(ATTENTION_KEY, uuid);
    }
    console.log(`Focus changed to: ${focus.current}, with ${uuid}.`);
  }
};
