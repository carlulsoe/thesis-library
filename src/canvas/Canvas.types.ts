export interface CanvasProps {
  setup: (ctx: CanvasRenderingContext2D) => void;
  width: number;
  height: number;
}
