import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  type GestureResponderEvent,
  Button,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const Canvas = () => {
  const [path, setPath] = useState('');
  const addToPath = (s: string) => setPath(path + s);

  function handleStart(e: GestureResponderEvent) {
    //console.log(e.nativeEvent);
    let x = e.nativeEvent.touches[0]?.locationX;
    let y = e.nativeEvent.touches[0]?.locationY;
    addToPath(`M${x} ${y} `);
  }
  function handleMove(e: GestureResponderEvent) {
    let x = e.nativeEvent.touches[0]?.locationX;
    let y = e.nativeEvent.touches[0]?.locationY;
    addToPath(`L${x} ${y} `);
  }

  return (
    <View style={styles.outer}>
      <View
        style={styles.container}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
      >
        <Svg width={1000} height={1000}>
          <Path d={path} stroke={'red'} fillOpacity={0} />
        </Svg>
      </View>
      <View>
        <Button onPress={() => setPath('')} title={'Clear Canvas'} />
        <Button onPress={() => console.log(path)} title={'Print Path'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
});
