import 'react-native-get-random-values';
import React from 'react';
import { Canvas, MultiDeviceAttention } from '../../src';

export default function App() {
  return (
    <MultiDeviceAttention>
      <Canvas variable={'paths'} />
    </MultiDeviceAttention>
  );
}
