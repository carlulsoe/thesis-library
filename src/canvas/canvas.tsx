import React, { useState } from 'react';
import { View, StyleSheet, type GestureResponderEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuTrigger,
  MenuOption,
} from 'react-native-popup-menu';

export const Canvas = () => {
  const [currentColor, setColor] = useState(Colors.Black);
  const [oldPaths, setOldPaths] = useState<IPath[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const addToPath = (s: string) => setCurrentPath(currentPath + s);
  const addCurrentToOldPaths = () =>
    setOldPaths([...oldPaths, { path: currentPath, color: currentColor }]);

  function handleStart(e: GestureResponderEvent) {
    let x = e.nativeEvent.touches[0]?.locationX;
    let y = e.nativeEvent.touches[0]?.locationY;
    addToPath(`M${x} ${y} `);
  }
  function handleMove(e: GestureResponderEvent) {
    let x = e.nativeEvent.touches[0]?.locationX;
    let y = e.nativeEvent.touches[0]?.locationY;
    addToPath(`L${x} ${y} `);
  }

  function handleEnd() {
    addCurrentToOldPaths();
    setCurrentPath('');
  }

  function clearCanvas() {
    setCurrentPath('');
    setOldPaths([]);
  }

  // @ts-ignore
  return (
    <MenuProvider>
      <View style={styles.outer}>
        <View
          style={styles.container}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          <Svg width={1000} height={1000}>
            {oldPaths.map((path) => (
              <Path
                key={path.path}
                d={path.path}
                stroke={path.color}
                fillOpacity={0}
              />
            ))}
            <Path d={currentPath} stroke={currentColor} fillOpacity={0} />
          </Svg>
        </View>
        <View>
          <Menu>
            <MenuTrigger text={'Options'} style={styles.button} />
            <MenuOptions customStyles={optionsStyles}>
              <MenuOption
                onSelect={() => console.log(currentPath)}
                text={'Print path to console'}
              />
              <MenuOption
                onSelect={() => clearCanvas()}
                text={'Clear canvas'}
              />
              <MenuOption
                onSelect={() => setColor(Colors.Red)}
                text={'Red stroke'}
              />
              <MenuOption
                onSelect={() => setColor(Colors.Green)}
                text={'Green stroke'}
              />
              <MenuOption
                onSelect={() => setColor(Colors.Blue)}
                text={'Blue stroke'}
              />
              <MenuOption
                onSelect={() => setColor(Colors.Black)}
                text={'Black stroke'}
              />
            </MenuOptions>
          </Menu>
        </View>
      </View>
    </MenuProvider>
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
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    textAlign: 'center',
  },
});

const optionsStyles = {
  optionsContainer: {
    padding: 5,
  },
  optionWrapper: {
    margin: 5,
  },
  optionTouchable: {
    activeOpacity: 70,
  },
};

enum Colors {
  Red = '#FF0000',
  Green = '#00FF00',
  Blue = '#0000FF',
  Black = '#000000',
}

interface IPath {
  color: string;
  path: string;
}
