import 'react-native-get-random-values';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Connect } from 'thesis-library';
import { Canvas } from '../../src';

function App() {
  // Run > `npx tinylicious` before normal start
  const initialMap = { time: null };

  return (
    <View className="App">
      <Connect containerSchema={initialMap}>
        <Canvas />
      </Connect>
      {/*<Button
        onPress={() => updateTime(Date.now().toString())}
        title="Get time"
      />
      <Text>{localTimestamp.time}</Text>*/}
    </View>
  );
}

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
