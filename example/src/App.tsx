import React, { useState } from 'react';
import { MarkdownTextInput } from '@expensify/react-native-live-markdown';
import type { MarkdownStyle } from '@expensify/react-native-live-markdown';
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
      <MarkdownTextInput
        multiline
        onChangeText={setText}
        value={text}
        markdownStyle={markdownStyle}
      />
    </MultiDeviceAttention>
  );
}
const FONT_FAMILY_MONOSPACE = 'monospace';

const markdownStyle: MarkdownStyle = {
  syntax: {
    color: 'gray',
  },
  link: {
    color: 'blue',
  },
  h1: {
    fontSize: 25,
  },
  emoji: {
    fontSize: 20,
  },
  blockquote: {
    borderColor: 'gray',
    borderWidth: 6,
    marginLeft: 6,
    paddingLeft: 6,
  },
  code: {
    fontFamily: FONT_FAMILY_MONOSPACE,
    fontSize: 20,
    color: 'black',
    backgroundColor: 'lightgray',
  },
  pre: {
    fontFamily: FONT_FAMILY_MONOSPACE,
    fontSize: 20,
    color: 'black',
    backgroundColor: 'lightgray',
  },
  mentionHere: {
    color: 'green',
    backgroundColor: 'lime',
  },
  mentionUser: {
    color: 'blue',
    backgroundColor: 'cyan',
  },
};
