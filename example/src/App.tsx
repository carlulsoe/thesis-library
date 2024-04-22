import React, { useState } from 'react';
import { Text } from 'react-native';
import { type ConnectionContext, MultiDeviceAttention } from 'thesis-library';

export default function App() {
  // Run > `npx tinylicious` before normal start
  const [time, setTime] = useState('');

  const sender = (context: ConnectionContext) => {
    context.set('time', Date.now().toString());
    setTime(context.get('time'));
  };

  const receiver = async (context: ConnectionContext) => {
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
