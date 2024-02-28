import React, { useEffect, useRef } from 'react';
import type { CanvasProps } from './Canvas.types';
import { handleTouches } from './TouchHandler';

/**
 * Creates a canvas in accordance to props of type CanvasProps
 * @param props
 * @constructor
 */
export const Canvas = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const context = canvas.getContext('2d');
    if (context == null) return;
    canvas.addEventListener('touchmove', (event) =>
      handleTouches(event, context)
    );

    props.configureSetup(context);
  }, [props]);

  return <canvas ref={canvasRef} width={props.width} height={props.height} />;
};
