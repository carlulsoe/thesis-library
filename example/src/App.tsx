import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { type ConnectionContext, MultiDeviceAttention } from 'thesis-library';

export default function App() {
  // Run > `npx tinylicious` before normal start
  const [text, setText] = useState('');
  const LOC = 'text';

  const sender = (context: ConnectionContext) => {
    context.set(LOC, text);
    //setText(context.get(LOC));
  };

  const receiver = (context: ConnectionContext) => {
    const newText = context.get(LOC);
    setText(newText);
  };

  return (
    <MultiDeviceAttention receivingFunction={receiver} sendingFunction={sender}>
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
