import React, { useEffect, useRef } from 'react';
import type { CanvasProps } from './Canvas.types';
import { handleTouches } from './TouchHandler';
import { useWindowDimensions } from 'react-native';

/**
 * Creates a canvas in accordance to the settings in props
 *
 * Below is an example of a full size canvas containing a dark red box
 * ```
 * export default function App() {
 *   const draw = (ctx) => {
 *     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
 *     ctx.fillStyle = '#600000';
 *     ctx.beginPath();
 *     ctx.rect(40, 20, 50, 70);
 *     ctx.fill();
 *     ctx.save();
 *   };
 *
 *   return <Canvas setup={draw} />;
 * }
 * ```
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

    if (props.setup === undefined) return;
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
