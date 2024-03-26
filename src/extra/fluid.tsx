import React from 'react';
import {
  Button,
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputChangeEventData,
  type NativeSyntheticEvent,
} from 'react-native';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import type { ConnectedComponentType } from '../components/Component';

interface ConnectProps {
  containerSchema: any;
  setObjects: Function;
  objects: ConnectedComponentType;
}

export const Connect = (props: ConnectProps) => {
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

  function updateId(e: NativeSyntheticEvent<TextInputChangeEventData>) {
    //console.log(e.nativeEvent.text);
    setContainerId(e.nativeEvent.text || '');
  }

  return (
    <View>
      <TextInput onChange={(e) => updateId(e)} placeholder="Insert ID here" />
      <Button onPress={ConnectEitherOr} title="Connect" />
      <Text style={styles.container}>{containerId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
