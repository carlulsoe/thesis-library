import {
  type GestureResponderEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import React, { type Dispatch, useState } from 'react';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import Svg, { Image, Path } from 'react-native-svg';

interface CanvasProps {
  localPaths: IPath[];
  setLocalPaths: Dispatch<React.SetStateAction<any>>;
  imageUrl?: string;
}

export const Canvas = ({
  localPaths,
  setLocalPaths,
  imageUrl,
}: CanvasProps) => {
  const { height, width } = useWindowDimensions();
  const [currentColor, setColor] = useState(Colors.Black);
  const [currentPath, setCurrentPath] = useState('');
  const addToPath = (s: string) => setCurrentPath(currentPath + s);
  const addCurrentToOldPaths = () =>
    setLocalPaths([...localPaths, { path: currentPath, color: currentColor }]);

  function handleStart(e: GestureResponderEvent) {
    let x = e.nativeEvent.touches[0]?.pageX;
    let y = e.nativeEvent.touches[0]?.pageY;
    addToPath(`M${x} ${y} `);
  }

  function handleMove(e: GestureResponderEvent) {
    let x = e.nativeEvent.touches[0]?.pageX;
    let y = e.nativeEvent.touches[0]?.pageY;
    addToPath(`L${x} ${y} `);
  }

  function handleEnd() {
    addCurrentToOldPaths();
    setCurrentPath('');
  }

  function clearCanvas() {
    setCurrentPath('');
    setLocalPaths([]);
  }

  /* ts-ignore */
  return (
    <MenuProvider>
      <View
        style={styles.container}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <Svg width={width} height={height * (7.4 / 9)}>
          <Image width="400" height="400" href={imageUrl} />
          {localPaths.map((path) => (
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
              text={'Clear canvas  '}
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
    </MenuProvider>
  );
};
const styles = StyleSheet.create({
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

export type IPath = {
  color: string;
  path: string;
};
