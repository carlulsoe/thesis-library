import React, { useCallback, useContext, useState } from 'react';
import {
  type GestureResponderEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import { objEq, uniqueMerge } from '../extra/tools';
import { ConnectionContext } from '../connection/ConnectionContext';
import { useAutoUpdater } from '../connection/useAutoUpdater';

export const Canvas = () => {
  const { height, width } = useWindowDimensions();
  const [currentColor, setColor] = useState(Colors.Black);
  const [currentPath, setCurrentPath] = useState('');
  const [localPaths, setLocalPaths] = useState<IPath[]>([]);
  const [paths, setPaths] = useAutoUpdater('paths');
  const addToPath = (s: string) => setCurrentPath(currentPath + s);
  const addCurrentToOldPaths = () =>
    setLocalPaths([...localPaths, { path: currentPath, color: currentColor }]);
  const Context = useContext(ConnectionContext);

  function handleStart(e: GestureResponderEvent) {
    let x = e.nativeEvent.touches[0]?.pageX;
    let y = e.nativeEvent.touches[0]?.pageY;
    addToPath(`M${x} ${y} `);
  }

  function handleMove(e: GestureResponderEvent) {
    console.log('ah');
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

  const mergePaths = useCallback(() => {
    if (Context?.container == null) return;
    let remotePaths: IPath[] = paths ? JSON.parse(paths) : [];
    if (objEq(remotePaths, localPaths)) return;
    return uniqueMerge(remotePaths, localPaths);
  }, [Context?.container, localPaths, paths]);

  React.useEffect(() => {
    let allPaths = mergePaths();
    if (!allPaths) return;
    setLocalPaths(allPaths);
    setPaths(JSON.stringify(allPaths));
  }, [mergePaths, paths, setPaths]);

  // TODO: Error in height on canvas
  return (
    <MenuProvider>
      <View
        style={styles.container}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <Svg width={width} height={height}>
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
              text={'Clear components'}
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
            <MenuOption
              onSelect={() => setPaths(mergePaths())}
              text={'Update canvas'}
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

type IPath = {
  color: string;
  path: string;
};
