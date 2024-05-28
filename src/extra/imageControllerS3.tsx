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
  ) => void,
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
      setSelectedImage(await Body.transformToString());
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
