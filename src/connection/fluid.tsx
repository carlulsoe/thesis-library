import React, { type PropsWithChildren, useState } from 'react';
import { Button, StyleSheet, TextInput, View, Text } from 'react-native';
import {
  TinyliciousClient,
  type TinyliciousClientProps,
} from '@fluidframework/tinylicious-client';
import { type IFluidContainer, SharedMap } from 'fluid-framework';
import Clipboard from '@react-native-clipboard/clipboard';
import { OptionalConnectionContext, type ConnectProps } from '../extra';

export const Connect = (props: PropsWithChildren<ConnectProps>) => {
  const initialObjects = {
    initialObjects: { sharedMap: SharedMap },
  };

  const [containerId, setContainerId] = React.useState('');
  const [container, setContainer] = React.useState<IFluidContainer | null>(
    null
  );
  let [multiuserComponent, setMultiuserComponent] = useState<React.JSX.Element>(
    <></>
  );

  let clientProps: TinyliciousClientProps;
  if (process.env.EXPO_PUBLIC_TINYLICIOUS_DOMAIN) {
    clientProps = {
      connection: {
        domain: process.env.EXPO_PUBLIC_TINYLICIOUS_DOMAIN,
        port: 443,
      },
    };
  } else {
    clientProps = {
      connection: {},
    };
  }

  async function ConnectToContainer(containerIdString: string) {
    const client = new TinyliciousClient(clientProps);
    setContainer(
      (await client.getContainer(containerIdString, initialObjects)).container
    );
  }

  async function CreateContainer() {
    const client = new TinyliciousClient(clientProps);
    let tmpContainer = (await client.createContainer(initialObjects)).container;
    setContainerId(await tmpContainer.attach());
    setContainer(tmpContainer);
    if (!props.multiuser) {
      setMultiuserComponent(
        <View>
          <Text />
          <Connect multiuser={true} />
        </View>
      );
    }
  }

  const ConnectEitherOr = async () => {
    await (containerId ? ConnectToContainer(containerId) : CreateContainer());
  };

  React.useEffect(() => {
    props.containerId?.setContainerId(containerId);
  });

  const dictSetter = (key: string, val: string) => {
    if (!container) throw new Error('Container not defined');
    (container.initialObjects.sharedMap as SharedMap).set(key, val);
  };

  const dictGetter = (key: string) => {
    if (!container) return '';
    return (container.initialObjects.sharedMap as SharedMap).get(key);
  };

  return (
    <View>
      <OptionalConnectionContext.Provider
        value={{
          set: dictSetter,
          get: dictGetter,
          sharedMap: container?.initialObjects.sharedMap as SharedMap,
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
      </OptionalConnectionContext.Provider>
      {multiuserComponent}
    </View>
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
