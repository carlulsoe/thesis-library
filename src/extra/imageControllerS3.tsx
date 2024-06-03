import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3';
import type { ConnectionContext } from 'thesis-library';
import type { Dispatch, SetStateAction } from 'react';

export function S3ImageSetup(
  ACCOUNT_ID: string,
  ACCESS_KEY_ID: string,
  SECRET_ACCESS_KEY: string,
  url: string,
  setUrl: Dispatch<SetStateAction<string>>
) {
  const config: S3ClientConfig = {
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  };
  return ImageController(url, setUrl, config);
}

function ImageController(
  selectedImage: string | undefined,
  setSelectedImage: Dispatch<SetStateAction<string>>,
  config: S3ClientConfig
) {
  const S3 = new S3Client(config);

  const fileKeyName = 'fileKey';

  async function receive(context: ConnectionContext) {
    let fileKey = context.get(fileKeyName);
    if (!fileKey) return;

    const input = {
      Bucket: 'thesis',
      Key: fileKey,
    };

    try {
      const { Body } = await S3.send(new GetObjectCommand(input));
      if (!Body) return;
      const s = await Body.transformToString();
      console.log(s);
      setSelectedImage(() => s);
    } catch (error) {
      console.error('Error receiving file:', error);
    }
  }

  async function sending(context: ConnectionContext) {
    if (!selectedImage) return;

    const key = 'dataURL.txt';
    const input = {
      Bucket: 'thesis',
      Key: key,
      Body: selectedImage,
    };

    try {
      await S3.send(new PutObjectCommand(input));
      context.set(fileKeyName, key);
      console.log('sending');
    } catch (error) {
      console.error('Error sending file:', error);
    }
  }

  return { receive, sending };
}
