/**
 * The input interface to set up a canvas
 * @property setup An optional function with the canvas's context as it's only parameter, which does the required first-time setup
 * @property size Sets the wanted canvas size. If not set, defaults to fullscreen. Currently only fullscreen works as expected
 * @interface
 */
export interface CanvasProps {
  setup?: (ctx: CanvasRenderingContext2D) => void;
  size?: CanvasSize;
}

/**
 * Type used for the size of the canvas
 * @property width The width of the canvas
 * @property height The height of the canvas
 * @interface
 */
export interface CanvasSize {
  width: number;
  height: number;
}
