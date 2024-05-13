import React, { useState } from 'react';
import { TextInput } from 'react-native';
import {
  Canvas,
  type ConnectionContext,
  MultiDeviceAttention,
} from 'thesis-library';

export default function App() {
  // Run > `npx tinylicious` before normal start
  const [text, setText] = useState('');
  const LOC = 'text';

  const sender = (context: ConnectionContext) => {
    console.log('send', text);
    context.set(LOC, text);
    //setText(context.get(LOC));
  };

  const receiver = (context: ConnectionContext) => {
    console.log('reci', text);
    const newText = context.get(LOC);
    setText(newText);
  };

  return (
    <MultiDeviceAttention receivingFunction={receiver} sendingFunction={sender}>
      <Canvas variable={'canvas'} />
      <TextInput
        multiline
        numberOfLines={4}
        maxLength={40}
        onChangeText={(t) => {
          setText(t);
        }}
        value={text}
      />
    </MultiDeviceAttention>
  );
}
