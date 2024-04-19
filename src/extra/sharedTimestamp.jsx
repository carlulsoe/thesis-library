import 'react-native-get-random-values';
import React from 'react';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { SharedMap } from 'fluid-framework';
import { Button, View, Text, TextInput } from 'react-native';

export function SharedTimestamp() {
  // Run > `npx tinylicious` before normal start
  const [fluidSharedObjects, setFluidSharedObjects] = React.useState(null);
  const [localTimestamp, setLocalTimestamp] = React.useState('Now');
  const [containerId, setContainerId] = React.useState();

  const Connect = async () => {
    // 1: Configure the container.
    const client = new TinyliciousClient();
    const containerSchema = {
      initialObjects: { sharedTimestamp: SharedMap },
    };
    let container;

    // 2: Get the container from the Fluid service.
    if (containerId) {
      ({ container } = await client.getContainer(containerId, containerSchema));
    } else {
      ({ container } = await client.createContainer(containerSchema));
      let id = await container.attach();
      setContainerId(id);
    }

    // 3: Set the Fluid timestamp object.
    setFluidSharedObjects(container.initialObjects);
  };

  React.useEffect(() => {
    console.log(containerId);
    if (!fluidSharedObjects) return;
    // 4: Set the value of the localTimestamp state object that will appear in the UI.
    const { sharedTimestamp } = fluidSharedObjects;
    const updateLocalTimestamp = () =>
      setLocalTimestamp({ time: sharedTimestamp.get('time') });

    updateLocalTimestamp();

    // 5: Register handlers.
    sharedTimestamp.on('valueChanged', updateLocalTimestamp);

    // 6: Delete handler registration when the React App component is dismounted.
    return () => {
      sharedTimestamp.off('valueChanged', updateLocalTimestamp);
    };
  }, [fluidSharedObjects, containerId]);

  if (localTimestamp) {
    return (
      <View className="App">
        <TextInput onChange={(e) => setContainerId(e.target.value || '')} />
        <Button onPress={Connect} title="Connect" />

        <Button
          onPress={() =>
            fluidSharedObjects.sharedTimestamp.set(
              'time',
              Date.now().toString()
            )
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
