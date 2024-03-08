import { mapBetweenRanges } from '../extra/maths';

type SimplifiedTouch = {
  x: number;
  y: number;
  w: number;
  h: number;
};

function draw(touch: SimplifiedTouch, context: CanvasRenderingContext2D) {
  context.beginPath();
  context.arc(
    touch.x + touch.w / 2,
    touch.y + touch.h / 2,
    Math.max(touch.w, touch.h) / 2,
    0,
    2 * Math.PI
  );
  context.fill();
}

export function handleTouches(
  event: TouchEvent,
  context: CanvasRenderingContext2D
) {
  let canvas = event.target as HTMLCanvasElement;
  const clientHeight = canvas.parentElement?.clientHeight!;
  const clientWidth = canvas.parentElement?.clientWidth!;

  const simpleTouchEvent = () => {
    const mapToCanvasWidth = (n: number) => {
      return mapBetweenRanges(0, clientWidth, 0, 1000, n);
    };
    const mapToCanvasHeight = (n: number) => {
      return mapBetweenRanges(0, clientHeight, 0, 1000, n);
    };

    let touchList: SimplifiedTouch[] = [];
    for (let i = 0; i < event.touches.length; i++) {
      let item = event.touches.item(i)!;
      console.log(item);
      console.log(mapToCanvasWidth(item.radiusX));
      touchList[i] = {
        w: mapToCanvasWidth(item.radiusX),
        h: mapToCanvasHeight(item.radiusY),
        x: mapToCanvasWidth(item.clientX - item.radiusX / 2),
        y: mapToCanvasHeight(item.clientY - item.radiusY / 2),
      };
    }
    return {
      ctrlKey: event.ctrlKey,
      touches: touchList,
    };
  };
  if (simpleTouchEvent().touches.length === 1) {
    event.preventDefault();
    draw(simpleTouchEvent().touches[0]!, context);
  }
}
