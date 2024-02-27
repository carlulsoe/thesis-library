import React, { useEffect, useRef } from 'react';

export function Canvas({ setup: setup, width: width, height: height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setup(context);
  }, [setup]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}
