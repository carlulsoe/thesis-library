import { useRef, type MutableRefObject } from 'react';
import React, { useEffect, useState } from 'react';
import { SharedMap } from 'fluid-framework';
import { View } from 'react-native';
import { Connect } from 'thesis-library';

export function AddDetector() {
  return Connector();
}

const ATTENTION_KEY = 'attention';

const Connector = () => {
  const [fluidSharedObjects, setFluidSharedObjects] = useState(null);
  const initialObjects = { attention: SharedMap };
  const uuid = self.crypto.randomUUID();
  const focus = useRef(true);
  console.log(uuid);
  useEffect(() => {
    if (fluidSharedObjects) {
      //@ts-ignore
      const { attention } = fluidSharedObjects.initialObjects;
      Detector(uuid, attention, focus);
    }
  }, [uuid, fluidSharedObjects]);

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

const Detector = (uuid: any, attention: SharedMap, focus: any) => {
  setInterval(() => IsFocused(focus, uuid, attention), 300);
  attention.addListener('valueChanged', (changed, local) => {
    if (changed.key !== ATTENTION_KEY) {
      return;
    }
    if (local) {
      // CASE 1: value changed from another to this
      // TODO
      console.log('This is in focus');
      console.log(uuid);
      return;
    } else {
      const itIsAnotherDeviceToAnotherDevice = changed.previousValue !== uuid;
      if (itIsAnotherDeviceToAnotherDevice) {
        return;
      }
      // CASE 2: value changed from this to another
      console.log('CASE 2: value changed from this to another');
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
