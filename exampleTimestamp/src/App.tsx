import React, { useState } from 'react';
import { type ConnectionContext, MultiDeviceAttention } from 'thesis-library';
import { Text } from 'react-native';

export default function App() {
  // Run > `npx tinylicious` before normal start
  const [timestamp, setTimestamp] = useState('');
  const [nowTimestamp, setNowTimestamp] = useState('');
  const LOC = 'timestamp';

  const sender = (context: ConnectionContext) => {
    context.set(LOC, Date.now().toString());
  };

  const receiver = (context: ConnectionContext) => {
    setNowTimestamp(Date.now().toString());
    setTimestamp(context.get(LOC));
  };

  return (
    <MultiDeviceAttention receivingFunction={receiver} sendingFunction={sender}>
      <Text>{nowTimestamp}</Text>
      <Text>{timestamp}</Text>
      <Text>Diff: {parseInt(nowTimestamp, 10) - parseInt(timestamp, 10)}</Text>
    </MultiDeviceAttention>
  );
}
