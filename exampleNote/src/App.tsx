import React, { useCallback, useState } from 'react';
import { MarkdownTextInput } from '@expensify/react-native-live-markdown';
import type { MarkdownStyle } from '@expensify/react-native-live-markdown';
import {
  type ConnectionContext,
  MultiDeviceAttention,
  ImageController,
} from 'thesis-library';
import type { S3ClientConfig } from '@aws-sdk/client-s3';
import { Canvas, type IPath } from './canvasComponent';
import { objEq, uniqueMerge } from '../../src/extra/tools';

export default function App() {
  // Run > `npx tinylicious` before normal start
  const [text, setText] = useState('');
  const [paths, setPaths] = useState<IPath[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const textLoc = 'text';
  const pathLoc = 'paths';

  const ACCOUNT_ID = 'd725e78d7ab30f5b391a57797cb0eeb5';
  const ACCESS_KEY_ID = '4f24e7d59e6cb1538760ff4af0ec7a3b';
  const SECRET_ACCESS_KEY =
    '7a39a7292f4d74aedbbc48deebd834bf901e045cbe2e294deea6c51cb8bee66a';

  const mergePaths = useCallback(
    (Context: ConnectionContext) => {
      if (Context.sharedMap == null) return paths;
      const JSONPaths = Context.get(pathLoc);
      let remotePaths: IPath[] = JSONPaths ? JSON.parse(JSONPaths) : [];
      if (objEq(remotePaths, paths)) return paths;
      return uniqueMerge(remotePaths, paths);
    },
    [paths]
  );

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
    context.set(textLoc, text);
    context.set(pathLoc, JSON.stringify(paths));
    //setText(context.get(LOC));
  };

  const receiver = (context: ConnectionContext) => {
    receive(context);
    setPaths(mergePaths(context));
    setText(context.get(textLoc));
  };

  return (
    <MultiDeviceAttention receivingFunction={receiver} sendingFunction={sender}>
      <Canvas
        localPaths={paths}
        setLocalPaths={setPaths}
        imageUrl={selectedImage}
      />
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
