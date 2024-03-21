import { useRef, type MutableRefObject } from 'react';
import React from 'react';
import { ConnectToClient, GetSharedAttention } from './attention';
import type { SharedMap } from 'fluid-framework';
import {
  View,
  Text,
  TextInput,
  Button,
  type NativeSyntheticEvent,
  type TextInputChangeEventData,
} from 'react-native';
import TinyliciousClient from '@fluidframework/tinylicious-client';

export function AddDetector() {
  return Connector();
}

const ATTENTION_KEY = 'attention';

const Connector = () => {
  const [containerId, setContainerId] = React.useState<string>();
  let client = new TinyliciousClient();
  const uuid = self.crypto.randomUUID();
  console.log(uuid);

  getAttention([containerId, setContainerId], uuid, client);
  return (
    <View>
      <TextInput
        onChange={(e) => setContainerId(HandleTextInputChange(e))}
        placeholder="Insert ID here"
      />
      <Button
        onPress={() => ConnectToClient(client, containerId)}
        title="Connect"
      />
      <Text>Session ID: {containerId}</Text>
    </View>
  );
};

const getAttention = (
  state: (
    | string
    | React.Dispatch<React.SetStateAction<string | undefined>>
    | undefined
  )[],
  uuid: string,
  client: TinyliciousClient
) => {
  GetSharedAttention(state, client).then(
    (attention) => {
      Detector(uuid, attention).then().catch();
    },
    (e) => {
      console.log(e);
    }
  );
};

const Detector = async (uuid: any, attention: SharedMap) => {
  const focus = useRef(true);
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

const HandleTextInputChange = (
  e: NativeSyntheticEvent<TextInputChangeEventData>
) => {
  let target = e.target;
  // @ts-ignore
  let value = target.value;
  return value;
};
