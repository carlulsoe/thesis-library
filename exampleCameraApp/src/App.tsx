import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { AddDetector } from 'thesis-library';
import {
  S3Client,
  GetObjectCommand,
  type GetObjectCommandInput,
  type PutObjectCommandInput,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

export default function PhotoApp() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        //alert('Permission to access media library is required!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (result == null) {
        console.log('Result is null');
        return;
      }
      console.log(result);
      if (!result.canceled) {
        console.log('Set picked photo as source');
        const uri = result.assets[0] && result.assets[0].uri;
        if (uri == null) {
          console.log('Uri is null');
          return;
        }
        console.log(uri);
        // Handle Android file URI format
        setSelectedImage(uri);
      }
    } catch (error) {
      console.error('Error picking an image', error);
    }
  };
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

  async function receive() {
    const input: GetObjectCommandInput = {
      // GetObjectRequest
      Bucket: 'thesis', // required
      Key: 'map.jpg', // required
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
      setSelectedImage(dataURI);
    };
    reader.readAsDataURL(imageBlob);
    console.log('received');
  }

  async function sending() {
    if (selectedImage === undefined) {
      return;
    }
    const input: PutObjectCommandInput = {
      // GetObjectRequest
      Bucket: 'thesis', // required
      Key: 'test.jpg', // required
      Body: selectedImage,
    };
    await S3.send(new PutObjectCommand(input));

    console.log('sending');
  }

  return (
    <View style={styles.container}>
      <AddDetector receivingFunction={receive} sendingFunction={sending}>
        <Text style={styles.title}>Simple Photo App</Text>
        <Button title="Pick a Photo" onPress={pickImage} />
        {selectedImage && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.image}
              alt="Picked Image"
            />
          </View>
        )}
      </AddDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  imageContainer: {
    marginVertical: 20,
    width: '80%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
  },
});
