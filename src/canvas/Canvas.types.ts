/**
 * The input interface to set up a canvas
 * @property setup A function taking the canvas's context and doing the required first-time setup
 * @property size Sets the wanted canvas size. If not set, defaults to fullscreen. Currently only fullscreen works as expected
 * @interface
 */
export interface CanvasProps {
  setup?: (ctx: CanvasRenderingContext2D) => void;
  size?: CanvasSize;
}

export interface CanvasSize {
  width: number;
  height: number;
}
