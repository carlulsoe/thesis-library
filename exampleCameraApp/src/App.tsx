import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { AddDetector } from 'thesis-library';

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

  return (
    <View style={styles.container}>
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
      <AddDetector />
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
