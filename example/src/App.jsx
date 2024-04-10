import 'react-native-get-random-values';
import React, { useContext } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Connect } from 'thesis-library';
import { Canvas } from '../../src';
import { ConnectionContext } from '../../src/connection/ConnectionContext';
import { useAutoUpdater } from '../../src/connection/useAutoUpdater';

function App() {
  // Run > `npx tinylicious` before normal start
  const initialMap = { time: null };

  return (
    <View className="App">
      <Connect containerSchema={initialMap}>
        {/*<Canvas />*/}
        <Time />
      </Connect>
    </View>
  );
}

const Time = () => {
  const [value, setValue] = useAutoUpdater('time');

  return (
    <View>
      <Button
        onPress={() => setValue(Date.now().toString())}
        title="Get time"
      />
      <Text>{value}</Text>
    </View>
  );
};

export default App;
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
