import React, { useState } from 'react';
import { MarkdownTextInput } from '@expensify/react-native-live-markdown';
import type { MarkdownStyle } from '@expensify/react-native-live-markdown';
import {
  type ConnectionContext,
  MultiDeviceAttention,
  S3FileSetup,
} from 'thesis-library';
import { Canvas, type IPath, mergePaths } from './canvasComponent';
import Preview from './Preview';
import { View } from 'react-native';

export default function App() {
  // Run > `npx tinylicious` before normal start
  const [text, setText] = useState('');
  const [paths, setPaths] = useState<IPath[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [displayImage, setDisplayImage] = useState(false);
  const includeToggle = () => setDisplayImage(!displayImage);
  const textLoc = 'text';
  const pathLoc = 'paths';
  const imageDisplayLoc = 'displayImage';

  const ACCOUNT_ID = 'd725e78d7ab30f5b391a57797cb0eeb5';
  const ACCESS_KEY_ID = '4f24e7d59e6cb1538760ff4af0ec7a3b';
  const SECRET_ACCESS_KEY =
    '7a39a7292f4d74aedbbc48deebd834bf901e045cbe2e294deea6c51cb8bee66a';
  if (!(ACCOUNT_ID && ACCESS_KEY_ID && SECRET_ACCESS_KEY))
    throw Error('Could not load environment variables');
  const { receiveImage } = S3FileSetup(
    ACCOUNT_ID,
    ACCESS_KEY_ID,
    SECRET_ACCESS_KEY,
    selectedImage,
    setSelectedImage
  );

  const sender = (context: ConnectionContext) => {
    context.set(textLoc, text);
    context.set(pathLoc, JSON.stringify(paths));
    context.set(imageDisplayLoc, displayImage);
    //setText(context.get(LOC));
  };

  const receiver = (context: ConnectionContext) => {
    receiveImage(context);
    setPaths(mergePaths(paths, pathLoc, context));
    setText(context.get(textLoc));
    setDisplayImage(context.get(imageDisplayLoc));
  };

  return (
    <MultiDeviceAttention receivingFunction={receiver} sendingFunction={sender}>
      {(paths.length !== 0 || displayImage) && (
        <View>
          <Canvas
            localPaths={paths}
            setLocalPaths={setPaths}
            imageUrl={selectedImage}
            includeImage={displayImage}
          />
          <Preview
            imageUrl={selectedImage}
            include={displayImage}
            includeToggle={includeToggle}
          />
        </View>
      )}
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
