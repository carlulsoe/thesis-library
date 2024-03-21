import 'react-native-get-random-values';
import React from 'react';
import { SharedMap } from 'fluid-framework';
import { View, StyleSheet } from 'react-native';
import { Connect, Canvas } from 'thesis-library';

function App() {
  // Run > `npx tinylicious` before normal start
  const [fluidSharedObjects, setFluidSharedObjects] = React.useState(null);
  const [localTimestamp, setLocalTimestamp] = React.useState('Now');
  const initialObjects = { sharedTimestamp: SharedMap };
  React.useEffect(() => {
    if (fluidSharedObjects) {
      const { sharedTimestamp } = fluidSharedObjects.initialObjects;
      const updateLocalTimestamp = () =>
        setLocalTimestamp({ time: sharedTimestamp.get('time') });

      updateLocalTimestamp();

      sharedTimestamp.on('valueChanged', updateLocalTimestamp);

      return () => {
        sharedTimestamp.off('valueChanged', updateLocalTimestamp);
      };
    }
  }, [fluidSharedObjects]);

  if (localTimestamp) {
    return (
      <View className="App">
        <Connect containerSchema={initialObjects} object={Canvas} />
      </View>
    );
  } else {
    return <div />;
  }
}

export default App;

/*

        <button
          onClick={() =>
            fluidSharedObjects.sharedTimestamp.set(
              'time',
              Date.now().toString()
            )
          }
          title={'hi'}
        >
          Get Time
        </button>
        <span>{localTimestamp.time}</span>
 */
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
