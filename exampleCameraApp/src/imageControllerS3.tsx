import {
  GetObjectCommand,
  type GetObjectCommandInput,
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
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
  let S3: S3Client;
  if (
    ACCOUNT_ID === undefined ||
    ACCESS_KEY_ID === undefined ||
    SECRET_ACCESS_KEY === undefined
  ) {
    console.log('Could not load env variables.');
  } else {
    S3 = new S3Client({
      region: 'auto',
      endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com/`,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    });
  }

  const fileKeyName = 'fileKey';

  async function receive(context: ConnectionContext) {
    let fileKey = context.get(fileKeyName);
    if (fileKey === null) return;
    if (fileKey === undefined) return;
    if (fileKey === '') return;
    if (fileKey === 'null') return;
    const input: GetObjectCommandInput = {
      // GetObjectRequest
      Bucket: 'thesis', // required
      Key: fileKey, // required
    };
    const { Body } = await S3.send(new GetObjectCommand(input));
    // Convert image data to Base64 encoded string
    if (!Body) {
      return;
    }
    const imageBlob = new Blob([await Body.transformToByteArray()]);

    // Create FileReader to read Blob as Data URI
    const reader = new FileReader();

    // Define onload event for reader
    reader.onload = function (event) {
      // Get Data URI
      const dataURI = event.target?.result;
      if (typeof dataURI !== 'string') return;
      setSelectedImage(dataURI);
    };
    reader.readAsDataURL(imageBlob);
    console.log('received');
  }

  async function sending(context: ConnectionContext) {
    if (selectedImage === undefined) {
      return;
    }
    const key = 'map.jpg';
    const input: PutObjectCommandInput = {
      // GetObjectRequest
      Bucket: 'thesis', // required
      Key: key, // required
      Body: selectedImage,
    };
    await S3.send(new PutObjectCommand(input));
    context.set(fileKeyName, key);
    console.log('sending');
  }

  return { receive, sending };
}
