import 'react-native-get-random-values';
import React, { useState } from 'react';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { SharedMap } from 'fluid-framework';
import { Text } from 'react-native';

export async function useAttention() {
  const [attention, _reactSetAttention] = React.useState();
  let SharedAttention = await GetSharedAttention();
  let setAttention = (
    value: `${string}-${string}-${string}-${string}-${string}`
  ) => SharedAttention.set('attention', value);
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
  //const uuid = self.crypto.randomUUID();
  setInterval(() => IsFocused(setFocused), 300);
  console.log(focused);
  if (focused) {
    return <Text>Focused</Text>;
  } else {
    return <Text>notFocused</Text>;
  }
}

export async function GetSharedAttention() {
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
