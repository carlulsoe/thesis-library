import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { MultiDeviceAttention, S3ImageSetup } from 'thesis-library';

export default function PhotoApp() {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const ACCOUNT_ID = 'd725e78d7ab30f5b391a57797cb0eeb5';
  const ACCESS_KEY_ID = '4f24e7d59e6cb1538760ff4af0ec7a3b';
  const SECRET_ACCESS_KEY =
    '7a39a7292f4d74aedbbc48deebd834bf901e045cbe2e294deea6c51cb8bee66a';
  if (!(ACCOUNT_ID && ACCESS_KEY_ID && SECRET_ACCESS_KEY))
    throw Error('Could not load environment variables');
  const { receive, sending } = S3ImageSetup(
    ACCOUNT_ID,
    ACCESS_KEY_ID,
    SECRET_ACCESS_KEY,
    selectedImage,
    setSelectedImage
  );

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

  return (
    <View style={styles.container}>
      <MultiDeviceAttention
        receivingFunction={receive}
        sendingFunction={sending}
        fileTransferringMethod={'S3'}
      >
        <Text style={styles.title}>Simple Photo App</Text>
        <Button title="Pick a Photo" onPress={pickImage} />
        {selectedImage && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.image}
              alt="Picked Image"
            />
            <Button
              title="Remove selected Photo"
              onPress={() => setSelectedImage('')}
            />
          </View>
        )}
      </MultiDeviceAttention>
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
