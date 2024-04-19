import React, { type PropsWithChildren } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { type IFluidContainer, SharedMap } from 'fluid-framework';
import Clipboard from '@react-native-clipboard/clipboard';
import { ConnectionContext, type ConnectProps } from '../extra';

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
        sharedMap: container?.initialObjects.sharedMap,
      }}
    >
      {props.children}
      <View style={sheet.container}>
        <Button
          onPress={() => Clipboard.setString(containerId)}
          title="Copy ID"
        />
        <TextInput
          onChange={(e) => setContainerId(e.nativeEvent.text || '')}
          defaultValue={containerId}
          placeholder="Insert ID here"
          style={sheet.input}
        />
        <Button
          onPress={ConnectEitherOr}
          title="Create or connect to given ID"
        />
      </View>
    </ConnectionContext.Provider>
  );
};

const sheet = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  input: {
    flexGrow: 2,
    marginLeft: 5,
  },
});
