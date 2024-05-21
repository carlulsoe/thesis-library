import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3';
import type { ConnectionContext } from 'thesis-library';

export function ImageController(
  selectedImage: string | undefined,
  setSelectedImage: (
    value:
      | ((prevState: string | undefined) => string | undefined)
      | string
      | undefined
  ) => void
) {
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
      setSelectedImage(await Body.transformToString());
      console.log('received');
    } catch (error) {
      console.error('Error receiving file:', error);
    }
  }

  async function sending(context: ConnectionContext) {
    if (!selectedImage) return;

    const key = 'image.txt';
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
