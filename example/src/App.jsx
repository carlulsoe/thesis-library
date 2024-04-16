import 'react-native-get-random-values';
import React from 'react';
import { View, Button, Text } from 'react-native';
import { Connect } from 'thesis-library';
import { Canvas } from '../../src';
import { useAutoUpdater } from '../../src/connection/useAutoUpdater';

function App() {
  // Run > `npx tinylicious` before normal start
  const initialMap = { time: null };

  return (
    <View className="App">
      <Connect containerSchema={initialMap}>
        <Time />
        <Canvas />
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
