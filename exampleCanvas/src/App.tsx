import 'react-native-get-random-values';
import React, { useCallback } from 'react';
import {
  type ConnectionContext,
  ImageController,
  MultiDeviceAttention,
} from 'thesis-library';
import { objEq, uniqueMerge } from '../../src/extra/tools';
import type { S3ClientConfig } from '@aws-sdk/client-s3';
import { Canvas, type IPath } from './canvasComponent';

export default function App() {
  const [localPaths, setLocalPaths] = React.useState<IPath[]>([]);
  const [imageUrl, setImageUrl] = React.useState<any>();
  const mergePaths = useCallback(
    (Context: ConnectionContext) => {
      if (Context.sharedMap == null) return localPaths;
      let remotePaths: IPath[] = Context.get(LOC)
        ? JSON.parse(Context.get(LOC))
        : [];
      if (objEq(remotePaths, localPaths)) return localPaths;
      return uniqueMerge(remotePaths, localPaths);
    },
    [localPaths]
  );
  const LOC = 'paths';
  const ACCOUNT_ID = 'd725e78d7ab30f5b391a57797cb0eeb5';
  const ACCESS_KEY_ID = '4f24e7d59e6cb1538760ff4af0ec7a3b';
  const SECRET_ACCESS_KEY =
    '7a39a7292f4d74aedbbc48deebd834bf901e045cbe2e294deea6c51cb8bee66a';

  const config: S3ClientConfig = {
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  };
  const { receive } = ImageController(imageUrl, setImageUrl, config);

  const receiver = (Context: ConnectionContext) => {
    setLocalPaths(mergePaths(Context));
    receive(Context);
  };

  const sender = (Context: ConnectionContext) => {
    Context.set(LOC, JSON.stringify(localPaths));
  };

  return (
    <MultiDeviceAttention receivingFunction={receiver} sendingFunction={sender}>
      <Canvas
        localPaths={localPaths}
        setLocalPaths={setLocalPaths}
        imageUrl={imageUrl}
      />
    </MultiDeviceAttention>
  );
}