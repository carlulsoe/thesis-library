import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { MultiDeviceAttention } from 'thesis-library';
import { ImageController } from './imageController';

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
  const { receive, sending } = ImageController(setSelectedImage, selectedImage);

  return (
    <View style={styles.container}>
      <MultiDeviceAttention
        receivingFunction={receive}
        sendingFunction={sending}
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
