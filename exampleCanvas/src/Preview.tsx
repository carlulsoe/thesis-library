import React from 'react';
import { View, Image, StyleSheet, Button } from 'react-native';

interface PreviewProps {
  imageUrl: string;
  include: boolean;
  includeToggle: () => void;
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
  container: {
    position: 'absolute',
    overflow: 'hidden',
    left: innerWidth - 100,
    width: 100,
  },
});

export default function Preview({
  imageUrl,
  includeToggle,
  include,
}: PreviewProps) {
  return (
    <View style={styles.container}>
      {imageUrl && (
        <>
          <Image style={styles.image} source={{ uri: imageUrl }} />
          <Button
            title={!include ? 'Include' : 'Remove'}
            onPress={includeToggle}
          />
        </>
      )}
    </View>
  );
}
