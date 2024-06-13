import 'react-native-get-random-values';
import React, { useState } from 'react';
import {
  type ConnectionContext,
  MultiDeviceAttention,
  S3FileSetup,
} from 'thesis-library';
import { Canvas, type IPath, mergePaths } from './canvasComponent';
import Preview from './Preview';

export default function App() {
  const [localPaths, setLocalPaths] = React.useState<IPath[]>([]);
  const [imageUrl, setImageUrl] = React.useState<any>();
  const [displayImage, setDisplayImage] = useState(false);
  const includeToggle = () => setDisplayImage(!displayImage);
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
    imageUrl,
    setImageUrl
  );

  const receiver = (Context: ConnectionContext) => {
    setLocalPaths(mergePaths(localPaths, pathLoc, Context));
    setDisplayImage(Context.get(imageDisplayLoc));
    receiveImage(Context);
  };

  const sender = (Context: ConnectionContext) => {
    Context.set(pathLoc, JSON.stringify(localPaths));
    Context.set(imageDisplayLoc, displayImage);
  };

  return (
    <MultiDeviceAttention receivingFunction={receiver} sendingFunction={sender}>
      <Canvas
        localPaths={localPaths}
        setLocalPaths={setLocalPaths}
        imageUrl={imageUrl}
        includeImage={displayImage}
      />
      <Preview
        imageUrl={imageUrl}
        include={displayImage}
        includeToggle={includeToggle}
      />
    </MultiDeviceAttention>
  );
}
