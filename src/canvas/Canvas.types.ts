/**
 * The input interface to set up a canvas
 * @property setup A function taking the canvas's context and doing the required first-time setup
 * @property height The wanted canvas-height
 * @property width The wanted canvas-width
 * @interface
 */
export interface CanvasProps {
  configureSetup: (ctx: CanvasRenderingContext2D) => void;
  height: number;
  width: number;
}
