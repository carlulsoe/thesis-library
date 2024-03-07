import 'react-native-get-random-values';
import React from 'react';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { SharedMap } from 'fluid-framework';
import {
  Button,
  View,
  Text,
  TextInput,
  type NativeSyntheticEvent,
  type TextInputChangeEventData,
} from 'react-native';

var attention_id = '';
/**
 * Set the current attention
 *
 * @param id sets the attention to be the provided id
 */
export function setAttention(id: string) {
  attention_id = id;
}

/**
 * Get the current attention
 *
 * @return A Promise of the current device id that has attention
 */
export function attention(): Promise<string> {
  return Promise.resolve(attention_id);
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
