import React, { useState } from 'react';
import {
  type ConnectionContext,
  MultiDeviceAttention,
  S3ImageSetup,
} from 'thesis-library';
import { Text } from 'react-native';

export default function App() {
  // Run > `npx tinylicious` before normal start
  const [timestamp, setTimestamp] = useState('');
  const [nowTimestamp, setNowTimestamp] = useState('');
  const ACCOUNT_ID = 'd725e78d7ab30f5b391a57797cb0eeb5';
  const ACCESS_KEY_ID = '4f24e7d59e6cb1538760ff4af0ec7a3b';
  const SECRET_ACCESS_KEY =
    '7a39a7292f4d74aedbbc48deebd834bf901e045cbe2e294deea6c51cb8bee66a';
  if (!(ACCOUNT_ID && ACCESS_KEY_ID && SECRET_ACCESS_KEY))
    throw Error('Could not load environment variables');
  const { receive, sending } = S3ImageSetup(
    ACCOUNT_ID,
    ACCESS_KEY_ID,
    SECRET_ACCESS_KEY,
    timestamp,
    setTimestamp
  );

  const sender = (context: ConnectionContext) => {
    setTimestamp(() => Date.now().toString());
    sending(context);
    //context.set(LOC, Date.now().toString());
  };

  const receiver = (context: ConnectionContext) => {
    console.log(timestamp);
    receive(context);
    console.log(timestamp);
    setNowTimestamp(Date.now().toString());
    //setTimestamp(context.get(LOC));
  };

  return (
    <MultiDeviceAttention receivingFunction={receiver} sendingFunction={sender}>
      <Text>{nowTimestamp}</Text>
      <Text>{timestamp}</Text>
      <Text>Diff: {parseInt(nowTimestamp, 10) - parseInt(timestamp, 10)}</Text>
    </MultiDeviceAttention>
  );
}
