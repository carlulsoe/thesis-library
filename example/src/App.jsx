import 'react-native-get-random-values';
import React from 'react';
import { SharedMap } from 'fluid-framework';
import { View, StyleSheet } from 'react-native';
import { Connect } from 'thesis-library';
import { Canvas } from '../../src';

function App() {
  // Run > `npx tinylicious` before normal start
  const [fluidSharedObjects, setFluidSharedObjects] = React.useState(null);
  const [localTimestamp, setLocalTimestamp] = React.useState({});
  const [containerId, setContainerId] = React.useState('');
  const initialObjects = { sharedTimestamp: SharedMap };
  React.useEffect(() => {
    if (fluidSharedObjects) {
      // 4: Set the value of the localTimestamp state object that will appear in the UI.
      const { sharedTimestamp } = fluidSharedObjects.initialObjects;
      const updateLocalTimestamp = () =>
        setLocalTimestamp({ time: sharedTimestamp.get('time') });

      updateLocalTimestamp();

      // 5: Register handlers.
      sharedTimestamp.on('valueChanged', updateLocalTimestamp);

      // 6: Delete handler registration when the React App component is dismounted.
      return () => {
        sharedTimestamp.off('valueChanged', updateLocalTimestamp);
      };
    }
  }, [fluidSharedObjects]);

  function updateTime(val) {
    return fluidSharedObjects?.initialObjects.sharedTimestamp.set('time', val);
  }

  const sharedObject = () => {
    return fluidSharedObjects?.initialObjects.sharedTimestamp;
  };

  if (localTimestamp) {
    return (
      <View className="App">
        <Connect
          containerSchema={initialObjects}
          setObjects={setFluidSharedObjects}
          containerId={{ containerId, setContainerId }}
        />
        <Canvas
          localPaths={localTimestamp.time}
          sendToRemote={updateTime}
          sharedObject={sharedObject}
        />
        {/*<Button
          onPress={() => updateTime(Date.now().toString())}
          title="Get time"
        />
        <Text>{localTimestamp.time}</Text>*/}
      </View>
    );
  } else {
    return <View />;
  }
}

export default App;

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
