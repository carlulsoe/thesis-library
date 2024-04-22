import 'react-native-get-random-values';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { MultiDeviceAttention } from 'thesis-library';
import { useAutoUpdater } from 'thesis-library';

function App() {
  // Run > `npx tinylicious` before normal start

  return (
    <MultiDeviceAttention>
      <Time />
    </MultiDeviceAttention>
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
