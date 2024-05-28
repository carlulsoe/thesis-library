import React, { useState } from 'react';
import { MarkdownTextInput } from '@expensify/react-native-live-markdown';
import type { MarkdownStyle } from '@expensify/react-native-live-markdown';
import {
  Canvas,
  type ConnectionContext,
  MultiDeviceAttention,
  ImageController,
} from 'thesis-library';
import type { S3ClientConfig } from '@aws-sdk/client-s3';

export default function App() {
  // Run > `npx tinylicious` before normal start
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const LOC = 'text';

  const ACCOUNT_ID = process.env.EXPO_PUBLIC_ACCOUNT_ID;
  const ACCESS_KEY_ID = process.env.EXPO_PUBLIC_ACCESS_KEY_ID;
  const SECRET_ACCESS_KEY = process.env.EXPO_PUBLIC_SECRET_ACCESS_KEY;

  if (
    ACCOUNT_ID === undefined ||
    ACCESS_KEY_ID === undefined ||
    SECRET_ACCESS_KEY === undefined
  ) {
    console.log('Could not load env variables.');
    return;
  }

  const config: S3ClientConfig = {
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  };

  const { receive } = ImageController(selectedImage, setSelectedImage, config);

  const sender = (context: ConnectionContext) => {
    console.log('send', text);
    context.set(LOC, text);
    //setText(context.get(LOC));
  };

  const receiver = (context: ConnectionContext) => {
    receive(context);
    console.log('reci', text);
    let newText = context.get(LOC);
    if (selectedImage) {
      if (selectedImage.startsWith('data:')) {
        let img = '![image](' + selectedImage + ')';
        newText += '\n' + img;
        setSelectedImage(undefined);
      }
    }
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
