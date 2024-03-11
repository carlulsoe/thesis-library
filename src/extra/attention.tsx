import 'react-native-get-random-values';
import React, { useState } from 'react';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { SharedMap } from 'fluid-framework';
//import {useSyncedString} from '@fluidframework/react';

import {
  Button,
  View,
  Text,
  TextInput,
  type NativeSyntheticEvent,
  type TextInputChangeEventData,
} from 'react-native';

export async function useAttention() {
  const [attention, _reactSetAttention] = React.useState();
  let setAttention = await GetSharedAttention();

  return [attention, setAttention];
}

function IsFocused(setFocused: {
  (value: React.SetStateAction<boolean>): void;
  (arg0: boolean): void;
}) {
  const focus = document.hasFocus();
  setFocused(focus);
}

export function HandleFocus() {
  const [focused, setFocused] = useState(false);
  const uuid = self.crypto.randomUUID();
  setInterval(() => IsFocused(setFocused), 300);
  console.log(focused);
  if (focused) {
    return <Text>Focused</Text>;
  } else {
    return <Text>notFocused</Text>;
  }
}

async function GetSharedAttention() {
  const [containerId, setContainerId] = React.useState<string>();
  let container = await ConnectToClient(new TinyliciousClient(), containerId);
  let id = await container.attach();
  setContainerId(id);

  let initialObject = container.initialObjects;
  return initialObject.attention;
}

async function ConnectToClient(
  client: TinyliciousClient,
  containerId: string | undefined
) {
  // 1: Configure the container.
  const containerSchema = {
    initialObjects: {
      attention: SharedMap,
    },
  };
  let container;

  // 2: Get the container from the Fluid service.
  console.log(containerId);
  if (containerId) {
    // TODO check a db here
    ({ container } = await client.getContainer(containerId, containerSchema));
  } else {
    ({ container } = await client.createContainer(containerSchema));
  }
  return container;
}

export function ShareTimeStamp() {
  const [fluidSharedObjects, setFluidSharedObjects] =
    React.useState<SharedMap>();
  const [localTimestamp, setLocalTimestamp] = React.useState({ time: 'Now' });
  const [containerId, setContainerId] = React.useState<string>();

  const Connect = async () => {
    // 1: Configure the container.
    const client = new TinyliciousClient();
    const containerSchema = {
      initialObjects: { sharedTimestamp: SharedMap },
    };
    let container;

    // 2: Get the container from the Fluid service.
    console.log(containerId);
    if (containerId) {
      ({ container } = await client.getContainer(containerId, containerSchema));
    } else {
      ({ container } = await client.createContainer(containerSchema));
      let id = await container.attach();
      setContainerId(id);
    }
    let initialObject = container.initialObjects;
    // 3: Set the Fluid timestamp object.
    setFluidSharedObjects(initialObject.sharedTimestamp);
  };
  //@ts-ignore
  React.useEffect(() => {
    console.log(fluidSharedObjects);
    console.log(containerId);
    if (fluidSharedObjects) {
      // 4: Set the value of the localTimestamp state object that will appear in the UI.
      const sharedTimestamp = fluidSharedObjects;
      const updateLocalTimestamp = () =>
        setLocalTimestamp({ time: sharedTimestamp.get('time') || '' });

      updateLocalTimestamp();

      // 5: Register handlers.
      sharedTimestamp.on('valueChanged', updateLocalTimestamp);

      // 6: Delete handler registration when the React App component is dismounted.
      return () => {
        sharedTimestamp.off('valueChanged', updateLocalTimestamp);
      };
    }
  }, [fluidSharedObjects, containerId]);

  const HandleTextInputChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    let target = e.target;
    // @ts-ignore
    let value = target.value;
    return value;
  };

  if (localTimestamp) {
    return (
      <View>
        <Text>
          {'\n'}
          {'\n'}
          {'\n'}
        </Text>
        <TextInput
          onChange={(e) => setContainerId(HandleTextInputChange(e))}
          placeholder="Insert ID here"
        />
        <Button onPress={Connect} title="Connect" />
        <Text>Session ID: {containerId}</Text>
        <Button
          onPress={() =>
            fluidSharedObjects &&
            fluidSharedObjects.set('time', Date.now().toString())
          }
          title="Get Time"
        />
        <Text>{localTimestamp.time}</Text>
      </View>
    );
  } else {
    return <div />;
  }
}

/*
function cdShortCutsFlow() {
  if (attention changes to not this device) {
      send marked stuff to buffer
  }
  if (attention changes to this device) {
    read buffer && (check that buffer has changed || clear buffer after insert)
  }
}
*/
