import React, { useEffect, useRef } from 'react';
import type { CanvasProps } from './Canvas.types';
import { handleTouches } from './TouchHandler';
import { useWindowDimensions } from 'react-native';

/**
 * Creates a canvas in accordance to the settings in props
 * @param props See interface for CanvasProps
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

    if (props.setup == undefined) return;
    props.setup(context);
  }, [props]);

  const { height, width } = useWindowDimensions();
  if (props.size !== undefined) {
    return (
      <canvas
        ref={canvasRef}
        width={props.size.width}
        height={props.size.height}
      />
    );
  } else {
    return <canvas ref={canvasRef} width={width} height={height} />;
  }
};
