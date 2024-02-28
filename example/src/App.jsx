import React from 'react';
import { Canvas } from 'thesis-library';

export default function App() {
  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#600000';
    ctx.beginPath();
    ctx.rect(40, 20, 50, 70);
    ctx.fill();
  };

  return <Canvas configureSetup={draw} width={1000} height={800} />;
}
