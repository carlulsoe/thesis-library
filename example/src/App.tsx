import React, { useState } from 'react';
import { Text } from 'react-native';
import { type Context, MultiDeviceAttention } from 'thesis-library';

export default function App() {
  // Run > `npx tinylicious` before normal start
  const [time, setTime] = useState('');

  const sender = (context: Context) => {
    context.set('time', Date.now().toString());
    setTime(context.get('time'));
  };

  const receiver = async (context: Context) => {
    await new Promise((f) => setTimeout(f, 50));
    setTime(context.get('time'));
  };

  return (
    <MultiDeviceAttention receivingFunction={receiver} sendingFunction={sender}>
      <Text>{time}</Text>
    </MultiDeviceAttention>
  );
}

/*const Time = () => {
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
};*/
