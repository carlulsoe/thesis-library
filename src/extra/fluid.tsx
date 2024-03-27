import React from 'react';
import { Button, View, TextInput, StyleSheet } from 'react-native';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';

interface ConnectProps {
  containerSchema: any;
  setObjects: Function;
  containerId?: { containerId: ''; setContainerId: Function };
}

export const Connect = (props: ConnectProps) => {
  //const initialObjects = { sharedTimestamp: SharedTree };
  const initialObjects = {
    initialObjects: props.containerSchema,
  };
  const [containerId, setContainerId] = React.useState('');

  async function ConnectToContainer(containerIdString: string) {
    let container;
    const client = new TinyliciousClient();
    ({ container } = await client.getContainer(
      containerIdString,
      initialObjects
    ));
    return container;
  }

  async function CreateContainer() {
    let container;
    const client = new TinyliciousClient();
    ({ container } = await client.createContainer(initialObjects));
    let id = await container.attach();
    setContainerId(id);
    return container;
  }

  const ConnectEitherOr = async () => {
    let container;
    if (containerId) {
      container = await ConnectToContainer(containerId);
    } else {
      container = await CreateContainer();
    }
    props.setObjects(container);
  };

  React.useEffect(() => {
    props.containerId?.setContainerId(containerId);
  });

  return (
    <View>
      <TextInput
        onChange={(e) => setContainerId(e.nativeEvent.text || '')}
        defaultValue={containerId}
        placeholder="Insert ID here"
      />
      <Button onPress={ConnectEitherOr} title="Create or connect to given ID" />
    </View>
  );
};
StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  imageContainer: {
    marginVertical: 20,
    width: '80%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
  },
});
