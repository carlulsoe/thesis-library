import React from 'react';
import { Canvas } from 'thesis-library';
import { useWindowDimensions } from 'react-native';

export default function App() {
  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#600000';
    ctx.beginPath();
    ctx.rect(40, 20, 50, 70);
    ctx.fill();
  };

  const { height, width } = useWindowDimensions();
  return <Canvas configureSetup={draw} width={width} height={height} />;
}
