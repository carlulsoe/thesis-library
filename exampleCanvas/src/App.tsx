import 'react-native-get-random-values';
import React, { type Dispatch, useCallback, useState } from 'react';
import {
  type ConnectionContext,
  ImageController,
  MultiDeviceAttention,
} from '../../src';
import { objEq, uniqueMerge } from '../../src/extra/tools';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import Svg, { Path, Image } from 'react-native-svg';
import type { S3ClientConfig } from '@aws-sdk/client-s3';

export default function App() {
  const [localPaths, setLocalPaths] = React.useState<IPath[]>([]);
  const [imageUrl, setImageUrl] = React.useState<any>();
  const mergePaths = useCallback(
    (Context: ConnectionContext) => {
      if (Context.sharedMap == null) return localPaths;
      let remotePaths: IPath[] = Context.get(LOC)
        ? JSON.parse(Context.get(LOC))
        : [];
      if (objEq(remotePaths, localPaths)) return localPaths;
      return uniqueMerge(remotePaths, localPaths);
    },
    [localPaths]
  );
  const LOC = 'paths';
  const ACCOUNT_ID = 'd725e78d7ab30f5b391a57797cb0eeb5';
  const ACCESS_KEY_ID = '4f24e7d59e6cb1538760ff4af0ec7a3b';
  const SECRET_ACCESS_KEY =
    '7a39a7292f4d74aedbbc48deebd834bf901e045cbe2e294deea6c51cb8bee66a';

  const config: S3ClientConfig = {
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  };
  const { receive } = ImageController(imageUrl, setImageUrl, config);

  const receiver = (Context: ConnectionContext) => {
    setLocalPaths(mergePaths(Context));
    receive(Context);
  };

  const sender = (Context: ConnectionContext) => {
    Context.set(LOC, JSON.stringify(localPaths));
  };

  return (
    <MultiDeviceAttention receivingFunction={receiver} sendingFunction={sender}>
      <Canvas
        localPaths={localPaths}
        setLocalPaths={setLocalPaths}
        imageUrl={imageUrl}
      />
    </MultiDeviceAttention>
  );
}

interface CanvasProps {
  localPaths: IPath[];
  setLocalPaths: Dispatch<React.SetStateAction<any>>;
  imageUrl: string;
}

const Canvas = ({ localPaths, setLocalPaths, imageUrl }: CanvasProps) => {
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
          {localPaths.map((path) => (
            <Path
              key={path.path}
              d={path.path}
              stroke={path.color}
              fillOpacity={0}
            />
          ))}
          <Path d={currentPath} stroke={currentColor} fillOpacity={0} />
          <Image width="200" height="200" href={imageUrl} />
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

type IPath = {
  color: string;
  path: string;
};
