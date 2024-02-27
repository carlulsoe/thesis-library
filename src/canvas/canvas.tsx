import React, { useEffect, useRef } from 'react';
import type { CanvasProps } from './Canvas.types';

export const Canvas = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const context = canvas.getContext('2d');
    if (context == null) return;
    props.setup(context);
  }, [props]);

  return <canvas ref={canvasRef} width={props.width} height={props.height} />;
};
