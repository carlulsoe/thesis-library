import 'react-native-get-random-values';
import React from 'react';
import { SharedMap } from 'fluid-framework';
import { Button, View, Text, StyleSheet } from 'react-native';
import { Connect } from 'thesis-library';

function App() {
  // Run > `npx tinylicious` before normal start
  const [fluidSharedObjects, setFluidSharedObjects] = React.useState(null);
  const [localTimestamp, setLocalTimestamp] = React.useState('Now');
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

  if (localTimestamp) {
    return (
      <View className="App">
        <Text>
          {'\n'}
          {'\n'}
          {'\n'}
        </Text>
        <Connect
          containerSchema={initialObjects}
          setObjects={setFluidSharedObjects}
        />
        <Button
          onPress={() =>
            fluidSharedObjects.initialObjects.sharedTimestamp.set(
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
