import React, { type PropsWithChildren } from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { type IFluidContainer, SharedMap } from 'fluid-framework';
import { ConnectionContext } from './ConnectionContext';

interface ConnectProps {
  containerSchema: any;
  containerId?: { containerId: ''; setContainerId: Function };
}
export const Connect = (props: PropsWithChildren<ConnectProps>) => {
  const initialObjects = {
    initialObjects: { sharedMap: SharedMap },
  };

  const [containerId, setContainerId] = React.useState('');
  const [container, setContainer] = React.useState<IFluidContainer | null>(
    null
  );

  async function ConnectToContainer(containerIdString: string) {
    const client = new TinyliciousClient();
    setContainer(
      (await client.getContainer(containerIdString, initialObjects)).container
    );
  }

  async function CreateContainer() {
    const client = new TinyliciousClient();
    let tmpContainer = (await client.createContainer(initialObjects)).container;
    setContainerId(await tmpContainer.attach());
    setContainer(tmpContainer);
  }

  const ConnectEitherOr = async () => {
    await (containerId ? ConnectToContainer(containerId) : CreateContainer());
  };

  React.useEffect(() => {
    props.containerId?.setContainerId(containerId);
  });

  const dictSetter = (key: string, val: string) => {
    if (!container)
      throw new Error("Can't set when container has not been defined");
    container.initialObjects.sharedMap.set(key, val);
  };

  const dictGetter = (key: string) => {
    if (!container) return '';
    return container.initialObjects.sharedMap.get(key);
  };

  return (
    <ConnectionContext.Provider
      value={{
        set: dictSetter,
        get: dictGetter,
        container: container,
      }}
    >
      <TextInput
        onChange={(e) => setContainerId(e.nativeEvent.text || '')}
        defaultValue={containerId}
        placeholder="Insert ID here"
      />
      <Button onPress={ConnectEitherOr} title="Create or connect to given ID" />
      {props.children}
    </ConnectionContext.Provider>
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
